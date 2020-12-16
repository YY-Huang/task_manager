
const { MongoClient, ObjectID } = require('mongodb')
const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

const id = new ObjectID();

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (err, client) => {
    if (err) {
        return console.log('unable to print to database')
    }

    const db = client.db(databaseName)


    db.collection('tasks').deleteOne({description: "Cook lunch"})
    .then((result) => {
        console.log(result)
    }).catch((err) => {
        console.log(err)
    })
})