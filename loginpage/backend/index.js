const express = require('express');
const app = express();
require('dotenv').config();
require('./models/db.js')



const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})