"use client";

import type {
  AccountWithBank,
  AcctType,
  banksSchema,
} from "@/server/db/schema";
import { api } from "@/trpc/react";
import { skipToken } from "@tanstack/react-query";
import React, { useState } from "react";
import type { z } from "zod";

type AcctFormContextProps = {
  banks: z.infer<typeof banksSchema>[] | undefined;
  isBanksLoading: boolean;
  type?: AcctType;
  acct?: AccountWithBank;
  formSubmitting: boolean;
  setFormSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
};

const AcctFormContext = React.createContext<AcctFormContextProps | undefined>(
  undefined,
);

export default function AcctFormProvider({
  children,
  type,
  acct,
}: {
  children: React.ReactNode;
  type?: AcctType;
  acct?: AccountWithBank;
}) {
  const [formSubmitting, setFormSubmitting] = useState(false);
  const { data, isLoading } = api.banks.getAll.useQuery(
    !!acct ? undefined : skipToken,
  );

  return (
    <AcctFormContext.Provider
      value={{
        banks: data,
        isBanksLoading: isLoading,
        type,
        acct,
        formSubmitting,
        setFormSubmitting,
      }}
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
