import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const ADAMIK_API_URL =
  // Custom URL that can be defined in an env var, locally or in Vercel
  process.env.NEXT_PUBLIC_ADAMIK_API_TEST_URL ||
  // Prod URL when running in a Vercel deployment
  "https://api.adamik.io/api";

const env = createEnv({
  /*
   * Serverside Environment variables, not available on the client.
   * Will throw if you access these variables on the client.
   */
  server: {
    ADAMIK_API_KEY: z.string().min(1),
  },

  /*
   * Due to how Next.js bundles environment variables on Edge and Client,
   * we need to manually destructure them to make sure all are included in bundle.
   *
   * 💡 You'll get type errors if not all variables from `server` & `client` are included here.
   */
  runtimeEnv: {
    ADAMIK_API_KEY: process.env.ADAMIK_API_KEY,
  },
});

export { env, ADAMIK_API_URL };
