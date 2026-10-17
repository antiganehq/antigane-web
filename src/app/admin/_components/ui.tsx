export const input =
  "w-full border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground";
export const label = "mb-1 block text-[13px] text-muted-foreground";
export const btn =
  "inline-block border border-foreground bg-foreground px-4 py-2 text-sm text-background";
export const dangerBtn =
  "inline-block border border-border px-4 py-2 text-sm text-foreground";

export function Field({
  name,
  label: text,
  value = "",
  placeholder = "",
  type = "text",
}: {
  name: string;
  label: string;
  value?: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className={label}>{text}</span>
      <input
        name={name}
        type={type}
        defaultValue={value}
        placeholder={placeholder}
        className={input}
        autoComplete="off"
      />
    </label>
  );
}
