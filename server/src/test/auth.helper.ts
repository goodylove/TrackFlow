export const UserData = {
  name: "Goodness",
  email: "goodyc@gmail.com",
  password: "wghejhfjjghfjw",
};
export const login = {
  email: "goodyc@gmail.com",
  password: "wghejhfjjghfjw",
};

export const UserDataB = {
  name: "Precious",
  email: "goodyc72@gmail.com",
  password: "wghejhfjjghfjwyy",
};

export const LoginUserB = {
  email: "goodyc72@gmail.com",
  password: "wghejhfjjghfjwyy",
};

type LoginResponse = {
  headers: Record<string, string | string[] | undefined>;
};

export function getAuthCookie(response: LoginResponse): string {
  const setCookie = response.headers["set-cookie"];
  const cookie = Array.isArray(setCookie) ? setCookie[0] : setCookie;

  if (!cookie) throw new Error("Login response did not set an authentication cookie");

  return cookie.split(";", 1)[0] ?? cookie;
}
