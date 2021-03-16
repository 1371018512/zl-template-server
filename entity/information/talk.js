const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const connectedMongoose = require('../../crud/mongoDB.js');


const TalkSchema = Schema({
	uId: {
		type: Number,
		required: true,
	},
	tId: {
		type: Number,
		required: true,
	},
	messages: [{
		/* 
		 uId
		 date
		 content
		 refused
		 */
	}],
	lastMessage: {
		type: String,
		default: ''
	},
	readto: {
		type: Number,
		default: 0,
	}
})


module.exports = connectedMongoose.model('talk', TalkSchema);