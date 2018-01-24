var snakes = snakes || {};

snakes.models = (function ($) {
    var GameModel = function () {
        var self = {};

        self.currentDestination = snakes.common.DEST_UP;
        self.apple = { x: 10, y: 40 };
        self.snake = [
            { x: 30, y: 30 },
            { x: 31, y: 30 },
            { x: 32, y: 30 },
            { x: 33, y: 30 },
        ];
        self.apples = 0;

        return self;
    };

    return {
        GameModel: GameModel
    };

})(jQuery);