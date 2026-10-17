import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { registerAdmin } from "../research/actions";

export const dynamic = "force-dynamic";

const field =
  "w-full border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground";
const fieldLabel = "mb-1 block text-[13px] text-muted-foreground";
const primaryBtn =
  "inline-block border border-foreground bg-foreground px-4 py-2 text-sm text-background";

export default async function AdminLoginPage() {
  let current = "";
  try {
    const raw = await readFile(join(process.cwd(), "src", "messages", "admin.json"), "utf-8");
    current = (JSON.parse(raw) as { user?: string }).user ?? "";
  } catch {
    current = "";
  }

  return (
    <div className="mx-auto w-full max-w-[1280px] px-6 py-12 md:px-10 md:py-16">
      <p className="kicker flex items-center gap-3 text-muted-foreground">
        <span aria-hidden="true" className="inline-block h-px w-12 bg-foreground" />
        Antigane CMS — Access
      </p>
      <div className="mt-6 grid grid-cols-12 gap-x-6 md:gap-x-8">
        <h1 className="col-span-12 font-display text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] tracking-[-0.01em] md:col-start-1 md:col-span-9">
          {current ? `Signed in as ${current}` : "Create your login"}
        </h1>
        <p className="col-span-12 mt-6 max-w-[50ch] text-[clamp(1.05rem,1.4vw,1.25rem)] leading-relaxed text-muted-foreground md:col-start-1 md:col-span-6">
          {current
            ? "Your login works. Open the research dashboard to add, edit, or delete content."
            : "No login exists yet — this form disappears once you register. After saving, wait for the redeploy (about 1–2 minutes), then sign in with these credentials."}
        </p>
        <div className="col-span-12 mt-6 border-l border-border pl-4 text-[13px] leading-relaxed text-muted-foreground md:col-start-10 md:col-span-3 md:mt-2">
          <p>Research dashboard</p>
          <p className="mt-1">One account</p>
          <p className="mt-1">Hashed + salted</p>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-12 gap-x-6 md:gap-x-8">
        <div className="col-span-12 border-t border-border pt-8 md:col-start-2 md:col-span-6">
          {current ? (
            <a href="/admin/research" className={primaryBtn}>
              Enter dashboard →
            </a>
          ) : (
            <form action={registerAdmin} className="space-y-4">
              <label className="block">
                <span className={fieldLabel}>Username</span>
                <input name="user" autoComplete="off" className={field} />
              </label>
              <label className="block">
                <span className={fieldLabel}>Password (min 16 characters)</span>
                <input name="newPass" type="password" className={field} />
              </label>
              <label className="block">
                <span className={fieldLabel}>Confirm password</span>
                <input name="confirm" type="password" className={field} />
              </label>
              <button type="submit" className={primaryBtn}>
                Register
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
