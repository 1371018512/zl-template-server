/* 
 * module1.js 路由模块1
 */
var Greeter = require('../../entity/Greeter/Greeter.js').Greeter;
var express = require('express');
var router = express.Router();
var crud = require('../../crud/index.js');
var Greeter2 = require('../../entity/Greeter/Greeter2.js');
var fs = require('fs');

// 方式1，导出函数
/* module.exports = function (app) {
	// 路由，post的话就app.post
	app.get('/', function(req, res) {
		res.send('hello world');
	})
	
	app.post('/', function(req, res) {
		console.log(req.body)
		res.send(req.body);
	})
	
	app.get('/about', function(req, res) {
		// 打印req的参数
		console.log(req.query)
		console.log(new Greeter('zk','ss'))
		res.send('i am express');
	})
} */

// 方式2
// 这些内容都是中间件，可以使用next进行多次路由匹配
router.get('/', async function(req, res) {
	// cookie一定要在writeHead前，而且用了writeHead就只能用end了
	res.cookie('name', 'abc', {
		signed: false,
		maxAge: 20 * 1000,
		httpOnly: true
	});
	
	// 顺便测试一下跨域
	res.writeHead(200, {
		"Content-type": "text/plain; charset=utf-8",
		"Access-Control-Allow-Origin": "*", // * 代表允许所有的源访问
		"Access-Control-Allow-Methods": "GET, POST, PUT", // 对于除get外的方法需要特殊设置
		//"Access-Control-Allow-Credentials": true, // 默认为false，指让是否服务器接收预请求cookie
	})
	
	/* res.cookie('name', 'abc', {
		signed: false,
		maxAge: 20 * 1000,
		httpOnly: true
	}); */
	
	let ans = await crud.query('test', 1);
	
	// 前端准备一个getData函数，然后直接运行就完事了
	// res.end(`getData(${JSON.stringify(req.query)})`);
	res.end(JSON.stringify(ans));
})

// 传参
router.get('/nimade/:id', async function(req, res) {
	res.send(req.params.id);
})

router.post('/', function(req, res) {
	console.log(req.body)
	res.send(req.body);
})

// 测试接口
router.post('/user/login', function(req, res) {
	console.log('登录');
	var ans = {
		code: 20000,
		data: {
			token: 'admin-token',
		},
	}
	res.status(200).json(ans);
})

router.post('/user/logout', function(req, res) {
	console.log('登出');
	var ans = {
		code: 20000,
	}
	res.status(200).json(ans);
})
// 同是测试接口
router.post('/user/modifyProfile', function(req, res) {
	// 直接流读取,然后传输就可以了
	var ws = fs.createWriteStream("./public/index.png", { encoding: "binary" });
	req.pipe(ws);
	
	var ans = {
		code: 20000,
		data: req.body,
	}
	res.status(200).json(ans);
})

router.post('/register', function(req, res, next) {
	let body = req.body;

	Greeter2.findOne({
		// 这是只查重email
		//email: body.email,
		$or: [{
				email: body.email
			},
			{
				nickname: body.nickname
			},
		],
	}).then(
		(data) => {
			if (data) {
				next({
					status: 403,
					data: 'nickname or email already exists'
				})
				//res.status(403).send('nickname或email已经存在');
			} else {
				let newUser = new Greeter2(body);
				newUser.save().then((data2) => {
					// 我认为的设计是前端如果vuex里有role路由方面直接使用这个role
					// 有role的话前端必然已经登录
					// 如果没有role就使用缓存中的账号密码自动登录，然后获取这个role
					// 并且后端方面登录时session设置isLogin为true，其他所有接口都必须要isLogin为true才能使用
					req.session.isLogin = true;

					res.status(200).send('register successfully');
				}, (err2) => {
					next({
						status: 500,
						data: 'register failed: ' + err2
					})
				})
			}
		},
		(err) =>
		next({
			status: 500,
			data: 'database find failed: ' + err
		})
	)
})

router.get('/about', function(req, res) {
	// 打印req的参数
	console.log(req.query)
	console.log(new Greeter('zk', 'ss'))
	res.send('i am express');
})

module.exports = router;
