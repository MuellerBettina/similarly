const express = require('express');
const Selection = require("../models/Selection");

const router = express.Router();

//get all selections
router.get('/', async (req, res) => {
    try {
        const selections = await Selection.find();
        res.json(selections);
    } catch (err){
        res.json({message:err});
    }
});

//get selections by user_id
router.get('/:user_id', async (req, res) => {
    try {
        const selections = await Selection.find({user_id: req.params.user_id})
        res.json(selections);
    }catch (err){
        res.json({message: err});
    }
});

//post one selection
router.post('/', async (req, res) => {
    const selection = new Selection({
        user_id: req.body.user_id,
        question_id: req.body.question_id,
        selected_answer: req.body.selected_answer,
    })
    try{
        const savedSelection = await selection.save();
        res.json(savedSelection);
    }catch (err){
        res.json({message: err});
    }
});

module.exports = router;
