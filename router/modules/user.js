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
const ArtHistory = require('../../entity/user/artHistory.js')
const userGrowHistory = require('../../entity/user/userGrowHistory.js');

module.exports = router;

// login
router.post('/user/login', function(req, res, next) {
	console.log('登录');
	UserLogin.findOne({
		userName: req.body.username,
	}).then(
		(data) => {
			if(!data) {
				next({
					status: 200,
					data: '该用户未进行注册'
				})
			}else if(data.password != req.body.password) {
				next({
					status: 200,
					data: '密码输入错误'
				})
			}else {
				res.cookie('uId', data.uId, {
					signed: false,
					maxAge: 20 * 100000,
					httpOnly: true
				});
				let ans = {
					code: 20000,
					data: {
						token: 'admin-token',
						uId: data.uId,
					},
				}
				res.status(200).json(ans);
			}
		},
		(err) => 
			next({
				status: 500,
				data: 'database find failed: ' + err
			})
	)
})
// logout
router.post('/user/logout', function(req, res) {
	console.log('登出');
	var ans = {
		code: 20000,
	}
	res.status(200).json(ans);
})
// getInfo
router.get('/user/getInfo', function(req, res, next) {
	console.log('获取用户信息');
	UserDetail.findOne({
		uId: req.query.uId,
	}).then(
		(data) => {
			if(!data) {
				next({
					status: 200,
					data: '没有该用户信息'
				})
			}else {
				res.cookie('uId', data.uId, {
					signed: false,
					maxAge: 20 * 100000,
					httpOnly: true
				});
				let ans = {
					code: 20000,
					data: data,
				}
				res.status(200).json(ans);
			}
		},
		(err) => 
			next({
				status: 500,
				data: 'database find failed: ' + err
			})
	)
})

// getInfos
router.post('/user/getInfos', function(req, res, next) {
	console.log('获取多用户信息');
	UserDetail.find({
		uId: { $in: req.body },
	}).then(
		(data) => {
			let result = {};
			data.forEach((item) => {
				result[item.uId] = item;
			})
			let ans = {
				code: 20000,
				data: result,
			}
			res.status(200).json(ans);
		},
		(err) => 
			next({
				status: 500,
				data: 'database find failed: ' + err
			})
	)
})

// getinfosBysth
router.post('/user/getinfosBysth', function(req, res, next) {
	console.log('指定条件用户');
	let condition = {};
	condition[req.body.by] = -1; 
	UserDetail.find({
		uId: { $ne: req.body.uId  }
	}).sort(condition).limit(req.body.limit).then(
		(data) => {
			let ans = {
				code: 20000,
				data: data,
			}
			res.status(200).json(ans);
		},
		(err) => 
			next({
				status: 500,
				data: 'database find failed: ' + err
			})
	)
})

// 获取通知消息
router.post('/user/getInformation', function(req, res, next) {
	console.log('获取用户通知信息');
	Information.find({
		tId: req.body.tId,
	}).sort({ date: -1 }).then(
		(data) => {
			if(!data) {
				next({
					status: 200,
					data: '没有该用户信息'
				})
			}else {
				var ans = {
					code: 20000,
					data: data,
				}
				res.status(200).json(ans);
			}
		},
		(err) => 
			next({
				status: 500,
				data: 'database find failed: ' + err
			})
	)
})
// upload profile
router.post('/user/modifyProfile', function(req, res) {
	// 直接流读取,然后传输就可以了
	var ws = fs.createWriteStream("./public/profile/" + req.cookies['uId'] + ".png", { encoding: "binary" });
	req.pipe(ws);
	
	var ans = {
		code: 20000,
		data: req.body,
	}
	res.status(200).json(ans);
})
// 修改个人信息
router.post('/user/modifyInfo', function(req, res) {
	console.log('尝试修改个人信息')
	UserDetail.findOneAndUpdate({
		uId: req.body.uId
	}, req.body).then((data) => {
		var ans = {
			code: 20000,
			data: data,
		}
		res.status(200).json(ans);
	})
})
// getLikes
router.post('/user/getLikes', function(req, res, next) {
	console.log('查看个人喜好')
	UserLike.findOne({
		uId: req.body.uId
	}).then((data) => {
		var ans = {
			code: 20000,
			data: data,
		}
		res.status(200).json(ans);
	}, (err) => {
		console.log(err)
		next({
			status: 200,
			data: 'getLikes faild'
		})
	})
})

// artLike
router.post('/user/likeArt', function(req, res, next) {
	console.log('文章点赞')
	
	UserLike.findOne({
		uId: req.body.uId
	}).then(async (data) => {
		// 设置userLike
		let action = 0;
		if(data.artLikes.find((item) => {
			return item == req.body.aId
		})) {
			// 存在
			action = -1
			await UserLike.update({
				uId: req.body.uId
			}, { 
				$pull: { artLikes: req.body.aId },
			})
		} else {
			// 不存在
			action = 1
			await UserLike.update({
				uId: req.body.uId
			}, { 
				$push: { artLikes: req.body.aId },
			})
		}
		
		let tId;
		
		// 设置art的likes
		await Art.update({
			id: req.body.aId
		}, {
			$inc: { likes: action }
		}).then(async () => {
			await Art.findOne({
				id: req.body.aId
			}).then(async (art) => {
				tId = art.uId;
				await utils.userGrow(art.uId, 3 * action);
			})
		})
		
		// 产生information
		if(action == 1) {
			let newInformation = new Information({
				uId: req.body.uId,
				date: new Date(),
				type: 'like',
				artId: req.body.aId,
				tId: tId,
			});
			await newInformation.save().then((info) => {
				console.log('消息产生')
			});
			await utils.newMessage(tId, true);
		}else {
			await Information.remove({
				uId: req.body.uId,
				artId: req.body.aId,
			}).then(() => {
				console.log('删除消息')
			})
		}
		
		
		var ans = {
			code: 20000,
			data: action,
		}
		res.status(200).json(ans);
	}, (err) => {
		console.log(err)
		next({
			status: 200,
			data: 'getLikes faild'
		})
	})
})

// artLike
router.post('/user/likeComment', function(req, res, next) {
	console.log('评论点赞')
	
	UserLike.findOne({
		uId: req.body.uId
	}).then(async (data) => {
		// 设置userLike
		let action = 0;
		if(data.commentLikes.find((item) => {
			return item == req.body.cId
		})) {
			// 存在
			action = -1
			await UserLike.update({
				uId: req.body.uId
			}, { 
				$pull: { commentLikes: req.body.cId },
			})
		} else {
			// 不存在
			action = 1
			await UserLike.update({
				uId: req.body.uId
			}, { 
				$push: { commentLikes: req.body.cId },
			})
		}
		
		let tId;
		let artId;
		// 设置comment的likes
		await Comment.update({
			id: req.body.cId
		}, {
			$inc: { likes: action }
		}).then(async () => {
			await Comment.findOne({
				id: req.body.cId
			}).then(async (com) => {
				tId = com.uId;
				artId = com.ArtId;
				await utils.userGrow(com.uId, 3 * action);
			})
		})
		
		// 产生information
		if(action == 1) {
			let newInformation = new Information({
				uId: req.body.uId,
				date: new Date(),
				type: 'like',
				commentId: req.body.cId,
				artId: artId,
				tId: tId,
			});
			await newInformation.save().then((info) => {
				console.log('消息产生')
			}, (err) => {
				console.log(err);
			});
			
			await utils.newMessage(tId, true);
		}else {
			await Information.remove({
				uId: req.body.uId,
				commentId: req.body.cId,
			}).then(() => {
				console.log('删除消息')
			})
		}
		
		var ans = {
			code: 20000,
			data: action,
		}
		res.status(200).json(ans);
	}, (err) => {
		console.log(err)
		next({
			status: 200,
			data: 'getLikes faild'
		})
	})
})

// 提交文章浏览记录
router.post('/user/submitArtHistory', async function(req, res, next) {
	console.log('提交文章浏览记录')
	
	//增加浏览量
	await Art.update({
		id: req.body.artId
	}, {
		$inc: {
			views: 1,
		}
	})
	await ArtHistory.findOne({
		uId: req.body.uId
	}).then(async (data) => {
		data = data.history;
		let index = data.findIndex((item) => {
			return item.artId == req.body.artId;
		})
		if(index >= 0){
			data.splice(index, 1);
			await ArtHistory.update({
				uId: req.body.uId
			}, { 
				$set: {
					history: data
				}
			})
		}else if(data.length > 4) {
			// 只保存五条记录
			data = data.slice(1);
			await ArtHistory.update({
				uId: req.body.uId
			}, { 
				$set: {
					history: data
				}
			})
		}
	})
	await ArtHistory.update({
		uId: req.body.uId
	}, { 
		$push: { history: {
			title: req.body.title,
			artId: req.body.artId,
			date: new Date(),
			uId: req.body.authorId,
		} },
	}).then((data) => {
		let ans = {
			code: 20000,
			data: data,
		}
		res.status(200).json(ans);
	})
})

// 拿取到文章浏览记录
router.post('/user/getArtHistory', async function(req, res, next) {
	console.log('拿取到文章浏览记录')
	await ArtHistory.findOne({
		uId: req.body.uId
	}).then(async (data) => {
		data = data.history;
		data.reverse();
		let ans = {
			code: 20000,
			data: data,
		}
		res.status(200).json(ans);
	})
})

// follow
router.post('/user/follow', function(req, res, next) {
	console.log('关注操作')
	
	UserDetail.findOne({
		uId: req.body.uId
	}).then(async (data) => {
		// 设置userLike
		let action = 0;
		if(data.followIds.find((item) => {
			return item == req.body.tId
		})) {
			// 存在
			action = -1
			await UserDetail.update({
				uId: req.body.uId
			}, { 
				$pull: { followIds: req.body.tId },
			})
			await UserDetail.update({
				uId: req.body.tId
			}, { 
				$pull: { fansIds: req.body.uId },
			})
		} else {
			// 不存在
			action = 1
			await UserDetail.update({
				uId: req.body.uId
			}, { 
				$push: { followIds: req.body.tId },
			})
			await UserDetail.update({
				uId: req.body.tId
			}, { 
				$push: { fansIds: req.body.uId },
			})
			// 解除拉黑
			await UserDetail.update({
				uId: req.body.uId
			}, { 
				$pull: { hateIds: req.body.tId },
			})
		}
		
		// 产生information
		if(action == 1) {
			let newInformation = new Information({
				uId: req.body.uId,
				date: new Date(),
				type: 'follow',
				tId: req.body.tId,
			});
			await newInformation.save().then((info) => {
				console.log('消息产生')
			});
			await utils.newMessage(req.body.tId, true);
		}else {
			await Information.remove({
				uId: req.body.uId,
				tId: req.body.tId,
			}).then(() => {
				console.log('删除消息')
			})
		}
		
		
		var ans = {
			code: 20000,
			data: action,
		}
		res.status(200).json(ans);
	}, (err) => {
		console.log(err)
		next({
			status: 200,
			data: 'Like faild'
		})
	})
})

// hate
router.post('/user/hate', function(req, res, next) {
	console.log('拉黑操作')
	
	UserDetail.findOne({
		uId: req.body.uId
	}).then(async (data) => {
		// 设置userLike
		let action = 0;
		if(data.hateIds.find((item) => {
			return item == req.body.tId
		})) {
			// 存在
			action = -1
			await UserDetail.update({
				uId: req.body.uId
			}, { 
				$pull: { hateIds: req.body.tId },
			})
		} else {
			// 不存在
			action = 1
			await UserDetail.update({
				uId: req.body.uId
			}, { 
				$push: { hateIds: req.body.tId },
			})
			// 解除关注
			await UserDetail.update({
				uId: req.body.uId
			}, { 
				$pull: { followIds: req.body.tId },
			})
		}
		
		var ans = {
			code: 20000,
			data: action,
		}
		res.status(200).json(ans);
	}, (err) => {
		console.log(err)
		next({
			status: 200,
			data: 'hate faild'
		})
	})
})
// getUserGrowHistor
router.post('/user/getUserGrowHistory', function(req, res, next) {
	console.log('查询成就值历史')
	
	userGrowHistory.findOne({
		uId: req.body.uId
	}).then((data) => {
		var ans = {
			code: 20000,
			data: data.history,
		}
		res.status(200).json(ans);
	}, (err) => {
		console.log(err)
		next({
			status: 200,
			data: '成就值查询失败'
		})
	})
	
})