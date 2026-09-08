export type AuthMode = "login" | "signup";

export type AuthPageProps = {
  mode: AuthMode;
};

export type LoginParams = {
  email: string;
  password: string;
  remember: boolean;
};

export type RegisterParams = {
  name: string;
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

export type AuthResponse = {
  user: AuthUser;
};
