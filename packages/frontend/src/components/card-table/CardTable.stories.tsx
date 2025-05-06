import type { Meta, StoryObj } from "@storybook/react";

import { CardTable } from "./CardTable";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Example/CardTable",
  component: CardTable,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof CardTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    deck: {
      hasOpponentWonAnyTricks: false,
      opponentCardsOnHand: [{ id: "1" }],
      hasPlayerWonAnyTricks: true,
      playerCardsOnTable: [
        {
          downCard: { id: "2" },
          upCard: { id: "1", rank: "10", suit: "hearts" },
        },
        {
          downCard: { id: "2" },
          upCard: { id: "1", rank: "10", suit: "hearts" },
        },
        {
          downCard: { id: "2" },
          upCard: { id: "1", rank: "10", suit: "hearts" },
        },
        {
          downCard: { id: "2" },
          upCard: { id: "1", rank: "10", suit: "hearts" },
        },
        {
          downCard: { id: "2" },
          upCard: { id: "1", rank: "10", suit: "hearts" },
        },
        {
          downCard: { id: "2" },
          upCard: { id: "1", rank: "10", suit: "hearts" },
        },
        {
          downCard: { id: "2" },
          upCard: { id: "1", rank: "10", suit: "hearts" },
        },
        {
          downCard: { id: "2" },
          upCard: { id: "1", rank: "10", suit: "hearts" },
        },
        {
          downCard: { id: "2" },
          upCard: { id: "1", rank: "10", suit: "hearts" },
        },
        {
          downCard: { id: "2" },
          upCard: { id: "1", rank: "10", suit: "hearts" },
        },
      ],
      playerCardsOnHand: [],
      opponentCardsOnTable: [
        {
          downCard: null,
          upCard: null,
        },
        {
          downCard: { id: "2" },
          upCard: { id: "1", rank: "10", suit: "hearts" },
        },

        {
          downCard: { id: "2" },
          upCard: { id: "1", rank: "10", suit: "hearts" },
        },

        {
          downCard: { id: "2" },
          upCard: { id: "1", rank: "10", suit: "hearts" },
        },

        {
          downCard: { id: "2" },
          upCard: { id: "1", rank: "10", suit: "hearts" },
        },

        {
          downCard: { id: "2" },
          upCard: { id: "1", rank: "10", suit: "hearts" },
        },

        {
          downCard: { id: "2" },
          upCard: { id: "1", rank: "10", suit: "hearts" },
        },

        {
          downCard: { id: "2" },
          upCard: { id: "1", rank: "10", suit: "hearts" },
        },

        {
          downCard: { id: "2" },
          upCard: { id: "1", rank: "10", suit: "hearts" },
        },

        {
          downCard: { id: "2" },
          upCard: { id: "1", rank: "10", suit: "hearts" },
        },
      ],
    },
    onSelectCard: () => {},
    onClickScoreboard: () => {},
    trumpSuit: "hearts",
    currentRoundScore: {
      active: 0,
      opponent: 0,
    },
  },
};
