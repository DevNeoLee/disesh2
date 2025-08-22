const mongoose = require('mongoose');

const { Schema } = mongoose; 

const SessionSchema = new Schema({
  ipAddress: String,
  sessionStartTime: Date,
  gameJoinedTime: Date,
  sessionEndTime: Date,
  gameStarted: Boolean,
  gameCompleted: Boolean,
  gameDropped: Boolean,
  sessionCompleted: Boolean,
  timeLastUpdated: Date,
  preQuiz: [],
  secondQuiz: [],
  role: String,
  yourDecisions: {},
  gameId:{ type: Schema.Types.ObjectId },
  roomName: String,
  mTurkNumber: String,
  lastActivity: String,
  scope: String,
  payoff: String,
  socket_id: String,
  survey: [],
  timeTracker: {}
});

module.exports = Session = mongoose.model('session', SessionSchema);
