import {
  ModalProvider as Modal,
  ModalBody,
  ModalContent,
  ModalTrigger,
} from "@/components/shared/modal";
import type { AccountWithBank, AcctType } from "@/server/db/schema";
import AcctFormProvider from "../_providers/acct-form-provider";
import AcctForm from "./acct-form";

type Props = {
  id: string;
  children: React.ReactNode;
  acct?: AccountWithBank;
  type?: AcctType;
};
export default function AcctModal({ id, acct, type, children }: Props) {
  return (
    <AcctFormProvider type={type} acct={acct}>
      <Modal id={id}>
        <ModalTrigger>{children}</ModalTrigger>
        <ModalBody>
          <ModalContent>
            <div className="flex flex-col gap-2 text-center sm:text-left">
              <h3 className="text-lg leading-none font-semibold">
                {acct ? "Update Account" : "Add New Account"}
              </h3>
              <p className="text-muted-foreground text-sm">
                {acct
                  ? "Change details for your account"
                  : "Enter details to save and track new account"}
              </p>
            </div>
            <div className="py-4">
              <AcctForm />
            </div>
          </ModalContent>
        </ModalBody>
      </Modal>
    </AcctFormProvider>
  );
}
