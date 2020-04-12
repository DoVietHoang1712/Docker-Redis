const mongoose = require('mongoose');

const ConnectDB = async () => {
    try {
        let uri = 'mongodb://hoangdo:hoangdo@localhost:27017/MongoDB';
        let option = {
            connectTimeoutMS: 3000,
            useNewUrlParser: true,
            useCreateIndex: true
        }
        await mongoose.connect(uri, option);
        console.log('Connecting');
    } catch (error) {
        console.log(error);
    }
}

ConnectDB();
module.exports = {mongoose};