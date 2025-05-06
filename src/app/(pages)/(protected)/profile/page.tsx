import { api } from "@/trpc/server";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ProfileForm from "./_components/profile-form";

export default async function ProfilePage() {
  const dbuser = await api.users.me();
  if (dbuser?.firstName) return redirect("/dashboard");

  const sessionUser = await currentUser();
  if (sessionUser?.firstName) {
    const dbuser = await api.users.create();
    if (dbuser.id) return redirect("/dashboard");
  }

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ProfileForm user={sessionUser} />
      </div>
    </div>
  );
}
