require("dotenv").config()

const express = require('express');
const app = express();
const userRouter = require("./routes/users/Users.router.js");

app.use(express.json());

app.use("/users", userRouter);

app.listen(process.env.LISTEN_PORT, () => {
console.log('Server started on port:', process.env.LISTEN_PORT);
});
