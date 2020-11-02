const express = require('express');
const router = express.Router();
const fs = require('fs');
const UserLogin = require('../../entity/user/userLogin.js');
const UserDetail = require('../../entity/user/userDetail.js');
const UserLike = require('../../entity/user/userLike.js');
const Art = require('../../entity/news/art.js');
const utils =  require('../../utils/index.js');
const Comment = require('../../entity/comment/comment.js');
const Information = require('../../entity/information/information.js')
const Talk = require('../../entity/information/talk.js')

var Server = require('ws').Server;
// 定义websocket服务器
const wsServer = new Server({ port: 8085 });

// 定义连接到的websocket集合
let socketSet = {};

// 连接
wsServer.on('connection', (websocket, req) => {
	socketSet[req.url.slice(1)] = websocket
	console.log(req.url.slice(1))
});

// 定时2s发送消息
/* setInterval(() => {
	let keys = Object.keys(socketSet);
	for(let i = 0;i < keys.length; i ++) {
		if(socketSet[keys[i]].readyState == 1) {
			socketSet[keys[i]].send(JSON.stringify({
                message: 999
            }))
		} else {
			delete socketSet[keys[i]];
		}
	}
}, 2000) */

module.exports = router;

// 拿到或者创建talk
router.post('/talk/getTalk', async function(req, res, next) {
	if(req.body.uId == req.body.tId) {
		res.status(200).json({
			code: 20000,
			data: '',
		});
		return;
	}
	// 拿到所有的talks
	if(!req.body.tId) {
		await Talk.find({
			uId: req.body.uId,
		}).then((data) => {
			let ans = {
				code: 20000,
				data: data,
			}
			res.status(200).json(ans);
		})
		return;
	}
	
	await Talk.findOne({
		uId: req.body.uId,
		tId: req.body.tId
	}).then(async (data) => {
		// 看对方有没有对话记录，没有新增
		// 这里其实不必了，因为发送的时候必然会新增对方的聊天
		/* await Talk.findOne({
			tId: req.body.uId,
			uId: req.body.tId,
		}).then(async (data) => {
			if(!data) {
				let newTalk2 = new Talk({
					tId: req.body.uId,
					uId: req.body.tId,
					messages: [],
				})
				await newTalk2.save()
			}
		}) */
		if(data) {
			if(req.body.read)
				await Talk.update({
					uId: req.body.uId,
					tId: req.body.tId
				},{
					$set: { readto: data.messages.length },
				})
			let ans = {
				code: 20000,
				data: data,
			}
			res.status(200).json(ans);
		}else {
			// 我方没对话记录
			let newTalk = new Talk({
				uId: req.body.uId,
				tId: req.body.tId,
				messages: [],
			})
			
			await newTalk.save().then((data) => {
				let ans = {
					code: 20000,
					data: data,
				}
				res.status(200).json(ans);
			});
		}
	})
	
	
})

// 提交talk
router.post('/talk/submitTalk', async function(req, res, next) {
	if(req.body.uId == req.body.tId) {
		res.status(200).json({
			code: 20000,
			data: '',
		});
		return;
	}
	await Talk.update({
		uId: req.body.uId,
		tId: req.body.tId,
	}, { 
		$push: { messages: {
			uId: req.body.uId,
			content: req.body.content,
			date: new Date(),
		} },
		$set: {
			lastMessage: req.body.content,
		},
		$inc: {
			readto: 1
		}
	})
	//对方可能把对话删了
	await Talk.findOne({
		tId: req.body.uId,
		uId: req.body.tId,
	}).then(async (data) => {
		if(!data) {
			let newTalk = new Talk({
				tId: req.body.uId,
				uId: req.body.tId,
				messages: [],
			})
			await newTalk.save()
		}
	})
	
	await Talk.update({
		tId: req.body.uId,
		uId: req.body.tId,
	}, { 
		$push: { messages: {
			uId: req.body.uId,
			content: req.body.content,
			date: new Date(),
		} },
		$set: {
			lastMessage: req.body.content,
		},
	})
	
	if(socketSet[req.body.tId]) {
		if(socketSet[req.body.tId].readyState == 1) {
			socketSet[req.body.tId].send(JSON.stringify({
				uId: req.body.uId,
				content: req.body.content,
				date: new Date(),
			}))
		} else {
			delete socketSet[req.body.tId];
		}
	}
	
	let ans = {
		code: 20000,
		data: '',
	}
	res.status(200).json(ans);
})

// 全部阅读talk
router.post('/talk/readAll', async function(req, res, next) {
	await Talk.find({
		uId: req.body.uId,
	}).then(async(data) => {
		for(let i = 0;i < data.length;i ++) {
			let item = data[i];
			let temp = item.messages.length;
			await Talk.update({
				uId: req.body.uId,
				tId: item.tId
			}, {
				$set: {
					readto: temp,
				}
			})
		}
	})
	
	let ans = {
		code: 20000,
		data: '',
	}
	res.status(200).json(ans);
})

// 删除talk
router.post('/talk/deleteTalk', async function(req, res, next) {
	await Talk.remove({
		uId: req.body.uId,
		tId: req.body.tId
	}).then(async(data) => {
		let ans = {
			code: 20000,
			data: '',
		}
		res.status(200).json(ans);
	})
})