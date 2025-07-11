"use server";

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";
import { createStreamableValue } from "ai/rsc";

import { generateEmbedding } from "@/lib/gemini";
import { db } from "@/server/db";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function askQuestion(question: string, projectId: string) {
  const stream = createStreamableValue();

  const queryVector = await generateEmbedding(question);
  const vectorQuery = `[${queryVector.join(",")}]`;

  const result = await db.$queryRaw<
    { fileName: string; sourceCode: string; summary: string }[]
  >`
    SELECT "fileName", "sourceCode", "summary",
    1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) AS similarity
    FROM "SourceCodeEmbedding"
    WHERE 1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) > 0.5
    AND "projectId" = ${projectId}
    ORDER BY similarity DESC
    LIMIT 10;
  `;

  let context = "";

  for (const doc of result) {
    context += `source: ${doc.fileName}\ncode content: ${doc.sourceCode}\nsummary of the file: ${doc.summary}\n\n`;
  }

  (async () => {
    const { textStream } = await streamText({
      model: google("gemini-1.5-flash"),
      prompt: `
        You are an AI code assistant who answers questions about the codebase. Your target audience is a technical intern or a fresher with less experience.
        AI assistant is a brand new, powerful, human-like artificial intelligence.
        The traits of the AI include expert knowledge, helpfulness, cleverness, and articulateness.
        AI is a well-behaved and well-mannered individual.
        AI is always friendly, kind, and inspiring, and is eager to provide vivid and thoughtful responses to the user.
        AI has the sum of all knowledge in their brain and is able to accurately answer nearly any question about any topic in the codebase.
        If the question is about code or a specific file, the AI will provide a detailed answer with step-by-step instructions.

        START OF THE CONTEXT BLOCK
        ${context}
        END OF THE CONTEXT BLOCK

        START QUESTION
        ${question}
        END QUESTION

        AI assistant will take into account any CONTEXT BLOCK provided in a conversation.
        If the context does not provide the answer to the question, the AI assistant will say:
        "I'm sorry, but I don't have enough information to answer that question."
        AI assistant will not apologize for previous responses, but will indicate if new information was gained.
        AI assistant will not invent anything that is not drawn directly from the provided context.
        Answer in markdown syntax with code snippets if needed. Be as detailed as possible and make sure to provide all necessary information.
      `,
    });

    for await (const delta of textStream) {
      stream.update(delta);
    }

    stream.done();
  })();

  return {
    output: stream.value,
    filesReferences: result,
  };
}
