import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { Heartbeat, HEARTBEAT_INTERVAL_MS } from "./heartbeat";
import { usersApi } from "@/features/users/api/users-api";

describe("Heartbeat", () => {
  it("registers presence once on mount", async () => {
    const spy = vi.spyOn(usersApi, "heartbeat").mockResolvedValue({ online: true } as never);
    render(<Heartbeat />);
    await vi.waitFor(() => {
      expect(spy).toHaveBeenCalledTimes(1);
    });
    spy.mockRestore();
  });

  it("exports the expected interval", () => {
    expect(HEARTBEAT_INTERVAL_MS).toBe(60_000);
  });
});
