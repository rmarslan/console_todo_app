import { TodoItem } from "./todoItem";

type ItemCounts = {
  total: number;
  incomplete: number;
};

export class TodoCollection {
  private nextId: number = 1;
  protected todos = new Map<number, TodoItem>();
  public username: string;

  public constructor(username: string, todos: TodoItem[] = []) {
    this.username = username;
    todos.forEach((todo) => this.todos.set(todo.id, todo));
  }

  public getTodo(id: number): TodoItem | undefined {
    return this.todos.get(id);
  }

  public addTodo(task: string): number {
    while (this.getTodo(this.nextId)) this.nextId++;

    this.todos.set(this.nextId, new TodoItem(this.nextId, task));

    return this.nextId;
  }

  public markComplete(id: number, complete: boolean = true): void {
    const foundTodo = this.getTodo(id);
    if (foundTodo) {
      foundTodo.complete = complete;
    }
  }

  public getTodos(includeCompleted: boolean): TodoItem[] {
    return [...this.todos.values()].filter(
      (todo) => includeCompleted || !todo.complete
    );
  }

  public removeComplete() {
    this.todos.forEach((todo) => {
      if (todo.complete) {
        this.todos.delete(todo.id);
      }
    });
  }

  public getItemsCount(): ItemCounts {
    return {
      total: this.todos.size,
      incomplete: this.getTodos(false).length,
    };
  }
}
