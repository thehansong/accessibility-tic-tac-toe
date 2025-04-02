"use client"

import { useEffect, useState } from "react"
import { notFound } from "next/navigation"

interface GamePageProps {
  params: { id: string }
}

type Player = "X" | "O"
type Cell = Player | null
type GameState = {
  board: Cell[]
  currentPlayer: Player
  winner: Player | "Draw" | null
}

const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

export default function GamePage({ params }: GamePageProps) {
  const gameId = params.id
  if (!gameId) notFound()

  const [game, setGame] = useState<GameState>({
    board: Array(9).fill(null),
    currentPlayer: "X",
    winner: null,
  })

  // Poll every 2 seconds to fetch latest game state
  useEffect(() => {
    const fetchGame = async () => {
      const res = await fetch(`/api/games/${gameId}`)
      const data = await res.json()
      setGame(data)
    }

    fetchGame()
    const interval = setInterval(fetchGame, 2000)
    return () => clearInterval(interval)
  }, [gameId])

  const checkWinner = (board: Cell[]): Player | "Draw" | null => {
    for (const [a, b, c] of winningCombos) {
      if (board[a] && board[a] === board[b] && board[b] === board[c]) {
        return board[a]
      }
    }
    return board.every((cell) => cell !== null) ? "Draw" : null
  }

  const handleMove = async (index: number) => {
    if (game.board[index] || game.winner) return

    const newBoard = [...game.board]
    newBoard[index] = game.currentPlayer
    const winner = checkWinner(newBoard)
    const nextPlayer = game.currentPlayer === "X" ? "O" : "X"

    const updatedGame: GameState = {
      board: newBoard,
      currentPlayer: winner ? game.currentPlayer : nextPlayer,
      winner,
    }

    setGame(updatedGame)

    await fetch(`/api/games/${gameId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedGame),
    })
  }

  const handleRestart = async () => {
    const newGame: GameState = {
      board: Array(9).fill(null),
      currentPlayer: "X",
      winner: null,
    }
  
    await fetch(`/api/games/${gameId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newGame),
    })
  
    // fetch updated game state after reset
    const res = await fetch(`/api/games/${gameId}`)
    const data = await res.json()
    setGame(data)
  }
  

  return (
    <main className="flex min-h-screen items-center justify-center p-4 bg-gray-100">
      <div className="w-full max-w-md text-center space-y-4">
        <h1 className="text-2xl font-bold" role="heading" aria-level={1}>
          Game ID: {gameId}
        </h1>

        {game.winner ? (
          <>
            <p className="text-xl font-semibold text-green-600" role="status" aria-live="assertive">
              {game.winner === "Draw" ? "It’s a draw!" : `🎉 Player ${game.winner} wins!`}
            </p>
            <button
              onClick={handleRestart}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Restart game"
            >
              🔄 Restart Game
            </button>
          </>
        ) : (
          <p className="text-muted-foreground">Current Turn: {game.currentPlayer}</p>
        )}

        <div className="grid grid-cols-3 gap-2" role="grid" aria-label="Tic Tac Toe board">
          {game.board.map((value, i) => (
            <button
              key={i}
              role="gridcell"
              tabIndex={0}
              aria-label={`Cell ${i + 1}, ${value ?? "empty"}`}
              className="aspect-square border border-border rounded text-2xl font-bold flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-ring hover:bg-muted cursor-pointer bg-white"
              onClick={() => handleMove(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  handleMove(i)
                }
              }}
              disabled={!!value || !!game.winner}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
    </main>
  )
}
