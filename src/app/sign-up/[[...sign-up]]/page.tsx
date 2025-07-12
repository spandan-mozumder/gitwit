import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="bg-secondary flex min-h-screen items-center justify-center">
      <SignUp />
    </div>
  );
}
