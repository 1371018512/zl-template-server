const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const connectedMongoose = require('../../crud/mongoDB.js');

const userLikeSchema = Schema({
	uId: {
		type: Number,
		required: true,
	},
	artLikes: [{
		type: Number,
	}],
	blinkLikes: [{
		type: Number,
	}],
	commentLikes: [{
		type: Number,
	}],
})

module.exports = connectedMongoose.model('user_like', userLikeSchema);