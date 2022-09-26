const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const ports = process.env.PORT || 3000;

const questionsRoute = require('./routes/questions');
const usersRoute = require('./routes/users');
const selectionsRoute = require('./routes/selections');
const downloadRoute = require('./routes/download');
const deleteRoute = require('./routes/delete');
const subscriptionRoute = require('./routes/subscription');

//use body-parser middleware for all routes
app.use(cors());
app.use(bodyParser.json());

app.use('/questions', questionsRoute);
app.use('/users', usersRoute);
app.use('/selections', selectionsRoute);
app.use('/download', downloadRoute);
app.use('/delete', deleteRoute);
app.use('/subscription', subscriptionRoute)

//connect to db
console.log(process.env.DB_CONNECTION)
mongoose.connect(process.env.DB_CONNECTION, {
    serverSelectionTimeoutMS: 5000
}).catch(err => console.log(err.reason));

app.listen(ports, () => console.log(`Server is running on port ${ports}`));
