/*
 * todo:实体类也应该模块化
 *
 */
var Greeter = /** @class */ (function () {
    function Greeter(message) {
        this.message = message;
        this.greeting = message;
    }
    Greeter.prototype.greet = function () {
        return "Hello, " + this.greeting;
    }; 
    return Greeter;
}());

module.exports = {
	Greeter: Greeter
}
