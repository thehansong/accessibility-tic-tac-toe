import { NextRequest, NextResponse } from "next/server"

type Player = "X" | "O"
type Cell = Player | null

type GameState = {
  board: Cell[]
  currentPlayer: Player
  winner: Player | "Draw" | null
}

const gameStore = new Map<string, GameState>()

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const game = gameStore.get(params.id)
  if (!game) {
    // auto-generate empty game if not found
    const newGame: GameState = {
      board: Array(9).fill(null),
      currentPlayer: "X",
      winner: null,
    }
    gameStore.set(params.id, newGame)
    return NextResponse.json(newGame)
  }
  return NextResponse.json(game)
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json()
  const game = gameStore.get(params.id)
  if (!game || game.winner) {
    return NextResponse.json({ error: "Game not found or already ended." }, { status: 400 })
  }

  gameStore.set(params.id, body)
  return NextResponse.json({ success: true })
}
