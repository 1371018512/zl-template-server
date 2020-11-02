const express = require('express');
const router = express.Router();
const fs = require('fs');
const Blink = require('../../entity/news/blink.js');
const Art = require('../../entity/news/art.js');
const utils =  require('../../utils/index.js');
const Comment = require('../../entity/comment/comment.js');
const UserDetail = require('../../entity/user/userDetail.js');

module.exports = router;

// submitArt
router.post('/art/submitArt', function(req, res, next) {
	console.log('上传Art');
	
	let newArt = new Art(req.body);
	console.log(newArt)
	newArt.save().then((data) => {
		var ans = {
			code: 20000,
			data: data,
		}
		res.status(200).json(ans);
	}, (err) => {
		console.log(err)
		next({
			status: 200,
			data: 'art save faild'
		})
	})
})

// getBlinks
router.post('/art/getBlinks', async function(req, res, next) {
	console.log('查询Blink');
	
	let query = { title: { $in: null }, uId: { $in: req.body } };
	
	Art.find(query).then(async(data) => {
		
		// 使用js进行排序
		/* data.sort(function(a, b) {
			// 默认加权排序
			if(!req.body.sort) {
				return utils.getArtSortValue(b) - utils.getArtSortValue(a);
			}
			// 最新发布
			else if(req.body.sort == 'publish') {
				return b.lastModify - a.lastModify;
			} else {
				return b.lastComment - a.lastComment;
			}
		}) */
		
		// 添加作者信息
		let arr = await Promise.all(data.map(async (item, i) => {
			let User = {};
			await UserDetail.findOne({
				uId: item.uId
			}).then((user) => {
				User = user;
			})
			
			return { 
				art: item,
				user: User,
				date: item.date,
			};
		}))
				
		var ans = {
			code: 20000,
			data: arr,
		}
		res.status(200).json(ans);
	}, (err) => {
		console.log(err)
		next({
			status: 200,
			data: 'art query faild'
		})
	})
})

// getArts
router.post('/art/getArts', async function(req, res, next) {
	console.log('查询Art');
	// 仅返回一篇的情况
	
	if(req.body.aId) {
		await Art.findOne({ 
			id: req.body.aId,
			// 排除blink
			title: {$ne:null}
		})
			.then((data) => {
				var ans = {
					code: 20000,
					data: data,
				}
				res.status(200).json(ans);
			})
		return;
	}
	// 排除blink
	let query = { title: {$ne:null} };
	
	if(req.body.topic) {
		query.topic = req.body.topic;
	}
	
	if(req.body.uId) {
		query.uId = req.body.uId;
	}
	
	Art.find(query).then(async(data) => {
		
		// 使用js进行排序
		data.sort(function(a, b) {
			// 默认加权排序
			if(!req.body.sort) {
				return utils.getArtSortValue(b) - utils.getArtSortValue(a);
			}
			// 最新发布
			else if(req.body.sort == 'publish') {
				return b.lastModify - a.lastModify;
			} else {
				return b.lastComment - a.lastComment;
			}
		})
		
		// 添加作者信息
		let arr = await Promise.all(data.map(async (item, i) => {
			let User = {};
			await UserDetail.findOne({
				uId: item.uId
			}).then((user) => {
				User = user;
			})
			
			return { 
				art: item,
				user: User,
				date: item.date,
			};
		}))
				
		var ans = {
			code: 20000,
			data: arr,
		}
		res.status(200).json(ans);
	}, (err) => {
		console.log(err)
		next({
			status: 200,
			data: 'art query faild'
		})
	})
})

// getArtsIcomment
router.post('/art/getArtsIcomment', function(req, res, next) {
	console.log('查询我评论过的Art');
	
	let arts = [];
	
	Comment.find({
		uId: req.body.uId,
	}).then(async (data) => {
		// item是每一条评论
		let m = new Map();
		data.forEach((item) => {
			if(m.has(item.ArtId)) {
				if(m.get(item.ArtId).date < item.date) {
					m.set(item.ArtId,item);
				}
			} else {
				m.set(item.ArtId,item);
			}
		})
		data = [];
		m.forEach((item) => {
			data.push(item);
		})
		data = await Promise.all(data.map(async (item) => {
			let arti;
			await Art.findOne({
				title: {$ne:null},
				id: item.ArtId
			}).then((art) => {
				arti = art;
			}, (err) => {
				console.log(err)
				next({
					status: 200,
					data: 'art query faild'
				})
			})
			
			return {
				art: arti,
				comment: item
			};
		}))
		
		data = data.filter((item) => {
			return item.art;
		})
		
		data.sort(function(a, b) {
			return b.art.lastComment - a.art.lastComment;
		})
		
		// 增加作者信息
		data = await Promise.all(data.map(async (item, i) => {
			let User = {};
			console.log(item)
			await UserDetail.findOne({
				uId: item.art.uId
			}).then((user) => {
				User = user;
			})
			
			return { 
				art: item.art,
				user: User,
				comment: item.comment,
				content: item.content,
			};
		}))
		
		var ans = {
			code: 20000,
			data: data,
		}
		res.status(200).json(ans);
	}, (err) => {
		console.log(err)
		next({
			status: 200,
			data: 'comment query faild'
		})
	})
})




