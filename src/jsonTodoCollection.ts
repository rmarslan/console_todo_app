import * as lowdb from "lowdb";
import * as FileSync from "lowdb/adapters/FileSync";
import { TodoItem } from "./todoItem";
import { TodoCollection } from "./todoCollection";

type schemaType = {
  tasks: {
    id: number;
    task: string;
    complete: boolean;
  }[];
};

export class JsonTodoCollection extends TodoCollection {
  private database: lowdb.LowdbSync<schemaType>;
  constructor(public username: string, todoItems: TodoItem[]) {
    super(username, []);
    this.database = lowdb(new FileSync("Todos.json"));
    if (this.database.has("tasks").value()) {
      const dbItems = this.database.get("tasks").value();
      dbItems.forEach((item) => {
        this.todos.set(
          item.id,
          new TodoItem(item.id, item.task, item.complete)
        );
      });
    } else {
      this.database.set("tasks", todoItems).write();
      todoItems.forEach((item) => this.todos.set(item.id, item));
    }
  }

  private storeTasks(): void {
    this.database.set("tasks", [...this.todos.values()]).write();
  }

  public addTodo(task: string): number {
    const result = super.addTodo(task);
    this.storeTasks();
    return result;
  }

  public markComplete(id: number, complete: boolean = false): void {
    super.markComplete(id, complete);
    this.storeTasks();
  }

  public removeComplete(): void {
    super.removeComplete();
    this.storeTasks();
  }
}
