const { Int32 } = require('mongodb');
const mongoose = require('mongoose');

const ProblemSchema = new mongoose.Schema({
    index: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    points: {
        type: Number,
        required: true,
        default: 100
    },
    flag: {
        type: String,
        required: true,
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('Problem', ProblemSchema);