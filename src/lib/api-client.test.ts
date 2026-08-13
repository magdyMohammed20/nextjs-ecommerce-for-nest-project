import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError, apiFetch } from "./api-client";

function mockFetchResponse(
  body: unknown,
  { status = 200, ok = status < 400 }: { status?: number; ok?: boolean } = {},
) {
  return vi.fn().mockResolvedValue({
    status,
    ok,
    json: async () => body,
  });
}

describe("apiFetch", () => {
  afterEach(() => {
    vi.stubGlobal("fetch", undefined);
    vi.unstubAllGlobals();
  });

  it("unwraps the { data: ... } envelope", async () => {
    vi.stubGlobal("fetch", mockFetchResponse({ data: { id: 1, name: "X" } }));
    const result = await apiFetch<{ id: number; name: string }>("/products/1");
    expect(result).toEqual({ id: 1, name: "X" });
  });

  it("returns the raw body when there is no envelope", async () => {
    vi.stubGlobal("fetch", mockFetchResponse({ raw: true }));
    const result = await apiFetch<unknown>("/raw");
    expect(result).toEqual({ raw: true });
  });

  it("sends an Authorization header when a token exists", async () => {
    document.cookie = "auth_token=abc.def.ghi; path=/;";
    const fetchMock = mockFetchResponse({ data: "ok" });
    vi.stubGlobal("fetch", fetchMock);
    await apiFetch("/user/me");
    const init = fetchMock.mock.calls[0][1] as RequestInit;
    expect((init.headers as Record<string, string>).Authorization).toBe(
      "Bearer abc.def.ghi",
    );
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  });

  it("throws ApiError with joined message for array errors", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetchResponse({ message: ["Email invalid", "Name short"] }, { status: 400, ok: false }),
    );
    const error = await apiFetch("/user/register", { body: "{}" }).catch((e) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).status).toBe(400);
    expect((error as ApiError).errors).toEqual(["Email invalid", "Name short"]);
  });

  it("maps 429 to a friendly message", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetchResponse({ message: "rate limited" }, { status: 429, ok: false }),
    );
    const error = await apiFetch("/x").catch((e) => e);
    expect((error as ApiError).message).toBe(
      "Too many requests, please wait a moment and try again",
    );
  });

  it("returns undefined for a 204 response", async () => {
    vi.stubGlobal("fetch", mockFetchResponse(null, { status: 204 }));
    await expect(apiFetch("/logout", { skipAuth: true })).resolves.toBeUndefined();
  });

  it("does not attach a token when skipAuth is set", async () => {
    document.cookie = "auth_token=abc.def.ghi; path=/;";
    const fetchMock = mockFetchResponse({ data: "ok" });
    vi.stubGlobal("fetch", fetchMock);
    await apiFetch("/login", { skipAuth: true });
    const init = fetchMock.mock.calls[0][1] as RequestInit;
    const headers = init.headers as Record<string, string>;
    expect(headers.Authorization).toBeUndefined();
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  });
});
