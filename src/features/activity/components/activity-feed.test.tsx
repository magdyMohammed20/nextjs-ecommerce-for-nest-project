import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/render";
import { activityEntries } from "@/test-utils/fixtures";
import type { ActivitySummaryDto } from "../types/activity-types";
import { ActivityFeed } from "./activity-feed";

describe("ActivityFeed", () => {
  it("renders skeletons while loading", async () => {
    await renderWithProviders(
      <ActivityFeed items={[]} isLoading hasError={false} />,
    );
    expect(document.querySelectorAll('[data-slot="skeleton"]')).toHaveLength(5);
  });

  it("shows the error state", async () => {
    await renderWithProviders(
      <ActivityFeed items={[]} isLoading={false} hasError />,
    );
    expect(screen.getByText("Failed to load activity.")).toBeInTheDocument();
  });

  it("shows the empty state", async () => {
    await renderWithProviders(
      <ActivityFeed items={[]} isLoading={false} hasError={false} />,
    );
    expect(screen.getByText("No activity yet.")).toBeInTheDocument();
  });

  it("renders actor names and translated actions", async () => {
    await renderWithProviders(
      <ActivityFeed items={activityEntries} isLoading={false} hasError={false} />,
    );

    expect(screen.getByText("Mary Johnson")).toBeInTheDocument();
    expect(screen.getByText("placed an order")).toBeInTheDocument();
    expect(screen.getByText("sent a contact message")).toBeInTheDocument();
    expect(screen.getByText("changed an order status")).toBeInTheDocument();
    expect(screen.getByText("updated a product")).toBeInTheDocument();
    expect(screen.getByText("created a user")).toBeInTheDocument();
  });

  it("renders a relative time for recent activity", async () => {
    const recent: ActivitySummaryDto = {
      id: 9,
      action: "user.created",
      actorName: "Admin User",
      actorRole: "admin",
      targetType: "user",
      targetId: 9,
      createdAt: new Date().toISOString(),
    };
    await renderWithProviders(
      <ActivityFeed items={[recent]} isLoading={false} hasError={false} />,
    );
    expect(screen.getByText("Just now")).toBeInTheDocument();
  });
});
