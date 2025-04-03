import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Game from "@/models/Game"
import { recordMove } from "@/lib/recordMove"

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase()

    const url = new URL(req.url)
    const id = url.pathname.split("/").pop() as string

    const game = await Game.findOne({ gameId: id })

    if (!game) {
      const newGame = await Game.create({
        gameId: id,
        board: Array(9).fill(null),
        currentPlayer: "X",
        winner: null,
        joinedRoles: [],
        timeLeft: 15,
        lastUpdated: Date.now(),
        startTime: Date.now(),
        moves: [],
      })
      return NextResponse.json(newGame)
    }

    return NextResponse.json(game)
  } catch (error) {
    console.error("Error in GET game:", error)
    return NextResponse.json({ error: "Failed to fetch game" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase()

    const url = new URL(req.url)
    const id = url.pathname.split("/").pop() as string
    const body = await req.json()

    const existingGame = await Game.findOne({ gameId: id })

    if (!existingGame) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 })
    }

    // Detect move to record
    const prevBoard = existingGame.board
    const newBoard = body.board
    for (let i = 0; i < 9; i++) {
      if (prevBoard[i] === null && newBoard[i] !== null) {
        recordMove(id, newBoard[i], i, body)
        existingGame.moves.push({
          player: newBoard[i],
          position: i,
          timestamp: Date.now(),
        })
        break
      }
    }

    // Update fields
    existingGame.board = newBoard
    existingGame.currentPlayer = body.currentPlayer
    existingGame.winner = body.winner
    existingGame.joinedRoles = body.joinedRoles
    existingGame.timeLeft = body.timeLeft
    existingGame.lastUpdated = Date.now()

    if (body.winner && !existingGame.endTime) {
      existingGame.endTime = Date.now()
    }

    await existingGame.save()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in POST game:", error)
    return NextResponse.json({ error: "Failed to update game" }, { status: 500 })
  }
}

