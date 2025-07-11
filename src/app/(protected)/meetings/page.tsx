"use client";

import React from "react";
import Link from "next/link";

import { api } from "@/trpc/react";
import useProject from "@/hooks/use-project";
import useRefetch from "@/hooks/use-refetch";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";

import MeetingCard from "../dashboard/meeting-card";


const MeetingsPage = () => {
  const { projectId } = useProject();
  const { data: meetings, isLoading } = api.project.getMeetings.useQuery(
    { projectId },
    { refetchInterval: 4000 },
  );

  const deleteMeeting = api.project.deleteMeeting.useMutation();
  const refetch = useRefetch();

  const formatDate = (date: string | Date) =>
    new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));

  return (
    <>
      <MeetingCard />
      <div className="h-6" />
      <h1 className="text-xl font-semibold">Meetings</h1>

      {isLoading && <div className="text-sm text-gray-500">Loading...</div>}
      {!isLoading && meetings?.length === 0 && (
        <div className="text-sm text-gray-500">No meetings found.</div>
      )}

      <ul className="divide-y divide-gray-200">
        {meetings?.map((meeting) => (
          <li
            key={meeting.id}
            className="flex items-center justify-between gap-x-6 py-5"
          >
            <div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/meetings/${meeting.id}`}
                    className="text-sm font-semibold hover:underline"
                  >
                    {meeting.name}
                  </Link>
                  {meeting.status === "PROCESSING" && (
                    <Badge className="bg-yellow-500 text-white">
                      Processing
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-x-2 text-xs text-gray-500">
                <p className="whitespace-nowrap">
                  {formatDate(meeting.createdAt)}
                </p>
                <p className="truncate">{meeting.issues?.length ?? 0} issues</p>
              </div>
            </div>

            <div className="flex flex-none items-center gap-x-4">
              <Link href={`/meetings/${meeting.id}`}>
                <Button variant="outline" size="sm">
                  View Meeting
                </Button>
              </Link>

              <Button
                variant="destructive"
                size="sm"
                disabled={deleteMeeting.isPending}
                onClick={() =>
                  deleteMeeting.mutate(
                    { meetingId: meeting.id },
                    {
                      onSuccess: async () => {
                        toast.success("Meeting deleted successfully!");
                        await refetch();
                      },
                      onError: (err) => {
                        toast.error("Failed to delete meeting");
                        console.error(err);
                      },
                    },
                  )
                }
              >
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default MeetingsPage;
