// src/models/Game.ts
import mongoose, { Schema, Document } from 'mongoose';

type Player = "X" | "O";
type Cell = Player | null;

// Game interface
export interface IGame extends Document {
  gameId: string;
  board: Cell[];
  currentPlayer: Player;
  winner: Player | "Draw" | null;
  joinedRoles: Player[];
  timeLeft: number;
  lastUpdated: number;
}

// Game schema
const GameSchema: Schema = new Schema({
  gameId: { type: String, required: true, unique: true },
  board: { type: [Schema.Types.Mixed], required: true },
  currentPlayer: { type: String, required: true, enum: ['X', 'O'] },
  winner: { type: Schema.Types.Mixed, default: null },
  joinedRoles: { type: [String], default: [] },
  timeLeft: { type: Number, default: 15 },
  lastUpdated: { type: Number, default: Date.now }
});

// GameHistory interface
export interface IGameHistory extends Document {
  gameId: string;
  startTime: number;
  endTime: number | null;
  players: Player[];
  winner: Player | "Draw" | null;
  moves: {
    player: Player;
    position: number;
    timestamp: number;
  }[];
}

// GameHistory schema
const GameHistorySchema: Schema = new Schema({
  gameId: { type: String, required: true, unique: true },
  startTime: { type: Number, required: true },
  endTime: { type: Number, default: null },
  players: { type: [String], default: [] },
  winner: { type: Schema.Types.Mixed, default: null },
  moves: [{
    player: { type: String, required: true, enum: ['X', 'O'] },
    position: { type: Number, required: true },
    timestamp: { type: Number, default: Date.now }
  }]
});

// Create or retrieve models
export const Game = mongoose.models.Game || mongoose.model<IGame>('Game', GameSchema);
export const GameHistory = mongoose.models.GameHistory || mongoose.model<IGameHistory>('GameHistory', GameHistorySchema);