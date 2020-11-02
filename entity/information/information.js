const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const connectedMongoose = require('../../crud/mongoDB.js');
const autoIncrement = require('mongoose-auto-increment-fix');

autoIncrement.initialize(connectedMongoose);

const InformationSchema = Schema({
	id: {
		type: Number,
		required: true,
	},
	uId: {
		type: Number,
	},
	content: {
		type: String,
		default: '',
	},
	date: {
		type: Date,
		// 这个不行，是服务器开始的时候开始算的
		default: new Date(),
	},
	tContent: {
		type: String,
	},
	tId: {
		type: Number,
		required: true,
	},
	type: {
		type: String,
		required: true,
		// normal、comment、like、follow
	},
	artId: {
		type: Number,
		default: -1,
	},
	blinkId: {
		type: Number,
		default: -1,
	},
	commentId: {
		type: Number,
		default: -1,
	},
})

InformationSchema.plugin(autoIncrement.plugin, {
    model: 'information',
    field: 'id',
    startAt: 1,
    incrementBy: 1
});

module.exports = connectedMongoose.model('information', InformationSchema);