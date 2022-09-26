const express = require('express');
const webpush = require('web-push');
const router = express.Router();

const publicVapidKey = 'BPcTlQeQvbvz6UF6imbPHNqhZGHLV26DnrQ2hhsTnvcxNOA9fJ_O5k2CMR1pvkFaC9Ee5kQPeHe85I7SXfX3mj4';
const privateVapidKey = 'baOVEzMv__E20bUqr1fEpvViSqTNd-kYDLucwiYChmU';

router.post('/', async(req, res) => {
    const subscription = req.body;
    console.log('subscription', subscription);
    res.status(201).json({ message: 'subscription received'});

    webpush.setVapidDetails('mailto:test@test.com;', publicVapidKey, privateVapidKey);
});

module.exports = router;
