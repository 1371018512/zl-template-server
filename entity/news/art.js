const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const connectedMongoose = require('../../crud/mongoDB.js');
const autoIncrement = require('mongoose-auto-increment-fix');

autoIncrement.initialize(connectedMongoose);

const ArtSchema = Schema({
	id: {
		type: Number,
		required: true,
	},
	uId: {
		type: Number,
		required: true,
	},
	title: {
		type: String,
	},
	content: {
		type: String,
	},
	tag: [{
		type: String,
	}],
	topic: [{
		type: String,
	}],
	date: {
		type: Date,
	},
	lastModify: {
		type: Date,
	},
	lastComment: {
		type: Date,
	},
	likes: {
		type: Number,
		default: 0,
	},
	collects: {
		type: Number,
		default: 0,
	},
	views: {
		type: Number,
		default: 0,
	},
	commentIds: [{
		type: Number,
	}],
})


ArtSchema.plugin(autoIncrement.plugin, {
    model: 'art',
    field: 'id',
    startAt: 1,
    incrementBy: 1
});


module.exports = connectedMongoose.model('art', ArtSchema);