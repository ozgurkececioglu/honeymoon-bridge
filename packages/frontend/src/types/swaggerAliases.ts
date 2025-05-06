import { components } from 'network/swagger-api';

export type UpCard = components['schemas']['UpCard'];
export type DownCard = components['schemas']['DownCard'];
export type UpDownCards = components['schemas']['UpDownCards'];
export type VisibleDeck = components['schemas']['ClientView']['deck'];

export type Suit = UpCard['suit'];
export type Rank = UpCard['rank'];

export type ClientView = components['schemas']['ClientView'];
export type GameInfo = components['schemas']['GameInfo'];
export type GameActionRequest = components['schemas']['GameActionRequest'];
export type GameActionResponse = components['schemas']['GameActionResponse'];

export type Player = components['schemas']['GameInfo']['players'][number];
