import * as inquirer from "inquirer";
import { TodoItem } from "./todoItem";
import { JsonTodoCollection } from "./jsonTodoCollection";

const todos = [
  new TodoItem(1, "Buy flowers"),
  new TodoItem(2, "Call Joe"),
  new TodoItem(3, "Collect Tikets"),
  new TodoItem(4, "Buy shoes", true),
];

const collection = new JsonTodoCollection("Arslan", todos);
let showCompleted = true;

function displayTodos(): void {
  console.log(
    `${collection.username}'s Todo List ` +
      `(${collection.getItemsCount().incomplete} items to do)`
  );
  collection.getTodos(showCompleted).forEach((todo) => todo.printDetails());
}

enum Commands {
  Add = "Add new task",
  Complete = "Complete Task",
  Toggle = "Show/Hide Completed",
  Purge = "Remove completed tasks",
  Quit = "Quit",
}

function promptUser(): void {
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

function addTaskPrompt(): void {
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

function promptComplete(): void {
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
      const compltedTasks = answers.complete as number[];

      collection.getTodos(true).forEach((item) => {
        collection.markComplete(
          item.id,
          compltedTasks.find((id) => id === item.id) !== undefined
        );
      });
      promptUser();
    });
}

function purgeCompleted(): void {
  collection.removeComplete();
  promptUser();
}

promptUser();
