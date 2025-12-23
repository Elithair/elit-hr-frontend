import z from 'zod/v3'

export const userSchema = z.object({
  id: z.string(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
  email: z.string().transform((val) => val.toLowerCase()),
  emailVerified: z.boolean().default(false),
  name: z.string(),
  image: z.string().nullish(),
  role: z.string().nullable().optional(),
  activeOrganizationId: z.string().nullable().optional(),
  activeTeamId: z.string().nullable().optional(),
})

export type User = z.infer<typeof userSchema>

// mock user for dev
export const user: User | null = {
  id: 'user-1',
  name: 'John Doe',
  email: 'john@example.com',
  emailVerified: true,
  image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  createdAt: new Date(),
  updatedAt: new Date(),
}
