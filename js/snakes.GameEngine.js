var snakes = snakes || {};

snakes.GameEngine = function(canvas, gameInfoElement, endGameCallback) {

	var self = {};

	// private:
	var movingIntervalId;
	var speedIndex = 0;
	var speeds = [100, 80, 50, 30, 15];
	var isPause = false;
	var gameHasFinished = false;

	var render = function() {
    	/* перерисовываем змею и яблоко */

		renderGameInfo();

    	canvas.clear();
    	for (var i = 0; i < model.snake.length; i++) {
    		var coord = model.snake[i];
			var color = 'red';
    		if(i == 0) {
    			color = 'blue';
    		}
			addRect(coord.y * snakes.common.CAGE_SIZE, coord.x * snakes.common.CAGE_SIZE, color);
    	}
		addRect(model.apple.y * snakes.common.CAGE_SIZE, model.apple.x * snakes.common.CAGE_SIZE, 'green');
	};

	var renderGameInfo = function() {
		var text = "Яблоки: " + model.apples;
		text += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Скорость: " + (speedIndex + 1);
		if(isPause) {
			text += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Пауза";
		}
		$(gameInfoElement).empty();
    	$(gameInfoElement).append("<span style='font-size:1.5em;'>" + text + "</span>");
	}

	var addRect = function(left, top, color, width, height) {
		var rect = new fabric.Rect({
		 	left: left,
			top: top,
			fill: color,
			width: snakes.common.CAGE_SIZE,
			height: snakes.common.CAGE_SIZE
		});
		canvas.add(rect);
	};

	var changeModelForNextStep = function() {
		var head = model.snake[0];
		var newHead = generateNewHead(head);

		if(isBarrier(newHead)) {
			gameHasFinished = true;
			clearInterval(movingIntervalId);
			endGameCallback();
		}

		model.snake.unshift(newHead);

		if(head.x == model.apple.x && head.y == model.apple.y) {
			model.apples++;
			generateNextApple();
		} else {
			model.snake.pop();
		}
	};

	var recreateMovingTimer = function() {
		clearInterval(movingIntervalId);
		movingIntervalId = setInterval(nextStep, speeds[speedIndex]);
	}

	var isBarrier = function(newHead) {
		// если стена или тело
		return newHead.x >= snakes.common.COUNT_H || 
			newHead.x < 0 || 
			newHead.y >= snakes.common.COUNT_W || 
			newHead.y < 0 ||
			coordInBody(newHead);
	};

	var generateNewHead = function(head) {
		var newHead = { x: head.x, y: head.y };

		if(model.currentDestination == snakes.common.DEST_UP) {
			newHead.x--;
		} else if(model.currentDestination == snakes.common.DEST_DOWN) {
			newHead.x++;
		} else if(model.currentDestination == snakes.common.DEST_LEFT) {
			newHead.y--;
		} else if(model.currentDestination == snakes.common.DEST_RIGHT) {
			newHead.y++;
		}

		return newHead;
	};

	var generateNextApple = function() {
		do {
			model.apple.x = snakes.common.getRandomInt(0, snakes.common.COUNT_H - 1);
			model.apple.y = snakes.common.getRandomInt(0, snakes.common.COUNT_W - 1);
		} while(coordInBody(model.apple)) /* генерим до тех пор, пока координаты попадают на тело змеи */
	};

	var coordInBody = function(coord) {
		for(var i = 0; i < model.snake.length; i++) {
			if(model.snake[i].x == coord.x && model.snake[i].y == coord.y) {
				return true;
			}
		}
		return false;
	}

	var nextStep = function() {
		changeModelForNextStep();
		render();
	}

	var model = new snakes.models.GameModel();


	// public:
	self.start = function() {
		render();
		movingIntervalId = setInterval(nextStep, speeds[speedIndex]);
	}

	self.moveUp = function() {
		if(isPause || gameHasFinished) {
			return;
		}

		if(model.currentDestination != snakes.common.DEST_DOWN) {
			model.currentDestination = snakes.common.DEST_UP;
		}
	}

	self.moveDown = function() {
		if(isPause || gameHasFinished) {
			return;
		}

		if(model.currentDestination != snakes.common.DEST_UP) {
			model.currentDestination = snakes.common.DEST_DOWN;
		}
	}

	self.moveLeft = function() {
		if(isPause || gameHasFinished) {
			return;
		}

		if(model.currentDestination != snakes.common.DEST_RIGHT) {
			model.currentDestination = snakes.common.DEST_LEFT;
		}
	}

	self.moveRight = function() {
		if(isPause || gameHasFinished) {
			return;
		}

		if(model.currentDestination != snakes.common.DEST_LEFT) {
			model.currentDestination = snakes.common.DEST_RIGHT;
		}
	}

	self.switchImprovementSpeedMode = function() {

		if(isPause || gameHasFinished) {
			return;
		}

		if(speedIndex != speeds.length - 1) {
			speedIndex++;
		} else {
			speedIndex = 0;
		}
		recreateMovingTimer();
	}

	self.pauseOrContinue = function() {

		if(gameHasFinished) {
			return;
		}

		if(!isPause) {
			clearInterval(movingIntervalId);
		} else {
			movingIntervalId = setInterval(nextStep, speeds[speedIndex]);
		}

		isPause = !isPause;
		renderGameInfo();
	}

	return self;
}