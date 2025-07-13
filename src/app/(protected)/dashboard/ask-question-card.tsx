"use client";

import React from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

import { toast } from "sonner";
import { readStreamableValue } from "ai/rsc";
import MDEditor from "@uiw/react-md-editor";

import logo from "@/assets/logo.png";
import useProject from "@/hooks/use-project";
import useRefetch from "@/hooks/use-refetch";
import CodeReferences from "./code-references";
import { askQuestion } from "./actions";
import { api } from "@/trpc/react";

const AskQuestionCard = () => {
  const { selectedProject } = useProject();
  const [question, setQuestion] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [filesReferences, setFilesReferences] = React.useState<
    { fileName: string; sourceCode: string; summary: string }[]
  >([]);
  const [answer, setAnswer] = React.useState("");
  const saveAnswer = api.project.saveAnswer.useMutation();
  const refetch = useRefetch();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedProject?.id) return;

    setAnswer("");
    setFilesReferences([]);
    setLoading(true);

    const { output, filesReferences } = await askQuestion(
      question,
      selectedProject.id,
    );

    setOpen(true);
    if (Array.isArray(filesReferences)) {
      setFilesReferences(
        filesReferences as {
          fileName: string;
          sourceCode: string;
          summary: string;
        }[],
      );
    }

    for await (const delta of readStreamableValue(output)) {
      if (delta) {
        setAnswer((ans) => ans + delta);
      }
    }

    setLoading(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="h-[95vh] max-h-none overflow-auto bg-white sm:max-w-[80vw]"
          style={{
            backgroundColor: "white",
            color: "black",
          }}
        >
          <DialogHeader>
            <div className="flex items-center gap-2">
              <DialogTitle>
                <Image src={logo} alt="GitWit Logo" width={50} height={50} />
              </DialogTitle>
              <Button
                disabled={saveAnswer.isPending}
                variant="outline"
                onClick={() => {
                  saveAnswer.mutate(
                    {
                      projectId: selectedProject!.id,
                      question,
                      answer,
                      filesReferences,
                    },
                    {
                      onSuccess: () => {
                        toast.success("Answer saved successfully!");
                        refetch();
                      },
                      onError: (error) => {
                        toast.error(`Failed to save answer: ${error.message}`);
                      },
                    },
                  );
                }}
              >
                Save Question
              </Button>
            </div>
          </DialogHeader>

          <MDEditor.Markdown
            source={answer}
            className="max-w[70vw] h-full max-h-[40vh] overflow-scroll rounded-md bg-white p-5 text-black"
          />

          <CodeReferences filesReferences={filesReferences} />

          <Button type="button" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogContent>
      </Dialog>

      <Card className="relative col-span-3">
        <CardHeader>
          <CardTitle>Ask a question</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <Textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Which file should I edit to change the home page?"
              className="h-24"
            />
            <div className="h-4" />
            <Button type="submit" disabled={loading}>
              Ask GitWit!
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default AskQuestionCard;
