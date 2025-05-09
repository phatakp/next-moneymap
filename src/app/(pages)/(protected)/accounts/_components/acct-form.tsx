"use client";

import { FormCheckbox } from "@/components/shared/form-checkbox";
import FormErrorArea from "@/components/shared/form-error-area";
import { FormInput } from "@/components/shared/form-input";
import { FormSelect } from "@/components/shared/form-select";
import { useModal } from "@/components/shared/modal";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ACCT_TYPES, INV_TYPES } from "@/lib/constants";
import { acct_number_format } from "@/lib/utils";
import { acctInsertFormSchema } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { skipToken } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { useAcctFormContext } from "../_providers/acct-form-provider";

const typeOptions = ACCT_TYPES.map((t) => ({ label: t, value: t }));
const invOptions = INV_TYPES.map((t) => ({ label: t, value: t }));

export default function AcctForm() {
  const { banks, isBanksLoading, type, acct, setFormSubmitting } =
    useAcctFormContext();
  const router = useRouter();
  const { modalId, closeModal } = useModal();

  const form = useForm<z.infer<typeof acctInsertFormSchema>>({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(acctInsertFormSchema),
    defaultValues: {
      type,
      name: acct?.name ?? "",
      bankId: acct?.bankId,
      num: acct?.num ?? "",
      invType: acct?.invType,
      isDefault: !!acct?.isDefault,
      balance: acct?.balance ?? 0,
      nav: acct?.mf?.nav ?? 0,
      units: acct?.mf?.units ?? 0,
      isSip: !!acct?.mf?.isSip,
      sipAmount: acct?.mf?.sipAmount ?? 0,
      quantity: acct?.equity?.quantity ?? 0,
      buyPrice: acct?.equity?.buyPrice ?? 0,
      currPrice: acct?.equity?.currPrice ?? 0,
      prefix: acct?.equity?.prefix ?? "",
    },
  });
  const { setValue, setError } = form;
  const formData = form.watch();

  const bankOptions = !acct?.id
    ? (banks
        ?.filter((b) => b.type === formData.type && b.name !== "Cash")
        .map((b) => ({ label: b.name, value: b.id })) ?? [])
    : (banks
        ?.filter((b) => b.id === acct.bankId)
        .map((b) => ({ label: b.name, value: b.id })) ?? []);

  const {
    data: mf,
    isLoading: isMFLoading,
    error: mfError,
  } = api.bankAccounts.getMFDetails.useQuery(
    formData.invType === "Mutual-Fund" && formData.num.length > 5
      ? { num: formData.num }
      : skipToken,
  );

  const {
    data: equity,
    isLoading: isEqLoading,
    error: eqError,
  } = api.bankAccounts.getEquityDetails.useQuery(
    formData.invType === "Equity" &&
      !!formData.prefix &&
      formData.prefix.length > 5 &&
      formData.num.length > 2
      ? { prefix: formData.prefix, symbol: formData.num }
      : skipToken,
  );

  useEffect(() => {
    if (mf?.schemeName) setValue("name", mf.schemeName);
    if (mf?.nav) {
      setValue("nav", mf.nav);
      if (formData?.units) setValue("value", mf.nav * formData.units);
    }
    if (mfError) setError("num", { message: "Could not get MF details" });
  }, [mf?.nav, mf?.schemeName, formData?.units, mfError, setValue, setError]);

  useEffect(() => {
    if (equity?.stockName) setValue("name", equity.stockName);
    if (equity?.price) {
      setValue("currPrice", equity.price);
      if (formData?.quantity)
        setValue("value", equity.price * formData.quantity);
    }
    if (eqError) setError("num", { message: "Could not get Equity details" });
  }, [
    equity?.price,
    equity?.stockName,
    formData?.quantity,
    eqError,
    setValue,
    setError,
  ]);

  const utils = api.useUtils();
  const createAccount = api.bankAccounts.create.useMutation({
    onSuccess: async () => {
      await utils.bankAccounts.invalidate();
      await utils.users.invalidate();
      toast.success("Success", {
        description: "Account Added Successfully!",
      });
      closeModal(modalId);
      router.replace(`/accounts/${formData.type}`);
    },
    onError: ({ message }) => {
      console.error(message);
      toast.error("Error", { description: "Failed to add account." });
    },
  });

  const updateAccount = api.bankAccounts.update.useMutation({
    onSuccess: async () => {
      await utils.bankAccounts.invalidate();
      await utils.users.invalidate();
      toast.success("Success", {
        description: "Account Updated Successfully!",
      });
      closeModal(modalId);
      router.replace(`/accounts/${formData.type}`);
    },
    onError: ({ message }) => {
      console.error(message);
      toast.error("Error", { description: "Failed to update account." });
    },
  });

  async function onSubmit(values: z.infer<typeof acctInsertFormSchema>) {
    setFormSubmitting(true);
    let res;
    if (acct?.id)
      res = await updateAccount.mutateAsync({ ...values, id: acct.id });
    else res = await createAccount.mutateAsync(values);
    if (!res?.id) {
      toast.error(`Failed to ${acct?.id ? "update" : "create"} account`);
    }
    setFormSubmitting(false);
  }

  return (
    <Form {...form}>
      <FormErrorArea />
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-6 py-8"
      >
        <div className="flex w-full gap-4">
          <FormSelect<z.infer<typeof acctInsertFormSchema>>
            name="type"
            label={"Acct Type"}
            options={typeOptions}
            disabled={!!acct?.id}
            handleChange={() =>
              form.reset({
                name: acct?.name ?? "",
                bankId: acct?.bankId,
                num: acct?.num ?? "",
                invType: acct?.invType,
                isDefault: !!acct?.isDefault,
                balance: acct?.balance ?? 0,
                nav: acct?.mf?.nav ?? 0,
                units: acct?.mf?.units ?? 0,
                isSip: !!acct?.mf?.isSip,
                sipAmount: acct?.mf?.sipAmount ?? 0,
                quantity: acct?.equity?.quantity ?? 0,
                buyPrice: acct?.equity?.buyPrice ?? 0,
                currPrice: acct?.equity?.currPrice ?? 0,
                prefix: acct?.equity?.prefix ?? "",
              })
            }
          />
          {isBanksLoading ? (
            <Skeleton className="h-12 w-full" />
          ) : (
            <FormSelect<z.infer<typeof acctInsertFormSchema>>
              name="bankId"
              label={"Bank"}
              options={bankOptions}
              disabled={!!acct?.id}
            />
          )}
        </div>

        {formData.type === "Investment" && (
          <>
            <div className="flex w-full flex-col gap-4 sm:flex-row">
              <FormSelect<z.infer<typeof acctInsertFormSchema>>
                name="invType"
                label={"Investment Type"}
                options={invOptions}
                disabled={!!acct?.id}
                handleChange={() => {
                  form.resetField("name");
                  form.resetField("num");
                  form.resetField("balance");
                  form.resetField("value");
                  form.resetField("units");
                  form.resetField("nav");
                  form.resetField("isSip");
                  form.resetField("sipAmount");
                  form.resetField("quantity");
                  form.resetField("buyPrice");
                  form.resetField("currPrice");
                  form.resetField("prefix");
                  form.resetField("isDefault");
                }}
              />
              <FormInput<z.infer<typeof acctInsertFormSchema>>
                name="num"
                disabled={!!acct?.id}
                label={
                  formData.invType === "Mutual-Fund"
                    ? "Scheme Code"
                    : formData.invType === "Equity"
                      ? "Symbol"
                      : "Acct Number"
                }
              />
            </div>

            {formData.invType === "Equity" && (
              <FormInput<z.infer<typeof acctInsertFormSchema>>
                name="prefix"
                disabled={!!acct?.id}
                label={"MoneyControl Prefix"}
              />
            )}

            {isMFLoading && <Skeleton className="h-12 w-full" />}
            {isEqLoading && <Skeleton className="h-12 w-full" />}
            {formData.name && (
              <FormInput<z.infer<typeof acctInsertFormSchema>>
                name="name"
                readOnly
                disabled
                label={
                  formData.invType === "Mutual-Fund"
                    ? "Scheme Name"
                    : formData.invType === "Equity"
                      ? "Company Name"
                      : "Acct Name"
                }
              />
            )}
          </>
        )}

        {formData.type !== "Investment" && (
          <>
            <FormInput<z.infer<typeof acctInsertFormSchema>>
              name="name"
              label="Acct Name"
              disabled={acct?.bank.name === "Cash"}
            />
            <FormInput<z.infer<typeof acctInsertFormSchema>>
              name="num"
              label="Acct Number"
              value={acct_number_format(formData.num)}
              disabled={acct?.bank.name === "Cash"}
            />
          </>
        )}

        <div className="flex w-full gap-4">
          {formData.invType === "Mutual-Fund" && (
            <div className="flex w-full flex-col">
              <FormInput<z.infer<typeof acctInsertFormSchema>>
                name="units"
                label="Units"
                type="number"
                inputMode="numeric"
                onChange={(e) => {
                  form.setValue("units", +e.target.value);
                  form.setValue("value", +e.target.value * (formData.nav ?? 0));
                }}
              />
              {formData.nav && <Label>NAV: {formData.nav}</Label>}
            </div>
          )}

          {formData.invType === "Equity" && (
            <div className="flex w-full flex-col">
              <FormInput<z.infer<typeof acctInsertFormSchema>>
                name="quantity"
                label="Quantity"
                type="number"
                inputMode="numeric"
                onChange={(e) => {
                  form.setValue("quantity", +e.target.value);
                  form.setValue(
                    "value",
                    +e.target.value * (formData.currPrice ?? 0),
                  );
                }}
              />
              {formData.currPrice && (
                <Label>Curr Price: {formData.currPrice}</Label>
              )}
            </div>
          )}

          <div className="flex w-full flex-col">
            {formData.invType !== "Equity" && (
              <FormInput<z.infer<typeof acctInsertFormSchema>>
                name="balance"
                label={formData.type === "Investment" ? "Invested" : "Balance"}
                type="number"
                inputMode="numeric"
                onChange={(e) => {
                  form.setValue("balance", +e.target.value);
                  if (formData.type !== "Investment")
                    form.setValue("value", +e.target.value);
                }}
              />
            )}

            {formData.invType === "Equity" && (
              <FormInput<z.infer<typeof acctInsertFormSchema>>
                name="buyPrice"
                label="Buy Price"
                type="number"
                inputMode="numeric"
                onChange={(e) => {
                  form.setValue("buyPrice", +e.target.value);
                  form.setValue(
                    "balance",
                    +e.target.value * (formData.quantity ?? 0),
                  );
                }}
              />
            )}
            {!!formData.invType &&
              formData.invType !== "Deposit" &&
              formData.value && (
                <Label>Value: {formData.value.toFixed(2)}</Label>
              )}
          </div>
        </div>

        {formData.invType === "Deposit" && (
          <FormInput<z.infer<typeof acctInsertFormSchema>>
            name="value"
            label={"Current Value"}
            type="number"
            inputMode="numeric"
            onChange={(e) => {
              form.setValue("value", +e.target.value);
            }}
          />
        )}
        {formData.invType === "Mutual-Fund" && (
          <div className="flex w-full gap-4">
            <FormCheckbox<z.infer<typeof acctInsertFormSchema>>
              name="isSip"
              label="Is this SIP?"
            />

            {formData.isSip && (
              <FormInput<z.infer<typeof acctInsertFormSchema>>
                name="sipAmount"
                label={"SIP Amount"}
                type="number"
                inputMode="numeric"
                onChange={(e) => {
                  form.setValue("sipAmount", +e.target.value);
                }}
              />
            )}
          </div>
        )}

        {["Savings", "Wallet", "Credit-Card"].includes(formData.type) && (
          <FormCheckbox<z.infer<typeof acctInsertFormSchema>>
            name="isDefault"
            label="Use as default account?"
          />
        )}

        <div className="flex w-full justify-end gap-4">
          <Button
            type="submit"
            isLoading={createAccount.isPending || updateAccount.isPending}
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
