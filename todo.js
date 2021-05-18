#! /usr/bin/env node
// console.log(process.argv);
const chalk = require('chalk');
const args = process.argv;
//setting up a local db
const rl = require('readline');
const low = require('lowdb');
const fileSync = require('lowdb/adapters/FileSync');
const adapter = new fileSync('db.json');
const db = low(adapter);
// setting defaults for the db
db.defaults({ todos: [] }).write();

//promting users for input
function prompt(question) {
  const r = rl.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });
  return new Promise((resolve, error) => {
    r.question(question, (answer) => {
      r.close();
      resolve(answer);
    });
  });
}

//adding new // TODO:
function newTodo() {
  const q = chalk.yellow('Type in our Todo\n');
  prompt(q).then((todo) => {
    //add to db
    db.get('todos')
      .push({
        title: todo,
        complete: false,
      })
      .write();
  });
}

//retrieve todos
function getTodos() {
  const todos = db.get('todos').value();
  let index = 1;
  todos.forEach((todo) => {
    let todoText = `${index++} . ${todo.title}   `;
    if (todo.complete) {
      todoText += '✓';
    } else {
      todoText += '✘';
    }
    console.log(todoText);
  });
}
//marking todos as complete
/*
1. user types ./todo.js complete ->list all todos and ask them
to type a number to mark a todo as complete
2. we add an other param -> user types ./todo.js get
and then chooses the task to mark as complete ->
./todo.js complete 1
*/
function completeTodo() {
  //check the length
  if (args.length != 4) {
    errorLog('Invalid number of arguments passed');
    return;
  }
  let n = Number(args[3]);
  if (isNaN(n)) {
    errorLog('Please enter a valid number');
    return;
  }
  let todosLength = db.get('todos').value().length;
  if (n > todosLength) {
    errorLog('Invalid number passed');
    return;
  }
  db.set(`todos[${n - 1}].complete`, true).write();
}

//print guide
const commands = ['new', 'get', 'complete', 'help'];
const usage = () => {
  const usageText = `
    Todo helps you manage tasks
    usage:
      todo <command>
      commands can be :
      new : add new // TODO
      get : retrieve all todos
      complete : mark a todo as done
      help : print usage guide
  `;
  console.log(chalk.magenta(usageText));
};
//logging errors to the console
function errorLog(error) {
  const eLog = chalk.red(error);
  console.log(eLog);
}

//making sure that only 3 args are returned
if (args.length > 3 && args[2] != 'complete') {
  errorLog('Only one argument is accepted');
  usage();
}
//only the right command is passed
if (commands.indexOf(args[2]) == -1) {
  errorLog('Invalid command passed');
  usage();
}

switch (args[2]) {
  case 'help':
    usage();
    break;
  case 'new':
    newTodo();
    break;
  case 'get':
    getTodos();
    break;
  case 'complete':
    completeTodo();
    break;
  default:
    errorLog('Invalid command passed');
    usage();
}
