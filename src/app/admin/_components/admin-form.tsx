"use client";

import { useActionState, type ReactNode } from "react";
import type { ActionState } from "../research/actions";

type AdminAction = (prev: ActionState, formData: FormData) => Promise<ActionState>;

export type { AdminAction };

// Server-action form that shows failures as an inline alert (role=alert)
// instead of replacing the page with an error boundary.
export function AdminForm({
  action,
  children,
  className,
}: {
  action: AdminAction;
  children: ReactNode;
  className?: string;
}) {
  const [state, formAction] = useActionState(action, null);
  return (
    <form action={formAction} className={className}>
      {state?.error ? (
        <p role="alert" className="border border-foreground bg-foreground px-3 py-2 text-sm text-background">
          {state.error}
        </p>
      ) : null}
      {children}
    </form>
  );
}
