const express = require('express');
const Question = require("../models/Question");

const router = express.Router();

const questionController = require('../controllers/question')

//get all questions
router.get('/', async (req, res) => {
    try {
        const questions = await Question.find();
        res.json(questions);
    } catch (err){
        res.json({message:err});
    }
});


router.get(
    '/unanswered/:user_id',
    questionController.showUnansweredByUser
)

router.get(
    '/answered/:user_id',
    questionController.showAnsweredByUser
)

//add one question
router.post('/', async (req, res) => {
    const question = new Question({
        title: req.body.title,
        body: req.body.body,
        answer1: req.body.answer1,
        answer2: req.body.answer2
    })

    try{
        const savedQuestion = await question.save();
        res.json(savedQuestion);
    }catch (err){
        res.json({message: err});
    }
});

module.exports = router;
