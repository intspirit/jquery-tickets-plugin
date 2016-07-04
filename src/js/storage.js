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
