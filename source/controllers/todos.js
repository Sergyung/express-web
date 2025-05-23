import createError from 'http-errors';

import { getList, getItem, addItem, setDoneItem, deleteItem } from '../models/todos.js';
import { addendumUploader } from '../../storage/uploaded/uploaders.js';

export function mainPage(req, res) { 
  let list = getList();

  if(req.cookies.doneAtLast === '1'){
    list = [...list];
    list.sort((el1, el2) => {
      const date1 = new Date(el1.createdAt);
      const date2 = new Date(el2.createdAt);
      const done1 = el1.done || false;
      const done2 = el2.done || false;
      const doneDiff = done1 - done2;
      if(doneDiff != 0)
        return doneDiff;
      else
        return date1 - date2;
    });
  }

  if(req.query.search){
    const q = req.query.search.toLowerCase();
    list = list.filter((el) => {
      if(el.title.toLowerCase().includes(q))
        return true;
      else
        if(el.desc)
          return el.desc.toLowerCase().includes(q);
        else
          return false; 
    });
  }

  res.render('main', {
    todos: list,
    title: 'Главная'
  });
}

export function detailPage(req, res){
  const t = getItem(req.params.id);

  if(!t){
    throw createError(404, 'Запрошенное дело не найдено');
  }

  res.render('detail', {
    todo: t,
    title: t.title
  });
}

export function addPage(req, res){
  res.render('add', {title: 'Добавление дела'});
}

export function add(req, res){
  const todo = {
    title: req.body.title,
    desc: req.body.desc || '',
    createdAt: (new Date()).toString()
  };
  addItem(todo);
  res.redirect('/');
}

export function setDone(req, res){
  if(setDoneItem(req.params.id))
    res.redirect('/');
  else
    throw createError(404, 'Запрошенное дело не найдено');
}

export function remove(req, res){
  if(deleteItem(req.params.id))
    res.redirect('/');
  else
    throw createError(404, 'Запрошенное дело не найдено');
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