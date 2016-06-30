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