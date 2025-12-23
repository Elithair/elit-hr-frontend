import { createEnv } from '@t3-oss/env-core'
import z from 'zod'

export const env = createEnv({
  clientPrefix: 'VITE_',
  client: {
    VITE_FRONTEND_VERSION: z.string(),
    VITE_API_URL: z.string(),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
})
