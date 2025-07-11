"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import useProject from "@/hooks/use-project";
import { api } from "@/trpc/react";
import AskQuestionCard from "../dashboard/ask-question-card";
import React from "react";
import MDEditor from "@uiw/react-md-editor";
import CodeReferences from "../dashboard/code-references";
import Image from "next/image";
import anonymous from "@/assets/anonymous.png";

const QAPage = () => {
  const { projectId } = useProject();
  const { data: questions, isLoading } = api.project.getQuestions.useQuery({
    projectId,
  });
  const [questionIndex, setQuestionIndex] = React.useState(0);
  const question = questions?.[questionIndex];

  const formatDate = (date: string | Date) =>
    new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(typeof date === "string" ? new Date(date) : date);

  type FileReference = {
    fileName: string;
    sourceCode: string;
    summary: string;
  };

  function isValidFileReferenceArray(data: unknown): data is FileReference[] {
    return (
      Array.isArray(data) &&
      data.every(
        (item) =>
          item &&
          typeof item === "object" &&
          "fileName" in item &&
          "sourceCode" in item &&
          "summary" in item &&
          typeof item.fileName === "string" &&
          typeof item.sourceCode === "string" &&
          typeof item.summary === "string",
      )
    );
  }

  return (
    <Sheet>
      <AskQuestionCard />
      <div className="h-4" />
      <h1 className="text-xl font-semibold">Saved Questions</h1>
      <div className="h-2" />
      <div className="flex flex-col gap-2">
        {isLoading ? (
          <p className="text-sm text-gray-500">Loading questions...</p>
        ) : questions?.length ? (
          questions.map((question, index) => (
            <SheetTrigger
              key={question.id}
              onClick={() => setQuestionIndex(index)}
              aria-expanded={questionIndex === index}
            >
              <div className="shadow-border flex items-center gap-4 rounded-lg bg-white p-4">
                <Image
                  className="rounded-full"
                  height={30}
                  width={30}
                  src={
                    question.user.imageUrl ||
                    (typeof anonymous === "string" ? anonymous : anonymous.src)
                  }
                  alt="User Avatar"
                />
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-2">
                    <p className="line-clamp-1 text-lg font-medium text-gray-700">
                      {question.question}
                    </p>
                    <span className="text-xs whitespace-nowrap text-gray-400">
                      {formatDate(question.createdAt)}
                    </span>
                  </div>
                  <p className="line-clamp-1 text-sm text-gray-500">
                    {question.answer}
                  </p>
                </div>
              </div>
            </SheetTrigger>
          ))
        ) : (
          <p className="text-sm text-gray-500">No saved questions yet.</p>
        )}
      </div>

      {question && (
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{question.question}</SheetTitle>
            <MDEditor.Markdown source={question.answer} />
            <CodeReferences
              filesReferences={
                isValidFileReferenceArray(question.filesReferences)
                  ? question.filesReferences
                  : []
              }
            />
          </SheetHeader>
        </SheetContent>
      )}
    </Sheet>
  );
};

export default QAPage;
