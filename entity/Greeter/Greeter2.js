const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const connectedMongoose = require('../../crud/mongoDB.js');

const GreeterSchema = Schema({
	email: {
		type: String,
		required: true,
	},
	nickname: {
		type: String,
		required: true, 
	},
	password: {
		type: String,
		required: true,
	},
	created: {
		type: Date,
		default: function(){
			return new Date();
		},
	},
	avatar: {
		type: String,
		default: '',
	},
	gender: {
		type: String,
		enum: ['man', 'woman', 'secret'],
		default: 'secret',
	},
	birthday: {
		type: Date,
		default: new Date('1990/1/1'),
	},
	role: {
		type: String,
		enum: ['user','admin'],
		default: 'user',
	}
})

module.exports = connectedMongoose.model('Greeter', GreeterSchema);