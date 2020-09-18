"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer = require("inquirer");
const todoItem_1 = require("./todoItem");
const jsonTodoCollection_1 = require("./jsonTodoCollection");
const todos = [
    new todoItem_1.TodoItem(1, "Buy flowers"),
    new todoItem_1.TodoItem(2, "Call Joe"),
    new todoItem_1.TodoItem(3, "Collect Tikets"),
    new todoItem_1.TodoItem(4, "Buy shoes", true),
];
const collection = new jsonTodoCollection_1.JsonTodoCollection("Arslan", todos);
let showCompleted = true;
function displayTodos() {
    console.log(`${collection.username}'s Todo List ` +
        `(${collection.getItemsCount().incomplete} items to do)`);
    collection.getTodos(showCompleted).forEach((todo) => todo.printDetails());
}
var Commands;
(function (Commands) {
    Commands["Add"] = "Add new task";
    Commands["Complete"] = "Complete Task";
    Commands["Toggle"] = "Show/Hide Completed";
    Commands["Purge"] = "Remove completed tasks";
    Commands["Quit"] = "Quit";
})(Commands || (Commands = {}));
function promptUser() {
    console.clear();
    displayTodos();
    inquirer
        .prompt({
        type: "list",
        choices: Object.values(Commands),
        name: "command",
        message: "choose option",
    })
        .then((answers) => {
        switch (answers["command"]) {
            case Commands.Toggle:
                showCompleted = !showCompleted;
                promptUser();
                break;
            case Commands.Add:
                addTaskPrompt();
                break;
            case Commands.Complete:
                promptComplete();
                break;
            case Commands.Purge:
                purgeCompleted();
                break;
        }
    });
}
function addTaskPrompt() {
    console.log("Add new Task....");
    console.clear();
    inquirer
        .prompt({
        type: "input",
        name: "add",
        message: "Enter task: ",
    })
        .then((answers) => {
        if (answers["add"] !== "") {
            collection.addTodo(answers["add"]);
        }
        promptUser();
    });
}
function promptComplete() {
    console.clear();
    inquirer
        .prompt({
        type: "checkbox",
        name: "complete",
        message: "Mark Task Complete",
        choices: collection.getTodos(showCompleted).map((item) => ({
            name: item.task,
            value: item.id,
            checked: item.complete,
        })),
    })
        .then((answers) => {
        const compltedTasks = answers.complete;
        collection.getTodos(true).forEach((item) => {
            collection.markComplete(item.id, compltedTasks.find((id) => id === item.id) !== undefined);
        });
        promptUser();
    });
}
function purgeCompleted() {
    collection.removeComplete();
    promptUser();
}
promptUser();
