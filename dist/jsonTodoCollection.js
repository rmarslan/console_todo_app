"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonTodoCollection = void 0;
const lowdb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const todoItem_1 = require("./todoItem");
const todoCollection_1 = require("./todoCollection");
class JsonTodoCollection extends todoCollection_1.TodoCollection {
    constructor(username, todoItems) {
        super(username, []);
        this.username = username;
        this.database = lowdb(new FileSync("Todos.json"));
        if (this.database.has("tasks").value()) {
            const dbItems = this.database.get("tasks").value();
            dbItems.forEach((item) => {
                this.todos.set(item.id, new todoItem_1.TodoItem(item.id, item.task, item.complete));
            });
        }
        else {
            this.database.set("tasks", todoItems).write();
            todoItems.forEach((item) => this.todos.set(item.id, item));
        }
    }
    storeTasks() {
        this.database.set("tasks", [...this.todos.values()]).write();
    }
    addTodo(task) {
        const result = super.addTodo(task);
        this.storeTasks();
        return result;
    }
    markComplete(id, complete = false) {
        super.markComplete(id, complete);
        this.storeTasks();
    }
    removeComplete() {
        super.removeComplete();
        this.storeTasks();
    }
}
exports.JsonTodoCollection = JsonTodoCollection;
