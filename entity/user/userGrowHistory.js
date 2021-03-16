const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const connectedMongoose = require('../../crud/mongoDB.js');

const userGrowHistorySchema = Schema({
	uId: {
		type: Number,
		required: true,
	},
	history: [{
		//date
		//increase
	}],
})

module.exports = connectedMongoose.model('user_grow_history', userGrowHistorySchema);