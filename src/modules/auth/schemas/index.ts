import { z } from 'zod/v3'

export const LoginSchema = z.object({
  email: z.string().email('Email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  rememberMyEmail: z.boolean().optional().default(false),
})

export type Login = z.infer<typeof LoginSchema>

export const SignInSchema = z.object({
  email: z.string().email('auth.common.email.required'),
  password: z.string().min(8, 'auth.common.password.min'),
  rememberMe: z.boolean().optional().default(false),
})

export type SignIn = z.infer<typeof SignInSchema>

export const SignInResultSchema = z.object({
  redirect: z.boolean(),
  token: z.string().nullable(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    emailVerified: z.boolean(),
    image: z.string().nullable(),
    createdAt: z.string().transform((val) => new Date(val)),
    updatedAt: z.string().transform((val) => new Date(val)),
  }),
})

export type SignInResult = z.infer<typeof SignInResultSchema>
