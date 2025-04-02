// src/app/api/history/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { GameHistory } from "@/models/Game";

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

// Function to record a game move in history
export async function recordMove(gameId: string, player: Player, position: number, gameState: GameState) {
  await dbConnect();
  
  try {
    // Try to find existing game history
    let gameHistory = await GameHistory.findOne({ gameId });
    
    if (!gameHistory) {
      // Create new history entry if this is the first move
      gameHistory = await GameHistory.create({
        gameId,
        startTime: Date.now(),
        endTime: null,
        players: [...gameState.joinedRoles],
        winner: null,
        moves: []
      });
    }
    
    // Record the move
    gameHistory.moves.push({
      player,
      position,
      timestamp: Date.now()
    });
    
    // Update winner if the game is completed
    if (gameState.winner) {
      gameHistory.winner = gameState.winner;
      gameHistory.endTime = Date.now();
    }
    
    await gameHistory.save();
    return true;
  } catch (error) {
    console.error("Error recording move:", error);
    return false;
  }
}

// GET handler to retrieve all game history
export async function GET() {
  await dbConnect();
  
  try {
    // Get all history entries, sorted by most recent
    const historyEntries = await GameHistory.find({})
      .sort({ startTime: -1 })
      .lean();
    
    return NextResponse.json(historyEntries);
  } catch (error) {
    console.error("Failed to fetch history:", error);
    return NextResponse.json(
      { error: "Failed to fetch game history" },
      { status: 500 }
    );
  }
}

// POST handler to retrieve a specific game's history
export async function POST(req: NextRequest) {
  await dbConnect();
  const { gameId } = await req.json();
  
  if (!gameId) {
    return NextResponse.json({ error: "Game ID is required" }, { status: 400 });
  }
  
  try {
    const gameHistory = await GameHistory.findOne({ gameId }).lean();
    
    if (!gameHistory) {
      return NextResponse.json({ error: "Game history not found" }, { status: 404 });
    }
    
    return NextResponse.json(gameHistory);
  } catch (error) {
    console.error("Failed to fetch game history:", error);
    return NextResponse.json(
      { error: "Failed to fetch game history" },
      { status: 500 }
    );
  }
}