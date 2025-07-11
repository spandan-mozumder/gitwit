"use client";

import useProject from "@/hooks/use-project";
import { api } from "@/trpc/react";
import React from "react";
import anonymous from "@/assets/anonymous.png";

const TeamMembers = () => {
  const { projectId } = useProject();
  const { data: members, isLoading } = api.project.getTeamMembers.useQuery({
    projectId,
  });

  if (isLoading) return <p>Loading team...</p>;

  if (!members || members.length === 0) return <p>No team members found.</p>;

  return (
    <div className="flex items-center gap-2">
      {members.map((member) => (
        <img
          key={member.id}
          src={member.user.imageUrl || (typeof anonymous === "string" ? anonymous : anonymous.src)}
          alt={member.user.firstName || "User"}
          title={`${member.user.firstName ?? "Unknown"} ${member.user.lastName ?? ""}`}
          height={30}
          width={30}
          className="rounded-full object-cover"
        />
      ))}
    </div>
  );
};

export default TeamMembers;
