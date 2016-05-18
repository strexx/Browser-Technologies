// Start if javascript core functions are up and running
if ((document.querySelectorAll || document.querySelector) && ('forEach' in Array.prototype)) {
    start();
}

function start() {

    "use strict";

    // Add button functionality if addEventListener support
    if (document.addEventListener)
        addButtonListeners();

    // Feature detection for drag and drop
    var supportsDragAndDrop = function() {
        var div = document.createElement('div');
        return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
    };

    // Check if draganddrop is supported
    if (supportsDragAndDrop)
        addFunctions();

    // Global vars
    var list = document.querySelector('#grocery-list'),
        totalPrice = document.querySelector('#totalPrice'),
        items = document.querySelectorAll('#products .item'),
        message = document.querySelector('#message'),
        selected,
        status;

    // Remove function IE9 <
    Element.prototype.remove = function() {
        this.parentElement.removeChild(this);
    }

    // Check if element has class
    function hasClass(el, className) {
        if (el.classList)
            return el.classList.contains(className)
        else
            return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
    }

    // Add class function for IE9 and lower
    function addClass(ele, cls) {
        if (!hasClass(ele, cls)) ele.className += " " + cls;
    }

    // Remove class function for IE9 and lower
    function removeClass(ele, cls) {
        if (hasClass(ele, cls)) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            ele.className = ele.className.replace(reg, ' ');
        }
    }

    // Add items to grocery list
    function addItem(item) {

        var productName, productPrice, form, div;

        // Check if added via button
        if (item.nodeName == "BUTTON") {
            form = item.parentNode;
            div = form.parentNode;
            item = div.firstChild.nextSibling;
            productName = item.getAttribute('data-product');
            productPrice = parseInt(item.getAttribute('data-price'));
        }
        // Otherwise added by dragging and dropping
        else {
            productName = item.getAttribute('data-product');
            productPrice = parseInt(item.getAttribute('data-price'));
        }

        list.innerHTML += '<li data-price="' + productPrice + '">' + productName + '<button class="delete" role="button">Delete</button></li>';

        checkPrices();
        deleteButtonListeners();

        // Add status message
        removeClass(message, 'hidden');
        removeClass(message, 'draggingMsg');
        removeClass(message, 'deleteMsg');
        addClass(message, 'is-visible');
        addClass(message, 'successMsg');

        // Show message
        showMessage("Product toegevoegd &#10004", "added");
    }

    // Delete products from grocery list
    function deleteItem(item) {
        var elem = item.parentElement;
        elem.remove();
        checkPrices();

        removeClass(message, 'draggingMsg');
        removeClass(message, 'successMsg');
        addClass(message, 'deleteMsg');

        showMessage("Product verwijderd &#10004;", "deleted");

        // Remove status message if grocery list is empty
        var listItems = document.querySelectorAll('#grocery-list li');

        if (!listItems.length) {
            removeClass(message, 'deletemsg');
            addClass(message, 'hidden');
        }
    }

    // Count total prices and add up
    function checkPrices() {
        var listItems = document.querySelectorAll('#grocery-list li'),
            total = 0;

        [].forEach.call(listItems, function(item) {
            total += Number(item.getAttribute('data-price'));
        });
        totalPrice.innerHTML = "&euro; " + total;
    }

    // Remove product functionality to delete buttons
    function deleteButtonListeners() {
        var deleteButtons = document.querySelectorAll(".delete");

        [].forEach.call(deleteButtons, function(button) {
            button.addEventListener('click', function(index) {
                return function() {
                    deleteItem(index);
                };
            }(button), true);
        });
    }

    // Add product functionality to buttons
    function addButtonListeners() {
        var addButtons = document.querySelectorAll('#products button');

        [].forEach.call(addButtons, function(button) {
            button.addEventListener('click', function(index) {
                return function() {
                    addItem(index);
                };
            }(button), true);
        });
    }

    // Status message above grocery list
    function showMessage(message, statusMsg) {
        var messageBox = document.querySelector('#message');
        messageBox.innerHTML = message;
        status = statusMsg;
    }

    function addFunctions() {

        function handleDragStart(e) {
            selected = this;

            removeClass(message, 'hidden');

            showMessage("Sleep hierin om toe te voegen", "dragging");
            addClass(this, 'opacity');
            addClass(list, 'over');

            removeClass(message, 'deleteMsg');
            removeClass(message, 'successMsg');
            addClass(message, 'is-visible');
            addClass(message, 'draggingMsg');
        }

        function handleDragOver(e) {
            // Allows to drop
            if (e.preventDefault) {
                e.preventDefault();
            }
            return false;
        }

        function handleDragEnter(e) {
            removeClass(list, 'over');
            addClass(list, 'yellow');
            console.log("handleDragEnter");
        }

        function handleDragLeave(e) {
            addClass(list, 'over');
            console.log("handleDragLeave");
        }

        function handleDrop(e) {

            if (e.stopPropagation) {
                e.stopPropagation(); // stops the browser from redirecting.
            }

            // If dropped add item to list
            addItem(selected);
            checkPrices();

            // Add status message
            removeClass(message, 'hidden');
            removeClass(message, 'is-visible');
            removeClass(message, 'draggingMsg');
            removeClass(message, 'deleteMsg');
            addClass(message, 'successMsg');
            showMessage("Product toegevoegd &#10004", "added");

            console.log("handleDrop");

            return false;
        }

        function handleDragEnd(e) {

            // Remove status message if grocery list is empty
            var listItems = document.querySelectorAll('#grocery-list li');

            if (status === "dragging")
                addClass(message, 'hidden');

            // Remove classes
            removeClass(message, 'is-visible');
            removeClass(message, 'draggingMsg');

            removeClass(list, 'over');
            removeClass(list, 'yellow');

            [].forEach.call(items, function(item) {
                removeClass(item, 'opacity');
            });

            console.log("handleDragEnd");
        }

        // On page ready
        document.addEventListener('DOMContentLoaded', function() {

            // Add events
            list.addEventListener('dragenter', handleDragEnter, false)
            list.addEventListener('dragover', handleDragOver, false);
            list.addEventListener('drop', handleDrop, false);
            list.addEventListener('dragleave', handleDragLeave, false);

            var items = document.querySelectorAll('#products .item');

            [].forEach.call(items, function(item) {
                item.addEventListener('dragstart', handleDragStart, false);
                item.addEventListener('dragend', handleDragEnd, false);
            });
        });
    }
}
