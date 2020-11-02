 const mysql = require('mysql')
// 2.创建mysql的连接对象
const conn = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '123456',
	database: 'st'
})

async function query(table, id) {
	if(table === null) {
		return '请指定查询表表名'
	}
	let sql = `SELECT * FROM ${ table } `;
	if(id) {
		sql += `WHERE id = ${ id }`
	}
	let ans = await new Promise(function(resolve,reject) {
		conn.query(sql, (err, result) => {
			if (err) reject('获取数据失败' + err.message)
			resolve(result)
		})
	})
	return ans ;
}

module.exports = {
	query: query,
}

// 届时router中的回调也得修改成异步函数
// 我的策略是将其变为async函数来得到同步的结果
// 教学上的方法是通过传入回调，让回调来收尾工作

/* query('test',1).then(function(data){
	console.log(data)
	// ...对数据或者报错进行处理
}) */
