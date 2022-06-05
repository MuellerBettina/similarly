const mongoose = require('mongoose');

const SelectionSchema = mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    question_id: {
        type: String,
        required: true
    },
    selected_answer: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Selection', SelectionSchema);
