import { NextRequest, NextResponse } from "next/server"
import { recordMove } from "../../history/route"

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

// In-memory game store only resets when server restarts
const gameStore = new Map<string, GameState>()

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = await context.params
  const game = gameStore.get(id)

  if (!game) {
    const newGame: GameState = {
      board: Array(9).fill(null),
      currentPlayer: "X",
      winner: null,
      joinedRoles: [],
      timeLeft: 15,
      lastUpdated: Date.now(),      
    }
    
    gameStore.set(id, newGame)
    return NextResponse.json(newGame)
  }

  return NextResponse.json(game)
}

export async function POST(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = await context.params
  const body = await req.json()
  const currentGame = gameStore.get(id)

  // only check if the game exists
  if (!gameStore.has(id)) {
    return NextResponse.json(
      { error: "Game not found." },
      { status: 404 }
    )
  }

  // if there's a previous state, compare boards to detect moves
  if (currentGame && body.board) {
    // find which cell changed to record the move
    for (let i = 0; i < 9; i++) {
      if (currentGame.board[i] === null && body.board[i] !== null) {
        recordMove(id, body.board[i], i, body)
        break
      }
    }
  }

  const updatedGame: GameState = {
    ...body,
    lastUpdated: Date.now(),
  }

  gameStore.set(id, updatedGame)
  return NextResponse.json({ success: true })
}
