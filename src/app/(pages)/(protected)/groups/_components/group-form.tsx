"use client";

import FormErrorArea from "@/components/shared/form-error-area";
import { FormInput } from "@/components/shared/form-input";
import { FormMultiSelect } from "@/components/shared/form-multi-select";
import { useModal } from "@/components/shared/modal";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { groupFormSchema } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { useGroupFormContext } from "../_providers/grp-form-provider";

export default function GroupForm() {
  const { group, users, isUsersLoading } = useGroupFormContext();
  const router = useRouter();
  const { modalId, closeModal } = useModal();
  const { data: user, isLoading } = api.users.me.useQuery();

  const form = useForm<z.infer<typeof groupFormSchema>>({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(groupFormSchema),
    defaultValues: {
      name: group?.name ?? "",
      users: group?.groupUsers?.map((g) => g.userId) ?? [user?.id],
    },
  });

  const userOptions = users?.map((u) => ({ label: u.firstName, value: u.id }));

  const utils = api.useUtils();
  const createGroup = api.groups.create.useMutation({
    onSuccess: async () => {
      await utils.groups.invalidate();
      toast.success("Success", {
        description: "Group Added Successfully!",
      });
      closeModal(modalId);
    },
    onError: ({ message }) => {
      console.error(message);
      toast.error("Error", { description: "Failed to add group." });
    },
  });

  const updateGroup = api.groups.update.useMutation({
    onSuccess: async () => {
      await utils.groups.invalidate();
      toast.success("Success", {
        description: "Group Updated Successfully!",
      });
      closeModal(modalId);
    },
    onError: ({ message }) => {
      console.error(message);
      toast.error("Error", { description: "Failed to update group." });
    },
  });

  async function onSubmit(values: z.infer<typeof groupFormSchema>) {
    let res;
    if (group?.id)
      res = await updateGroup.mutateAsync({ ...values, id: group.id });
    else res = await createGroup.mutateAsync(values);
    if (!res?.id) {
      toast.error(`Failed to ${group?.id ? "update" : "create"} group`);
    }
  }

  return (
    <Form {...form}>
      <FormErrorArea />
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-6 py-8"
      >
        <FormInput<z.infer<typeof groupFormSchema>>
          name="name"
          label={"Name"}
        />

        <div className="flex items-center gap-4">
          <FormMultiSelect<z.infer<typeof groupFormSchema>>
            name="users"
            label={"Users"}
            options={userOptions ?? []}
            isLoading={isUsersLoading || isLoading}
            defaultValue={[user?.id ?? ""]}
          />
        </div>

        <div className="flex w-full justify-end gap-4">
          <Button
            type="submit"
            isLoading={createGroup.isPending || updateGroup.isPending}
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
