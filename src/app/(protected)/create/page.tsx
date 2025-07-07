"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import useRefetch from "@/hooks/use-refetch";

type FormInput = {
  repoUrl: string;
  projectName: string;
  githubToken?: string;
};

const CreatePage = () => {
  const { register, handleSubmit, reset } = useForm<FormInput>();
  const createProject = api.project.createProject.useMutation();
  const refetch = useRefetch();

  function onSubmit(data: FormInput) {
    createProject.mutate(
      {
        name: data.projectName,
        githubUrl: data.repoUrl,
        githubToken: data.githubToken,
      },
      {
        onSuccess: () => {
          toast.success("Project created successfully!");
          refetch();
          reset();
        },
        onError: (error) => {
          toast.error(`Error creating project: ${error.message}`);
        },
      },
    );
    return true;
  }

  return (
    <div className="flex h-full items-center justify-center gap-12">
      {/* <Image src="/" alt="create-page-image" className="h-56 w-auto" /> */}
      <div>
        <div>
          <h1 className="text-2xl font-semibold">
            Link your GitHub Repository
          </h1>
          <p className="text-muted-foreground text-sm">
            Enter the URL of your repository to link it to GitWit
          </p>

          <div className="h-4"></div>

          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Input
                {...register("projectName", { required: true })}
                placeholder="Project Name"
                required
              />

              <div className="h-2"></div>
              <Input
                {...register("repoUrl", { required: true })}
                placeholder="GitHub URL"
                required
              />

              <div className="h-2"></div>
              <Input
                {...register("githubToken")}
                placeholder="GitHub Token (optional)"
              />
              <div className="h-4"></div>

              <Button type="submit" disabled={createProject.isPending}>
                Create Project
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
