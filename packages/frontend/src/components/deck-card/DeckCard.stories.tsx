import type { Meta, StoryObj } from "@storybook/react";
import { motion } from "motion/react";

import { DeckCard } from "./DeckCard";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Example/DeckCard",
  component: DeckCard,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof DeckCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  render: () => (
    <div className="relative">
      <DeckCard
        card={{ id: "1", suit: "hearts", rank: "A" }}
        isDown={false}
        position={{ left: "10%", top: "10%" }}
      />
      <DeckCard
        card={{ id: "1", suit: "diamonds", rank: "K" }}
        isDown={false}
        position={{ left: "22%", top: "10%" }}
      />
      <DeckCard
        card={{ id: "1", suit: "spades", rank: "10" }}
        isDown={false}
        position={{ left: "34%", top: "10%" }}
      />
      <DeckCard
        card={{ id: "1", suit: "clubs", rank: "9" }}
        isDown={false}
        position={{ left: "46%", top: "10%" }}
      />
      <DeckCard
        card={{ id: "1", suit: "diamonds", rank: "8" }}
        isDown={false}
        position={{ left: "58%", top: "10%" }}
      />
      <DeckCard
        card={{ id: "1", suit: "hearts", rank: "7" }}
        isDown={false}
        position={{ left: "70%", top: "10%" }}
      />
      <DeckCard
        card={{ id: "1", suit: "spades", rank: "6" }}
        isDown={false}
        position={{ left: "82%", top: "10%" }}
      />
      <DeckCard
        card={{ id: "1", suit: "clubs", rank: "5" }}
        isDown={false}
        position={{ left: "10%", top: "30%" }}
      />
      <DeckCard
        card={{ id: "1", suit: "diamonds", rank: "4" }}
        isDown={false}
        position={{ left: "22%", top: "30%" }}
      />
      <DeckCard
        card={{ id: "1", suit: "hearts", rank: "3" }}
        isDown={false}
        position={{ left: "34%", top: "30%" }}
      />
      <DeckCard
        card={{ id: "1", suit: "spades", rank: "2" }}
        isDown={false}
        position={{ left: "46%", top: "30%" }}
      />
      <DeckCard
        card={{ id: "1", suit: "clubs", rank: "A" }}
        isDown={false}
        position={{ left: "58%", top: "30%" }}
      />
      <DeckCard
        card={{ id: "1", suit: "diamonds", rank: "K" }}
        isDown={false}
        position={{ left: "70%", top: "30%" }}
      />
    </div>
  ),
  args: {
    isDown: false,
    position: {
      left: "10%",
      top: "10%",
    },
    card: {
      id: "1",
      suit: "hearts",
      rank: "A",
    },
  },
};

export const Hidden: Story = {
  render: () => {
    return (
      <div className="w-screen h-screen relative">
        <motion.div
          className="w-24 h-24 bg-amber-400 absolute"
          animate={{
            top: ["50%", "10%", "50%"],
            left: ["50%", "10%", "50%"],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            times: [0, 0.5, 1],
          }}
        ></motion.div>
      </div>
    );
  },
  args: {
    isDown: true,
    position: {
      left: "10%",
      top: "10%",
    },
    card: { id: "1" },
  },
};
