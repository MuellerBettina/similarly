const mongoose = require('mongoose');

const QuestionSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Questions', QuestionSchema);
