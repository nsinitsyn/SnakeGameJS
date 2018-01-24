$(function () {
	var canvas = new fabric.Canvas('gCanvas');

	var game = new snakes.GameEngine(canvas, $("#applesText:first"), function () {
		//alert("Game over");
	});
	game.start();

	var keyCodeActions = {
		37: game.moveLeft,
		38: game.moveUp,
		39: game.moveRight,
		40: game.moveDown,
		16: game.pauseOrContinue,
		32: game.switchImprovementSpeedMode
	};

	$(document).keydown(function (e) {
		var action = keyCodeActions[e.keyCode];
		if (action != undefined) {
			action();
			return false;
		}
	});
});