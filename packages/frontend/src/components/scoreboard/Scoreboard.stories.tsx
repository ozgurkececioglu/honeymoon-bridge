import type { Meta, StoryObj } from "@storybook/react";

import { Scoreboard } from "./Scoreboard";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Example/Scoreboard",
  component: Scoreboard,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Scoreboard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    scores: {
      clubs: { active: 10, opponent: 5 },
      diamonds: { active: 8, opponent: 12 },
      hearts: { active: 15, opponent: 20 },
      spades: { active: 7, opponent: 9 },
      none: { active: 0, opponent: 0 },
    },
    onClose: () => {
      console.log("Close button clicked");
    },
  },
};
