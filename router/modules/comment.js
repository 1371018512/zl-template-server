const express = require('express');
const router = express.Router();
const fs = require('fs');
const Art = require('../../entity/news/art.js');
const Comment = require('../../entity/comment/comment.js');
const UserDetail = require('../../entity/user/userDetail.js');
const Information = require('../../entity/information/information.js')
const utils =  require('../../utils/index.js');

module.exports = router;

// submitComment
router.post('/comment/submitComment', function(req, res, next) {
	console.log('上传Comment');
	console.log(req.body);
	let newComment = new Comment(req.body);
	newComment.save().then(async (data) => {
		// 一级评论
		// 没妈的
		let tId;
		if(!req.body.motherId) {
			await Comment.update({
				id: data.id
			}, {
				$set:{ motherId: data.id }
			})
			
			// 文章commentIds添加元素
			await Art.update({
				id: data.ArtId
			}, { 
				$push: { commentIds: data.id },
				$set: { lastComment: new Date() }
			})
		}else {
		// 有妈的
			await Comment.update({
				id: data.id
			}, {
				$set:{ motherId: req.body.motherId }
			})
			// 父评论中recommentIds添加元素
			await Comment.update({
				id: data.motherId
			}, {
				$push: { recommentIds: data.id },
			})
			
		}
		
		
		// 产生information
		let newInformation = new Information({
			uId: req.body.uId,
			date: new Date(),
			type: 'comment',
			artId: req.body.ArtId,
			content: req.body.content,
			tContent: req.body.tContent,
			tId: req.body.tId,
		});
		await newInformation.save().then((info) => {
			console.log('消息产生')
		}, (err) => {
			console.log(err);
		});
		
		await utils.newMessage(req.body.tId, true);
		
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

// getComments
router.post('/comment/getComments', function(req, res, next) {
	console.log('查询Comments');
	
	Comment.find({
		id: {
			$in: req.body.commentIds
		}
	}).then(async (comments) => {
		// 追加二级评论
		comments = await Promise.all(comments.map(async (ite, ind) => {
			//ite就是单个一级com
			let recomments = await Promise.all(ite.recommentIds.map(async (it,inde) => {
				//it是二级com的id
				let Recomment = {};
				// 找所有的二级评论
				await Comment.findOne({
					id: it
				}).then((recomment) => {
					Recomment = recomment;
				})
				
				//找二级评论的作者和target
				// 找出user
				let user = {};
				await UserDetail.findOne({
					uId: Recomment.uId
				}).then((u) => {
					user = u;
				})
				// 找出target
				let target = {};
				await UserDetail.findOne({
					uId: Recomment.tId
				}).then((t) => {
					target = t;
				})
				
				Recomment = {
					recomment: Recomment,
					user: user,
					target: target
				}
				
				return Recomment;
			}))
			
			// 找出user
			let user = {};
			await UserDetail.findOne({
				uId: ite.uId
			}).then((u) => {
				user = u;
			})
			// 找出target
			let target = {};
			await UserDetail.findOne({
				uId: ite.tId
			}).then((t) => {
				target = t;
			})
			
			return {
				comment: ite,
				target: target, 
				user: user,
				recomments: recomments,
			}
		}))
		
		// 按时间最近排序
		if(req.body.sort == 'time') {
			comments = comments.reverse();
		}
		
		// 按点赞数排序
		if(req.body.sort == 'like') {
			comments.sort((a, b) => {
				return b.comment.likes - a.comment.likes;
			})
		}
		
		var ans = {
			code: 20000,
			data: comments,
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