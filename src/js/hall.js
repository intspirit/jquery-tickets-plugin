function Hall (container) {

    var jContainer = $(container);
    if (!jContainer)
        throw new Error('Container is not defined');
    this.jContainer = jContainer;
    this.__categories = {};

    this.createToolsPanel();
    this.createCategoriesTable();
}

Hall.prototype.createToolsPanel = function () {
    this.jCategoryButton = $createButton('Create Category').on('click', $.proxy(this.onCategoryBtnClick, this));
    this.jToolsPanel = $createElement('div').addClass($prefixClasses('tools'));
    this.jToolsPanel.append(this.jCategoryButton);
    this.jContainer.append(this.jToolsPanel);
}

Hall.prototype.createCategoriesTable = function () {
    this.jCategoriesTable = $createElement('table').addClass($prefixClasses('table categories'));
    this.jCategoriesTable.append($createElement('tbody'));
    this.jContainer.append(this.jCategoriesTable);
}

Hall.prototype.addCategoryToTable = function (category) {
    var jCategory = $createElement('tr').attr('id', category.name)
                                        .addClass($prefixClasses('category'))
                                        .append(
                                            $createElement('td').text(category.name),
                                            $createElement('td').text(category.value),
                                            $createElement('td').css({'background-color': category.getColor()}),
                                            $createElement('td').append($createButton('edit')
                                                .on('click', category, $.proxy(this.onEditCategoryBtnClick, this))),
                                            $createElement('td').append($createButton('remove'))
                                        );
    this.jCategoriesTable.append(jCategory);
}

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
}

Hall.prototype.removeCategoryFromTable = function (name) { this.jCategoriesTable.find('#' + name).remove(); }

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
}

Hall.prototype.onCategoryBtnClick = function (e) {
    e.stopPropagation();
    this.showCategoriesModal();
}

Hall.prototype.onEditCategoryBtnClick = function (e) {
    e.stopPropagation();
    this.showCategoriesModal(e.data);
}

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


