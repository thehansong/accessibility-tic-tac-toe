"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Home() {
  const [joinGameId, setJoinGameId] = useState("")
  const router = useRouter()

  const handleCreateGame = () => {
    // creation of game from random 6-character game ID
    const gameId = Math.random().toString(36).substring(2, 8)
    router.push(`/game/${gameId}`)
  }

  const handleJoinGame = () => {
    if (joinGameId.trim()) {
      router.push(`/game/${joinGameId.trim()}`)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4 bg-gray-100">
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="flex flex-col items-center gap-6 p-6 text-center">
          <h1 className="text-2xl font-bold" role="heading" aria-level={1}>
            Welcome to Accessible Tic Tac Toe
          </h1>
          <p className="text-sm text-gray-600" aria-live="polite">
            Play in your browser. Designed for screen readers & keyboard navigation.
          </p>

          <div className="w-full">
            <label htmlFor="game-id" className="sr-only">
              Enter Game ID
            </label>
            <Input
              id="game-id"
              placeholder="Enter Game ID to join"
              value={joinGameId}
              onChange={(e) => setJoinGameId(e.target.value)}
              className="mb-4"
              aria-label="Enter Game ID to join"
            />
            <div className="flex justify-center gap-4">
              <Button
                onClick={handleCreateGame}
                aria-label="Create a new game session"
                className="w-1/2"
              >
                ➕ Create Game
              </Button>
              <Button
                onClick={handleJoinGame}
                aria-label="Join an existing game session"
                variant="outline"
                className="w-1/2"
              >
                🔗 Join Game
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
