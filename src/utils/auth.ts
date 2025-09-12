// utils/auth.ts
import { SignJWT, jwtVerify, type JWTPayload } from "jose";

/**
 * Sign a JWT (HS256) with payload.
 * Returns the compact JWT string.
 */
export async function signToken(payload: object): Promise<string> {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET || "");
  if (!secret || secret.length === 0) {
    throw new Error("Missing JWT_SECRET");
  }

  return await new SignJWT(payload as JWTPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

/**
 * Verify a JWT and return decoded payload (or null if invalid).
 */
export async function verifyToken(token: string): Promise<Record<string, any> | null> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "");
    if (!secret || secret.length === 0) throw new Error("Missing JWT_SECRET");
    const { payload } = await jwtVerify(token, secret);
    // payload is a JWTPayload (Record<string, any>) — return as-is
    return payload as Record<string, any>;
  } catch (err) {
    return null;
  }
}
