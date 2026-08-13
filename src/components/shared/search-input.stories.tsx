import { useState, type ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SearchInput } from "./search-input";

const meta = {
  title: "Shared/SearchInput",
  component: SearchInput,
  parameters: { layout: "centered" },
  args: {
    value: "",
    onValueChange: () => undefined,
    onSearch: () => undefined,
    placeholder: "Search products…",
    debounceMs: 400,
  },
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

function InteractiveSearchInput(args: ComponentProps<typeof SearchInput>) {
  const [value, setValue] = useState(args.value);
  const [searched, setSearched] = useState("");
  return (
    <div className="flex w-80 flex-col gap-3">
      <SearchInput
        {...args}
        value={value}
        onValueChange={setValue}
        onSearch={setSearched}
      />
      <p className="text-sm text-muted-foreground">
        Query: <span className="font-medium">{value || "—"}</span> · Debounced:{" "}
        <span className="font-medium">{searched || "—"}</span>
      </p>
    </div>
  );
}

export const Default: Story = {
  render: InteractiveSearchInput,
};
