import { describe, expect, it } from "vitest";
import { decodeToken, TOKEN_COOKIE } from "./token";

function makeJwt(payload: object) {
  const b64 = (value: string) =>
    btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  return `${b64(JSON.stringify({ alg: "none", typ: "JWT" }))}.${b64(
    JSON.stringify(payload),
  )}.signature`;
}

describe("decodeToken", () => {
  it("decodes a well-formed JWT payload", () => {
    const token = makeJwt({ id: 7, role: "admin", iat: 100, exp: 9999999999 });
    expect(decodeToken(token)).toEqual({
      id: 7,
      role: "admin",
      iat: 100,
      exp: 9999999999,
    });
  });

  it("returns null for a malformed token", () => {
    expect(decodeToken("not-a-jwt")).toBeNull();
    expect(decodeToken("")).toBeNull();
  });

  it("returns null for a token with an invalid payload", () => {
    expect(decodeToken("aaa.!!!.ccc")).toBeNull();
  });

  it("exposes the cookie name", () => {
    expect(TOKEN_COOKIE).toBe("auth_token");
  });
});
