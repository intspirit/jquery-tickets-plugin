; (function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'd3'], factory($, d3));
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('jquery'), require('d3'));
    } else {
        factory(jQuery, d3);
    }
}(function ($, d3, undefined) {
    'use strict';
// colors
var WHITE = '#FFF';

// regular expressions
var HEX_COLOR_REGEXP = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i;

// seat types
var seatTypes = {
    square: 1,
    round: 2
};

var $createElement = function (name) { return $(document.createElement(name)); };

var $createButton = function (text, className, id) {
    var classes = ['btn', 'btn-default'];
    if (className)
        classes.push(className);

    var attributes = { type: 'button' };
    if (id)
        attributes.id = id;

    return $createElement('button').attr(attributes).addClass(classes.join(' ')).text(text);
};
function Category (name, value, color) {
    this.name = name;
    this.value = value;

    var _color = WHITE;
    this.getColor = function () { return _color; };
    this.setColor = function (color) { _color = HEX_COLOR_REGEXP.test(color) ? color : _color; };

    color && this.setColor(color);

};

Category.prototype.toObject = function () {
    return {
        name: this.name,
        value: this.value,
        color: this.getColor()
    };
};

Category.prototype.toJson = function () { return JSON.stringify(this.toObject()); };

Category.fromJson = function (json) {
    var _name, _value, _color, category;
    try
    {
        var parsedCategoryObject = JSON.parse(json);

        if (parsedCategoryObject.name) _name = parsedCategoryObject.name;
        if (parsedCategoryObject.value) _value = parsedCategoryObject.value;
        if (parsedCategoryObject.color) _color = parsedCategoryObject.color;

        category = new Category(_name, _value, _color);
    }
    catch(e)
    {
        console.log(e);
        category = null;
    }

    return category;
};
function Tools (jContainer) {
    if (!jContainer)
        throw new Error('Parent container should be initialized');
    this.jContainer = jContainer;

    this.createPanel();
}

Tools.prototype.createPanel = function () {
    this.jCategoryButton = $createButton('Create Category').on('click', this.onCategoryBtnClick);
    this.jPanel = $createElement('div').addClass('tools');
    this.jPanel.append(this.jCategoryButton);
    this.jContainer.append(this.jPanel);
}

Tools.prototype.onCategoryBtnClick = function (e) {
    e.stopPropagation();
}
$.fn.extend({
    cinemaHall: function (options) {
        return this.each(function (index, container) {
            var jContainer = $(container);
            var tools = new Tools(jContainer);
        });
    }
});
}));