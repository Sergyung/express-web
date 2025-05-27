import { database, saveDatabase, getObjectId } from "./__loaddatabase.js";

const todos = database.todos;

export function getList(user){
  return todos.filter((el) => el.user === user);
}

export function getItem(id, user) {
  return todos.find((el) => el._id === id && el.user === user);
}

export function addItem(todo){
  todo._id = getObjectId();
  todos.push(todo);
  saveDatabase();
}

function getItemIndex(id, user){
  return todos.findIndex((el) => el._id === id && el.user === user);
}

export function setDoneItem(id, user){
  const index = getItemIndex(id, user);
  if (index > -1){
    todos[index].done = true;
    saveDatabase();
    return true;
  } else 
    return false;
}

export function deleteItem(id, user){
  const index = getItemIndex(id, user);
  if(index > -1){
    todos.splice(index, 1);
    saveDatabase();
    return true;
  } else
    return false;
}