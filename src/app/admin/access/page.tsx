import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { saveCredentials } from "../research/actions";
import { AdminForm } from "../_components/admin-form";
import { Field, btn } from "../_components/ui";

export const dynamic = "force-dynamic";

export default async function AdminAccessPage() {
  let currentUser = "";
  try {
    const raw = await readFile(join(process.cwd(), "src", "messages", "admin.json"), "utf-8");
    currentUser = (JSON.parse(raw) as { user?: string }).user ?? "";
  } catch {
    currentUser = "";
  }

  return (
    <div>
      <p className="kicker text-muted-foreground">System</p>
      <h1 className="mt-2 font-display text-4xl">Access</h1>
      <p className="mt-3 max-w-[66ch] text-sm leading-relaxed text-muted-foreground">
        Signed in as <span className="text-foreground">{currentUser || "(not set)"}</span>.
        Saving new credentials rebuilds the site — your saved login stops working and the login box returns.
      </p>
      <AdminForm action={saveCredentials} className="mt-8 max-w-md space-y-3">
        <Field name="user" label="Username" value={currentUser} />
        <Field name="newPass" label="New password (min 4 characters)" type="password" />
        <Field name="confirm" label="Confirm new password" type="password" />
        <button type="submit" className={btn}>Rotate credentials</button>
      </AdminForm>
    </div>
  );
}
