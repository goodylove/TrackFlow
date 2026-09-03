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
import { useForm, type ControllerRenderProps, type SubmitHandler } from "react-hook-form"
import { Link, useNavigate, useSearchParams } from "react-router-dom"

import { authFormSchema, type AuthFormValues } from "@/feature/auth/auth-schema"
import {
    useAuthLoginService,
    useAuthRegisterService,
} from "@/feature/auth/services/auth-service"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert } from "@/components/ui/alert"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    useFormField,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ApiError } from "@/lib/api/api-error"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/stores/auth-store"
import type { AuthPageProps } from "./types"
import { testimonial } from "./dummy"





function BrandLockup({ inverse = false }: { inverse?: boolean }) {
    return (
        <div className="flex items-center gap-2.5">
            <span
                className={cn(
                    "flex size-8 items-center justify-center rounded-[0.7rem]",
                    inverse ? "bg-white/12 text-white" : "bg-[var(--marketing-action)] text-white"
                )}
            >
                <Kanban className="size-[1.05rem]" weight="fill" />
            </span>
            <span
                className={cn(
                    "text-lg font-bold tracking-[-0.04em]",
                    inverse ? "text-white" : "text-[#171722]"
                )}
            >
                TrackFlow
            </span>
        </div>
    )
}

function PasswordField({
    autoComplete,
    field,
}: {
    autoComplete: "current-password" | "new-password"
    field: ControllerRenderProps<AuthFormValues, "password">
}) {
    const [isVisible, setIsVisible] = useState(false)
    const { error, formDescriptionId, formItemId, formMessageId } = useFormField()

    return (
        <div className="relative">
            <Input
                autoComplete={autoComplete}
                className={cn(
                    "h-11 w-full rounded-md border bg-white px-3 pr-11 text-sm text-[#171722] outline-none transition placeholder:text-[var(--marketing-muted-foreground)] focus:ring-4 focus:ring-[var(--marketing-action)]/10",
                    error
                        ? "border-red-400 focus:border-red-500"
                        : "border-[var(--marketing-border)] focus:border-[var(--marketing-action)]"
                )}
                aria-describedby={error ? `${formDescriptionId} ${formMessageId}` : formDescriptionId}
                aria-invalid={Boolean(error)}
                id={formItemId}
                placeholder="Enter your password"
                type={isVisible ? "text" : "password"}
                {...field}
            />
            <Button
                aria-label={isVisible ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[var(--marketing-muted-foreground)] transition hover:text-[#171722] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--marketing-action)]"
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

export function Auth({ mode }: AuthPageProps) {
    const isSignup = mode === "signup"
    const navigate = useNavigate()
    const setSession = useAuthStore((state) => state.setSession)
    const loginMutation = useAuthLoginService()
    const registerMutation = useAuthRegisterService()
    const [searchParams] = useSearchParams()
    const [notice, setNotice] = useState(
        !isSignup && searchParams.get("registered") === "1"
            ? "Your account is ready. Sign in to continue."
            : ""
    )
    const form = useForm<AuthFormValues>({
        defaultValues: {
            email: "",
            mode,
            name: "",
            password: "",
            remember: false,
        },
        mode: "onBlur",
        reValidateMode: "onChange",
        resolver: zodResolver(authFormSchema),
    })
    const {
        clearErrors,
        control,
        formState: { errors, isSubmitting },
        handleSubmit,
        setError,
    } = form

    const title = isSignup ? "Create your account" : "Welcome back"
    const description = isSignup
        ? "Set up your workspace and start moving work forward."
        : "Enter your details to sign in."

    const onSubmit: SubmitHandler<AuthFormValues> = async (values) => {
        clearErrors("root")
        setNotice("")

        try {
            if (isSignup) {
                await registerMutation.mutateAsync({
                    name: values.name,
                    email: values.email,
                    password: values.password,
                })
                navigate("/login?registered=1", { replace: true })
                return
            }

            const { user } = await loginMutation.mutateAsync({
                email: values.email,
                password: values.password,
            })

            if (!user.token) {
                throw new ApiError("TrackFlow did not return a session. Please try again.")
            }

            setSession(
                user.token,
                { id: user.id, name: user.name, email: user.email },
                values.remember
            )
            navigate("/", { replace: true })
        } catch (submissionError) {
            if (submissionError instanceof ApiError && submissionError.fieldErrors) {
                const fieldErrors = submissionError.fieldErrors
                    ; (["name", "email", "password"] as const).forEach((field) => {
                        if (fieldErrors[field]) {
                            setError(field, { type: "server", message: fieldErrors[field] })
                        }
                    })

                if (Object.keys(fieldErrors).length > 0) {
                    return
                }
            }

            setError("root", {
                message:
                    submissionError instanceof ApiError
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
        <main className="min-h-screen bg-[var(--marketing-page)] p-4 sm:p-8 lg:grid lg:place-items-center">
            <div className="mx-auto grid min-h-[42rem] w-full max-w-[88rem] overflow-hidden rounded-[1.35rem] border border-[var(--marketing-border)] bg-white shadow-[0_30px_90px_-56px_rgba(47,55,244,0.34)] md:grid-cols-[0.94fr_1.06fr]">
                <aside className="relative hidden overflow-hidden bg-[linear-gradient(180deg,#232044_0%,#2020b8_58%,#322dff_100%)] p-9 text-white md:flex md:flex-col lg:p-12">
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-[radial-gradient(circle_at_14%_92%,rgba(255,255,255,0.12),transparent_31%),radial-gradient(circle_at_92%_4%,rgba(196,199,255,0.2),transparent_38%)]"
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
                                className="inline-flex size-9 items-center justify-center rounded-md text-[var(--marketing-muted-foreground)] transition hover:bg-[var(--marketing-track)] hover:text-[#171722]"
                                to="/"
                            >
                                <ArrowLeft className="size-4" />
                            </Link>
                        </div>

                        <Link
                            className="hidden items-center gap-2 text-sm font-medium text-[var(--marketing-muted-foreground)] transition hover:text-[#171722] md:inline-flex"
                            to="/"
                        >
                            <ArrowLeft className="size-4" />
                            Back to site
                        </Link>

                        <div className="mt-8">
                            <h1 className="text-[1.75rem] font-bold tracking-[-0.05em] text-[#171722] sm:text-3xl">
                                {title}
                            </h1>
                            <p className="mt-2 text-sm leading-6 text-[var(--marketing-muted-foreground)]">
                                {description}
                            </p>
                        </div>

                        {notice ? (
                            <Alert className="mt-5 flex items-start gap-2" role="status" variant="success">
                                <CheckCircle className="mt-0.5 size-4 shrink-0" weight="fill" />
                                {notice}
                            </Alert>
                        ) : null}

                        {errors.root?.message ? (
                            <Alert className="mt-5" variant="destructive">
                                {errors.root.message}
                            </Alert>
                        ) : null}

                        <Form {...form}>
                            <form className="mt-7 space-y-4" noValidate onSubmit={handleSubmit(onSubmit)}>
                                {isSignup ? (
                                    <FormField
                                        control={control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-semibold text-[#171722]">Full name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        autoComplete="name"
                                                        className="h-11 w-full rounded-md border-[var(--marketing-border)] bg-white px-3 text-sm text-[#171722] outline-none transition placeholder:text-[var(--marketing-muted-foreground)] focus:border-[var(--marketing-action)] focus:ring-4 focus:ring-[var(--marketing-action)]/10 aria-invalid:border-red-400 aria-invalid:focus:border-red-500"
                                                        placeholder="Enter your full name"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                ) : null}

                                <FormField
                                    control={control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-semibold text-[#171722]">Email address</FormLabel>
                                            <FormControl>
                                                <Input
                                                    autoComplete="email"
                                                    className="h-11 w-full rounded-md border-[var(--marketing-border)] bg-white px-3 text-sm text-[#171722] outline-none transition placeholder:text-[var(--marketing-muted-foreground)] focus:border-[var(--marketing-action)] focus:ring-4 focus:ring-[var(--marketing-action)]/10 aria-invalid:border-red-400 aria-invalid:focus:border-red-500"
                                                    placeholder="Enter your email"
                                                    type="email"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center justify-between gap-3 text-sm font-semibold text-[#171722]">
                                                Password
                                                {!isSignup ? (
                                                    <Button
                                                        className="text-xs font-medium text-[var(--marketing-action)] transition hover:text-[var(--marketing-action-strong)]"
                                                        size="sm"
                                                        type="button"
                                                        variant="link"
                                                        onClick={() => showUnavailable("Password reset")}
                                                    >
                                                        Forgot password?
                                                    </Button>
                                                ) : null}
                                            </FormLabel>
                                            <PasswordField
                                                autoComplete={isSignup ? "new-password" : "current-password"}
                                                field={field}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {!isSignup ? (
                                    <FormField
                                        control={control}
                                        name="remember"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center gap-2 space-y-0 pt-0.5">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        className="border-[var(--marketing-action)] data-checked:bg-[var(--marketing-action)]"
                                                        name={field.name}
                                                        onBlur={field.onBlur}
                                                        onCheckedChange={field.onChange}
                                                        ref={field.ref}
                                                    />
                                                </FormControl>
                                                <FormLabel className="cursor-pointer text-xs font-normal text-[var(--marketing-muted-foreground)]">
                                                    Remember me for 30 days
                                                </FormLabel>
                                            </FormItem>
                                        )}
                                    />
                                ) : null}

                                <Button
                                    className="mt-2 h-11 w-full rounded-md bg-[var(--marketing-action)] font-semibold text-white hover:bg-[var(--marketing-action-strong)]"
                                    disabled={isSubmitting}
                                    size="default"
                                    type="submit"
                                >
                                    {isSubmitting ? <SpinnerGap className="size-4 animate-spin" /> : null}
                                    {isSubmitting ? "Please wait" : isSignup ? "Create account" : "Sign in"}
                                </Button>
                            </form>
                        </Form>

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
                                className="font-semibold text-[var(--marketing-action)] transition hover:text-[var(--marketing-action-strong)]"
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
