import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { isUserOnline, PresenceDot, ONLINE_WINDOW_MS } from "./presence-dot";

describe("isUserOnline", () => {
  it("returns false when isOnline is falsy", () => {
    expect(isUserOnline(false, new Date().toISOString())).toBe(false);
    expect(isUserOnline(undefined, new Date().toISOString())).toBe(false);
  });

  it("returns false when there is no lastActiveAt", () => {
    expect(isUserOnline(true, null)).toBe(false);
    expect(isUserOnline(true, undefined)).toBe(false);
  });

  it("returns false for an invalid timestamp", () => {
    expect(isUserOnline(true, "not-a-date")).toBe(false);
  });

  it("returns true for recent activity", () => {
    expect(isUserOnline(true, new Date().toISOString())).toBe(true);
  });

  it("returns false when activity is older than the window", () => {
    const old = new Date(Date.now() - ONLINE_WINDOW_MS - 1000).toISOString();
    expect(isUserOnline(true, old)).toBe(false);
  });
});

describe("PresenceDot", () => {
  it("labels an online user", () => {
    render(<PresenceDot isOnline lastActiveAt={new Date().toISOString()} />);
    expect(screen.getByRole("img", { name: /online/i })).toBeInTheDocument();
  });

  it("labels an offline user", () => {
    render(<PresenceDot isOnline={false} lastActiveAt={null} />);
    expect(screen.getByRole("img", { name: /offline/i })).toBeInTheDocument();
  });
});
