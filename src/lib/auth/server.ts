import { SignJWT, jwtVerify } from "jose";
import { TOKEN_COOKIE, TokenPayload } from "./token";

const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? "secret");

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}

export async function signToken(payload: Pick<TokenPayload, "id" | "role">): Promise<string> {
  return new SignJWT({ role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(payload.id))
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secret);
}

export { TOKEN_COOKIE };
