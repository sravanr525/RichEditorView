/**
 * Copyright (C) 2015 Wasabeef
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 "use strict";

var RE = {};

window.onload = function() {
    RE.callback("ready");
};

RE.editor = document.getElementById('editor');

// Not universally supported, but seems to work in iOS 7 and 8
document.addEventListener("selectionchange", function() {
    RE.backuprange();
    RE.callback("selectionchange");

});

//looks specifically for a Range selection and not a Caret selection
RE.rangeSelectionExists = function() {
    //!! coerces a null to bool
    var sel = document.getSelection();
    if (sel && sel.type == "Range") {
        return true;
    }
    return false;
};

RE.rangeOrCaretSelectionExists = function() {
    //!! coerces a null to bool
    var sel = document.getSelection();
    if (sel && (sel.type == "Range" || sel.type == "Caret")) {
        return true;
    }
    return false;
};

RE.editor.addEventListener("input", function() {
    RE.updatePlaceholder();
    RE.backuprange();
    RE.callback("input");
});

RE.editor.addEventListener("copy", function() {
    RE.callback("copy");
});

RE.editor.addEventListener("focus", function() {
    RE.backuprange();
    RE.callback("focus");
});

RE.editor.addEventListener("blur", function() {
    RE.callback("blur");
});

RE.customAction = function(action) {
    RE.callback("action/" + action);
};

RE.updateHeight = function() {
    RE.callback("updateHeight");
}

RE.callbackQueue = [];
RE.runCallbackQueue = function() {
    if (RE.callbackQueue.length === 0) {
        return;
    }

    setTimeout(function() {
        window.location.href = "re-callback://";
    }, 0);
};

RE.getCommandQueue = function() {
    var commands = JSON.stringify(RE.callbackQueue);
    RE.callbackQueue = [];
    return commands;
};

RE.callback = function(method) {
    RE.callbackQueue.push(method);
    RE.runCallbackQueue();
};

RE.setHtml = function(contents) {
    var tempWrapper = document.createElement('div');
    tempWrapper.innerHTML = contents;
    var images = tempWrapper.querySelectorAll("img");

    for (var i = 0; i < images.length; i++) {
        images[i].onload = RE.updateHeight;
    }

    RE.editor.innerHTML = tempWrapper.innerHTML;
    RE.updatePlaceholder();
};

RE.getHtml = function() {
    return RE.editor.innerHTML;
};

RE.getText = function() {
    return RE.editor.innerText;
};

RE.getSelectedText = function() {
    return document.getSelection().toString();
};

RE.setBaseTextColor = function(color) {
    RE.editor.style.color  = color;
};

RE.setPlaceholderText = function(text) {
    RE.editor.setAttribute("placeholder", text);
};

RE.updatePlaceholder = function() {
    if (RE.editor.innerHTML.indexOf('img') !== -1 || (RE.editor.textContent.length > 0 && RE.editor.innerHTML.length > 0)) {
        RE.editor.classList.remove("placeholder");
    } else {
        if ((RE.editor.innerHTML == "") || (RE.editor.innerHTML == "<div><br></div>") || (RE.editor.innerHTML == "<br>")){
            RE.editor.text = "";
            RE.editor.classList.add("placeholder");
        }else{
            RE.editor.classList.remove("placeholder");
        }
    }
};

RE.removeFormat = function() {
    document.execCommand('removeFormat', false, null);
};

RE.setFontSize = function(size) {
    RE.editor.style.fontSize = size;
};

RE.setSelecedFontSize = function(size) {
    document.execCommand("fontSize", false, size);
};
RE.setBackgroundColor = function(color) {
    RE.editor.style.backgroundColor = color;
};

RE.setHeight = function(size) {
    RE.editor.style.height = size;
};

RE.undo = function() {
    document.execCommand('undo', false, null);
};

RE.redo = function() {
    document.execCommand('redo', false, null);
};

RE.setBold = function() {
    document.execCommand('bold', false, null);
};

RE.setItalic = function() {
    document.execCommand('italic', false, null);
};

RE.setSubscript = function() {
    document.execCommand('subscript', false, null);
};

RE.setSuperscript = function() {
    document.execCommand('superscript', false, null);
};

RE.setStrikeThrough = function() {
    document.execCommand('strikeThrough', false, null);
};

RE.setUnderline = function() {
    document.execCommand('underline', false, null);
};

RE.setTextColor = function(color) {
//    RE.restorerange();
    document.execCommand("styleWithCSS", null, true);
    document.execCommand('foreColor', false, color);
    document.execCommand("styleWithCSS", null, false);
};

RE.setTextBackgroundColor = function(color) {
    RE.restorerange();
    document.execCommand("styleWithCSS", null, true);
    document.execCommand('hiliteColor', false, color);
    document.execCommand("styleWithCSS", null, false);
};

RE.setHeading = function(heading) {
    document.execCommand('formatBlock', false, '<h' + heading + '>');
};

RE.setIndent = function() {
    document.execCommand('indent', false, null);
};

RE.setOutdent = function() {
    document.execCommand('outdent', false, null);
};

RE.setOrderedList = function() {
    document.execCommand('insertOrderedList', false, null);
};

RE.setUnorderedList = function() {
    document.execCommand('insertUnorderedList', false, null);
};

RE.setJustifyLeft = function() {
    document.execCommand('justifyLeft', false, null);
};

RE.setJustifyCenter = function() {
    document.execCommand('justifyCenter', false, null);
};

RE.setJustifyRight = function() {
    document.execCommand('justifyRight', false, null);
};

RE.getLineHeight = function() {
    return RE.editor.style.lineHeight;
};

RE.setLineHeight = function(height) {
    RE.editor.style.lineHeight = height;
};

RE.insertImage = function(url, alt) {
    var img = document.createElement('img');
    img.setAttribute("src", url);
    img.setAttribute("alt", alt);
    img.onload = RE.updateHeight;

    RE.insertHTML(img.outerHTML);
    RE.callback("input");
};

RE.setBlockquote = function() {
    document.execCommand('formatBlock', false, '<blockquote>');
};

RE.insertHTML = function(html) {
    RE.restorerange();
    document.execCommand('insertHTML', false, html);
};

RE.insertLink = function(url, title) {
    RE.restorerange();
    var sel = document.getSelection();
    if (sel.toString().length !== 0) {
        if (sel.rangeCount) {

            var el = document.createElement("a");
            el.setAttribute("href", url);
            el.setAttribute("title", title);

            var range = sel.getRangeAt(0).cloneRange();
            range.surroundContents(el);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }
    RE.callback("input");
};

RE.prepareInsert = function() {
    RE.backuprange();
};

RE.backuprange = function() {
    var selection = window.getSelection();
    if (selection.rangeCount > 0) {
        var range = selection.getRangeAt(0);
        RE.currentSelection = {
            "startContainer": range.startContainer,
            "startOffset": range.startOffset,
            "endContainer": range.endContainer,
            "endOffset": range.endOffset
        };
    }
};

RE.addRangeToSelection = function(selection, range) {
    if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
    }
};

// Programatically select a DOM element
RE.selectElementContents = function(el) {
    var range = document.createRange();
    range.selectNodeContents(el);
    var sel = window.getSelection();
    // this.createSelectionFromRange sel, range
    RE.addRangeToSelection(sel, range);
};

RE.restorerange = function() {
    var selection = window.getSelection();
    selection.removeAllRanges();
    var range = document.createRange();
    range.setStart(RE.currentSelection.startContainer, RE.currentSelection.startOffset);
    range.setEnd(RE.currentSelection.endContainer, RE.currentSelection.endOffset);
    selection.addRange(range);
};

RE.focus = function() {
    var range = document.createRange();
    range.selectNodeContents(RE.editor);
    range.collapse(false);
    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    RE.editor.focus();
};

RE.focusAtPoint = function(x, y) {
    var range = document.caretRangeFromPoint(x, y) || document.createRange();
    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    RE.editor.focus();
};

RE.replace = function(str) {
    getWordPrecedingCaret(RE.editor,str);
    RE.callback("input");
};
RE.blurFocus = function() {
    RE.editor.blur();
};

/**
Recursively search element ancestors to find a element nodeName e.g. A
**/
var _findNodeByNameInContainer = function(element, nodeName, rootElementId) {
    if (element.nodeName == nodeName) {
        return element;
    } else {
        if (element.id === rootElementId) {
            return null;
        }
        _findNodeByNameInContainer(element.parentElement, nodeName, rootElementId);
    }
};

var isAnchorNode = function(node) {
    return ("A" == node.nodeName);
};

RE.getAnchorTagsInNode = function(node) {
    var links = [];

    while (node.nextSibling !== null && node.nextSibling !== undefined) {
        node = node.nextSibling;
        if (isAnchorNode(node)) {
            links.push(node.getAttribute('href'));
        }
    }
    return links;
};

RE.countAnchorTagsInNode = function(node) {
    return RE.getAnchorTagsInNode(node).length;
};

/**
 * If the current selection's parent is an anchor tag, get the href.
 * @returns {string}
 */
RE.getSelectedHref = function() {
    var href, sel;
    href = '';
    sel = window.getSelection();
    if (!RE.rangeOrCaretSelectionExists()) {
        return null;
    }

    var tags = RE.getAnchorTagsInNode(sel.anchorNode);
    //if more than one link is there, return null
    if (tags.length > 1) {
        return null;
    } else if (tags.length == 1) {
        href = tags[0];
    } else {
        var node = _findNodeByNameInContainer(sel.anchorNode.parentElement, 'A', 'editor');
        href = node.href;
    }

    return href ? href : null;
};

// Returns the cursor position relative to its current position onscreen.
// Can be negative if it is above what is visible
RE.getRelativeCaretYPosition = function() {
    var y = 0;
    var sel = window.getSelection();
    if (sel.rangeCount) {
        var range = sel.getRangeAt(0);
        var needsWorkAround = (range.startOffset == 0)
        /* Removing fixes bug when node name other than 'div' */
        // && range.startContainer.nodeName.toLowerCase() == 'div');
        if (needsWorkAround) {
            y = range.startContainer.offsetTop - window.pageYOffset;
        } else {
            if (range.getClientRects) {
                var rects=range.getClientRects();
                if (rects.length > 0) {
                    y = rects[0].top;
                }
            }
        }
    }

    return y;
};
function getWordPrecedingCaret(containerEl, newVal) {
    var preceding = "",
        sel,
        range,
        precedingRange;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount > 0) {
            range = sel.getRangeAt(0).cloneRange();
            range.deleteContents();
            range.insertNode(document.createTextNode(newVal));
            sel.removeAllRanges();
        }
    }
}
RE.selectedPosition = function() {
    return getRectForSelectedText();
}
function getRectForSelectedText() {
    var selection = window.getSelection();
    var range = selection.getRangeAt(0);
    var rect = range.getBoundingClientRect();
    return  rect.left + "," + rect.top + "," + rect.width + "," + rect.height ;
}



RE.editor.addEventListener("click", function() {
    RE.callback("click");
});
RE.editor.addEventListener("touchend", function() {
    RE.callback("touch");
});
RE.editor.addEventListener("touchstart", function() {
    RE.callback("touch");
});

RE.editor.addEventListener("touchmove", function() {
    RE.callback("touch");
});


RE.isBold = function() {
    var isAllBold = document.queryCommandState("bold");
    return isAllBold
};

RE.isItalic = function() {
    var isAllItalic = document.queryCommandState("italic");
    return isAllItalic
};

RE.isUnderline = function() {
    var isAllUnderLine = document.queryCommandState("underline");
    return isAllUnderLine
};
RE.isStrike = function() {
    var isStrikeThrough = document.queryCommandState("strikeThrough");
    return isStrikeThrough
};

RE.getColor = function() {
    var colour = document.queryCommandValue("ForeColor");
    return rgbToHex(colour)
};
RE.getFontSize = function() {
    var fontSize = document.queryCommandValue("FontSize");
    return fontSize
};
RE.getCursorPosition = function() {
    var position = window.getSelection().getRangeAt(0).startOffset;
    return position;
};



RE.getCursorPositionNew = function() {
    return getCaretPosition();
};

RE.getTestValue = function() {
    return getLastWord();
};

//RE.cursor_positionF = function() {
//    return cursor_position();
//};

function getCaretPosition() {
    var position = window.getSelection().getRangeAt(0).toString();
    return position;

    var caretOffset = "";
    var range = window.getSelection().getRangeAt(0);
    var preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(RE.editor);
    preCaretRange.setEnd(range.endContainer, range.startOffset);
    caretOffset = preCaretRange.toString().length;
    return preCaretRange.toString();
}
function getCaretPosition1() {
    let ctrl = RE.editor;
    var CaretPos = 0;   // IE Support
    var Sel = document.createRange();
    Sel.moveStart('character', -ctrl.textContent.length);
    CaretPos = Sel.text.length;
    return (CaretPos);
}

function rgbToHex(rgb) {
   var a = rgb.split("(")[1].split(")")[0];
    a = a.split(",");
    var b = a.map(function(x){
        x = parseInt(x).toString(16);
        return (x.length==1) ? "0"+x : x;
    });
    b = b.join("");
    return b;
}


//function ReturnWord(text, caretPos) {
//    var index = text.indexOf(caretPos);
//    var preText = text.substring(0, caretPos);
//    if (preText.indexOf(" ") > 0) {
//        var words = preText.split(" ");
//        return words[words.length - 1]; //return last word
//    }
//    else {
//        return preText;
//    }
//}
function getCaretPositionNew11() {
    let ctrl = RE.editor;
    var CaretPos = 0;   // IE Support
//    if (document.selection) {
//        var Sel = document.selection.createRange();
//        Sel.moveStart('character', -ctrl.value.length);
//        CaretPos = Sel.text.length;
//    }else if (ctrl.selectionStart || ctrl.selectionStart == '0'){
//        CaretPos = ctrl.selectionStart;
//    }
    var Sel = document.selection.createRange();
    Sel.moveStart('character', -ctrl.value.length);
    CaretPos = Sel.text.length;
    return (CaretPos);
}



function getInsertAtCursor(myValue) {
    let myField = RE.editor;
    var startPos = myField.selectionStart;
    var endPos = myField.selectionEnd;
    return endPos;
    //IE support
    if (document.selection) {
        sel = document.selection.createRange();
        sel.text = myValue;
    }
    //MOZILLA and others
    else if (myField.selectionStart || myField.selectionStart == '0') {
        var startPos = myField.selectionStart;
        var endPos = myField.selectionEnd;
        return endPos;
//        myField.value = myField.value.substring(0, startPos)
//            + myValue
//            + myField.value.substring(endPos, myField.value.length);
    } else {
//        myField.value += myValue;
    }
    return 2;
}

function insertAtCursor(myValue) {
    let myField = RE.editor;
    //IE support
    if (document.selection) {
        sel = document.selection.createRange();
        sel.text = myValue;
    }
    //MOZILLA and others
    else if (myField.selectionStart || myField.selectionStart == '0') {
        var startPos = myField.selectionStart;
        var endPos = myField.selectionEnd;
        myField.value = myField.value.substring(0, startPos)
            + myValue
            + myField.value.substring(endPos, myField.value.length);
    } else {
        myField.value += myValue;
    }
}

function getCaretCharacterOffsetWithin() {
    let element = RE.editor;
    var caretOffset = 0;
    var caretOffset1 = "";
    var doc = element.ownerDocument || element.document;
    var win = doc.defaultView || doc.parentWindow;
    var sel;
    if (typeof win.getSelection != "undefined") {
        sel = win.getSelection();
        if (sel.rangeCount > 0) {
            var range = win.getSelection().getRangeAt(0);
            var preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(element);
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            caretOffset = preCaretRange.toString().length;
        }
    } else if ( (sel = doc.selection) && sel.type != "Control") {
        var textRange = sel.createRange();
        var preCaretTextRange = doc.body.createTextRange();
        preCaretTextRange.moveToElementText(element);
        preCaretTextRange.setEndPoint("EndToEnd", textRange);
        caretOffset = preCaretTextRange.innerText.length;
    }
    return caretOffset;
}


function getLastWord1(){
var selection = window.getSelection();
     var selection = window.getSelection();
        if (selection.rangeCount > 0) {
            var range = selection.getRangeAt(0);
            var text = range.startContainer.data;
            var index = range.endOffset;
         if(RE.editor.contentEditable == "true"){
            if (typeof text === 'undefined' && index == 0) {
               var text = RE.getText();
               var shortString = text.substring(0,getCaretCharacterOffsetWithin());
               var latword = shortString.substring(shortString.lastIndexOf(" ", shortString.lanth -1),shortString.length)
               return latword;
            }
            else if (index > 0 && (text[index - 1] == ' ' || text.charCodeAt(index - 1) == 160)) {
                // Click after a space
                var text = range.startContainer.data;
                var shortString = text.substring(0,index);
                var latword = shortString.substring(shortString.lastIndexOf(" ", shortString.lanth -2),shortString.length)
                console.log(latword);
                console.log("go gog gog gogpogpogogog ");
                return latword;
            }
            else {
              var text = RE.getText();
              var shortString = text.substring(0,getCaretCharacterOffsetWithin());
              var latword = shortString.substring(shortString.lastIndexOf(" ", shortString.lanth -1),shortString.length)
              return latword;
            }
          }
        }
        else{
         return " bhai to aaye hi nahi"
        }
}
function cursor_position() {
    var sel = document.getSelection();
    sel.modify("extend", "backward", "paragraphboundary");
    var pos = sel.toString().length;
    if(sel.anchorNode != undefined) sel.collapseToEnd();
    return pos;
}

function getCaretPosition(){
    var el = RE.editor;
    let tempHtml = el.innerHTML
    
    let str = tempHtml.replace(/<div><br><div><div>/,'sravan');
    return str;
    el.html = str
    var caretOffset = 0, sel;
    if (typeof window.getSelection !== "undefined") {
        var range = window.getSelection().getRangeAt(0);
        var selected = range.toString().length;
        var preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(el);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preCaretRange.toString().length - selected;
        return preCaretRange.toString();
    }
    return caretOffset;
}

function getLastWord(){
    var selection = window.getSelection();
        if (selection.rangeCount > 0) {
            var range = selection.getRangeAt(0);
            var text = range.startContainer.data;
            var index = range.endOffset;
            if(RE.editor.contentEditable == "true"){
                if (typeof text === 'undefined' && index == 0) {
                    var text = range.startContainer.data;
                    var shortString = text.substring(0,index);
                    var latword = shortString.substring(shortString.lastIndexOf(" ", shortString.lanth -1),shortString.length);
                    return latword + "cccc";
                }
            else if (index > 0 && (text[index - 1] == ' ' || text.charCodeAt(index - 1) == 160)) {
                // Click after a space
                var text = range.startContainer.data;
                var shortString = text.substring(0,index).replace(/^\s+|\s+$/g, "");;
                var latword = shortString.substring(shortString.lastIndexOf(" ", shortString.lanth -1),shortString.length);
                return latword + "ddd";;
            }else {
                var text = range.startContainer.data;
                var shortString = text.substring(0,index);
                var shortString2 = text.substring(index,text.length);
                var latword = shortString.substring(shortString.lastIndexOf(" ", shortString.lanth -1),shortString.length);
                var addWord = "";
//                if shortString2[0] == " "{
//                    addWord = "888";
//                }
                return shortString + "5555" + shortString2 + addWord;
            }
          }
        }
        else{
         return "NNNNNN"
        }
}

