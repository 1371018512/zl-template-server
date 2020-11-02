var WebSocketServer = require('ws').Server,
wss = new WebSocketServer({ port: 8181 });//服务端口8181

var exp;
wss.on('connection', function (ws) {
    console.log('服务端websocket就绪');
	var sendSpeedUpdates = function () {
		var speedObj = {
			name: 'zl',
		};
		ws.send(JSON.stringify(speedObj)); //需要将对象转成字符串。WebSocket只支持文本和二进制数据,推送消息
		console.log("服务器：更新数据", JSON.stringify(speedObj));
	}
	
	exp = sendSpeedUpdates();
	//每三秒发送一次
	/* var clientSpeedUpdater = setInterval(function () {
		sendSpeedUpdates(ws);
	}, 10000); */
    /* ws.on('message', function (message) {
        //打印客户端监听的消息
        console.log(message);
    }); */
});

setInterval(function() {
	exp();
} ,3000);