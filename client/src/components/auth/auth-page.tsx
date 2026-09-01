import { useState } from "react"
import {
  ArrowLeft,
  CheckCircle,
  Eye,
  EyeSlash,
  GithubLogo,
  GoogleLogo,
  Kanban,
  SpinnerGap,
} from "@phosphor-icons/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm, type SubmitHandler, type UseFormRegisterReturn } from "react-hook-form"
import { Link, useNavigate, useSearchParams } from "react-router-dom"

import { authFormSchema, type AuthFormValues } from "@/components/auth/auth-schema"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthApiError, loginUser, registerUser } from "@/lib/auth-api"
import { cn } from "@/lib/utils"

type AuthMode = "login" | "signup"

type AuthPageProps = {
  mode: AuthMode
}

const testimonial = {
  quote:
    "TrackFlow transformed how our team manages sprint planning and issue tracking. The clarity it provides is unmatched.",
  name: "Sarah Jenkins",
  role: "Lead Engineer, TechCorp",
}

function BrandLockup({ inverse = false }: { inverse?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={cn(
          "flex size-8 items-center justify-center rounded-[0.7rem]",
          inverse ? "bg-white/12 text-white" : "bg-[var(--primary)] text-white"
        )}
      >
        <Kanban className="size-[1.05rem]" weight="fill" />
      </span>
      <span
        className={cn(
          "text-lg font-bold tracking-[-0.04em]",
          inverse ? "text-white" : "text-[var(--foreground)]"
        )}
      >
        TrackFlow
      </span>
    </div>
  )
}

function PasswordField({
  id,
  autoComplete,
  registration,
  hasError,
}: {
  id: string
  autoComplete: "current-password" | "new-password"
  registration: UseFormRegisterReturn<"password">
  hasError: boolean
}) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="relative">
      <Input
        autoComplete={autoComplete}
        className={cn(
          "h-11 w-full rounded-md border bg-white px-3 pr-11 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--marketing-muted-foreground)] focus:ring-4 focus:ring-[var(--primary)]/10",
          hasError
            ? "border-red-400 focus:border-red-500"
            : "border-[var(--marketing-border)] focus:border-[var(--primary)]"
        )}
        id={id}
        placeholder="Enter your password"
        type={isVisible ? "text" : "password"}
        {...registration}
      />
      <Button
        aria-label={isVisible ? "Hide password" : "Show password"}
        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[var(--marketing-muted-foreground)] transition hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
        size="icon"
        type="button"
        variant="ghost"
        onClick={() => setIsVisible((visible) => !visible)}
      >
        {isVisible ? <EyeSlash className="size-4" /> : <Eye className="size-4" />}
      </Button>
    </div>
  )
}

export function AuthPage({ mode }: AuthPageProps) {
  const isSignup = mode === "signup"
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [notice, setNotice] = useState(
    !isSignup && searchParams.get("registered") === "1"
      ? "Your account is ready. Sign in to continue."
      : ""
  )
  const {
    clearErrors,
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
  } = useForm<AuthFormValues>({
    defaultValues: {
      email: "",
      mode,
      name: "",
      password: "",
      remember: false,
    },
    resolver: zodResolver(authFormSchema),
  })

  const title = isSignup ? "Create your account" : "Welcome back"
  const description = isSignup
    ? "Set up your workspace and start moving work forward."
    : "Enter your details to sign in."

  const onSubmit: SubmitHandler<AuthFormValues> = async (values) => {
    clearErrors("root")
    setNotice("")

    try {
      if (isSignup) {
        await registerUser({ name: values.name, email: values.email, password: values.password })
        navigate("/login?registered=1", { replace: true })
        return
      }

      const { user } = await loginUser({ email: values.email, password: values.password })

      if (!user.token) {
        throw new AuthApiError("TrackFlow did not return a session. Please try again.")
      }

      const storage = values.remember ? localStorage : sessionStorage
      storage.setItem("trackflow.auth.token", user.token)
      storage.setItem(
        "trackflow.auth.user",
        JSON.stringify({ id: user.id, name: user.name, email: user.email })
      )
      navigate("/", { replace: true })
    } catch (submissionError) {
      setError("root", {
        message:
          submissionError instanceof AuthApiError
            ? submissionError.message
            : "Something went wrong. Please try again.",
      })
    }
  }

  function showUnavailable(provider: string) {
    clearErrors("root")
    setNotice(`${provider} sign-in is not available yet.`)
  }

  return (
    <main className="min-h-screen bg-[#f3f5f1] p-4 sm:p-8 lg:grid lg:place-items-center">
      <div className="mx-auto grid min-h-[42rem] w-full max-w-[88rem] overflow-hidden rounded-[1.35rem] border border-[var(--marketing-border)] bg-white shadow-[0_30px_90px_-56px_rgba(22,32,25,0.38)] md:grid-cols-[0.94fr_1.06fr]">
        <aside className="relative hidden overflow-hidden bg-[var(--primary)] p-9 text-white md:flex md:flex-col lg:p-12">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_14%_92%,rgba(183,243,107,0.12),transparent_31%),radial-gradient(circle_at_92%_4%,rgba(195,231,207,0.16),transparent_38%)]"
          />
          <div className="relative">
            <BrandLockup inverse />
            <p className="mt-3 max-w-[17rem] text-sm leading-6 text-white/72">
              Streamline your engineering team's workflow.
            </p>
          </div>

          <figure className="relative mt-auto rounded-xl border border-white/10 bg-black/5 p-6">
            <blockquote className="text-sm font-medium leading-6 text-white/90">
              "{testimonial.quote}"
            </blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-full bg-white/14 text-xs font-bold">
                SJ
              </span>
              <span>
                <span className="block text-sm font-semibold">{testimonial.name}</span>
                <span className="block text-xs text-white/60">{testimonial.role}</span>
              </span>
            </figcaption>
          </figure>
        </aside>

        <section className="flex items-center px-6 py-10 sm:px-12 md:px-14 lg:px-20">
          <div className="mx-auto w-full max-w-[23rem]">
            <div className="mb-10 flex items-center justify-between md:hidden">
              <BrandLockup />
              <Link
                aria-label="Back to TrackFlow"
                className="inline-flex size-9 items-center justify-center rounded-md text-[var(--marketing-muted-foreground)] transition hover:bg-[var(--marketing-track)] hover:text-[var(--foreground)]"
                to="/"
              >
                <ArrowLeft className="size-4" />
              </Link>
            </div>

            <Link
              className="hidden items-center gap-2 text-sm font-medium text-[var(--marketing-muted-foreground)] transition hover:text-[var(--foreground)] md:inline-flex"
              to="/"
            >
              <ArrowLeft className="size-4" />
              Back to site
            </Link>

            <div className="mt-8">
              <h1 className="text-[1.75rem] font-bold tracking-[-0.05em] text-[var(--foreground)] sm:text-3xl">
                {title}
              </h1>
              <p className="mt-2 text-sm leading-6 text-[var(--marketing-muted-foreground)]">
                {description}
              </p>
            </div>

            {notice ? (
              <p
                className="mt-5 flex items-start gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm leading-5 text-emerald-800"
                role="status"
              >
                <CheckCircle className="mt-0.5 size-4 shrink-0" weight="fill" />
                {notice}
              </p>
            ) : null}

            {errors.root?.message ? (
              <p
                className="mt-5 rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-sm leading-5 text-red-700"
                role="alert"
              >
                {errors.root.message}
              </p>
            ) : null}

            <form className="mt-7 space-y-4" noValidate onSubmit={handleSubmit(onSubmit)}>
              {isSignup ? (
                <Label className="block" htmlFor={`${mode}-name`}>
                  <span className="mb-1.5 block text-sm font-semibold text-[var(--foreground)]">
                    Full name
                  </span>
                  <Input
                    autoComplete="name"
                    className={cn(
                      "h-11 w-full rounded-md border bg-white px-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--marketing-muted-foreground)] focus:ring-4 focus:ring-[var(--primary)]/10",
                      errors.name
                        ? "border-red-400 focus:border-red-500"
                        : "border-[var(--marketing-border)] focus:border-[var(--primary)]"
                    )}
                    id={`${mode}-name`}
                    placeholder="Enter your full name"
                    {...register("name")}
                  />
                  {errors.name ? (
                    <span className="mt-1.5 block text-xs text-red-600">{errors.name.message}</span>
                  ) : null}
                </Label>
              ) : null}

              <Label className="block" htmlFor={`${mode}-email`}>
                <span className="mb-1.5 block text-sm font-semibold text-[var(--foreground)]">
                  Email address
                </span>
                <Input
                  autoComplete="email"
                  className={cn(
                    "h-11 w-full rounded-md border bg-white px-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--marketing-muted-foreground)] focus:ring-4 focus:ring-[var(--primary)]/10",
                    errors.email
                      ? "border-red-400 focus:border-red-500"
                      : "border-[var(--marketing-border)] focus:border-[var(--primary)]"
                  )}
                  id={`${mode}-email`}
                  placeholder="Enter your email"
                  type="email"
                  {...register("email")}
                />
                {errors.email ? (
                  <span className="mt-1.5 block text-xs text-red-600">{errors.email.message}</span>
                ) : null}
              </Label>

              <Label className="block" htmlFor={`${mode}-password`}>
                <span className="mb-1.5 flex items-center justify-between gap-3 text-sm font-semibold text-[var(--foreground)]">
                  Password
                  {!isSignup ? (
                    <Button
                      className="text-xs font-medium text-[var(--primary)] transition hover:text-[var(--marketing-primary-strong)]"
                      size="sm"
                      type="button"
                      variant="link"
                      onClick={() => showUnavailable("Password reset")}
                    >
                      Forgot password?
                    </Button>
                  ) : null}
                </span>
                <PasswordField
                  autoComplete={isSignup ? "new-password" : "current-password"}
                  hasError={Boolean(errors.password)}
                  id={`${mode}-password`}
                  registration={register("password")}
                />
                {errors.password ? (
                  <span className="mt-1.5 block text-xs text-red-600">{errors.password.message}</span>
                ) : null}
              </Label>

              {!isSignup ? (
                <Label className="flex cursor-pointer items-center gap-2 pt-0.5 text-xs text-[var(--marketing-muted-foreground)]">
                  <Controller
                    control={control}
                    name="remember"
                    render={({ field }) => (
                      <Checkbox
                        checked={field.value}
                        name={field.name}
                        onBlur={field.onBlur}
                        onCheckedChange={field.onChange}
                        ref={field.ref}
                      />
                    )}
                  />
                  Remember me for 30 days
                </Label>
              ) : null}

              <Button
                className="mt-2 h-11 w-full rounded-md font-semibold"
                disabled={isSubmitting}
                size="default"
                type="submit"
              >
                {isSubmitting ? <SpinnerGap className="size-4 animate-spin" /> : null}
                {isSubmitting ? "Please wait" : isSignup ? "Create account" : "Sign in"}
              </Button>
            </form>

            <div className="my-6 flex items-center gap-3 text-xs text-[var(--marketing-muted-foreground)] before:h-px before:flex-1 before:bg-[var(--marketing-border)] after:h-px after:flex-1 after:bg-[var(--marketing-border)]">
              Or continue with
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                className="h-10 rounded-md text-xs"
                size="sm"
                type="button"
                variant="outline"
                onClick={() => showUnavailable("Google")}
              >
                <GoogleLogo className="size-4" weight="bold" />
                Google
              </Button>
              <Button
                className="h-10 rounded-md text-xs"
                size="sm"
                type="button"
                variant="outline"
                onClick={() => showUnavailable("GitHub")}
              >
                <GithubLogo className="size-4" weight="fill" />
                GitHub
              </Button>
            </div>

            <p className="mt-7 text-center text-sm text-[var(--marketing-muted-foreground)]">
              {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
              <Link
                className="font-semibold text-[var(--primary)] transition hover:text-[var(--marketing-primary-strong)]"
                to={isSignup ? "/login" : "/signup"}
              >
                {isSignup ? "Sign in" : "Sign up"}
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
