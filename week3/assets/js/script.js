function start() {

    "use strict";

    // Feature detection
    var supportsDragAndDrop = function() {
        var div = document.createElement('div');
        return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
    };

    // Check if draganddrop is supported
    if (supportsDragAndDrop) {
        addFunctions();
    } else {
        addButtonListeners();
    }

    // Global vars
    var list = document.querySelector('#grocery-list'),
        totalPrice = document.querySelector('#totalPrice'),
        items = document.querySelectorAll('#products .item'),
        message = document.querySelector('#message'),
        selected;

    function addItem(item) {

        var productName, productPrice;

        if (item.nodeName == "BUTTON") {
            item = item.previousElementSibling;
            productName = item.getAttribute('data-product');
            productPrice = parseInt(item.getAttribute('data-price'));
        } else {
            productName = item.getAttribute('data-product');
            productPrice = parseInt(item.getAttribute('data-price'));
        }

        list.innerHTML += '<li data-price="' + productPrice + '">' + productName + '<button class="delete" rel="button">Delete</button></li>';

        checkPrices();
        deleteButtonListeners();

        // Add status message
        message.classList.remove('hidden');
        message.classList.remove('draggingMsg');
        message.classList.remove('deleteMsg');
        message.classList.add('is-visible');
        message.classList.add('successMsg');
        showMessage("Product toegevoegd &#10004");
    }

    function deleteItem(item) {
        var elem = item.parentElement;
        elem.remove();
        checkPrices();
        message.classList.remove('is-visible');
        message.classList.remove('draggingMsg');
        message.classList.remove('successMsg');
        message.classList.add('deleteMsg');
        showMessage("Product verwijderd &#10004;");

        // Remove status message if grocery list is empty
        var listItems = document.querySelectorAll('#grocery-list li');

        if (!listItems.length) {
            message.classList.remove('deleteMsg');
            message.classList.add('hidden');
        }
    }

    function checkPrices() {
        var listItems = document.querySelectorAll('#grocery-list li'),
            total = 0;

        [].forEach.call(listItems, function(item) {
            total += Number(item.getAttribute('data-price'));
        });
        totalPrice.innerHTML = "&euro; " + total;
    }

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

    function showMessage(message) {
        var messageBox = document.querySelector('#message');
        messageBox.innerHTML = message;
    }

    function addFunctions() {

        // Show core functionality buttons for adding to grocery list
        function hideButtons() {
            var buttons = document.querySelectorAll('#products button');
            [].forEach.call(buttons, function(button) {
                button.classList.add("hidden");
            });
        }

        function handleDragStart(e) {
            selected = this;
            message.classList.remove('hidden');
            showMessage("Sleep hierin om toe te voegen");
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
            addButtonListeners();

            // Add status message
            message.classList.remove('hidden');
            message.classList.remove('is-visible');
            message.classList.remove('draggingMsg');
            message.classList.remove('deleteMsg');
            message.classList.add('successMsg');
            showMessage("Product toegevoegd &#10004");

            console.log("handleDrop");

            return false;
        }

        function handleDragEnd(e) {

            // Remove status message if grocery list is empty
            var listItems = document.querySelectorAll('#grocery-list li');

            if (!listItems.length)
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

            // Hide core functionality buttons
            hideButtons();

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

start();