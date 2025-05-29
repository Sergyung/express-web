import { Todo } from './__loaddatabase.js';

export async function getList(user, doneAtLast, search) {
  return await Todo.find({user: user});
}

export async function getItem(id, user) {
  return await Todo.findOne({ _id: id, user: user});
}

export async function addItem(todo) {
  const oTodo = new Todo(todo);
  await oTodo.save();
}

export async function setDoneItem(id, user) {
  const todo = await getItem(id, user);
  if(todo) {
    todo.done = true;
    await todo.save();
    return true;
  } else
    return false;
}

export async function deleteItem(id, user) {
  return await Todo.findOneAndDelete({ _id: id, user: user});
}