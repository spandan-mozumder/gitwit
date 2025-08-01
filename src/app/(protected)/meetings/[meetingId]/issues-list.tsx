"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api, type RouterOutputs } from "@/trpc/react";
import { VideoIcon } from "lucide-react";
import React from "react";

type Props = {
  meetingId: string;
};

const IssuesList = ({ meetingId }: Props) => {
  const { data: meeting, isLoading } = api.project.getMeetingById.useQuery(
    { meetingId },
    {
      refetchInterval: 4000,
    },
  );

  const formatDate = (date?: string | Date) =>
    date ? new Date(date).toLocaleDateString() : "Unknown date";

  return (
    <div className="p-8">
      <div className="mx-auto flex max-w-2xl items-center justify-between border-b pb-6 lg:mx-0 lg:max-w-none">
        <div className="flex items-center gap-x-6">
          <div className="rounded-full bg-white p-3">
            <VideoIcon className="h-6 w-6" />
          </div>
          <h1>
            <div className="text-sm text-gray-600">
              Meeting on {formatDate(meeting?.createdAt)}
            </div>
            <div className="mt-1 text-base font-semibold text-gray-900">
              {meeting?.name}
            </div>
          </h1>
        </div>
      </div>

      <div className="h-4" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {meeting?.issues?.length ? (
          meeting.issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))
        ) : (
          <p className="col-span-full text-sm text-gray-500">
            No issues found for this meeting.
          </p>
        )}
      </div>
    </div>
  );
};

function IssueCard({
  issue,
}: {
  issue: NonNullable<
    RouterOutputs["project"]["getMeetingById"]
  >["issues"][number];
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{issue.gist}</DialogTitle>
            <DialogDescription>
              {new Date(issue.createdAt).toLocaleDateString()}
            </DialogDescription>
            <p className="text-gray-600">{issue.headline}</p>
            <blockquote className="mt-2 border-l-4 border-gray-300 bg-gray-50 p-4">
              <span className="text-sm text-gray-600">
                {issue.start} – {issue.end}
              </span>
              <p className="mt-2 font-medium text-gray-900 italic">
                {issue.summary}
              </p>
            </blockquote>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Card className="relative transition-shadow hover:shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">{issue.gist}</CardTitle>
          <div className="border-b" />
          <CardDescription>{issue.headline}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setOpen(true)} size="sm">
            Details
          </Button>
        </CardContent>
      </Card>
    </>
  );
}

export default IssuesList;
