import { connectToDatabase } from "@/lib/mongodb"
import Game from "@/models/Game"

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

export async function recordMove(
  gameId: string,
  player: Player,
  position: number,
  gameState: GameState
) {
  await connectToDatabase()
  const game = await Game.findOne({ gameId })
  if (!game) return

  game.moves.push({ player, position, timestamp: Date.now() })

  if (!game.startTime) {
    game.startTime = Date.now()
    game.players = [...gameState.joinedRoles]
  }

  if (gameState.winner && !game.endTime) {
    game.winner = gameState.winner
    game.endTime = Date.now()
  }

  await game.save()
}
