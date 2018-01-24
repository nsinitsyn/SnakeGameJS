var snakes = snakes || {};

snakes.common = (function ($) {
	return {
		COUNT_W: 60,
		COUNT_H: 50,
		CAGE_SIZE: 10,

		DEST_UP: 1,
		DEST_DOWN: 2,
		DEST_LEFT: 3,
		DEST_RIGHT: 4,

		getRandomInt: function (min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}
	};

})(jQuery);