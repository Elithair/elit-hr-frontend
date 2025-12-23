import { z } from 'zod/v3'

export const LoginSchema = z.object({
  email: z.string().email('Email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  rememberMyEmail: z.boolean().optional().default(false),
})

export type Login = z.infer<typeof LoginSchema>
