const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const connectedMongoose = require('../../crud/mongoDB.js');

const UserLoginSchema = Schema({
	uId: {
		type: Number,
		required: true,
	},
	userName: {
		type: String,
		required: true, 
	},
	password: {
		type: String,
		required: true,
	},
})

module.exports = connectedMongoose.model('user_login', UserLoginSchema);