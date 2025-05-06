import { SessionModel } from "@/models/SessionModel";
import { ClientViewModel } from "@/schemas/ClientViewSchema";
import { GameActionRequestModel } from "@/schemas/GameActionRequestSchema";
import { GameActionResponseModel } from "@/schemas/GameActionResponseSchema";
import { GameInfoModel } from "@/schemas/GameInfoSchema";
import { Socket, Server } from "socket.io";

export interface SocketListenEventsMap {
  authenticate: (message: { sessionId: string }) => void;
  join_room: (message: { gameId?: string }) => void;
  game_action: (message: GameActionRequestModel) => void;
  error: (message: { message: string; details?: string }) => void;
}

export interface SocketEmitEventsMap {
  authenticated: (message: {
    type: string;
    success: boolean;
    message: string;
  }) => void;
  room_joined: (message: { gameId: string; game: GameInfoModel }) => void;
  game_started: (message: { gameId: string; view: ClientViewModel }) => void;
  game_over: (message: { gameId: string }) => void;
  round_over: (message: { gameId: string; view: ClientViewModel }) => void;
  game_updated: (message: GameActionResponseModel) => void;
  error: (message: { message: string; details?: string }) => void;
}

export type SocketType = Socket<
  SocketListenEventsMap,
  SocketEmitEventsMap,
  {},
  {
    sessionId: string;
    session: SessionModel;
  }
>;

export type SocketServerType = Server<
  SocketListenEventsMap,
  SocketEmitEventsMap,
  {},
  {
    sessionId: string;
    session: SessionModel;
  }
>;
