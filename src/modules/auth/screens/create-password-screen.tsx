import { AnimatePresence, motion } from 'framer-motion'
import { Check, Eye, EyeOff, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type StrengthLevel = '' | 'weak' | 'medium' | 'strong'

interface PasswordStrength {
  score: number
  level: 'weak' | 'medium' | 'strong' | 'very-strong' | ''
  segments: {
    first: StrengthLevel
    second: StrengthLevel
    third: StrengthLevel
  }
}

interface PasswordRequirements {
  hasMinLength: boolean
  hasUppercase: boolean
  hasLowercase: boolean
  hasNumber: boolean
  hasSpecialChar: boolean
}

function usePasswordValidation(password: string) {
  const requirements = useMemo<PasswordRequirements>(() => {
    if (!password) {
      return {
        hasMinLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecialChar: false,
      }
    }

    return {
      hasMinLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(password),
    }
  }, [password])

  const strength = useMemo<PasswordStrength>(() => {
    if (!password) {
      return {
        score: 0,
        level: '',
        segments: { first: '', second: '', third: '' },
      }
    }

    let score = 0

    if (requirements.hasMinLength) score += 2
    else if (password.length >= 6) score += 1

    if (requirements.hasUppercase) score += 1
    if (requirements.hasLowercase) score += 1
    if (requirements.hasNumber) score += 1
    if (requirements.hasSpecialChar) score += 1

    let level: PasswordStrength['level']
    let segments: PasswordStrength['segments']

    if (score <= 2) {
      level = 'weak'
      segments = { first: 'weak', second: '', third: '' }
    } else if (score === 3) {
      level = 'weak'
      segments = { first: 'medium', second: 'weak', third: '' }
    } else if (score === 4) {
      level = 'medium'
      segments = { first: 'strong', second: 'medium', third: '' }
    } else if (score === 5) {
      level = 'strong'
      segments = { first: 'strong', second: 'strong', third: 'medium' }
    } else {
      level = 'very-strong'
      segments = { first: 'strong', second: 'strong', third: 'strong' }
    }

    return { score, level, segments }
  }, [password, requirements])

  const isValid = useMemo(() => {
    return Object.values(requirements).every(Boolean)
  }, [requirements])

  return { requirements, strength, isValid }
}

interface RequirementItemProps {
  met: boolean
  label: string
}

function RequirementItem({ met, label }: RequirementItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        'flex items-center gap-2 text-xs transition-colors duration-200',
        met ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground',
      )}
    >
      <motion.div
        initial={false}
        animate={{
          scale: met ? [1, 1.2, 1] : 1,
          rotate: met ? [0, 10, 0] : 0,
        }}
        transition={{ duration: 0.3 }}
        className={cn(
          'flex items-center justify-center size-4 rounded-full border-2 transition-colors duration-200',
          met
            ? 'bg-green-500 border-green-500 dark:bg-green-600 dark:border-green-600'
            : 'border-muted-foreground/40',
        )}
      >
        <AnimatePresence mode="wait">
          {met ? (
            <motion.div
              key="check"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Check className="size-3 text-white" strokeWidth={3} />
            </motion.div>
          ) : (
            <motion.div
              key="x"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.5 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X
                className="size-2.5 text-muted-foreground/60"
                strokeWidth={2.5}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <span className="font-medium">{label}</span>
    </motion.div>
  )
}

interface StrengthSegmentProps {
  strength: StrengthLevel
  delay?: number
}

function StrengthSegment({ strength, delay = 0 }: StrengthSegmentProps) {
  const bgClass = useMemo(() => {
    if (!strength) return 'bg-muted border border-muted-foreground/20'
    if (strength === 'weak') return 'bg-red-500 border border-red-600'
    if (strength === 'medium') return 'bg-orange-500 border border-orange-600'
    return 'bg-green-500 border border-green-600'
  }, [strength])

  return (
    <motion.div
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ delay, duration: 0.3, ease: 'easeOut' }}
      className="w-full h-2 rounded-full origin-left overflow-hidden"
    >
      <motion.div
        initial={false}
        animate={{
          opacity: strength ? 1 : 0.5,
        }}
        className={cn(
          'h-full rounded-full transition-all duration-500',
          bgClass,
        )}
      />
    </motion.div>
  )
}

export default function CreatePasswordScreen() {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const { requirements, strength, isValid } = usePasswordValidation(password)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) {
      return
    }
    if (password !== confirmPassword) {
      return
    }

    console.log('Password created successfully!')
  }

  const strengthLabel = useMemo(() => {
    if (!strength.level) return ''
    switch (strength.level) {
      case 'weak':
        return 'Weak'
      case 'medium':
        return 'Medium'
      case 'strong':
        return 'Strong'
      case 'very-strong':
        return 'Very Strong'
      default:
        return ''
    }
  }, [strength.level])

  const strengthColor = useMemo(() => {
    if (!strength.level) return ''
    switch (strength.level) {
      case 'weak':
        return 'text-red-600 dark:text-red-400'
      case 'medium':
        return 'text-orange-600 dark:text-orange-400'
      case 'strong':
        return 'text-green-600 dark:text-green-400'
      case 'very-strong':
        return 'text-emerald-600 dark:text-emerald-400'
      default:
        return ''
    }
  }, [strength.level])

  const passwordsMatch = confirmPassword && password === confirmPassword
  const passwordsDontMatch = confirmPassword && password !== confirmPassword

  return (
    <div className="min-w-screen min-h-screen bg-muted flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl"
      >
        <Card className="shadow-xl border-muted-foreground/10">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Create Your Password
            </CardTitle>
            <CardDescription className="text-base">
              Choose a strong password to secure your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={passwordVisible ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => password.length === 0 && setIsFocused(false)}
                    className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {passwordVisible ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>

                <AnimatePresence>
                  {isFocused && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-2 overflow-hidden"
                    >
                      <div className="flex items-center gap-3 min-h-4">
                        <motion.div
                          layout
                          className="flex gap-1.5 flex-1 min-w-0"
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                          <StrengthSegment
                            strength={strength.segments.first}
                            delay={0}
                          />
                          <StrengthSegment
                            strength={strength.segments.second}
                            delay={0.1}
                          />
                          <StrengthSegment
                            strength={strength.segments.third}
                            delay={0.2}
                          />
                        </motion.div>
                        <AnimatePresence mode="wait">
                          {strengthLabel && (
                            <motion.span
                              layout
                              key={strengthLabel}
                              initial={{ opacity: 0, width: 0 }}
                              animate={{ opacity: 1, width: 'auto' }}
                              exit={{ opacity: 0, width: 0 }}
                              transition={{ duration: 0.3, ease: 'easeInOut' }}
                              className={cn(
                                'text-xs font-semibold whitespace-nowrap',
                                strengthColor,
                              )}
                            >
                              {strengthLabel}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="space-y-2">
                        <RequirementItem
                          met={requirements.hasMinLength}
                          label="At least 8 characters"
                        />
                        <RequirementItem
                          met={requirements.hasUppercase}
                          label="At least 1 uppercase letter"
                        />
                        <RequirementItem
                          met={requirements.hasLowercase}
                          label="At least 1 lowercase letter"
                        />
                        <RequirementItem
                          met={requirements.hasNumber}
                          label="At least 1 number"
                        />
                        <RequirementItem
                          met={requirements.hasSpecialChar}
                          label="At least 1 special character"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirm-password"
                  className="text-sm font-medium"
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={confirmPasswordVisible ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={cn(
                      'pr-10 transition-all duration-200 focus:ring-2',
                      passwordsMatch &&
                        'border-green-500 focus:ring-green-500/20',
                      passwordsDontMatch &&
                        'border-red-500 focus:ring-red-500/20',
                    )}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setConfirmPasswordVisible(!confirmPasswordVisible)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {confirmPasswordVisible ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                <AnimatePresence mode="wait">
                  {passwordsDontMatch && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1.5"
                    >
                      <X className="size-3" />
                      Passwords do not match
                    </motion.p>
                  )}
                  {passwordsMatch && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1.5"
                    >
                      <Check className="size-3" />
                      Passwords match
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <Button
                type="submit"
                disabled={!isValid || !passwordsMatch}
                className="w-full h-11 font-semibold transition-all duration-200 disabled:opacity-50"
              >
                Create Account
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
