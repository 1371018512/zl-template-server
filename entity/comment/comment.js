const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const connectedMongoose = require('../../crud/mongoDB.js');
const autoIncrement = require('mongoose-auto-increment-fix');

autoIncrement.initialize(connectedMongoose);

const CommentSchema = Schema({
	id: {
		type: Number,
		required: true,
	},
	uId: {
		type: Number,
		required: true,
	},
	tId: {
		type: Number,
		required: true,
	},
	content: {
		type: String,
	},
	date: {
		type: Date,
		// 这个不行，是服务器开始的时候开始算的
		default: new Date(),
	},
	likes: {
		type: Number,
		default: 0,
	},
	recommentIds: [{
		type: Number
	}],
	motherId: {
		type: Number,
		//required: true,
	},
	ArtId: {
		type: Number,
		default: -1,
	},
})

CommentSchema.plugin(autoIncrement.plugin, {
    model: 'comment',
    field: 'id',
    startAt: 1,
    incrementBy: 1
});

module.exports = connectedMongoose.model('comment', CommentSchema);