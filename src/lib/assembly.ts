import { AssemblyAI } from "assemblyai";

if (!process.env.ASSEMBLYAI_API_KEY) {
  throw new Error("Missing ASSEMBLYAI_API_KEY in environment variables.");
}

const client = new AssemblyAI({ apiKey: process.env.ASSEMBLYAI_API_KEY });

function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

type ProcessedMeeting = {
  transcript: Awaited<ReturnType<typeof client.transcripts.transcribe>>;
  summaries: {
    start: string;
    end: string;
    gist: string;
    headline: string;
    summary: string;
  }[];
};

export const processMeeting = async (
  meetingUrl: string,
): Promise<ProcessedMeeting> => {
  try {
    const transcript = await client.transcripts.transcribe({
      audio: meetingUrl,
      auto_chapters: true,
    });

    if (!transcript.text) {
      throw new Error("No transcript text returned.");
    }

    const summaries =
      transcript.chapters?.map((chapter) => ({
        start: formatTime(chapter.start),
        end: formatTime(chapter.end),
        gist: chapter.gist,
        headline: chapter.headline,
        summary: chapter.summary,
      })) || [];

    return {
      transcript,
      summaries,
    };
  } catch (error) {
    console.error("Error processing meeting:", error);
    throw error;
  }
};
