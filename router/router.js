const moduleArray = [];

//moduleArray.push(require('./modules/moduleTest.js'));
moduleArray.push(require('./modules/user.js'));
moduleArray.push(require('./modules/art.js'));
moduleArray.push(require('./modules/comment.js'));
moduleArray.push(require('./modules/info.js'));
moduleArray.push(require('./modules/talk.js'));

module.exports = moduleArray;

