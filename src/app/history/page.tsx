"use client"

import { useEffect, useState } from "react"
// import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type Player = "X" | "O"

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

export default function HistoryPage() {
  const [history, setHistory] = useState<GameHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedGame, setSelectedGame] = useState<GameHistory | null>(null)
  // const router = useRouter()

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/history")
        if (res.ok) {
          const data = await res.json()
          setHistory(data)
        }
      } catch (error) {
        console.error("Failed to fetch history:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  const handleViewGame = (game: GameHistory) => {
    setSelectedGame(game)
  }

  const renderBoard = (game: GameHistory) => {
    // Create an empty board
    const board = Array(9).fill(null)
    
    // Fill in the moves in sequence
    game.moves.forEach(move => {
      board[move.position] = move.player
    })
    
    return (
      <div 
        className="grid grid-cols-3 gap-2 my-4" 
        role="grid"
        aria-label="Game board showing final positions"
      >
        {board.map((cell, i) => (
          <div
            key={i}
            role="gridcell"
            aria-label={`Cell ${i + 1}, ${cell ?? "empty"}`}
            className="aspect-square border border-border rounded text-2xl font-bold flex items-center justify-center bg-white"
          >
            {cell}
          </div>
        ))}
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gray-100">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold" role="heading" aria-level={1}>
            Game History
          </h1>
          <Link href="/">
            <Button variant="outline" aria-label="Return to home">
              Return Home
            </Button>
          </Link>
        </div>

        {loading ? (
          <p aria-live="polite">Loading game history...</p>
        ) : history.length === 0 ? (
          <Card>
            <CardContent className="py-6">
              <p className="text-center" aria-live="polite">No game history available.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Past Games</h2>
              {history.map((game) => (
                <Card key={game.gameId} className="mb-4">
                  <CardContent className="py-4">
                    <h3 className="font-medium">Game ID: {game.gameId}</h3>
                    <p className="text-sm text-muted-foreground">
                      Started: {formatDate(game.startTime)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Players: {game.players?.join(", ") ?? "Unknown"}
                    </p>
                    <p className="text-sm font-medium mt-1">
                      {game.winner ? (
                        game.winner === "Draw" ? 
                          "Result: Draw" : 
                          `Winner: Player ${game.winner}`
                      ) : (
                        "Status: In Progress"
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Moves: {game.moves.length}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => handleViewGame(game)}
                      aria-label={`View details of game ${game.gameId}`}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-2">Game Details</h2>
              {selectedGame ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Game {selectedGame.gameId}</CardTitle>
                    <CardDescription>
                      {selectedGame.winner 
                        ? `Completed: ${formatDate(selectedGame.endTime!)}` 
                        : "Game in progress"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-medium mb-2">Final Board</h3>
                    {renderBoard(selectedGame)}
                    
                    <h3 className="font-medium mt-4 mb-2">Move History</h3>
                    <div className="space-y-1 max-h-96 overflow-y-auto">
                      {selectedGame.moves.map((move, index) => (
                        <div 
                          key={index}
                          className="flex justify-between text-sm p-2 border-b"
                          aria-label={`Move ${index + 1}: Player ${move.player} placed at position ${move.position + 1}`}
                        >
                          <span>
                            {index + 1}. Player {move.player} → Position {move.position + 1}
                          </span>
                          <span className="text-muted-foreground">
                            {new Date(move.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="py-6">
                    <p className="text-center text-muted-foreground">
                      Select a game to view details
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
