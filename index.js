const express = require('express');
const app = express();

app.get('/', (req, res) => {
	res.json({
        success:1,
        message: 'Bookly API Test' });

});

app.listen(3000, () => {
    console.log('Server started on port 3000...');
});
