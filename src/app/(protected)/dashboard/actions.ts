"use server";

import { streamText } from "ai";
import { createStreamableValue } from "ai/rsc";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
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
    SELECT "fileName", "sourceCode","summary",
    1-("summaryEmbedding" <=> ${vectorQuery}::vector)AS similarity
    FROM "SourceCodeEmbedding"
    WHERE 1-("summaryEmbedding" <=> ${vectorQuery}::vector) > .5
    AND "projectId" = ${projectId}
    ORDER BY similarity DESC
    LIMIT 10;`;

    let context = "";
    
  for (const doc of result) {
    context += `source: ${doc.fileName}\n code content: ${doc.sourceCode}\n summary of the file: ${doc.summary}`;
  }

  (async () => {
    const { textStream } = await streamText({
      model: google("gemini-1.5-flash"),
      prompt: `
            You are an AI code assistant who answers questioms about the codebase. Your target audience is a technical intern or a fresher with less experience.
            AI assistant is a brand new, powerful, human-like artificial intelligence.
            The traits of the AI include expert knowledge, helpfulness, cleverness and articulateness.
            AI is a well behaved and well mannnered individual.
            Ai is always friendly, kind and inspiring and he is eager tp provide vivid and thoughtful responses to the user.
            Ai has the sum of all knowledge in their brain and is able to accuratelt answer nearly any question about any topic in the codebase.
            If the question is asking about code or a specific file, the Ai will provide the detailed answer giving step by step instructions.
            START OF THE CONTEXT BLOCK
            ${context}
            END OF THE CONTEXT BLOCK

            START QUESTION
            ${question}
            END QUESTION

        AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
        If the context does not provide the answer to question, the AI assistant will say "I'm sorry, but I dont have enough information to answer that question."
        AI assistant will not apologize for previous responses, but instead will indicate that now information was gained.
        AI assistant will not invent anything that is not drawn dirctly from the context provided.
        Answer in markdown syntax with code snippets if needed. Be as detaied as possible when answering and make sure to provide all the necessary information.
            `,
    });

    for await (const delta of textStream) {
      stream.update(delta);
    }
    stream.done();
  })();
    
    return {
        output: stream.value,
        filesReferences: result
    }
}
