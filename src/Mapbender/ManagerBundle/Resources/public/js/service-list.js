$(function() {
    $('#listFilterServices').on('click', '.iconRemove[data-url]', function() {
        var $el = $(this);
        var url = $el.attr('data-url');
        var preText = $el.attr('title');    // HACK
        $.ajax(url, {
            method: 'GET'
        }).then(function(response) {
            var content = ['<p>', preText, '</p>', response].join('');
            var stringMap = {
                // @todo: bring your own translation string
                title: "mb.manager.components.popup.delete_element.title",
                // @todo: bring your own translation string
                cancel: "mb.manager.components.popup.delete_element.btn.cancel",
                // @todo: bring your own translation string
                confirm: "mb.manager.components.popup.delete_element.btn.ok"
            };
            Mapbender.Manager.confirmDelete($el, url, stringMap, content);
        });
        return false;
    });
});
