import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import {
  SkeletonCard,
  SkeletonGrid,
  SkeletonList,
  SkeletonListRow,
  SkeletonStatsCard,
  SkeletonStatsGrid,
  SkeletonHero,
  SkeletonDialog,
} from "./index";

describe("skeleton components", () => {
  it("renders a skeleton card with skeletons", () => {
    const { container } = render(<SkeletonCard />);
    expect(container.querySelectorAll('[data-slot="skeleton"]').length).toBeGreaterThan(0);
  });

  it("renders the requested number of grid cards", () => {
    const { container } = render(<SkeletonGrid count={6} />);
    expect(container.querySelectorAll('[data-slot="skeleton"]')).toHaveLength(6 * 5);
  });

  it("renders a stats grid with the requested count", () => {
    const { container } = render(<SkeletonStatsGrid count={4} />);
    expect(container.querySelectorAll('[data-slot="skeleton"]').length).toBeGreaterThanOrEqual(
      4 * 4,
    );
  });

  it("renders a list and list row", () => {
    const { container } = render(<SkeletonList />);
    expect(container.querySelectorAll('[data-slot="skeleton"]').length).toBeGreaterThan(0);
    const { container: rowContainer } = render(<SkeletonListRow />);
    expect(rowContainer.querySelectorAll('[data-slot="skeleton"]').length).toBeGreaterThan(0);
  });

  it("renders hero and dialog skeletons", () => {
    const { container } = render(<SkeletonHero />);
    expect(container.querySelectorAll('[data-slot="skeleton"]').length).toBeGreaterThan(0);
    const { container: dialogContainer } = render(<SkeletonDialog />);
    expect(dialogContainer.querySelectorAll('[data-slot="skeleton"]').length).toBeGreaterThan(0);
  });

  it("renders a single stats card", () => {
    const { container } = render(<SkeletonStatsCard />);
    expect(container.querySelectorAll('[data-slot="skeleton"]').length).toBe(4);
  });
});
