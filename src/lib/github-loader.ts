import { db } from "@/server/db";
import { generateEmbedding, summariseCode } from "./gemini";
import { Document } from "@langchain/core/documents";
import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";

const IGNORED_LOCK_FILES = [
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  "bun.lockb",
];

type EmbeddingResult = {
  summary: string;
  embedding: number[];
  sourceCode: string;
  fileName: string;
};

export const loadGithubRepo = async (
  githubUrl: string,
  githubToken?: string,
): Promise<Document[]> => {
  const loader = new GithubRepoLoader(githubUrl, {
    accessToken: githubToken || "",
    branch: "main",
    ignoreFiles: IGNORED_LOCK_FILES,
    recursive: true,
    unknown: "warn",
    maxConcurrency: 5,
  });

  return await loader.load();
};

export const indexGithubRepo = async (
  projectId: string,
  githubUrl: string,
  githubToken?: string,
): Promise<void> => {
  try {
    const docs = await loadGithubRepo(githubUrl, githubToken);
    const allEmbeddings = await generateEmbeddings(docs);

    await Promise.allSettled(
      allEmbeddings.map(async (embedding) => {
        if (!embedding) return;

        try {
          const sourceCodeEmbedding = await db.sourceCodeEmbedding.create({
            data: {
              summary: embedding.summary,
              sourceCode: embedding.sourceCode,
              fileName: embedding.fileName,
              projectId,
            },
          });

          await db.$executeRaw`
            UPDATE "SourceCodeEmbedding"
            SET "summaryEmbedding" = ${embedding.embedding}::vector
            WHERE id = ${sourceCodeEmbedding.id}
          `;
        } catch (err) {
          console.error(
            `Failed to store embedding for ${embedding.fileName}:`,
            err,
          );
        }
      }),
    );
  } catch (err) {
    console.error("Error indexing GitHub repo:", err);
    throw new Error("Failed to index GitHub repository");
  }
};

const generateEmbeddings = async (
  docs: Document[],
): Promise<EmbeddingResult[]> => {
  return await Promise.all(
    docs.map(async (doc) => {
      try {
        const summary = await summariseCode(doc);
        const embedding = await generateEmbedding(summary);

        return {
          summary,
          embedding,
          sourceCode: doc.pageContent,
          fileName: doc.metadata.source,
        };
      } catch (err) {
        console.error(
          `Failed to generate embedding for ${doc.metadata.source}:`,
          err,
        );
        return null;
      }
    }),
  ).then((results) => results.filter(Boolean) as EmbeddingResult[]);
};
