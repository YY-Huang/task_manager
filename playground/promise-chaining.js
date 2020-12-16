require('../src/db/mongoose');

const User = require('../src/models/user');

// 5eb9996679525a429a44da90

/* User.findOneAndUpdate('5eb9996679525a429a44da90', { age: 1}).then((user) => {
	console.log(user);
	return User.countDocuments({ age: 1});
}).then((result) => {
	console.log(result);
}).catch((err) => {
	console.log(err);
});
 */
const updateAgeAndCount = async (id, age) => {

    const user = await User.findByIdAndUpdate(id, { age })
    const count = await User.countDocuments( { age })

    return count
}

updateAgeAndCount('5eb9996679525a429a44da90', 2).then((result) => {
    console.log(result)
}).catch((err) => {
    console.log(err)
})