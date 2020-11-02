const express = require('express');
const router = express.Router();
const fs = require('fs');
const Blink = require('../../entity/news/blink.js');
const Art = require('../../entity/news/art.js');
const utils = require('../../utils/index.js');
const Comment = require('../../entity/comment/comment.js');
const UserDetail = require('../../entity/user/userDetail.js');

module.exports = router;

// 获得like通知信息
router.post('/info/oldInfo', async function(req, res, next) {
	console.log('消息已读');
	await utils.newMessage(req.body.uId, false);
	ans = {
		code: 20000,
		data: '完成查看',
	}
	res.status(200).json(ans);
})

// 获得like通知信息
router.post('/info/getLikeInfo', async function(req, res, next) {
	console.log('获取like信息');

	let arr = req.body;
	let ans = [];
	let userMap = new Map();
	let artMap = new Map();
	// user
	for (let i = 0; i < arr.length; i++) {
		let item = arr[i];
		ans.push({ id: item.id });
		ans[i].date = item.date;
		if(userMap.has(item.uId)) {
			ans[i].user = userMap.get(item.uId);
			continue;
		}
		await UserDetail.findOne({
			uId: item.uId,
		}).then((data) => {
				userMap.set(item.uId, data);
				ans[i].user = data;
			}, (err) =>
			next({
				status: 500,
				data: 'database find failed: ' + err
			}))
	}
	//art
	for (let i = 0; i < arr.length; i++) {
		let item = arr[i];
		if(artMap.has(item.artId)) {
			ans[i].art = artMap.get(item.artId);
		}
		else await Art.findOne({
			id: item.artId,
		}).then((data) => {
				artMap.set(item.artId, data);
				ans[i].art = data;
			}, (err) =>
			next({
				status: 500,
				data: 'database find failed: ' + err
			}))
		if(item.commentId > 0) {
			//
		}
		else if(ans[i].art.title) {
			ans[i].content = '我的帖子: ' + ans[i].art.title;
		}else {
			ans[i].content = '我的动态: ' + ans[i].art.content;
		}
	}
	//comment
	for (let i = 0; i < arr.length; i++) {
		let item = arr[i];
		if(item.commentId == -1) continue;
		await Comment.findOne({
			id: item.commentId,
		}).then((data) => {
				ans[i].content = '我的回复: ' + data.content;
			}, (err) =>
			next({
				status: 500,
				data: 'database find failed: ' + err
			}))
	}
	ans = {
		code: 20000,
		data: ans,
	}
	res.status(200).json(ans);
})

// 获得comment通知信息
router.post('/info/getCommentInfo', async function(req, res, next) {
	console.log('获取comment信息');

	let arr = req.body;
	let ans = [];
	let userMap = new Map();
	let artMap = new Map();
	// user
	for (let i = 0; i < arr.length; i++) {
		let item = arr[i];
		ans.push({ id: item.id });
		ans[i].date = item.date;
		if(userMap.has(item.uId)) {
			ans[i].user = userMap.get(item.uId);
			continue;
		}
		await UserDetail.findOne({
			uId: item.uId,
		}).then((data) => {
				userMap.set(item.uId, data);
				ans[i].user = data;
			}, (err) =>
			next({
				status: 500,
				data: 'database find failed: ' + err
			}))
	}
	//art
	for (let i = 0; i < arr.length; i++) {
		let item = arr[i];
		if(artMap.has(item.artId)) {
			ans[i].art = artMap.get(item.artId);
		}
		else await Art.findOne({
			id: item.artId,
		}).then((data) => {
				artMap.set(item.artId, data);
				ans[i].art = data;
			}, (err) =>
			next({
				status: 500,
				data: 'database find failed: ' + err
			}))
		ans[i].content = item.content;
		ans[i].tContent = item.tContent
	}
	
	ans = {
		code: 20000,
		data: ans,
	}
	res.status(200).json(ans);
})