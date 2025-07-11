import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { pollCommits } from "@/lib/github";
import { indexGithubRepo } from "@/lib/github-loader";

export const projectRouter = createTRPCRouter({
  createProject: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        githubUrl: z.string(),
        githubToken: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const project = await ctx.db.project.create({
          data: {
            githubUrl: input.githubUrl,
            name: input.name,
            userToProjects: {
              create: {
                userId: ctx.user.userId!,
              },
            },
          },
        });

        await indexGithubRepo(project.id, input.githubUrl, input.githubToken);
        await pollCommits(project.id);

        return project;
      } catch (error) {
        console.error("Error creating project:", error);
        throw new Error("Failed to create project");
      }
    }),

  getProjects: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.db.project.findMany({
        where: {
          userToProjects: {
            some: {
              userId: ctx.user.userId!,
            },
          },
          deletedAt: null,
        },
      });
    } catch (error) {
      console.error("Error fetching projects:", error);
      throw new Error("Failed to fetch projects");
    }
  }),

  getCommits: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        await pollCommits(input.projectId);
        return await ctx.db.commit.findMany({
          where: { projectId: input.projectId },
          orderBy: { commitDate: "desc" },
        });
      } catch (error) {
        console.error("Error fetching commits:", error);
        throw new Error("Failed to fetch commits");
      }
    }),

  saveAnswer: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        question: z.string(),
        answer: z.string(),
        filesReferences: z.any(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.question.create({
          data: {
            answer: input.answer,
            filesReferences: input.filesReferences,
            projectId: input.projectId,
            question: input.question,
            userId: ctx.user.userId!,
          },
        });
      } catch (error) {
        console.error("Error saving answer:", error);
        throw new Error("Failed to save answer");
      }
    }),

  getQuestions: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.db.question.findMany({
          where: { projectId: input.projectId },
          include: { user: true },
          orderBy: { createdAt: "desc" },
        });
      } catch (error) {
        console.error("Error fetching questions:", error);
        throw new Error("Failed to fetch questions");
      }
    }),

  uploadMeeting: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        meetingUrl: z.string(),
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.meeting.create({
          data: {
            meetingUrl: input.meetingUrl,
            projectId: input.projectId,
            name: input.name,
            status: "PROCESSING",
          },
        });
      } catch (error) {
        console.error("Error uploading meeting:", error);
        throw new Error("Failed to upload meeting");
      }
    }),

  getMeetings: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.db.meeting.findMany({
          where: { projectId: input.projectId },
          orderBy: { createdAt: "desc" },
          include: { issues: true },
        });
      } catch (error) {
        console.error("Error fetching meetings:", error);
        throw new Error("Failed to fetch meetings");
      }
    }),

  deleteMeeting: protectedProcedure
    .input(z.object({ meetingId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.meeting.delete({
          where: { id: input.meetingId },
        });
      } catch (error) {
        console.error("Error deleting meeting:", error);
        throw new Error("Failed to delete meeting");
      }
    }),

  getMeetingById: protectedProcedure
    .input(z.object({ meetingId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.db.meeting.findUnique({
          where: { id: input.meetingId },
          include: { issues: true },
        });
      } catch (error) {
        console.error("Error fetching meeting by ID:", error);
        throw new Error("Failed to fetch meeting");
      }
    }),

  archiveProject: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.project.update({
          where: { id: input.projectId },
          data: { deletedAt: new Date() },
        });
      } catch (error) {
        console.error("Error archiving project:", error);
        throw new Error("Failed to archive project");
      }
    }),

  getTeamMembers: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.db.userToProject.findMany({
          where: { projectId: input.projectId },
          include: { user: true },
        });
      } catch (error) {
        console.error("Error fetching team members:", error);
        throw new Error("Failed to fetch team members");
      }
    }),
});
