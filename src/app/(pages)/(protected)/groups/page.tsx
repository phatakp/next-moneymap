import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import GroupModal from "./_components/group-modal";

export default function GroupsPage() {
  return (
    <div>
      Groups Page
      <GroupModal id={`add-group-new`}>
        <Button>
          <span className="hidden sm:flex">New Group</span> <PlusCircle />
        </Button>
      </GroupModal>
    </div>
  );
}
