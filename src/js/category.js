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