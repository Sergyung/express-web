import { database, saveDatabase, getObjectId } from "./__loaddatabase.js";

const todos = database.todos;

export function getList(){
  return todos;
}

export function getItem(id) {
  return todos.find((el) => el._id === id);
}

export function addItem(todo){
  todo._id = getObjectId();
  todos.push(todo);
  saveDatabase();
}

function getItemIndex(id){
  return todos.findIndex((el) => el._id === id);
}

export function setDoneItem(id){
  const index = getItemIndex(id);
  if (index > -1){
    todos[index].done = true;
    saveDatabase();
    return true;
  } else 
    return false;
}

export function deleteItem(id){
  const index = getItemIndex(id);
  if(index > -1){
    todos.splice(index, 1);
    saveDatabase();
    return true;
  } else
    return false;
}