"use client";

import { useFormContext } from "react-hook-form";

export default function FormErrorArea() {
  const { formState } = useFormContext();
  return (
    <ul className="grid gap-2">
      {Object.entries(formState.errors).map(([key, val]) => (
        <li
          key={key}
          className="bg-destructive text-destructive-foreground flex items-center gap-2 rounded-md p-2 text-sm"
        >
          <span className="font-semibold capitalize underline underline-offset-2">
            {key}:
          </span>
          <span className="flex-1 truncate">{val?.message as string}</span>
        </li>
      ))}
    </ul>
  );
}
