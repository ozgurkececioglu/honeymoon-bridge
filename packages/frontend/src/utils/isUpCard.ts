import { DownCard, UpCard } from 'types/swaggerAliases';

export function isUpCard(card: UpCard | DownCard): card is UpCard {
  return !!card && 'id' in card && 'suit' in card && 'rank' in card;
}
