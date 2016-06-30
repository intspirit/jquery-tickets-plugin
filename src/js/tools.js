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