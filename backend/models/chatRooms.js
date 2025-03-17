const mongoose = require('mongoose');

const chatroomSchema = new mongoose.Schema({
    user1: String,
    user2: String,
    roomCode: String,
    messages: [{
        sender: String,
        message: String
    }]
})

module.exports = mongoose.model('ChatRooms', chatroomSchema)