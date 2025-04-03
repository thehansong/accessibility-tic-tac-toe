import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Game from "@/models/Game"

// type Player = "X" | "O"
// type Cell = Player | null

// type GameState = {
//   board: Cell[]
//   currentPlayer: Player
//   winner: Player | "Draw" | null
//   joinedRoles: Player[]
//   timeLeft: number
//   lastUpdated: number
// }

// // MongoDB persistence
// export async function recordMove(
//   gameId: string,
//   player: Player,
//   position: number,
//   gameState: GameState
// ) {
//   await connectToDatabase()
//   const game = await Game.findOne({ gameId })

//   if (!game) return

//   game.moves.push({
//     player,
//     position,
//     timestamp: Date.now(),
//   })

//   // Set metadata
//   if (!game.startTime) {
//     game.startTime = Date.now()
//     game.players = [...gameState.joinedRoles]
//   }

//   if (gameState.winner && !game.endTime) {
//     game.winner = gameState.winner
//     game.endTime = Date.now()
//   }

//   await game.save()
// }

// GET: Fetch all game history
export async function GET() {
  await connectToDatabase()

  const games = await Game.find({}, {
    gameId: 1,
    startTime: 1,
    endTime: 1,
    players: 1,
    winner: 1,
    moves: 1,
    _id: 0,
  }).sort({ startTime: -1 }).lean()

  return NextResponse.json(games)
}

// POST: Fetch specific game history by ID
export async function POST(req: NextRequest) {
  const { gameId } = await req.json()

  if (!gameId) {
    return NextResponse.json({ error: "Game ID is required" }, { status: 400 })
  }

  await connectToDatabase()
  const game = await Game.findOne({ gameId }, {
    gameId: 1,
    startTime: 1,
    endTime: 1,
    players: 1,
    winner: 1,
    moves: 1,
    _id: 0,
  }).lean()

  if (!game) {
    return NextResponse.json({ error: "Game history not found" }, { status: 404 })
  }

  return NextResponse.json(game)
}
