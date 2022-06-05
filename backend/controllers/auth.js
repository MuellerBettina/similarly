const { validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User')

exports.signup = async (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) return

    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

    //hashing the password and saving user
    try {
        const hashedPassword = await bcrypt.hash(password, 12)

        const user = new User({
            username: username,
            password: hashedPassword,
            email: email
        })

        const savedUser = await user.save();
            res.json(savedUser);

    } catch (err){
        res.json({message: err});
    }
}

exports.login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await User.find({ email: email})

        if (!user){
            const error = new Error('A user with this email could not be found.')
            error.statusCode = 401;
            throw error;
        }

        const isEqual = await bcrypt.compare(password, user[0].password);

        //if password doesn't match stored password
        if (!isEqual){
            const error = new Error('Wrong password!');
            error.statusCode = 401;
            throw error;
        }

        //creation of the jason web token
        const token = jwt.sign(
            {
                email: user[0].email,
                userId: user[0].id
            },
            'secretfortoken',
            { expiresIn: '1h'}
        );

        res.status(200).json({ token: token, userId: user[0].id });

    } catch (err) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err)
    }
}
