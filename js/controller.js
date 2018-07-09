var app = angular.module('ToDoApp', []);
var userId;
var user;
var tasks = [];

app.controller('ToDoCtrl', function ($scope, $http) {

    $scope.init = function () {
        $http({
            url: "https://to-do-server.herokuapp.com/hello/",
            method: "GET",
            transformResponse: [function (data) {
                console.log(data);
                return data;
            }]
        });
    };

    $scope.oauthToken = function (request) {
        var client = "todo-client";
        var secret = "todo-secret";
        var grantType = "password";

        $http({
            method: 'POST',
            url: "http://to-do-server.herokuapp.com/oauth/token",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic dG9kby1jbGllbnQ6dG9kby1zZWNyZXQ='
            },
            data: "username=admin&password=root&grant_type=password"
        }).then(function (response) {
            console.log("SUCCESS");
            console.log(response);
        }).catch(function (response) {
            console.log("ERROR");
            console.log(response);
        });
    };

    $scope.signUser = function () {
        showLoader();

        var request = processLogin();

        if (request === null)  {
            hideLoader();
            return;
        }

        $http.post("https://to-do-server.herokuapp.com/sign/", request)
            .then(function (response) {
                userId = response.data.userId;
                if (userId === null) {
                    showError();
                } else {
                    $scope.oauthToken(request);
                    // $scope.getUser(userId);
                    // $scope.toDoUser(userId);
                    //
                    // //saveToken(token);
                    // hideLogin();
                }
                hideLoader();
            });
    };

    $scope.toDoUser = function (token) {
        $http.post("https://to-do-server.herokuapp.com/todo/", {userId: token})
            .then(function (response) {
                var tasksId = response.data.tasksId;
                $scope.getTasks(tasksId);
            });
    };

    $scope.getUser = function (token) {
        $http.get("https://to-do-server.herokuapp.com/rest/users/" + token)
            .then(function (response) {
                user = response.data;
                showUser(response.data);
            });
    };

    $scope.getTasks = function (tasksId) {
        for (var i = 0; i < tasksId.length; i++) {
            $http.get("https://to-do-server.herokuapp.com/rest/tasks/" + tasksId[i])
                .then(function (response) {
                    tasks.push(response.data);
                    showTask(response.data);
                });
        }
    };

    $scope.addTask = function () {
        showLoader();
        var task = createTask();
        if (task === null) return;
        $http.post("https://to-do-server.herokuapp.com/rest/tasks/", task)
            .then(function (response) {
                tasks.push(response.data);
                hideLoader();
                showNotification("ADD", false);
            })
            .catch(function () {
                hideLoader();
                showNotification("ERROR", true);
            });
    };

    $scope.removeTask = function (task) {
        showLoader();
        $http.delete(task._links.self.href)
            .then(function () {
                hideLoader();
                showNotification("DELETE", false);
            })
            .catch(function () {
                hideLoader();
                showNotification("ERROR", true);
            });
    };

    $scope.updateTask = function (task) {
        showLoader();
        $http.patch(task._links.self.href, {
            title: task.title,
            finished: task.finished,
            description: task.description,
            date: task.date
        }).then(function () {
            hideLoader();
            showNotification("UPDATE", false);
        })
        .catch(function () {
            hideLoader();
            showNotification("ERROR", true);
        });
    };
});