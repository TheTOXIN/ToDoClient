var inputTask = document.getElementById('new-task');
var unfinishedTasks = document.getElementById('unfinished-tasks');
var finishedTasks = document.getElementById('finished-tasks');
var loginWindow = document.getElementById("login");
var rootWindow = document.getElementById("root");
var descriptionWindow = document.getElementById("description");
var underWindow = document.getElementById("under");
var signHeader = document.getElementById("sign");
var loginInput = document.getElementById("log-input");
var passwordInput = document.getElementById("pas-input");
var registerInput = document.getElementById("reg-input");
var welcomeMsg = document.getElementById("welcome");
var boxWindow = document.getElementById("description");
var notificationWindow = document.getElementById("notification");

const max = 50;//TODO OMG

function createNewElement(task, finish) {
    var checkbox = document.createElement('button');
    checkbox.className = "material-icons checkbox";

    if (finish) {
        checkbox.innerHTML = "<i class='material-icons'>check_box</i>";
    } else {
        checkbox.innerHTML = "<i class='material-icons'>check_box_outline_blank</i>";
    }

    var label = document.createElement('label');
    label.innerText = task;

    var input = document.createElement('input');
    input.type = "text";

    var menu = document.createElement('div');

    var descriptionButton = document.createElement('button');
    descriptionButton.className = "material-icons description";
    descriptionButton.innerHTML = "<i class='material-icons'>description</i>";

    var editButton = document.createElement('button');
    editButton.className = "material-icons edit";
    editButton.innerHTML = "<i class='material-icons'>edit</i>";

    var deleteButton = document.createElement('button');
    deleteButton.className = "material-icons delete";
    deleteButton.innerHTML = "<i class='material-icons'>delete</i>";

    var menuButton = document.createElement('button');
    menuButton.className = "material-icons menu";
    menuButton.innerHTML = "<i class='material-icons'>menu</i>";

    var listItem = document.createElement('li');
    listItem.setAttribute("style", "display: none");

    listItem.appendChild(checkbox);
    listItem.appendChild(label);
    listItem.appendChild(input);
    listItem.appendChild(menu);
    menu.appendChild(deleteButton);
    menu.appendChild(editButton);
    menu.appendChild(descriptionButton);
    listItem.appendChild(menuButton);

    return listItem;
}

function createTask() {
    if (inputTask.value && inputTask.value.length < max) {
        var task = {
            title: inputTask.value,
            finished: false,
            description: "",
            date: new Date().toISOString().substring(0, 10),
            user: "https://to-do-server.herokuapp.com/rest/users/" + userId
        };

        load(task);
        inputTask.value = "";

        return task;
    } else {
        showNotification("LONG", true);
    }

    return null;
}

function deleteTask() {
    var li = this.parentNode.parentNode;
    var title = li.querySelector('label').innerText;

    $(li).hide(1000);

    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].title === title) {
            angular.element(document.getElementById('ToDo')).scope().removeTask(tasks[i]);
        }
    }
}

function editTask() {
    var editButton = this;
    var listItem = editButton.parentNode.parentNode;
    var label = listItem.querySelector('label');
    var input = listItem.querySelector('input');
    var containsClass = listItem.classList.contains('editMode');
    var title = label.innerText;

    if (containsClass) {
        if (input.value.length === 0 || input.value.length > max) {
            showNotification("INVALID", true);
            return;
        }

        label.innerText = input.value;

        editButton.className = "material-icons edit";
        editButton.innerHTML = "<i class='material-icons'>edit</i>";

        for (var i = 0; i < tasks.length; i++) {
            if (tasks[i].title === title) {
                tasks[i].title = input.value;
                angular.element(document.getElementById('ToDo')).scope().updateTask(tasks[i]);
            }
        }
    } else {
        input.value = label.innerText;
        editButton.className = "material-icons save";
        editButton.innerHTML = "<i class='material-icons'>save</i>";
    }

    listItem.classList.toggle('editMode');
}

function showDescription() {
    rootWindow.style.filter = "blur(3px)";
    descriptionWindow.style.display = "block";

    var descriptionButton = this;
    var listItem = descriptionButton.parentNode.parentNode;
    var label = listItem.querySelector('label');
    var title = label.innerText;
    var h2 = boxWindow.querySelector('h2');
    var h4 = boxWindow.querySelector('h4');
    var textarea = boxWindow.querySelector('textarea');

    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].title === title) {
            var task = tasks[i];
            h2.innerText = task.title;
            h4.innerText = task.date;
            textarea.value = task.description;
        }
    }
}

function hideDescription() {
    rootWindow.style.filter = "blur(0px)";
    descriptionWindow.style.display = "none";

    var h2 = boxWindow.querySelector('h2');
    var title = h2.innerText;
    var textarea = boxWindow.querySelector('textarea');

    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].title === title) {
            tasks[i].description = textarea.value;
            angular.element(document.getElementById('ToDo')).scope().updateTask(tasks[i]);
        }
    }
}

function finishedTask() {
    var checkbox = this;
    var li = checkbox.parentNode;
    var containsClass = li.classList.contains('editMode');

    if (!containsClass) {
        checkbox.className = "material-icons checkbox";
        checkbox.innerHTML = "<i class='material-icons'>check_box</i>";

        $(li).slideUp().fadeOut(500);

        setTimeout(function () {
            finishedTasks.appendChild(li);
        }, 500);

        bindTaskEvents(li, unfinishedTask);

        var title = li.querySelector('label').innerText;
        for (var i = 0; i < tasks.length; i++) {
            if (tasks[i].title === title) {
                tasks[i].finished = true;
                angular.element(document.getElementById('ToDo')).scope().updateTask(tasks[i]);
            }
        }

        $(li).slideDown().fadeIn(500);
    } else {
        showNotification("SAVE TODO", true);
    }
}

function unfinishedTask() {
    var checkbox = this;
    var li = checkbox.parentNode;
    var containsClass = li.classList.contains('editMode');

    if (!containsClass) {
        checkbox.className = "material-icons checkbox";
        checkbox.innerHTML = "<i class='material-icons'>check_box_outline_blank</i>";

        $(li).slideUp().fadeOut(500);

        setTimeout(function () {
            unfinishedTasks.appendChild(li);
        }, 500);

        bindTaskEvents(li, finishedTask);

        var title = li.querySelector('label').innerText;
        for (var i = 0; i < tasks.length; i++) {
            if (tasks[i].title === title) {
                tasks[i].finished = false;
                angular.element(document.getElementById('ToDo')).scope().updateTask(tasks[i]);
            }
        }

        $(li).slideDown().fadeIn(500);
    } else {
        showNotification("SAVE TODO", true);
    }
}

function expandTasks() {
    if ($(finishedTasks).css('display') === "block") {
        $(finishedTasks).slideUp(500);
        $('#expand').html("expand_more");
    } else {
        $(finishedTasks).slideDown(500);
        $('#expand').html("expand_less");
    }
}

function expandMenu() {
    var menu = this;
    var li = this.parentNode;
    var div = li.querySelector("div");

    if ($(menu).css('display') === "block") {
        $(menu).hide('slow');
        $(div).show('slow');
    }

    setTimeout(function () {
        $(menu).show('slow');
        $(div).hide('slow');
    }, 5000);
}

function bindTaskEvents(listItem, checkboxEvent) {
    var checkbox = listItem.querySelector('button.checkbox');
    var editButton = listItem.querySelector('button.edit');
    var deleteButton = listItem.querySelector('button.delete');
    var descriptionButton = listItem.querySelector('button.description');
    var menuButton = listItem.querySelector('button.menu');

    checkbox.onclick = checkboxEvent;
    editButton.onclick = editTask;
    deleteButton.onclick = deleteTask;
    descriptionButton.onclick = showDescription;
    menuButton.onclick = expandMenu;
}

function load(task) {
    var listItem = createNewElement(task.title, task.finished);

    if (task.finished) {
        finishedTasks.appendChild(listItem);
        bindTaskEvents(listItem, unfinishedTask)
    } else {
        unfinishedTasks.appendChild(listItem);
        bindTaskEvents(listItem, finishedTask)
    }

    $(listItem).show(1000);
}

function processLogin() {
    if (loginInput.value.length === 0 || passwordInput.value.length === 0)
        return null;

    return {
        login: loginInput.value,
        password: passwordInput.value,
        reg: registerInput.checked
    };
}

function showLogin() {
    loginWindow.style.display = "none";
    rootWindow.style.display = "none";
    underWindow.style.display = "none";

    $(loginWindow).fadeIn(1000);
    $(underWindow).slideDown(500);
}

function hideLogin() {
    $(loginWindow).fadeOut(500);
    $(rootWindow).fadeIn(500);
}

function showError() {
    $("#message").show('slow');
    setTimeout(function () {
        $("#message").hide('slow');
    }, 3000);
}

function showNotification(msg, wrn) {
    var p = notificationWindow.querySelector("p");

    p.innerText = msg;
    if (wrn) {
        p.style.color = 'red';
    } else {
        p.style.color = 'green';
    }

    $(notificationWindow).slideDown('slow');
    setTimeout(function () {
        $(notificationWindow).slideUp('slow');
    }, 5000);
}

function changeHeader() {
    if (registerInput.checked) {
        signHeader.innerText = "SIGN UP";
    } else {
        signHeader.innerText = "SIGN IN";
    }
}

function showWelcome(msg) {
    $(welcomeMsg).slideUp(500);
    setTimeout(function () {
        welcomeMsg.innerText = msg;
        $(welcomeMsg).slideDown(500);
    }, 500);
}

function showTask(task) {
    load(task);
}

function showLoader() {
    $("#loadImg").fadeIn(1000);
}

function hideLoader() {
    $("#loadImg").fadeOut(1000);
}

// function saveData(token, userId) {
//     document.cookie = "token:" + token;
//     document.cookie = "userId:" + userId;
// }

// function deleteToken() {
//
// }

// function logout() {
//     deleteToken();
//     location.reload();
// }

// var oldScrollY_2 = 0;
// window.onscroll = function () {
//     var scrolled = window.pageYOffset || document.documentElement.scrollTop;
//     var dY = scrolled - oldScrollY_2;
//
//     if (dY > 0) {
//         $("#logout").slideDown(500);
//     } else {
//         $("#logout").slideUp(500);
//     }
//
//     oldScrollY_2 = scrolled;
// };

//
// function bindEnter() {
//     $('html').keydown(function (e) {
//         if (e.keyCode === 13 && $(rootWindow).css('display') === 'block') {
//             showLoader();
//             createTask();
//         }
//     });
// }

function bindScrollUnder() {
    var oldScrollY_1 = 0;
    window.onscroll = function () {
        var scrolled = window.pageYOffset || document.documentElement.scrollTop;
        var dY = scrolled - oldScrollY_1;

        if (dY > 0) {
            $("#under").slideUp(500);
        } else {
            $("#under").slideDown(500);
        }

        oldScrollY_1 = scrolled;
    };
}

function bindScrollDescription() {
    $(document).scroll(function () {
        var document = $(this);
        var block = $('#description');
        var position = block.height() + document.scrollTop();
        block.css('top', Math.round(position) + 'px');
    });
}

function bindEvent() {
    bindScrollUnder();
    bindScrollDescription();
}

function main() {
    showLogin();
    bindEvent();
}

main();