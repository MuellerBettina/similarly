const express = require('express');
const User = require('../models/User');

const router = express.Router();

const { body } = require('express-validator');

const authController = require('../controllers/auth');

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
router.post(
    '/signup',
    [
        body('username').trim().not().isEmpty(),
        body('password').trim().isLength({ min: 8}),
        body('email').isEmail().withMessage('Please enter a valid email.').normalizeEmail()
    ],
    authController.signup
);

router.post(
    '/login',
    authController.login
);

//get a specific user
router.get('/:user_id', async (req, res) => {
    try {
        const user = await User.findById(req.params.user_id);
        res.json(user);
    }catch (err){
        res.json({message: err});
    }
});

//delete a specific user
router.delete('/:user_id', async (req, res) => {
    try {
        const removedUser = await User.remove({ _id: req.params.user_id });
        res.json(removedUser);
    }catch (err){
        res.json({message: err});
    }
});

//update password of a specific user
router.patch('/:user_id', async (req, res) => {
    try {
        const updatedUser = await User.updateOne({ _id: req.params.user_id }, { $set: {password: req.body.password}});
        res.json(updatedUser);
    }catch (err){
        res.json({message: err});
    }
});

module.exports = router;
