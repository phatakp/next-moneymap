import { type PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

type Props = PropsWithChildren & {
  className?: string;
  type?: "dot" | "grid";
};

export default function Background({
  className,
  children,
  type = "dot",
}: Props) {
  return (
    <div
      className={cn(
        "bg-background relative flex h-full w-full items-center justify-center",
        className,
      )}
    >
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:40px_40px]",
          type == "dot"
            ? "[background-image:radial-gradient(#404040_1px,transparent_1px)]"
            : "[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
        )}
      />
      {/* Radial gradient for the container to give a faded look */}
      <div className="bg-background pointer-events-none absolute inset-0 flex items-center justify-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="relative z-20">{children}</div>
    </div>
  );
}
