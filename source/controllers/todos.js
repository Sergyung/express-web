import createError from 'http-errors';

import { join } from "node:path";
import { rm } from 'node:fs/promises';
import { currentDir } from '../utility.js';

import { getList, getItem, addItem, setDoneItem, deleteItem, getMostActiveUsers } from '../models/todos.js';
import { addendumUploader } from '../../storage/uploaded/uploaders.js';
import { title } from 'node:process';

export async function mainPage(req, res) { 
  let list = await getList(req.user.id, req.cookies.doneAtLast, req.query.search);

  res.render('main', {
    todos: list,
    title: 'Главная'
  });
}

export async function detailPage(req, res, next){
  try {
    const t = await getItem(req.params.id, req.user.id);

    if(!t){
      throw createError(404, 'Запрошенное дело не найдено');
    }

    res.render('detail', {
      todo: t,
      title: t.title
    });
  } catch(err) {
    next(err);
  }
}

export function addPage(req, res){
  res.render('add', {title: 'Добавление дела'});
}

export async function add(req, res){
  const todo = {
    title: req.body.title,
    desc: req.body.desc || '',
    user: req.user.id
  };
  if(req.file)
    todo.addendum = req.file.filename;
  await addItem(todo);
  res.redirect('/');
}

export async function setDone(req, res, next){
  try {
    if(await setDoneItem(req.params.id, req.user.id))
      res.redirect('/');
    else
      throw createError(404, 'Запрошенное дело не найдено');
  } catch(err) {
    next(err)
  }
}

export async function remove(req, res, next){
  try {
    const t = await deleteItem(req.params.id, req.user.id);
    if(!t)
      throw createError(404, 'Запрошенное дело не существует');
    if(t.addendum)
      await rm(join(currentDir, 'storage', 'uploaded', t.addendum));
    deleteItem(t._id, req.user.id);
    res.redirect('/');
  } catch (err) {
    next(err);
  }
}

export function setOrder(req, res){
  res.cookie('doneAtLast', req.body.done_at_last);
  res.redirect('/');
}

export function addendumWrapper(req, res, next){
  addendumUploader(req, res, (err) => {
    if(err)
      if(err.code == 'LIMIT_FILE_SIZE') {
        req.errorObj = {
          addendum : {
            msg: 'Допускаются лишь файлы размером не более 100Кбайт'
          }
        };
        next();
      } else
        next(err);
    else
      next();
  });
}

export async function mostActiveUsers(req, res) {
  const r = await getMostActiveUsers();
  res.render('most-active', {
    title: 'Самые активные пользователи',
    mostActiveAll: r[0],
    mostActiveDone: r[1]
  });
}