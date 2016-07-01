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