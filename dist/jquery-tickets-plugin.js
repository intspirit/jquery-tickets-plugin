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

// different
var CLASS_PREFIX = 'tickets-plugin-';

var storageKeys = {
    'Categories': Category
};
var $prefixClasses = function (classNames) {
    var names = classNames.split(' ');
    $.each(names, function (index, name) { name = CLASS_PREFIX + name; });
    return names.join(' ');
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

var $createModal = function (title, jContent) {
    return $createElement('div')
               .addClass('modal fade')
               .attr('id', 'tickets_universal_modal')
               .attr('role', 'document')
               .append($createElement('div')
                           .addClass('modal-dialog')
                           .append($createElement('div')
                                       .addClass('modal-content')
                                       .append(
                                           // header
                                           $createElement('div')
                                               .addClass('modal-header')
                                               .append(
                                                   $createElement('button')
                                                       .addClass('close')
                                                       .attr('type', 'button')
                                                       .attr('data-dismiss', 'modal')
                                                       .append($createElement('span')
                                                                   .html('&times;')),

                                                   $createElement('h4')
                                                       .addClass('modal-title')
                                                       .text(title)
                                               ),
                                           // body
                                           $createElement('div')
                                               .addClass('modal-body')
                                               .append(jContent),
                                           // footer
                                           $createElement('div')
                                               .addClass('modal-footer')
                                               .append(
                                                   $createButton('Close')
                                                       .attr('data-dismiss', 'modal'),
                                                   $createButton('Save', null, 'save_btn')
                                               )
                                       )));
};

var $showModal = function (title, jContent, jParentContainer, saveCallback) {
    var jModal = $createModal(title, jContent).one('hidden.bs.modal', function () { jModal.remove(); });
    jModal.find('#save_btn').one('click', function () {
        if (saveCallback)
            saveCallback();
        jModal.modal('hide');
    });
    jParentContainer.append(jModal);
    jModal.modal('show');
}

var $createInputFormGroup = function (id, label, type, value) {
    return $createElement('div')
               .addClass('form-group')
               .append(
                   $createElement('label')
                       .attr('for', id)
                       .text(label),
                   $createElement('input')
                       .attr({
                            id: id,
                            type: type || 'text'
                       })
                       .addClass('form-control')
                       .val(value)
               );
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
function Seat () {
  //this.form
  //this.category
  //this.id
}

Seat.prototype.setCategory = function (category) {

}

Seat.prototype.setForm = function (form) {

}

Seat.prototype.toJson = function () {

}

function Row (label) {
    this.seats = [];
    this.label = label;
}

Row.prototype.generateSeats = function (numberOfSeats, form, category) {

}

Row.prototype.toJson = function () {

}

function Hall (container) {

    var jContainer = $(container);
    if (!jContainer)
        throw new Error('Container is not defined');
    this.jContainer = jContainer;
    this.__categories = {};
    this.__rows = {};

    this.createToolsPanel();
    this.createCategoriesTable();
}

Hall.prototype.createToolsPanel = function () {
    this.jCategoryButton = $createButton('Create Category').on('click', $.proxy(this.onCategoryBtnClick, this));
    this.jRowsButton = $createButton('Add Rows').on('click', $.proxy(this.onRowsButtonClick, this));
    this.jToolsPanel = $createElement('div').addClass($prefixClasses('tools'));
    this.jToolsPanel.append(this.jCategoryButton);
    this.jContainer.append(this.jToolsPanel);
};

Hall.prototype.createCategoriesTable = function () {
    this.jCategoriesTable = $createElement('table').addClass($prefixClasses('table categories'));
    this.jCategoriesTable.append($createElement('tbody'));
    this.jContainer.append(this.jCategoriesTable);
};

Hall.prototype.addCategoryToTable = function (category) {
    var jCategory = $createElement('tr').attr('id', category.name)
                                        .addClass($prefixClasses('category'))
                                        .append(
                                            $createElement('td').text(category.name),
                                            $createElement('td').text(category.value),
                                            $createElement('td').css({'background-color': category.getColor()}),
                                            $createElement('td').append($createButton('edit')
                                                .on('click', category, $.proxy(this.onEditCategoryBtnClick, this))),
                                            $createElement('td').append($createButton('remove')
                                                .on('click', category, $.proxy(this.onRemoveCategoryBtnClick, this)))
                                        );
    this.jCategoriesTable.append(jCategory);
};

Hall.prototype.updateCategoryInTable = function (oldName, category) {
    var jCategory = this.jCategoriesTable.find('#' + oldName);
    if (jCategory.length) {
        jCategory.children().each(function (index, element) {
            if (index == 0) $(element).text(category.name);
            if (index == 1) $(element).text(category.value);
            if (index == 2) $(element).css('background-color', category.getColor());
        });
        jCategory.attr('id', category.name);
    }
};

Hall.prototype.removeCategoryFromTable = function (name) { this.jCategoriesTable.find('#' + name).remove(); };

Hall.prototype.showCategoriesModal = function (currentCategory) {
    var jCategoryName = $createInputFormGroup('category_name', 'Name', undefined, currentCategory ? currentCategory.name : undefined);
    var jCategoryValue = $createInputFormGroup('category_value', 'Value', undefined, currentCategory ? currentCategory.value : undefined);
    var jCategoryColor = $createInputFormGroup('category_color', 'Color', undefined, currentCategory ? currentCategory.getColor() : undefined);
    var jCategoryForm = $createElement('form')
                            .addClass('form')
                            .append(jCategoryName, jCategoryValue, jCategoryColor);

    var self = this;
    var onSave = function () {
        var name = jCategoryName.find('input').val();
        var value = jCategoryValue.find('input').val();
        var color = jCategoryColor.find('input').val();

        try
        {
            if (currentCategory) {
                var oldName = currentCategory.name;
                currentCategory.name = name;
                currentCategory.value = value;
                currentCategory.setColor(color);
                self.removeCategory(oldName);
                self.addCategory(currentCategory);
                self.updateCategoryInTable(oldName, currentCategory);
            } else {
                currentCategory = new Category(name, value, color);
                self.addCategory(currentCategory);
                self.addCategoryToTable(currentCategory);
            }
        }
        catch(e)
        {
            console.log(e);
        }
    };

    $showModal('Create Category', jCategoryForm, this.jContainer, onSave);
};

Hall.prototype.showRowsModal = function () {
    var jRowsNumber = $createInputFormGroup('rows_number', 'Number of rows');
    var jSeatsNumber = $createInputFormGroup('seats_number', 'Number of seats');

    var jRowsForm = $createElement('form')
                        .addClass('form')
                        .append(jRowsNumber, jSeatsNumber);

    var self = this;
    var onSave = function () {
        var numberOfRows = jRowsNumber.find('input').val();
        var numberOfSeats = jSeatsNumber.find('input').val();
    }

    $showModal('Add Rows', jRowsForm, this.jContainer, onSave);
};

Hall.prototype.onCategoryBtnClick = function (e) {
    e.stopPropagation();
    this.showCategoriesModal();
};

Hall.prototype.onEditCategoryBtnClick = function (e) {
    e.stopPropagation();
    this.showCategoriesModal(e.data);
};

Hall.prototype.onRemoveCategoryBtnClick = function (e) {
    var name = e.data.name;
    this.removeCategory(name);
    this.removeCategoryFromTable(name);
};

Hall.prototype.onRowsButtonClick = function () {

};

Hall.prototype.getCategories = function () { return this.__categories; };

Hall.prototype.addCategory = function (category) {
    if (!category.name)
        throw new Error('Cannot add category with empty name.');
    else if (this.__categories[category.name])
        throw new Error('Category with a given name already exists.');
    else
        this.__categories[category.name] = category;
};

Hall.prototype.removeCategory = function (name) {
    if (!name)
        throw new Error('Cannot remove category with empty name.');
    else if (!this.__categories[name])
        throw new Error('Category with given name does not exist');
    else
        delete(this.__categories[name]);
};

Hall.prototype.addRow = function (row) {
        if (!row.label)
        throw new Error('Cannot add row with empty label.');
    else if (this.__rows[row.label])
        throw new Error('Row with a given label already exists.');
    else
        this.__rows[row.label] = row;
};

Hall.prototype.removeRow = function (label) {
    if (!label)
        throw new Error('Cannot remove row with empty label.');
    else if (!this.__rows[label])
        throw new Error('Row with a given label does not exist');
    else
        delete(this.__rows[label]);
};



function Storage (shouldPersist) {
    if (shouldPersist)
        this.__storage = localStorage;
    else
        this.__storage = sessionStorage;
}

Storage.prototype.getItem = function (tableName, id, Constructor) {
    return Constructor.fromJson(this.__storage.getItem(tableName + id));
};

Storage.prototype.getItems = function (tableName, cacheTableName, Constructor) {
    var items = [];
    var cache = this.__storage.getItem(cacheTableName);
    if (cache) {
        cache = cache.split(' ');
        var len = cache.length, index = 0, item;
        for (; index < len; index++) {
            item = Constructor.fromJson(this.__storage.getItem(tableName + cache[index]));
            item && items.push(item);
        }
    }
    return items;
};

Storage.prototype.addOrUpdateItem = function (tableName, cacheTableName, id, item, shouldUpdate) {
    var itemExists = !!this.__storage.getItem(tableName + id);
    shouldUpdate = !!shouldUpdate;
    if (itemExists == shouldUpdate) {
        this.__storage.setItem(tableName + id, item.toJson());
        this.updateCache(cacheTableName, id);
    } else {
        var errMsg = shouldUpdate ? 'Cannot update item with id - ' + id + '. It doesnt exist.'
                                  : 'Cannot duplicate item with id - ' + id;
        throw new Error(errMsg);
    }
};

Storage.prototype.removeItem = function (tableName, cacheTableName, id) {
    this.__storage.removeItem(tableName + id);
    this.updateCache(cacheTableName, id, true);
};

Storage.prototype.updateCache = function (tableName, id, shouldRemove) {
    id = id.toString();
    var cache = this.__storage.getItem(tableName),
        condition = false;
    if (cache) {
        if (cache.indexOf(id) > -1) {
            condition = shouldRemove;
            cache = cache.replace(id, '');
        } else {
            condition = !shouldRemove;
            cache = cache + ' ' + id;
        }
    } else {
        condition = !shouldRemove;
        cache = id;
    }
    condition && this.__storage.setItem(tableName, cache);
};

(function (storageConstructor, keys) {
    var tableName, cacheTableName, cacheTableNames = [], constructor, constructorName;
    for (var key in keys) {
        tableName = '__' + key + '__';
        cacheTableName = '__' + key + '_ids__';
        cacheTableNames.push(cacheTableName);
        constructor = keys[key];
        constructorName = /^function\s+([\w\$]+)\s*\(/.exec(constructor.toString())[1];

        var getItemsWrapper = (new Function('constructor',
            'return function () { return this.getItems("' + tableName + '", "' + cacheTableName + '", constructor); };'))
        (constructor);

        var getItemWrapper = (new Function ('constructor',
            'return function (id) { return this.getItem("' + tableName + '", id, constructor); };'))
        (constructor);

        storageConstructor.prototype['get' + key] = function () { return getItemsWrapper.call(this); };

        storageConstructor.prototype['get' + constructorName] = function (id) { return getItemWrapper.call(this, id); };

        storageConstructor.prototype['add' + constructorName] = new Function('id', 'item', 'return ' +
            'this.addOrUpdateItem("' + tableName + '","' + cacheTableName + '", id, item);' );

        storageConstructor.prototype['update' + constructorName] = new Function ('id', 'item', 'return ' +
            'this.addOrUpdateItem("' + tableName + '","' + cacheTableName + '", id, item, true);' );

        storageConstructor.prototype['remove' + constructorName] = new Function ('id', 'return ' +
            'this.removeItem("' + tableName + '","' + cacheTableName + '", id);');
    }
})(Storage, storageKeys);

$.fn.extend({
    cinemaHall: function (options) {
        return this.each(function (index, container) {
            var hall = new Hall(container);
        });
    }
});
}));