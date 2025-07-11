import { db } from "@/server/db";
import { Octokit } from "octokit";
import axios from "axios";
import { aiSummariseCommit } from "./gemini";

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

type CommitResponse = {
  commitHash: string;
  commitMessage: string;
  commitAuthorName: string;
  commitAuthorAvatar: string;
  commitDate: string;
};

export const getCommitHashes = async (
  githubUrl: string,
): Promise<CommitResponse[]> => {
  const [owner, repo] = githubUrl.split("/").slice(-2);

  if (!owner || !repo) {
    throw new Error("Invalid GitHub URL");
  }

  try {
    const { data } = await octokit.rest.repos.listCommits({ owner, repo });

    const sortedCommits = data.sort(
      (a, b) =>
        new Date(b.commit.author?.date ?? "").getTime() -
        new Date(a.commit.author?.date ?? "").getTime(),
    );

    return sortedCommits.slice(0, 10).map((commit) => ({
      commitHash: commit.sha,
      commitMessage: commit.commit.message ?? "",
      commitAuthorName: commit.commit.author?.name ?? "",
      commitAuthorAvatar: commit.author?.avatar_url ?? "",
      commitDate: commit.commit.author?.date ?? "",
    }));
  } catch (error) {
    console.error("Failed to fetch commits from GitHub:", error);
    throw new Error("Unable to fetch commit history");
  }
};

export const pollCommits = async (projectId: string) => {
  try {
    const { project, githubUrl } = await fetchProjectGithubUrl(projectId);

    if (!githubUrl) {
      throw new Error("GitHub URL not found for project");
    }

    const commitHashes = await getCommitHashes(githubUrl);
    const unprocessedCommits = await filterUnprocessedCommits(
      projectId,
      commitHashes,
    );

    const summaryResponses = await Promise.allSettled(
      unprocessedCommits.map((commit) =>
        summariseCommit(githubUrl, commit.commitHash),
      ),
    );

    const summaries = summaryResponses.map((res) =>
      res.status === "fulfilled" ? res.value : "",
    );

    const commits = await db.commit.createMany({
      data: summaries.map((summary, i) => ({
        projectId,
        commitHash: unprocessedCommits[i]!.commitHash,
        commitMessage: unprocessedCommits[i]!.commitMessage,
        commitAuthorName: unprocessedCommits[i]!.commitAuthorName,
        commitAuthorAvatar: unprocessedCommits[i]!.commitAuthorAvatar,
        commitDate: unprocessedCommits[i]!.commitDate,
        summary,
      })),
    });

    return commits;
  } catch (error) {
    console.error("Failed to poll and store commits:", error);
    throw new Error("Polling commits failed");
  }
};

async function summariseCommit(githubUrl: string, commitHash: string) {
  try {
    const { data } = await axios.get(`${githubUrl}/commit/${commitHash}.diff`, {
      headers: {
        Accept: "application/vnd.github.v3.diff",
      },
    });

    return await aiSummariseCommit(data);
  } catch (error) {
    console.error(`Error summarising commit ${commitHash}:`, error);
    return "";
  }
}

async function fetchProjectGithubUrl(projectId: string) {
  const project = await db.project.findUnique({
    where: { id: projectId },
    select: { githubUrl: true },
  });

  return { project, githubUrl: project?.githubUrl ?? null };
}

async function filterUnprocessedCommits(
  projectId: string,
  commitHashes: CommitResponse[],
) {
  const processedCommits = await db.commit.findMany({
    where: { projectId },
    select: { commitHash: true },
  });

  const processedHashes = new Set(processedCommits.map((c) => c.commitHash));

  return commitHashes.filter(
    (commit) => !processedHashes.has(commit.commitHash),
  );
}
