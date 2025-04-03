import mongoose, { Schema, model, models } from "mongoose"

const moveSchema = new Schema({
  player: { type: String, enum: ["X", "O"], required: true },
  position: { type: Number, required: true },
  timestamp: { type: Number, required: true },
}, { _id: false })

const gameSchema = new Schema({
  gameId: { type: String, required: true, unique: true },
  board: [String],
  currentPlayer: { type: String, enum: ["X", "O"] },
  winner: { type: String },
  joinedRoles: [String],
  timeLeft: Number,
  lastUpdated: Number,
  startTime: Number,
  endTime: Number,
  moves: [moveSchema],
})

export default models.Game || model("Game", gameSchema)
