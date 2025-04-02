import { NextRequest, NextResponse } from "next/server"

type Player = "X" | "O"
type Cell = Player | null

type GameState = {
  board: Cell[]
  currentPlayer: Player
  winner: Player | "Draw" | null
}

// In-memory game store only resets when server restarts
const gameStore = new Map<string, GameState>()

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params
  const game = gameStore.get(id)

  if (!game) {
    const newGame: GameState = {
      board: Array(9).fill(null),
      currentPlayer: "X",
      winner: null,
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
  const { id } = context.params
  const body = await req.json()

  // only check if the game exists
  if (!gameStore.has(id)) {
    return NextResponse.json(
      { error: "Game not found." },
      { status: 404 }
    )
  }

  gameStore.set(id, body)
  return NextResponse.json({ success: true })
}
