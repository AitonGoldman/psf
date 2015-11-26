var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;
//var Number = mongoose.Schema.Number;

var ScorePlayer = new mongoose.Schema({
    playerId: {type: ObjectId, required: true},
    playerName: {type: String, required: true},
    wins: {type: Number},
    losses: {type: Number},
    points: {type: Number}
})

var ChallengeScoreSchema = new mongoose.Schema({
    dateOfScore: {type: Date, default: Date.now },
    winnerId: {type: ObjectId, required: true},
    machinePlayedOnId: {type: String},
    challenge: {type: Boolean, required: true}, 
    scorePlayers: [ScorePlayer]
})

mongoose.model('ChallengeScore', ChallengeScoreSchema);
