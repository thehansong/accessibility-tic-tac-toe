"use client"

import { useState } from "react"
import { notFound } from "next/navigation"

interface GamePageProps {
  params: {
    id: string
  }
}

type Player = "X" | "O"
type Cell = Player | null

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

  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X")
  const [winner, setWinner] = useState<Player | "Draw" | null>(null)

  const checkWinner = (newBoard: Cell[]) => {
    for (const [a, b, c] of winningCombos) {
      if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[b] === newBoard[c]) {
        return newBoard[a]
      }
    }
    return newBoard.every((cell) => cell !== null) ? "Draw" : null
  }

  const handleMove = (index: number) => {
    if (board[index] || winner) return

    const newBoard = [...board]
    newBoard[index] = currentPlayer
    setBoard(newBoard)

    const result = checkWinner(newBoard)
    if (result) {
      setWinner(result)
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X")
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4 bg-gray-100">
      <div className="w-full max-w-md text-center space-y-4">
        <h1 className="text-2xl font-bold" role="heading" aria-level={1}>
          Game ID: {gameId}
        </h1>
        {winner ? (
          <p className="text-xl font-semibold text-green-600" role="status" aria-live="assertive">
            {winner === "Draw" ? "It’s a draw!" : `🎉 Player ${winner} wins!`}
          </p>
        ) : (
          <p className="text-muted-foreground">Current Turn: {currentPlayer}</p>
        )}

        <div
          className="grid grid-cols-3 gap-2"
          role="grid"
          aria-label="Tic Tac Toe board"
        >
          {board.map((value, i) => (
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
              disabled={!!value || !!winner}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
    </main>
  )
}
