import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getPageNumbers, Pagination } from "./pagination";

describe("getPageNumbers", () => {
  it("returns all pages when totalPages <= 7", () => {
    expect(getPageNumbers(1, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it("adds ellipses for large ranges", () => {
    expect(getPageNumbers(5, 20)).toEqual([1, "…", 4, 5, 6, "…", 20]);
  });

  it("handles early pages without a leading ellipsis", () => {
    expect(getPageNumbers(1, 20)).toEqual([1, 2, "…", 20]);
  });

  it("handles trailing pages without a trailing ellipsis", () => {
    expect(getPageNumbers(20, 20)).toEqual([1, "…", 19, 20]);
  });
});

describe("Pagination", () => {
  it("renders nothing when there is a single page", () => {
    const { container } = render(
      <Pagination page={1} totalPages={1} total={5} limit={10} onPageChange={() => {}} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders showing/from/to counts", () => {
    render(
      <Pagination page={2} totalPages={5} total={42} limit={10} onPageChange={() => {}} />,
    );
    expect(screen.getByText("11")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("disables previous on the first page", () => {
    render(
      <Pagination page={1} totalPages={3} total={30} limit={10} onPageChange={() => {}} />,
    );
    expect(screen.getByRole("button", { name: /previous/i })).toBeDisabled();
  });

  it("disables next on the last page", () => {
    render(
      <Pagination page={3} totalPages={3} total={30} limit={10} onPageChange={() => {}} />,
    );
    expect(screen.getByRole("button", { name: /next/i })).toBeDisabled();
  });

  it("calls onPageChange with the clicked page number", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <Pagination page={1} totalPages={5} total={50} limit={10} onPageChange={onPageChange} />,
    );
    await user.click(screen.getByRole("button", { name: "3" }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("calls onPageChange for next", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <Pagination page={1} totalPages={5} total={50} limit={10} onPageChange={onPageChange} />,
    );
    await user.click(screen.getByRole("button", { name: /next/i }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });
});
