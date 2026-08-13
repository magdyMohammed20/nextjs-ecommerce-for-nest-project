import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

describe("Select", () => {
  it("opens, selects a value and fires onValueChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Select onValueChange={onChange}>
        <SelectTrigger aria-label="Category">
          <SelectValue placeholder="Pick one" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">Alpha</SelectItem>
          <SelectItem value="b">Beta</SelectItem>
        </SelectContent>
      </Select>,
    );

    await user.click(screen.getByRole("combobox", { name: "Category" }));
    const beta = await screen.findByRole("option", { name: "Beta" });
    await user.click(beta);

    expect(onChange).toHaveBeenCalledWith("b");
    expect(screen.getByRole("combobox")).toHaveTextContent("Beta");
  });
});
