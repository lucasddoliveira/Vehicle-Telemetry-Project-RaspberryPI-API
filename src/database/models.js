const mongoose = require('../database')

const TestSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    createdAt: {
        type: Date,
        defaut: Date(),
    },
})

const Test = mongoose.model('User', TestSchema)

module.exports = Test