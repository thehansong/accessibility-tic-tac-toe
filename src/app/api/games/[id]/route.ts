// src/app/api/games/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Game } from "@/models/Game";
import { recordMove } from "../../history/route";

type Player = "X" | "O";
type Cell = Player | null;

type GameState = {
  board: Cell[];
  currentPlayer: Player;
  winner: Player | "Draw" | null;
  joinedRoles: Player[];
  timeLeft: number;
  lastUpdated: number;
};

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  await dbConnect();
  const { id } = context.params;
  
  try {
    // Try to find the game
    let game = await Game.findOne({ gameId: id });
    
    // If no game exists, create a new one
    if (!game) {
      const newGame: GameState = {
        gameId: id,
        board: Array(9).fill(null),
        currentPlayer: "X",
        winner: null,
        joinedRoles: [],
        timeLeft: 15,
        lastUpdated: Date.now(),
      };
      
      game = await Game.create(newGame);
    }
    
    return NextResponse.json(game);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch game" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  context: { params: { id: string } }
) {
  await dbConnect();
  const { id } = context.params;
  const body = await req.json();
  
  try {
    // Find the current game
    const currentGame = await Game.findOne({ gameId: id });
    
    // Check if game exists
    if (!currentGame) {
      return NextResponse.json(
        { error: "Game not found." },
        { status: 404 }
      );
    }
    
    // If there's a previous state, compare boards to detect moves
    if (currentGame && body.board) {
      // find which cell changed to record the move
      for (let i = 0; i < 9; i++) {
        if (currentGame.board[i] === null && body.board[i] !== null) {
          await recordMove(id, body.board[i], i, body);
          break;
        }
      }
    }
    
    // Update game state
    const updatedGame: GameState = {
      ...body,
      gameId: id,
      lastUpdated: Date.now(),
    };
    
    await Game.findOneAndUpdate({ gameId: id }, updatedGame, { 
      new: true,
      upsert: true 
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to update game" },
      { status: 500 }
    );
  }
}