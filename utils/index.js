const UserDetail = require('../entity/user/userDetail.js');

// 计算文章默认排序的权值
function getArtSortValue(art) {
	let value = art.views + art.likes * 10 + art.collects * 10;
	value /= Math.pow((((new Date() - art.lastModify) / 3600000) + 2), 1.1);
	return value;
}

async function userGrow(uId, grow) {
	await UserDetail.findOne({
		uId: uId
	}).then(async (u) => {
		let newScore = u.score + grow;
		let newLevel;
		switch(true) {
			case newScore < 100: 
				newLevel = 0;
				break;
			case newScore < 300:
				newLevel = 1;
				break;
			case newScore < 700:
				newLevel = 2;
				break;
			case newScore < 1500:
				newLevel = 3;
				break;
			case newScore < 3000:
				newLevel = 4;
				break;
			case newScore < 5700:
				newLevel = 5;
				break;
			case newScore < 10600:
				newLevel = 6;
				break;
			default:
				newLevel = 7;
				break;
		}
		await UserDetail.update({
			uId: uId
		},{
			$set:{
				score: newScore,
				userLevel: newLevel,
			}
		}).then((data) => {
			console.log('用户积分更新成功')
		})
	})
	UserDetail.update({
		uId: uId
	}, {
		$inc: { scores: grow }
	})
}

async function newMessage(uId, val) {
	await UserDetail.update({
		uId: uId
	},{
		$set:{
			newsInfo: val,
		}
	}).then((data) => {
		console.log('用户消息查看状态更新成功')
	})
}

module.exports = {
	getArtSortValue,
	userGrow,
	newMessage
}
