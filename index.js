require("dotenv").config()

const express = require('express');
const app = express();

app.get('/', (req, res) => {
	res.json({
        success:1,
        message: 'Bookly API Test' });

});

app.listen(process.env.LISTEN_PORT, () => {
console.log('Server started on port:', process.env.LISTEN_PORT);
});
