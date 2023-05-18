import { z } from "zod";

if (typeof window !== "undefined")
  throw new Error("Secrets should not be on client side.");

const SecretEnvVarsParser = z.object({
  SUPABASE_API_SECRET_KEY: z.string(),
  SUPABASE_PROJECT_URL: z.string(),
});

export type SecretEnvVars = z.infer<typeof SecretEnvVarsParser>;

export const secretEnvVars = SecretEnvVarsParser.parse(process.env);
