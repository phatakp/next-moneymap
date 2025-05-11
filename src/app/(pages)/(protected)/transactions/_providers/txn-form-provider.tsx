"use client";

import type { SelectOption } from "@/components/shared/form-select";
import type {
  AccountWithBank,
  FullTransaction,
  GroupWithUsers,
} from "@/server/db/schema";
import { api } from "@/trpc/react";
import React, { useEffect, useState } from "react";

type TxnFormContextProps = {
  groups: GroupWithUsers[] | undefined;
  accounts: AccountWithBank[] | undefined;
  isGroupLoading: boolean;
  isAcctsLoading: boolean;
  txn?: FullTransaction;
  isIncome?: boolean;
  selectedGroup: SelectOption | undefined;
  setSelectedGroup: React.Dispatch<
    React.SetStateAction<SelectOption | undefined>
  >;
  defAcctId: string | undefined;
};

const TxnFormContext = React.createContext<TxnFormContextProps | undefined>(
  undefined,
);

export default function TxnFormProvider({
  children,
  txn,
  isIncome,
}: {
  children: React.ReactNode;
  txn?: FullTransaction;
  isIncome?: boolean;
}) {
  const [selectedGroup, setSelectedGroup] = useState<SelectOption | undefined>(
    undefined,
  );
  const [defAcctId, setDefAcctId] = useState<string | undefined>(undefined);
  const { data, isLoading } = api.bankAccounts.getUserAccountsForTxn.useQuery();
  const { data: groups, isLoading: isGroupLoading } =
    api.groups.getAllUserGroups.useQuery();

  useEffect(() => {
    setSelectedGroup(
      groups
        ?.filter((g) => g.name === "Personal")
        ?.map((g) => ({ label: g.name, value: g.id }))?.[0],
    );
  }, [groups]);

  useEffect(() => {
    setDefAcctId(data?.find((g) => g.isDefault)?.id);
  }, [data]);

  return (
    <TxnFormContext.Provider
      value={{
        groups,
        isGroupLoading,
        accounts: data,
        isAcctsLoading: isLoading,
        txn,
        isIncome,
        selectedGroup,
        setSelectedGroup,
        defAcctId,
      }}
    >
      {children}
    </TxnFormContext.Provider>
  );
}

export const useTxnFormContext = () => {
  const context = React.useContext(TxnFormContext);
  if (!context)
    throw new Error("Txn Form context should be used within a provider");
  return context;
};
