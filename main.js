function isInput(elem) {
    if (!elem || !elem.nodeName) {
        return false;
    }

    return ["INPUT", "TEXTAREA"].indexOf(elem.nodeName.toUpperCase()) > -1;
}

function getCaretPosition (oField) {
    // http://stackoverflow.com/questions/2897155/get-cursor-position-in-characters-within-a-text-input-field

    // Initialize
    var iCaretPos = 0;

    // IE Support
    if (document.selection) {

        // Set focus on the element
        oField.focus();

        // To get cursor position, get empty selection range
        var oSel = document.selection.createRange();

        // Move selection start to 0 position
        oSel.moveStart('character', -oField.value.length);

        // The caret position is selection length
        iCaretPos = oSel.text.length;
    }

    // Firefox support
    else if (oField.selectionStart || oField.selectionStart == '0')
        iCaretPos = oField.selectionStart;

    // Return results
    return iCaretPos;
}

function drawList($target, emojis) {
    $('ul.emojiext').empty();

    var $ul = $('ul.emojiext')
            .css('left', $target.offset().left)
            .css('top', $target.offset().top + $target.outerHeight())
            .css('visibility', 'visible');

    Enumerable.from(emojis)
        .forEach(function(e, idx) {
            var $li = $('<li>')
                    .append(
                        $('<span>')
                            .addClass('chars')
                            .text(e.chars)
                    )
                    .append(
                        $('<span>')
                            .addClass('name')
                            .text(e.name)
                    )
                    .appendTo($ul);

            if (idx === 0) {
                $li.addClass('selected');
            }
        });
}

$(function() {
    var $ul = $('<ul>')
            .addClass('emojiext')
            .css('visibility', 'collapse')
            .appendTo($('body'));

    $(document).on('keyup', function() {
        setTimeout(function() {
            var elem = document.activeElement;
            if (!isInput(elem)) {
                return;
            }

            var flagment = elem.value.substring(0, getCaretPosition(elem) - 1);
            var spl = elem.value.split(':');
            flagment = "";

            if (spl.length > 1) {
                flagment = spl[spl.length - 1];
            }

            var emojis;
            if (flagment) {
                console.log(flagment);
                emojis = Enumerable.from(emojiData)
                    .where(function(e) {
                        return Enumerable.from(e.aliases)
                            .any(function(a) {
                                return a.indexOf(flagment) > -1;
                            });
                    })
                    .toArray();
            }

            if (emojis) {
                console.log(emojis);
                drawList($(elem), emojis);
            }
        }, 100);
    });
});
