const mongoose = require('mongoose');

const hackathonSchema = new mongoose.Schema({
    name: String,
    link: String,
    interestedPeoples: [String]
})

module.exports = mongoose.model('Hackathons', hackathonSchema)  