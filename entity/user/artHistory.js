const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const connectedMongoose = require('../../crud/mongoDB.js');

const ArtHistorySchema = Schema({
	uId: {
		type: Number,
		required: true,
	},
	history: [{
		//date
		//artId
		//title
	}],
})

module.exports = connectedMongoose.model('art_history', ArtHistorySchema);