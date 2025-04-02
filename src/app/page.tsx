import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4 bg-gray-100">
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="flex flex-col items-center gap-6 p-6 text-center">
          <h1 className="text-2xl font-bold" role="heading" aria-level={1}>
            Welcome to Accessible Tic Tac Toe
          </h1>
          <p className="text-sm text-gray-600" aria-live="polite">
            Test, govtech, Play in your browser.
          </p>
          <div className="flex w-full justify-center gap-4">
            <Button aria-label="Create a new game session" className="w-1/2">
              ➕ Create Game
            </Button>
            <Button aria-label="Join an existing game session" variant="outline" className="w-1/2">
              🔗 Join Game
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
