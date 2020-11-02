const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const connectedMongoose = require('../../crud/mongoDB.js');
const autoIncrement = require('mongoose-auto-increment-fix');

autoIncrement.initialize(connectedMongoose);

const BlinkSchema = Schema({
	id: {
		type: Number,
	},
	uId: {
		type: Number,
		required: true,
	},
	content: {
		type: String,
	},
	date: {
		type: Date,
		default: new Date(),
	},
	likes: {
		type: Number,
		default: 0,
	},
	commentIds: [{
		type: Number,
	}],
})

BlinkSchema.plugin(autoIncrement.plugin, {
    model: 'blink',
    field: 'id',
    startAt: 1,
    incrementBy: 1
});

module.exports = connectedMongoose.model('blink', BlinkSchema);