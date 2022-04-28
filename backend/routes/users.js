const express = require('express');
const User = require('../models/User');

const router = express.Router();

//get all the users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err){
        res.json({message:err});
    }
});

//add a user to the db
router.post('/', async (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    })

    try{
        const savedUser = await user.save();
        res.json(savedUser);
    }catch (err){
        res.json({message: err});
    }
});

//get a specific user
router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        res.json(user);
    }catch (err){
        res.json({message: err});
    }
});

//delete a specific user
router.delete('/:userId', async (req, res) => {
    try {
        const removedUser = await User.remove({ _id: req.params.userId });
        res.json(removedUser);
    }catch (err){
        res.json({message: err});
    }
});

//update password of a specific user
router.patch('/:userId', async (req, res) => {
    try {
        const updatedUser = await User.updateOne({ _id: req.params.userId }, { $set: {password: req.body.password}});
        res.json(updatedUser);
    }catch (err){
        res.json({message: err});
    }
});



module.exports = router;
