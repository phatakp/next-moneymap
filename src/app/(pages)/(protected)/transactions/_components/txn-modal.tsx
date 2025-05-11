import {
  ModalProvider as Modal,
  ModalBody,
  ModalContent,
  ModalTrigger,
} from "@/components/shared/modal";
import type { FullTransaction } from "@/server/db/schema";
import TxnFormProvider from "../_providers/txn-form-provider";
import TxnForm from "./txn-form";
type Props = {
  id: string;
  children: React.ReactNode;
  txn?: FullTransaction;
  isIncome?: boolean;
};
export default function TxnModal({ id, txn, children, isIncome }: Props) {
  return (
    <TxnFormProvider txn={txn} isIncome={isIncome}>
      <Modal id={id}>
        <ModalTrigger className="w-full">{children}</ModalTrigger>
        <ModalBody>
          <ModalContent>
            <div className="flex flex-col gap-2 text-center sm:text-left">
              <h3 className="text-lg leading-none font-semibold">
                {txn
                  ? isIncome
                    ? "Update Income"
                    : "Update Expense"
                  : isIncome
                    ? "Add New Income"
                    : "Add New Expense"}
              </h3>
              <p className="text-muted-foreground text-sm">
                {txn
                  ? isIncome
                    ? "Change details for your income"
                    : "Change details for your expense"
                  : isIncome
                    ? "Enter details to save income"
                    : "Enter details to save expense"}
              </p>
            </div>
            <div className="py-4">
              <TxnForm />
            </div>
          </ModalContent>
        </ModalBody>
      </Modal>
    </TxnFormProvider>
  );
}
