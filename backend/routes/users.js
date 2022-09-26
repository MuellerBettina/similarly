const express = require('express');
const User = require('../models/User');
const mongoose = require('mongoose');
const upload = require('../middleware/upload')
const router = express.Router();
const webpush = require('web-push')

const { body } = require('express-validator');

const authController = require('../controllers/auth');

const connect = mongoose.createConnection(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true });
const collectionFiles = connect.collection('profilePictures.files');
const collectionChunks = connect.collection('profilePictures.chunks');

const publicVapidKey = 'BPcTlQeQvbvz6UF6imbPHNqhZGHLV26DnrQ2hhsTnvcxNOA9fJ_O5k2CMR1pvkFaC9Ee5kQPeHe85I7SXfX3mj4';
const privateVapidKey = 'baOVEzMv__E20bUqr1fEpvViSqTNd-kYDLucwiYChmU';
const pushSubscription = {
    endpoint: 'https://fcm.googleapis.com/fcm/send/dp0w9cmLlTQ:APA91bHRg0bwG_KoM2f1ivv6MhKggrLl04CkN1cmgdHeyDHc8DYkLxtUKGuNxDvYRySazoOme7phnzUAUEMlR8LzOtAiY2FQ2EVY6axTIDUQEQx32tUR7J7eWo2bsaQp1OcEEyAhDjuu',
    keys: {
        auth: 'eK3-mQPHUu5avQTHDmsUlA',
        p256dh: 'BPojltWgE6IYbIZgCDWvH3dzHugbVNXTqe59BLohIqANgEFxWnTO-GFo3RHKm5ZzVXX_4FpGooEgQgzLO0CNerQ'
    }
}

function sendNotification() {
    webpush.setVapidDetails('mailto:test@test.com', publicVapidKey, privateVapidKey);
    const payload = JSON.stringify({
        title: 'New Profile Picture',
        content: 'New profile picture was uploaded!'
    });
    webpush.sendNotification(pushSubscription,payload)
        .catch(err => console.error(err));
    console.log('push notification sent');
    // res.status(201).json({ message: 'push notification sent'});
}

function getAllPosts() {
    return new Promise( async(resolve, reject) => {
        const sendAllUsers = [];
        const allUsers = await User.find();
        try {
            for(const user of allUsers) {
                console.log('user', user)
                const oneUser = await getOneUser(user._id);
                sendAllUsers.push(oneUser);
            }
            console.log('sendAllPosts', sendAllUsers)
            resolve(sendAllUsers)
        } catch {
            reject(new Error("Users do not exist!"));
        }
    });
}

function getOneUser(id) {
    return new Promise( async(resolve, reject) => {
        try {
            const user = await User.findOne({ _id: id });
            let fileName = user.profile_picture;

            collectionFiles.find({filename: fileName}).toArray( async(err, docs) => {
                collectionChunks.find({files_id : docs[0]._id}).sort({n: 1}).toArray( (err, chunks) => {

                    const fileData = [];
                    for(let chunk of chunks)
                    {
                        fileData.push(chunk.data.toString('base64'));
                    }

                    let base64file = 'data:' + docs[0].contentType + ';base64,' + fileData.join('');
                    let getUser = new User({
                        "username": user.username,
                        "password": user.password,
                        "email": user.email,
                        "profile_picture": base64file
                    });
                    resolve(getUser)
                })

            })

        } catch {
            reject(new Error("User does not exist!"));
        }
    })
}

//get all the users
router.get('/', async (req, res) => {
    getAllPosts()
        .then( (users) => {
            res.send(users);
        })
        .catch( () => {
            res.status(404);
            res.send({
                error: "User do not exist!"
            });
        })
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
    getOneUser(req.params.user_id)
        .then((user) => {
            console.log('user', user);
            res.send(user);
        })
        .catch( () => {
            res.status(404);
            res.send({
                error: "User does not exist!"
            });

        })
});

//delete a specific user
router.delete('/:user_id', async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.user_id})
        let fileName = user.profile_picture
        await User.deleteOne({_id: req.params.user_id})
        await collectionFiles.find({filename: fileName}).toArray( async(err, docs) => {
            await collectionChunks.deleteMany({files_id: docs[0]._id});
        })
        await collectionFiles.deleteOne({filename: fileName})
        res.status(204).send()
    }catch {
        res.status(404)
        res.send({error: "User does not exist!"});
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

//update profile picture of a specific user
router.post('/:user_id', upload.single('file'), async (req, res) => {
    if(req.file === undefined){
        return res.send({
            "message": "no file selected"
        });
    } else {
        try {
            console.log('req.body', req.body)
            const updatedUser = await User.updateOne({ _id: req.params.user_id }, { $set: {profile_picture: req.file.filename}});
            sendNotification();
            res.json(updatedUser);
        } catch (err){
            res.json({message: err});
        }
    }
});

module.exports = router;
