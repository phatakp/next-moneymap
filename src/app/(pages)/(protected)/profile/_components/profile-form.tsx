"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { usersUpdateFormSchema } from "@/server/db/schema";
import { api } from "@/trpc/react";
import type { User } from "@clerk/nextjs/server";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";

type Props = {
  user: User | null;
};
export default function ProfileForm({ user }: Props) {
  const form = useForm<z.infer<typeof usersUpdateFormSchema>>({
    resolver: zodResolver(usersUpdateFormSchema),
    defaultValues: {
      id: user?.id,
      email: user?.primaryEmailAddress?.emailAddress,
      firstName: "",
      lastName: "",
    },
  });
  const router = useRouter();
  const utils = api.useUtils();
  const updateProfile = api.users.update.useMutation({
    onSuccess: async () => {
      await utils.users.invalidate();
      toast("Profile Updated successfully!");
      router.replace("/dashboard");
    },
    onError: () => toast.error("Failed to update profile."),
  });

  async function onSubmit(values: z.infer<typeof usersUpdateFormSchema>) {
    const res = await updateProfile.mutateAsync(values);
    if (!res?.id) {
      toast.error("Failed to update profile.");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto space-y-8 py-10"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input readOnly disabled type="email" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
