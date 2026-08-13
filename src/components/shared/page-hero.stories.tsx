import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@/components/ui/button";
import { PageHero } from "./page-hero";

const meta = {
  title: "Shared/PageHero",
  component: PageHero,
  args: {
    children: <div />,
  },
} satisfies Meta<typeof PageHero>;

export default meta;
type Story = StoryObj<typeof meta>;

function PageHeroDemo() {
  return (
    <PageHero>
      <div className="flex flex-col items-center justify-center gap-4 px-4 py-20 text-center text-white">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">ShopWave</h1>
        <p className="max-w-md text-sm text-white/80">
          Discover hand-picked products at unbeatable prices.
        </p>
        <div className="flex gap-3">
          <Button>Shop now</Button>
          <Button variant="outline" className="bg-transparent text-white hover:bg-white/10 hover:text-white">
            Learn more
          </Button>
        </div>
      </div>
    </PageHero>
  );
}

export const Default: Story = {
  render: PageHeroDemo,
};
