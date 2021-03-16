const UserDetail = require('../entity/user/userDetail.js');
const userGrowHistory = require('../entity/user/userGrowHistory.js');

// 计算文章默认排序的权值
function getArtSortValue(art) {
	let value = art.views + art.likes * 10 + art.collects * 10;
	value /= Math.pow((((new Date() - art.lastModify) / 3600000) + 2), 1.1);
	return value;
}

function getCurrentDate(format, time) {
  var now = time || new Date();
  var year = now.getFullYear(); //得到年份
  var month = now.getMonth();//得到月份
  var date = now.getDate();//得到日期
  var day = now.getDay();//得到周几
  var hour = now.getHours();//得到小时
  var minu = now.getMinutes();//得到分钟
  var sec = now.getSeconds();//得到秒
  month = month + 1;
  if (month < 10) month = "0" + month;
  if (date < 10) date = "0" + date;
  if (hour < 10) hour = "0" + hour;
  if (minu < 10) minu = "0" + minu;
  if (sec < 10) sec = "0" + sec;
  var time = "";
  //精确到天
  if(format==1){
	time = year + "-" + month + "-" + date;
  }
  //精确到分
  else if(format==2){
	time = year + "-" + month + "-" + date+ " " + hour + ":" + minu + ":" + sec;
  }
  return time;
}

async function userGrow(uId, grow) {
	let newScore;
	await UserDetail.findOne({
		uId: uId
	}).then(async (u) => {
		newScore = u.score + grow;
		let newLevel;
		switch (true) {
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
		}, {
			$set: {
				score: newScore,
				userLevel: newLevel,
			}
		}).then((data) => {
			console.log('用户积分更新成功')
		})
	})
	userGrowHistory.findOne({
		uId: uId
	}).then((data) => {
		
		const history = data.history;
		const now = new Date();
		if (history.length && getCurrentDate(1) === getCurrentDate(1, history[history.length - 1].date)) {
			history[history.length - 1].increase = newScore;
		} else {
			history.push({
				date: now,
				increase: newScore,
			});
		}
		
		userGrowHistory.update({
			uId: uId
		}, {
			$set: {
				history: history
			}
		}).then((e) => {
			console.log(e)
		})
		
	})
	// UserDetail.update({
	// 	uId: uId
	// }, {
	// 	$inc: { scores: grow }
	// })
}

async function newMessage(uId, val) {
	await UserDetail.update({
		uId: uId
	}, {
		$set: {
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
