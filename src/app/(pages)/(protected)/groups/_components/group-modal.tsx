import {
  ModalProvider as Modal,
  ModalBody,
  ModalContent,
  ModalTrigger,
} from "@/components/shared/modal";
import type { GroupWithUsers } from "@/server/db/schema";
import GroupFormProvider from "../_providers/grp-form-provider";
import GroupForm from "./group-form";

type Props = {
  id: string;
  children: React.ReactNode;
  group?: GroupWithUsers;
};
export default function GroupModal({ id, group, children }: Props) {
  return (
    <GroupFormProvider group={group}>
      <Modal id={id}>
        <ModalTrigger className="w-full">{children}</ModalTrigger>
        <ModalBody>
          <ModalContent>
            <div className="flex flex-col gap-2 text-center sm:text-left">
              <h3 className="text-lg leading-none font-semibold">
                {group ? "Update Group" : "Add New Group"}
              </h3>
              <p className="text-muted-foreground text-sm">
                {group
                  ? "Change details for your group"
                  : "Enter details to save new group"}
              </p>
            </div>
            <div className="py-4">
              <GroupForm />
            </div>
          </ModalContent>
        </ModalBody>
      </Modal>
    </GroupFormProvider>
  );
}
