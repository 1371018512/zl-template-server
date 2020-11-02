/* 
 * app.js 入口模块
 */
const express = require('express');
const routerArray = require('./router/router.js')
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();

// 公开指定目录，可以直接访问
// 如果第一个参数被省略，那么就可以直接访问
// app.use是任何请求都会触发的中间件
app.use('/public/', express.static('./public/'))

app.use(bodyParser.urlencoded({
	extended: false
}))
app.use(bodyParser.json())

app.use(cookieParser())

// 使用session
// 这里的session已经分装过了，自动给了sessionId
// 只要之前赋值过，用户就能在req.session中拿到值
app.use(session({
	// 这个是加密字符串，增加安全性
	secret: '12345',
	/* name: 'name',
	cookie: {
		maxAge: 60000
	}, */
	resave: false,
	// 无论是否使用session都分配sessionId
	saveUninitialized: true,
}));

// 方法1
//router_module1(app);

// 方法2
//app.use(router_module1);

// 方法3,遍历所有路由模块
routerArray.forEach(function(item, i) {
	app.use(item);
})

// 都没办法处理走这个
// 自定义中间件一定要走next哦
// 包括get、post在内的中间件如果不next就不会继续路由匹配
app.use('*', function(req, res) {
	var ans = {
		message: '404 not found',
	}
	res.status(404).send('404 not found...');
})

// 统一错误处理
// next中多了一个参数err,因此不会走404路由
app.use('*', function(err, req, res, next) {
	var ans = {
		message: err.data,
	}
	res.status(err.status).send(ans);
})

app.listen(3000, function() {
	console.log('app is running')
})
