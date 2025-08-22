const mongoose = require('mongoose');

const { Schema } = mongoose;

const GameSchema = new Schema({
  roomName: String,
  gameCompleted: Boolean,
  gameCreatedTime: Date,
  gameStartTime: Date,
  gameEndTime: Date,
  gameStarted: Boolean,
  gameCompleted: Boolean,
  gameDropped: Boolean,
  scope: String,
  payoff: String,
  state: String,
  inGame: Boolean,
  participants: [],
  gameResults: [],
  gameStopDuration: Number,
  roundDuration: Number,  
  resultDuration: Number, 
  secondInstructionCompletedUsers: [],
  roundIndex: Number,
  rounds: [],
  currentRound: String,
  totalRounds: Number,
  roles: [],
  isDepletedFirstRound: Boolean,
  isDepletedSecondRound: Boolean,
  currentWater: Number,
  waitingRoomTime: Number,
  waitingRoom2Time: Number,
  previousWater: Number,
  rechargeWater: Number,
  now: Number,
  participantDropped: {},
  participantNotresponded: {},
});

module.exports = Game = mongoose.model('Game', GameSchema);
