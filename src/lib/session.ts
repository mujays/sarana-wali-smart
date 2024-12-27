import Cookies from "js-cookie";

export function getSession() {
  const session = Cookies.get("session");
  if (!session) return null;
  return session;
}
