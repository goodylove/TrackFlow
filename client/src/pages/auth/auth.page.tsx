import { Auth } from "@/feature/auth/auth";
import type { AuthPageProps } from "@/feature/auth/types";

function AuthPage({ mode }: AuthPageProps) {
  return <Auth mode={mode} />
}
export default AuthPage