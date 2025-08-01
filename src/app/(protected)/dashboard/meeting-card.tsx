"use client";

import React from "react";
import { useDropzone } from "react-dropzone";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { Presentation, Upload } from "lucide-react";

import { uploadFile } from "@/lib/firebase";
import { toast } from "sonner";

import useProject from "@/hooks/use-project";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

const MeetingCard = () => {
  const { selectedProject } = useProject();
  const [isUploading, setIsUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const router = useRouter();

  const uploadMeeting = api.project.uploadMeeting.useMutation();

  const processMeeting = useMutation({
    mutationFn: async ({
      meetingUrl,
      meetingId,
      projectId,
    }: {
      meetingUrl: string;
      meetingId: string;
      projectId: string;
    }) => {
      console.log("[processMeeting] Sending to /api/process-meeting", {
        meetingUrl,
        meetingId,
        projectId,
      });

      const response = await axios.post("/api/process-meeting", {
        meetingUrl,
        meetingId,
        projectId,
      });

      console.log("[processMeeting] Response:", response.data);
      return response.data;
    },
  });

  const { getRootProps, getInputProps, open } = useDropzone({
    accept: {
      "audio/*": [".mp3", ".wav", ".m4a"],
    },
    noClick: true,
    noKeyboard: true,
    multiple: false,
    maxSize: 50_000_000,
    onDrop: async (acceptedFiles) => {
      if (!selectedProject) {
        console.warn("No selected project. Aborting.");
        return;
      }

      const file = acceptedFiles[0];
      if (!file) {
        console.warn("No file uploaded.");
        return;
      }

      setIsUploading(true);

      try {
        const downloadURL = (await uploadFile(file, setProgress)) as string;

        uploadMeeting.mutate(
          {
            projectId: selectedProject.id,
            meetingUrl: downloadURL,
            name: file.name,
          },
          {
            onSuccess: async (meeting) => {
              toast.success("Meeting uploaded successfully!");
              try {
                const result = await processMeeting.mutateAsync({
                  meetingUrl: downloadURL,
                  meetingId: meeting.id,
                  projectId: selectedProject.id,
                });
              } catch (err) {
                toast.error(
                  `Error: ${err instanceof Error ? err.message : String(err)}`,
                );
              }
            },
            onError: (error) => {
              toast.error("Failed to upload meeting. Please try again.");
            },
            onSettled: () => {
              setIsUploading(false);
            },
          },
        );
      } catch (err) {
        toast.error(
          `Upload failed: ${err instanceof Error ? err.message : String(err)}`,
        );
        setIsUploading(false);
      }
    },
  });

  return (
    <Card
      className="col-span-2 flex cursor-pointer flex-col items-center justify-center p-10"
      {...getRootProps()}
    >
      {!isUploading ? (
        <>
          <Presentation className="h-10 w-10 animate-bounce text-indigo-600" />
          <h3 className="text-sm font-semibold text-gray-900">
            Create a new meeting
          </h3>
          <p className="text-center text-sm text-gray-500">
            Analyze your meeting with GitWit
            <br />
            Powered by AI
          </p>
          <div className="mt-4">
            <Button
              onClick={(e) => {
                console.log("Upload button clicked");
                e.stopPropagation();
                open();
              }}
            >
              <Upload className="h-5 w-5" aria-hidden="true" />
              Upload Meeting
            </Button>
          </div>
          <input {...getInputProps()} />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-4">
          <CircularProgressbar
            value={progress}
            text={`${progress}%`}
            className="size-20 transition-all"
            styles={buildStyles({
              pathColor: "#4F46E5",
              textColor: "#4F46E5",
              trailColor: "#E5E7EB",
            })}
          />
          <p className="text-center text-sm text-gray-500">
            Uploading your meeting
          </p>
        </div>
      )}
    </Card>
  );
};

export default MeetingCard;
