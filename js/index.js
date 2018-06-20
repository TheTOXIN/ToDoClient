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

const max = 50;

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

    var descriptionButton = document.createElement('button');
    descriptionButton.className = "material-icons description";
    descriptionButton.innerHTML = "<i class='material-icons'>description</i>";

    var editButton = document.createElement('button');
    editButton.className = "material-icons edit";
    editButton.innerHTML = "<i class='material-icons'>edit</i>";

    var deleteButton = document.createElement('button');
    deleteButton.className = "material-icons delete";
    deleteButton.innerHTML = "<i class='material-icons'>delete</i>";

    var listItem = document.createElement('li');
    listItem.setAttribute("style", "display: none");

    listItem.appendChild(checkbox);
    listItem.appendChild(label);
    listItem.appendChild(input);
    listItem.appendChild(deleteButton);
    listItem.appendChild(editButton);
    listItem.appendChild(descriptionButton);

    return listItem;
}

function createTask() {
    if (inputTask.value && inputTask.value.length < max) {
        var task = {
            title: inputTask.value,
            finished: false,
            description: "",
            date: new Date().toISOString().substring(0, 10),
            user: "https://to-do-server.herokuapp.com/rest/users/" + token
        };

        load(task);
        inputTask.value = "";

        return task;
    } else {
        showNotification("INVALID", true);
    }

    return null;
}

function deleteTask() {
    var li = this.parentNode;
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
    var listItem = editButton.parentNode;
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
    var listItem = descriptionButton.parentNode;
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

        finishedTasks.appendChild(li);
        bindTaskEvents(li, unfinishedTask);

        var title = li.querySelector('label').innerText;
        for (var i = 0; i < tasks.length; i++) {
            if (tasks[i].title === title) {
                tasks[i].finished = true;
                angular.element(document.getElementById('ToDo')).scope().updateTask(tasks[i]);
            }
        }
    } else {
        alert("СОХРАНИТЕ TODO");
    }
}

function unfinishedTask() {
    var checkbox = this;
    var li = checkbox.parentNode;
    var containsClass = li.classList.contains('editMode');

    if (!containsClass) {
        checkbox.className = "material-icons checkbox";
        checkbox.innerHTML = "<i class='material-icons'>check_box_outline_blank</i>";

        unfinishedTasks.appendChild(li);
        bindTaskEvents(li, finishedTask);

        var title = li.querySelector('label').innerText;
        for (var i = 0; i < tasks.length; i++) {
            if (tasks[i].title === title) {
                tasks[i].finished = false;
                angular.element(document.getElementById('ToDo')).scope().updateTask(tasks[i]);
            }
        }
    } else {
        alert("СОХРАНИТЕ TODO");
    }
}

function bindTaskEvents(listItem, checkboxEvent) {
    var checkbox = listItem.querySelector('button.checkbox');
    var editButton = listItem.querySelector('button.edit');
    var deleteButton = listItem.querySelector('button.delete');
    var descriptionButton = listItem.querySelector('button.description');

    checkbox.onclick = checkboxEvent;
    editButton.onclick = editTask;
    deleteButton.onclick = deleteTask;
    descriptionButton.onclick = showDescription;
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
    }, 2000);
}

function changeHeader() {
    if (registerInput.checked) {
        signHeader.innerText = "SIGN IN";
    } else {
        signHeader.innerText = "SIGN UP";
    }
}

var msgs = [
    "Hello ",
    "Hi ",
    "Welcome ",
    "Your so cute ",
    "Very nice ",
    "Amazing day! ",
    "Go ToDo ",
    "You need more ToDo ",
    "All right ",
    "I'm glad to see you ",
    "How are you? ",
    "Omg, it's you ",
    "Yeeeah ",
    "Please visit my GtiHub ",
    "How many Todo ",
    "JUST DO IT "
];

function showUser(user) {
    $(welcomeMsg).slideUp(500);
    setTimeout(function () {
        welcomeMsg.innerText = msgs[Math.floor(Math.random() * msgs.length)] + user.login;
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

function saveToken(token) {
    var date = new Date();
    date.setDate(date.getDate() + 1);
    document.cookie = "token:" + token;
}

function deleteToken() {

}

function logout() {
    deleteToken();
    location.reload();
}

var oldScrollY_1 = 0;
window.onscroll = function () {
    var scrolled = window.pageYOffset || document.documentElement.scrollTop;
    var dY = scrolled - oldScrollY;

    if (dY > 0) {
        $("#under").slideUp(500);
    } else {
        $("#under").slideDown(500);
    }

    oldScrollY = scrolled;
};

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

function main() {
    showLogin();
}

main();