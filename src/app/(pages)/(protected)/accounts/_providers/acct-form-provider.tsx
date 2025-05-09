"use client";

import type { banksSchema } from "@/server/db/schema";
import { api } from "@/trpc/react";
import React from "react";
import type { z } from "zod";

type AcctFormContextProps = {
  banks: z.infer<typeof banksSchema>[] | undefined;
  isBanksLoading: boolean;
};

const AcctFormContext = React.createContext<AcctFormContextProps | undefined>(
  undefined,
);

export default function AcctFormProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, isLoading } = api.banks.getAll.useQuery();

  return (
    <AcctFormContext.Provider
      value={{ banks: data, isBanksLoading: isLoading }}
    >
      {children}
    </AcctFormContext.Provider>
  );
}

export const useAcctFormContext = () => {
  const context = React.useContext(AcctFormContext);
  if (!context)
    throw new Error("Acct Form context should be used within a provider");
  return context;
};
