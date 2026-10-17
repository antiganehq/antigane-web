// Shared Server-Action form state. Pure types only (no directives) so both
// "use server" action modules and client form components can import it.

export type ActionState = { error?: string } | null;

export type AdminAction = (prev: ActionState, formData: FormData) => Promise<ActionState>;
