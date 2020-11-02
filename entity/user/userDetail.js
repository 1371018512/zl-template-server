const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const connectedMongoose = require('../../crud/mongoDB.js');

const UserDetailSchema = Schema({
	uId: {
		type: Number,
		required: true,
	},
	introduction: {
		type: String,
	},
	edcation: {
		type: String,
	},
	base: {
		type: String,
	},
	sex: {
		type: Number,
		enum: [0, 1],
	},
	belikes: {
		type: Number,
		default: 0,
	},
	becollects: {
		type: Number,
		default: 0,
	},
	codePass: {
		type: Number,
		default: 0,
	},
	problemPass: {
		type: Number,
		default: 0,
	},
	highquiltyOutput: {
		type: Number,
		default: 0,
	},
	score: {
		type: Number,
		default: 0,
	},
	nickName: {
		type: String,
		required: true,
	},
	school: {
		type: String,
	},
	graduationYear: {
		type: Number,
	},
	direction: {
		type: String,
	},
	identity: {
		name: {
			type: String,
		},
		type: {
			type: String,
		}
	},
	userLevel: {
		type: Number,
	},
	profile: {
		type: String,
	},
	followIds: [{
		type: Number,
	}],
	fansIds: [{
		type: Number,
	}],
	circles: [{
		type: Number,
	}],
	newsInfo: {
		type: Boolean,
	}
})

module.exports = connectedMongoose.model('user_detail', UserDetailSchema);