import { db } from "@/server/db";
import { redirect } from "next/navigation";
import { auth, clerkClient } from "@clerk/nextjs/server";

type Props = {
  params: { projectId: string };
};

const JoinHandler = async ({ params }: Props) => {
  const { projectId } = params;
  const { userId } = await auth();

  if (!userId) return redirect("/sign-in");

  const dbUser = await db.user.findUnique({
    where: { id: userId },
  });

  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  if (!dbUser) {
    await db.user.create({
      data: {
        id: userId,
        emailAddress: user.emailAddresses[0]?.emailAddress || "",
        imageUrl: user.imageUrl,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  }

  const project = await db.project.findUnique({
    where: { id: projectId },
  });

  if (!project) return redirect("/dashboard");

  try {
    await db.userToProject.create({
      data: {
        userId,
        projectId,
      },
    });
  } catch (error) {
    console.log("User might already be in the project:", error);
  }

  return redirect("/dashboard");
};

export default JoinHandler;
