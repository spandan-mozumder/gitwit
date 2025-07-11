import { Document } from "@langchain/core/documents";
import { GoogleGenerativeAI } from "@google/generative-ai";

import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined in environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey);

const summarizerModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const embedderModel = genAI.getGenerativeModel({
  model: "models/embedding-001",
});

export const aiSummariseCommit = async (diff: string): Promise<string> => {
  const systemPrompt = `You are an expert programmer, and you are trying to summarise a git diff.
Reminders about the git diff format:
For every file, there are a few metadata lines, like (for example):
\`\`\`
diff --git a/lib/index.js b/lib/index.js
index aadf691..bfef603 100644
--- a/lib/index.js
+++ b/lib/index.js
\`\`\`
This means that \`lib/index.js\` was modified in this commit. Note that this is only an example.
Then there is a specifier of the lines that were modified. 
A line starting with \`+\` means it was added.
A line starting with \`-\` means it was removed.
A line starting with neither \`+\` nor \`-\` is code given for context and better understanding. It is not part of the diff.

EXAMPLE SUMMARY COMMENTS:
\`\`\`
* Raised the amount of returned recordings from \`10\` to \`100\` [packages/server/recordings_api.ts], [packages/server/constants.ts]
* Fixed a typo in the GitHub action name [.github/workflows/gpt-commit-summarizer.yml]
* Moved the \`octokit\` initialization to a separate file [src/octokit.ts], [src/index.ts]
* Lowered numeric tolerance for test files
\`\`\`
Most commits will have fewer comments than this list. The last comment does not include the file names because there were more than two relevant files in the hypothetical commit.
Do not include parts of the example in your summary. It is given only as an example of appropriate comments.`;

  try {
    const response = await summarizerModel.generateContent([
      systemPrompt,
      `Please summarize the following diff file:\n\n${diff}`,
    ]);

    return response.response.text();
  } catch (error) {
    console.error("Error summarizing commit diff:", error);
    return "[Failed to generate commit summary]";
  }
};

export async function summariseCode(doc: Document): Promise<string> {
  try {
    const code = doc.pageContent.slice(0, 10_000); // Safety limit
    const response = await summarizerModel.generateContent([
      `You are an intelligent senior software engineer who specialises in onboarding junior developers.`,
      `You are onboarding a junior developer and explaining the purpose of the ${doc.metadata.fileName} file.`,
      `Here is the code:
      ---
      ${code}
      ---
      Please summarize the code in no more than 100 words.`,
    ]);

    return response.response.text();
  } catch (error) {
    console.error(
      `Error summarizing code for ${doc.metadata.fileName}:`,
      error,
    );
    return "[Summary unavailable]";
  }
}

export async function generateEmbedding(summary: string): Promise<number[]> {
  try {
    const result = await embedderModel.embedContent(summary);
    return result.embedding.values;
  } catch (error) {
    console.error("Error generating embedding:", error);
    return [];
  }
}
