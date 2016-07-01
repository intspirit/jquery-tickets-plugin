$.fn.extend({
    cinemaHall: function (options) {
        return this.each(function (index, container) {
            var hall = new Hall(container);
        });
    }
});