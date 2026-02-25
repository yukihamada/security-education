import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { getUserById } from "./db";

const JWT_SECRET = process.env.JWT_SECRET || "dojoc-dev-secret-change-in-production";
const COOKIE_NAME = "dojoc_token";
const TOKEN_EXPIRY = "7d";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signJwt(payload: { userId: string; email: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

export function verifyJwt(
  token: string
): { userId: string; email: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email: string;
    };
    return decoded;
  } catch {
    return null;
  }
}

/** Read the auth cookie and return the current user, or null if not authenticated */
export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = verifyJwt(token);
  if (!payload) return null;

  const user = getUserById(payload.userId);
  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    plan: user.plan,
  };
}

export { COOKIE_NAME };
