const express = require("express");
require("./db/mongoose");
const multer = require("multer");

/*
	Models and Routers
*/
const User = require("./models/user");
const Task = require("./models/tasks");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/tasks");

const app = express();
const PORT = process.env.PORT || 3000;

const upload = multer({
	dest: "images"
});

app.post("/upload", upload.single("upload"), (req, res) => {
	res.send();
});


app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(PORT, () => {
	console.log(`Listening on port: ${PORT}`);
});
