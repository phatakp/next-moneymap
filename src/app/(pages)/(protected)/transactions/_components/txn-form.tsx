"use client";

import { FormCheckbox } from "@/components/shared/form-checkbox";
import { FormDatePicker } from "@/components/shared/form-date-picker";
import FormErrorArea from "@/components/shared/form-error-area";
import { FormInput } from "@/components/shared/form-input";
import { FormSelect } from "@/components/shared/form-select";
import { useModal } from "@/components/shared/modal";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CATEGORIES, GRP_TXN_TYPES } from "@/lib/constants";
import { txnFormSchema } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { useTxnFormContext } from "../_providers/txn-form-provider";

const categoryOptions = CATEGORIES.map((t) => ({ label: t, value: t }));
const grpTxtTypeOptions = GRP_TXN_TYPES.map((t) => ({ label: t, value: t }));

export default function TxnForm() {
  const {
    accounts,
    isAcctsLoading,
    txn,
    isGroupLoading,
    groups,
    isIncome,
    selectedGroup,
    setSelectedGroup,
    defAcctId,
  } = useTxnFormContext();
  const { modalId, closeModal } = useModal();

  const form = useForm<z.infer<typeof txnFormSchema>>({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(txnFormSchema),
    defaultValues: {
      description: txn?.description ?? "",
      acctId: txn?.acctId ?? defAcctId,
      groupId: txn?.groupId ?? selectedGroup?.value,
      date: txn?.date ?? new Date(),
      isIncome: txn?.isIncome ?? !!isIncome,
      amount: txn?.amount ?? 0,
      category: txn?.category ?? undefined,
      grpTxnType:
        (txn?.grpTxnType ??
        (selectedGroup && selectedGroup?.label !== "Personal"))
          ? "Split"
          : undefined,
    },
  });
  const { setValue } = form;
  const formData = form.watch();

  const acctOptions =
    accounts?.map((a) => ({ label: a.name, value: a.id })) ?? [];
  const grpOptions = groups?.map((a) => ({ label: a.name, value: a.id })) ?? [];

  useEffect(() => {
    const selectGrp = grpOptions.find((g) => g.value === formData.groupId);
    setSelectedGroup(selectGrp);
    if (selectGrp?.label === "Personal") setValue("grpTxnType", undefined);
  }, [formData.groupId, setValue]);

  const utils = api.useUtils();
  const createTxn = api.transactions.create.useMutation({
    onSuccess: async () => {
      await utils.transactions.invalidate();
      await utils.bankAccounts.invalidate();
      toast.success("Success", {
        description: "Txn Added Successfully!",
      });
      closeModal(modalId);
    },
    onError: ({ message }) => {
      console.error(message);
      toast.error("Error", { description: "Failed to add txn." });
    },
  });

  const updateTxn = api.transactions.update.useMutation({
    onSuccess: async () => {
      await utils.transactions.invalidate();
      await utils.bankAccounts.invalidate();
      toast.success("Success", {
        description: "Txn Updated Successfully!",
      });
      closeModal(modalId);
    },
    onError: ({ message }) => {
      console.error(message);
      toast.error("Error", { description: "Failed to update txn." });
    },
  });

  async function onSubmit(values: z.infer<typeof txnFormSchema>) {
    let res;
    if (txn?.id) res = await updateTxn.mutateAsync({ ...values, id: txn.id });
    else res = await createTxn.mutateAsync(values);
    if (!res?.id) {
      toast.error(`Failed to ${txn?.id ? "update" : "create"} txn`);
    }
  }

  return (
    <Form {...form}>
      <FormErrorArea />
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-6 py-8"
      >
        <div className="flex w-full gap-4">
          <FormCheckbox<z.infer<typeof txnFormSchema>>
            name="isIncome"
            label="Is it Income?"
            disabled={isIncome}
          />

          <FormDatePicker<z.infer<typeof txnFormSchema>>
            name="date"
            label="Date"
          />
        </div>

        <div className="flex w-full gap-4">
          <FormSelect<z.infer<typeof txnFormSchema>>
            name="groupId"
            label={"Group"}
            options={grpOptions}
            isLoading={isGroupLoading}
            disabled={!!formData.isIncome}
          />

          {selectedGroup && selectedGroup?.label !== "Personal" && (
            <FormSelect<z.infer<typeof txnFormSchema>>
              name="grpTxnType"
              label={"Split"}
              options={grpTxtTypeOptions}
              defaultValue={"Split"}
            />
          )}
        </div>

        <FormInput<z.infer<typeof txnFormSchema>>
          name="description"
          label={"Description"}
        />

        <FormSelect<z.infer<typeof txnFormSchema>>
          name="category"
          label={"Category"}
          options={categoryOptions}
        />

        <div className="flex w-full gap-4">
          <FormInput<z.infer<typeof txnFormSchema>>
            name="amount"
            label="Amount"
            type="number"
            inputMode="numeric"
            onChange={(e) => {
              form.setValue("amount", +e.target.value);
            }}
          />
        </div>
        <FormSelect<z.infer<typeof txnFormSchema>>
          name="acctId"
          label={formData.isIncome ? "To Account" : "From Account"}
          options={acctOptions}
          defaultValue={defAcctId}
          isLoading={isAcctsLoading}
        />

        <div className="flex w-full justify-end gap-4">
          <Button
            type="submit"
            isLoading={createTxn.isPending || updateTxn.isPending}
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
