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
  return (
    <>
      <div className="p-8">
        <div className="gap-w-8 mx-auto flex max-w-2xl items-center justify-between border-b pb-6 lg:mx-0 lg:max-w-none">
          <div className="flex items-center gap-x-6">
            <div className="rounded-full bg-white p-3">
              <VideoIcon className="h-6 w-6" />
            </div>
            <h1>
              <div className="text-sm leading-6 text-gray-600">
                Meeting on {""} {meeting?.createdAt.toLocaleDateString()}
              </div>
              <div className="mt-1 text-base leading-6 font-semibold text-gray-900">
                {meeting?.name}
              </div>
            </h1>
          </div>
        </div>

        <div className="h-4"></div>
        <div className="gird gird-cols-1 gap-2 sm:grid-cols-3">
          {meeting?.issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      </div>
    </>
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
              {issue.createdAt.toLocaleDateString()}
            </DialogDescription>
            <p className="text-gray-600">{issue.headline}</p>
            <blockquote className="border-1-4 mt-2 border-gray-300 bg-gray-50 p-4">
              <span className="text-sm text-gray-600">
                {issue.start} - {issue.end}
              </span>
              <p className="leading-relaxed font-medium text-gray-900 italic">
                {issue.summary}
              </p>
            </blockquote>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Card className="relative">
        <CardHeader>
          <CardTitle className="text-xl">{issue.gist}</CardTitle>
          <div className="border-b"></div>
          <CardDescription>{issue.headline}</CardDescription>
        </CardHeader>

        <CardContent>
          <Button onClick={() => setOpen(true)}>Details</Button>
        </CardContent>
      </Card>
    </>
  );
}

export default IssuesList;
