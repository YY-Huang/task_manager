const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/tasks');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/tasks');

const app = express();
const PORT = process.env.PORT || 3000;

// app.use((req, res, next) => {
// 	console.log(req.method, req.path)
// 	if (req.method === 'GET') {
// 		res.status(503).send('Maintenance for server is currently ongoing')
// 	} else {
// 		next()
// 	}
// })

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});

/* const main = async () => {
	const task = await Task.findById('5eda90f292f2970092a25acf')

	await task.populate('owner').execPopulate()

	console.log(task.owner)

	const user = await User.findById('5eda8f6a806fcc866ca2fca1')
	await user.populate('tasks').execPopulate()
	console.log(user.tasks)
}

main() */

/* const pet = {
	name: 'Eevee'
};

pet.toJSON = function () {
	console.log('this', this);
	return {};
};

console.log(JSON.stringify(pet)); */

/*
const jwt = require('jsonwebtoken')

const myFunc = async () => {
	const token = jwt.sign(
		{ _id: 'dummyID' },
		'thisismynewcourse',
		{ expiresIn: '7 days'}
	)

	const payload = jwt.verify(token, 'thisismynewcourse')

	console.log(payload)
}
myFunc()
*/
