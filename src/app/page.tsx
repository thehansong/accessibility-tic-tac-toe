"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Home() {
  const [joinGameId, setJoinGameId] = useState("")
  const [selectedRole, setSelectedRole] = useState<"X" | "O" | null>(null)
  const [joinedRoles, setJoinedRoles] = useState<("X" | "O")[]>([])
  const router = useRouter()

  useEffect(() => {
    if (!joinGameId) return
    const fetchRoles = async () => {
      const res = await fetch(`/api/games/${joinGameId}`)
      if (!res.ok) return
      const data = await res.json()
      setJoinedRoles(data.joinedRoles || [])
    }
    fetchRoles()
  }, [joinGameId])

  const handleCreateGame = () => {
    if (!selectedRole) return alert("Please select a role first.")
    const gameId = Math.random().toString(36).substring(2, 8)
    localStorage.setItem(`tic-role-${gameId}`, selectedRole)
    router.push(`/game/${gameId}`)
  }

  const handleJoinGame = () => {
    if (!selectedRole || !joinGameId.trim()) {
      return alert("Please enter a Game ID and select a role.")
    }
    if (joinedRoles.includes(selectedRole)) {
      return alert(`Role ${selectedRole} is already taken in this game.`)
    }
    localStorage.setItem(`tic-role-${joinGameId}`, selectedRole)
    router.push(`/game/${joinGameId.trim()}`)
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4 bg-gray-100">
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="flex flex-col items-center gap-6 p-6 text-center">
          <h1 className="text-2xl font-bold" role="heading" aria-level={1}>
            Welcome to Accessible Tic Tac Toe
          </h1>
          <p className="text-sm text-gray-600" aria-live="polite">
            Choose your role and create or join a game.
          </p>

          <div className="flex gap-4">
            <Button
              variant={selectedRole === "X" ? "default" : "outline"}
              onClick={() => setSelectedRole("X")}
              aria-pressed={selectedRole === "X"}
              aria-label="Select to play as X"
              disabled={joinedRoles.includes("X")}
            >
              🧍 Player X {joinedRoles.includes("X") && "(Taken)"}
            </Button>
            <Button
              variant={selectedRole === "O" ? "default" : "outline"}
              onClick={() => setSelectedRole("O")}
              aria-pressed={selectedRole === "O"}
              aria-label="Select to play as O"
              disabled={joinedRoles.includes("O")}
            >
              🧍 Player O {joinedRoles.includes("O") && "(Taken)"}
            </Button>
          </div>

          <div className="w-full">
            <Input
              id="game-id"
              placeholder="Enter Game ID to join"
              value={joinGameId}
              onChange={(e) => setJoinGameId(e.target.value)}
              className="mb-4"
              aria-label="Enter Game ID"
            />
            <div className="flex justify-center gap-4">
              <Button onClick={handleCreateGame} className="w-1/2" aria-label="Create a new game session">
                ➕ Create Game
              </Button>
              <Button onClick={handleJoinGame} variant="outline" className="w-1/2" aria-label="Join game session">
                🔗 Join Game
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
