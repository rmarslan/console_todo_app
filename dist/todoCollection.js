"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoCollection = void 0;
const todoItem_1 = require("./todoItem");
class TodoCollection {
    constructor(username, todos = []) {
        this.nextId = 1;
        this.todos = new Map();
        this.username = username;
        todos.forEach((todo) => this.todos.set(todo.id, todo));
    }
    getTodo(id) {
        return this.todos.get(id);
    }
    addTodo(task) {
        while (this.getTodo(this.nextId))
            this.nextId++;
        this.todos.set(this.nextId, new todoItem_1.TodoItem(this.nextId, task));
        return this.nextId;
    }
    markComplete(id, complete = true) {
        const foundTodo = this.getTodo(id);
        if (foundTodo) {
            foundTodo.complete = complete;
        }
    }
    getTodos(includeCompleted) {
        return [...this.todos.values()].filter((todo) => includeCompleted || !todo.complete);
    }
    removeComplete() {
        this.todos.forEach((todo) => {
            if (todo.complete) {
                this.todos.delete(todo.id);
            }
        });
    }
    getItemsCount() {
        return {
            total: this.todos.size,
            incomplete: this.getTodos(false).length,
        };
    }
}
exports.TodoCollection = TodoCollection;
