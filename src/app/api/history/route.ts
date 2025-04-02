import { NextRequest, NextResponse } from "next/server"

type Player = "X" | "O"
type Cell = Player | null

type GameState = {
  board: Cell[]
  currentPlayer: Player
  winner: Player | "Draw" | null
  joinedRoles: Player[]
  timeLeft: number
  lastUpdated: number
}

// Create a history store structure
type GameHistory = {
  gameId: string
  startTime: number
  endTime: number | null
  players: Player[]
  winner: Player | "Draw" | null
  moves: {
    player: Player
    position: number
    timestamp: number
  }[]
}

// Global store for game history
const historyStore = new Map<string, GameHistory>()

// Function to record a game move in history
export function recordMove(gameId: string, player: Player, position: number, gameState: GameState) {
  let gameHistory = historyStore.get(gameId)
  
  if (!gameHistory) {
    // Create new history entry if this is the first move
    gameHistory = {
      gameId,
      startTime: Date.now(),
      endTime: null,
      players: [...gameState.joinedRoles],
      winner: null,
      moves: []
    }
    historyStore.set(gameId, gameHistory)
  }
  
  // Record the move
  gameHistory.moves.push({
    player,
    position,
    timestamp: Date.now()
  })
  
  // Update winner if the game is completed
  if (gameState.winner) {
    gameHistory.winner = gameState.winner
    gameHistory.endTime = Date.now()
  }
}

// GET handler to retrieve all game history
export async function GET() {
  // Convert Map to array for JSON response
  const historyEntries = Array.from(historyStore.entries()).map(([id, history]) => history)
  
  // Sort by most recent games first
  historyEntries.sort((a, b) => (b.startTime || 0) - (a.startTime || 0))
  
  return NextResponse.json(historyEntries)
}

// GET handler to retrieve a specific game's history
export async function POST(req: NextRequest) {
  const { gameId } = await req.json()
  
  if (!gameId) {
    return NextResponse.json({ error: "Game ID is required" }, { status: 400 })
  }
  
  const gameHistory = historyStore.get(gameId)
  
  if (!gameHistory) {
    return NextResponse.json({ error: "Game history not found" }, { status: 404 })
  }
  
  return NextResponse.json(gameHistory)
}
