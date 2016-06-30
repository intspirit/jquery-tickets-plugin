$.fn.extend({
    cinemaHall: function (options) {
        return this.each(function (index, container) {
            var jContainer = $(container);
            var tools = new Tools(jContainer);
        });
    }
});