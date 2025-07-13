"use client";

import useProject from "@/hooks/use-project";
import { ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import CommitLog from "./commit-log";
import AskQuestionCard from "./ask-question-card";
import MeetingCard from "./meeting-card";
import ArchiveButton from "./archive-button";
import TeamMembers from "./team-members";
import dynamic from "next/dynamic";

const InviteButton = dynamic(() => import("./invite-button"), { ssr: false });

const DashboardPage = () => {
  const { selectedProject } = useProject();
  const githubUrl = selectedProject?.githubUrl;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-y-4">
        <div className="bg-primary w-fit rounded-md px-4 py-3">
          <div className="flex items-center">
            <Github className="size-5 text-white" />
            <p className="ml-2 text-sm font-medium text-white">
              This project is linked to{" "}
              {githubUrl ? (
                <Link
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-white/80 hover:underline"
                >
                  {githubUrl}
                  <ExternalLink className="ml-1 size-4" />
                </Link>
              ) : (
                <span className="text-white/70 italic">
                  No GitHub URL provided
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <TeamMembers />
          <InviteButton />
          <ArchiveButton />
        </div>
      </div>

      <div className="my-6 grid grid-cols-1 gap-4 sm:grid-cols-5">
        <AskQuestionCard />
        <MeetingCard />
      </div>

      <CommitLog />
    </div>
  );
};

export default DashboardPage;
