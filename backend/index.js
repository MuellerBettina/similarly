const express = require('express');
const app = express();

const ports = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send("Hello world!");
})

app.listen(ports, () => console.log(`Server is running on port ${ports}`));
