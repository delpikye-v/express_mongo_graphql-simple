const mongoose = require('mongoose')

const URL = 'mongodb://localhost:27017/apidemo'

const connection = () => {
    mongoose
        .connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log('Connect to database!')
        })
        .catch(e => {
            console.log(e)
        })
}

module.exports = connection
