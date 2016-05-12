// Start if javascript core functions are up and running
if ((document.querySelectorAll || document.querySelector) && ('forEach' in Array.prototype)) {
    start();
}

function start() {

    "use strict";

    // Add button functionality
    addButtonListeners();

    // Feature detection for drag and drop
    var supportsDragAndDrop = function() {
        var div = document.createElement('div');
        return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
    };

    // Check if draganddrop is supported
    if (supportsDragAndDrop) {
        addFunctions();
    }

    // Global vars
    var list = document.querySelector('#grocery-list'),
        totalPrice = document.querySelector('#totalPrice'),
        items = document.querySelectorAll('#products .item'),
        message = document.querySelector('#message'),
        selected,
        status;

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
        message.classList.remove('hidden');
        message.classList.remove('draggingMsg');
        message.classList.remove('deleteMsg');
        message.classList.add('is-visible');
        message.classList.add('successMsg');
        showMessage("Product toegevoegd &#10004", "added");
    }

    // Delete products from grocery list
    function deleteItem(item) {
        var elem = item.parentElement;
        elem.remove();
        checkPrices();
        message.classList.remove('is-visible');
        message.classList.remove('draggingMsg');
        message.classList.remove('successMsg');
        message.classList.add('deleteMsg');
        showMessage("Product verwijderd &#10004;", "deleted");

        // Remove status message if grocery list is empty
        var listItems = document.querySelectorAll('#grocery-list li');

        if (!listItems.length) {
            message.classList.remove('deleteMsg');
            message.classList.add('hidden');
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
            message.classList.remove('hidden');
            showMessage("Sleep hierin om toe te voegen", "dragging");
            this.classList.add('opacity');
            list.classList.add('over');
            message.classList.remove('deleteMsg');
            message.classList.remove('successMsg');
            message.classList.add('is-visible');
            message.classList.add('draggingMsg');
        }

        function handleDragOver(e) {
            // Allows to drop
            if (e.preventDefault) {
                e.preventDefault();
            }
            return false;
        }

        function handleDragEnter(e) {
            list.classList.remove('over');
            list.classList.add('yellow');
            console.log("handleDragEnter");
        }

        function handleDragLeave(e) {
            list.classList.add('over');
            console.log("handleDragLeave");
        }

        function handleDrop(e) {

            if (e.stopPropagation) {
                e.stopPropagation(); // stops the browser from redirecting.
            }

            // If dropped add item to list
            addItem(selected);
            checkPrices();
            //addButtonListeners();

            // Add status message
            message.classList.remove('hidden');
            message.classList.remove('is-visible');
            message.classList.remove('draggingMsg');
            message.classList.remove('deleteMsg');
            message.classList.add('successMsg');
            showMessage("Product toegevoegd &#10004", "added");

            console.log("handleDrop");

            return false;
        }

        function handleDragEnd(e) {

            // Remove status message if grocery list is empty
            var listItems = document.querySelectorAll('#grocery-list li');

            if (status === "dragging")
                message.classList.add('hidden');

            // Remove classes
            message.classList.remove('is-visible');
            message.classList.remove('draggingMsg');
            list.classList.remove('over');
            list.classList.remove('yellow');

            [].forEach.call(items, function(item) {
                item.classList.remove('opacity');
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
