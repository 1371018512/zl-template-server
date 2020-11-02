/* 常用查询条件
 * $or　　　　或关系
 * $nor　　　　或关系取反
 * $gt　　　　大于
 * $gte　　　　大于等于
 * $lt　　　　小于
 * $lte　　　　小于等于
 * $ne　　　　不等于
 * $in　　　　在多个值范围内
 * $nin　　　　不在多个值范围内
 * $all　　　　匹配数组中多个值
 * $regex　　　　正则，用于模糊查询
 * $size　　　　匹配数组大小
 * $maxDistance　　　　范围查询，距离（基于LBS）
 * $mod　　　　取模运算
 * $near　　　　邻域查询，查询附近的位置（基于LBS）
 * $exists　　　　字段是否存在
 * $elemMatch　　　　匹配内数组内的元素
 * $within　　　　范围查询（基于LBS）
 * $box　　　　范围查询，矩形范围（基于LBS）
 * $center　　　　范围醒询，圆形范围（基于LBS）
 * $centerSphere　　　　范围查询，球形范围（基于LBS）
 * $slice　　　　查询字段集合中的元素（比如从第几个之后，第N到第M个元素
 */
/* 
 * 关于mongoDB的基本操作：
 * 以当前磁盘下的/data/db作为数据库 输入mongod开启服务
 * 再开一个cmd输入mongo连接服务，exit退出
 * 1.show dbs
 * 	查看当前所有数据库
 * 2.show collections
 * 	查看当前所有数据表
 * 3.use 数据库名称
 * 	切换到指定数据库，如果没有就新建
 * 4.db
 * 	查看当前操作的数据库
 * 5.db.数据表名.insertOne({"name":"zl"})
 * 6.db.数据表名.find()
 * 	返回所有数据
 * */
/* 
 * 实际项目中mongoDB的使用方法：
 * 1.使用npm上官方的mongodb包来操作
 * 2.使用npm上第三方mongoose包（其实它是对官方包的二次封装）来操作
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.set('useCreateIndex', true) //加上这个
// 这里建立了一个叫animal的数据库
mongoose.connect('mongodb://localhost/zl-template', { 
	useNewUrlParser: true,
	useUnifiedTopology: true,
	},
);
module.exports = mongoose;

/* const DogSchema = Schema({
	// 非必须
	name: String,
	// 必须
	sex: {
		type: String,
		required: true,
	},
})
const Dog = mongoose.model('Dog', DogSchema); */

// 这里是设计了一张表，叫cat,参数二就是他的结构,用于新增时取出冗余字段，要求必须字段
// 最终表的名字为cats
// 如果用于查询，model的结构与查询无关
/* const Cat = mongoose.model('Cat', { 
		// 非必须
		name: String,
		// 必须
		sex: {
			type: String,
			required: true,
		},
	},
); */
// 这里是持久化存储了一条记录
// 存储时只存结构中有的内容，多的内容被删去，少的内容不影响
/* const kitty = new Cat({ 
		name: 'zyms',
	}
); */
/* const gof = new Dog({
	name: 'zll',
	sex: 'man'
}) */

// 新增
/* kitty.save().then((data) => 
	console.log('ok' + data),
	(err) =>
		console.log('fail' + err)
); */

// 查询,第一个参数是条件， 第二个参数表示是否输出对应字段
// 如果第一个参数是复杂条件，那value使用对象并且添加条件：值这样的键值对
// 如Article.find({views : {$gte : 300 , $lte : 400}})
// 查询时与schema约束无关
// 还有findOne
/* Dog.find({
	},
	{
		'name': 0,
	},
).then((data) => 
		console.log(data),
	(err) => 
		console.log(err)
) */

// 删除 规则和查询一样
/* Cat.remove({
	name: 'Zildjian'
}).then((data) => 
		console.log(data),
	(err) => 
		console.log(err)
) */

// 改 findOneAndUpdate