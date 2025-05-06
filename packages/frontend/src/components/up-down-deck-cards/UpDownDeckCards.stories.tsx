import type { Meta, StoryObj } from "@storybook/react";

import { UpDownDeckCards } from "./UpDownDeckCards";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Example/UpDownCards",
  component: UpDownDeckCards,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof UpDownDeckCards>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    cardOnTable: {
      upCard: {
        id: "1",
        rank: "10",
        suit: "hearts",
      },
      downCard: { id: "2" },
    },
    isPlayerCard: true,
    index: 0,
  },
};
