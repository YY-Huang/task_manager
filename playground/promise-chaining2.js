require('../src/db/mongoose');

const Task = require('../src/models/tasks');

/* Task.findOneAndDelete('5ec3f576d8318a083202e4d5').then((task) => {
	console.log('delete task', task);

	return Task.find({ completed: false});
}).then((result) => {
	console.log('result is: ',result);
}).catch((err) => {
	console.log(err);
}); */

const findAndDeleteTask = async (taskID) => {

    const deleteTask = await Task.findByIdAndDelete(taskID)
    const findIncompleteTask = await Task.countDocuments({ completed: false})

    return findIncompleteTask
}

findAndDeleteTask('5ec826c0ea09c8546fc47312').then((incompleteTask) => {
    console.log('incomplete Tasks', incompleteTask)
}).catch((err) => {
    console.log('error is: ', incompleteTask)
})