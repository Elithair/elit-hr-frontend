'use client'
import {
  CheckCircleIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/solid'
import { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import z from 'zod/v3'
import type { FieldValues, SubmitHandler } from 'react-hook-form'
import type { Login } from '../schemas'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input, InputWrapper } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/providers/mock-auth-provider'

export default function AuthScreen() {
  const [showPassword, setShowPassword] = useState(false)
  const prevAuthRef = useRef<boolean>(false)
  const prevErrorRef = useRef<string | null>(null)
  const { isLoading, signIn, isAuthenticated, errors } = useAuth()
  const navigate = useNavigate()

  const form = useForm<Login>({
    // @ts-expect-error - zodResolver is not typed correctly, dependency error -- works fine
    resolver: zodResolver(
      // Test schema
      z.object({
        email: z.string().optional(),
        password: z.string().optional(),
        rememberMyEmail: z.boolean().optional().default(false),
      }),
    ),
    defaultValues: {
      email: '',
      password: '',
      rememberMyEmail: false,
    },
  })

  const { handleSubmit, control } = form

  useEffect(() => {
    const errorMessage = errors ? Object.values(errors).find((e) => e) : null
    if (errorMessage && errorMessage !== prevErrorRef.current) {
      toast.error('Sign in failed', {
        description: errorMessage,
        icon: <ExclamationTriangleIcon className="w-5 h-5" />,
        position: 'bottom-center',
        richColors: true,
      })
    }
    prevErrorRef.current = errorMessage || null
  }, [errors])

  useEffect(() => {
    if (isAuthenticated && !prevAuthRef.current) {
      toast.success('Sign in successful', {
        description: 'You are now signed in',
        icon: <CheckCircleIcon className="w-5 h-5" />,
        richColors: true,
      })
      // Redirect to dashboard after successful sign in
      setTimeout(() => {
        navigate({ to: '/dashboard' })
      }, 1000)
    }
    prevAuthRef.current = isAuthenticated
  }, [isAuthenticated, navigate])

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      await signIn(data.email || '')
    } catch (error) {
      toast.error('Sign in failed', {
        description:
          error instanceof Error ? error.message : 'An error occurred',
        icon: <ExclamationTriangleIcon className="w-5 h-5" />,
        position: 'bottom-center',
        richColors: true,
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-4 flex flex-col items-center justify-center gap-6">
        <h1 className="text-2xl font-bold">Elit HRMS</h1>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl">Hey, Welcome Back!</CardTitle>
            <CardDescription>
              To continue, please sign in to your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
              id="sign-in"
            >
              <FieldGroup>
                <Controller
                  name="email"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Email <span className="text-destructive">*</span>
                      </FieldLabel>
                      <InputWrapper>
                        <EnvelopeIcon />
                        <Input
                          {...field}
                          variant={'wrapper'}
                          type="email"
                          aria-invalid={fieldState.invalid}
                          placeholder="john.doe@elitklinik.com"
                        />
                      </InputWrapper>
                      <FieldDescription>
                        Please login with you company email address.
                      </FieldDescription>
                      <FieldError>{fieldState.error?.message}</FieldError>
                    </Field>
                  )}
                />
                <Controller
                  name="password"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Password <span className="text-destructive">*</span>
                      </FieldLabel>
                      <InputWrapper>
                        <Input
                          {...field}
                          variant={'wrapper'}
                          type={showPassword ? 'text' : 'password'}
                          aria-invalid={fieldState.invalid}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                        >
                          {showPassword ? <Eye /> : <EyeOff />}
                        </button>
                      </InputWrapper>
                      <FieldDescription>
                        Please login with you company email address.
                      </FieldDescription>
                      <FieldError>{fieldState.error?.message}</FieldError>
                    </Field>
                  )}
                />
              </FieldGroup>
            </form>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              form="sign-in"
              className="w-full"
              disabled={isLoading}
              startIcon={
                isLoading ? <Loader2 className="animate-spin" /> : null
              }
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
