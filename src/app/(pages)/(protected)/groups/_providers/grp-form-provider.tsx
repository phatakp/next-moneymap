"use client";

import type { GroupWithUsers, usersSchema } from "@/server/db/schema";
import { api } from "@/trpc/react";
import React from "react";
import type { z } from "zod";

type GroupFormContextProps = {
  group?: GroupWithUsers;
  users: z.infer<typeof usersSchema>[] | undefined;
  isUsersLoading: boolean;
};

const GroupFormContext = React.createContext<GroupFormContextProps | undefined>(
  undefined,
);

export default function GroupFormProvider({
  children,
  group,
}: {
  children: React.ReactNode;
  group?: GroupWithUsers;
}) {
  const { data: users, isLoading: isUsersLoading } =
    api.users.getAll.useQuery();
  return (
    <GroupFormContext.Provider
      value={{
        group,
        users,
        isUsersLoading,
      }}
    >
      {children}
    </GroupFormContext.Provider>
  );
}

export const useGroupFormContext = () => {
  const context = React.useContext(GroupFormContext);
  if (!context)
    throw new Error("Group Form context should be used within a provider");
  return context;
};
