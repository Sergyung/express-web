import { timingSafeEqual } from 'node:crypto';

import { body } from "express-validator";
import { getUser } from "./models/users.js";
import { pbkdf2Promisified } from './utility.js';

const todoV = [
    body('title').isString().trim().notEmpty().withMessage('Заголовок не указан'),
    body('desc').isString().trim()
];
export { todoV };

const registerV = [
    body('username').isString().trim().notEmpty().withMessage('Не указано имя пользователя')
        .custom((value) => {
            if(getUser(value))
                throw new Error('Пользователь с таким именем уже зарегистрирован');
            return true;
        }),
    body('password').isString().trim().notEmpty().withMessage('Не указан пароль'),
    body('password2').isString().trim().notEmpty().withMessage('Не указан повтор пароль')
        .custom((value, { req }) => {
            if(req.body.password != value)
                throw new Error('Введенные пароли не совпадают');
            return true;
        })
];
export { registerV };

const loginV = [
    body('username').isString().trim().notEmpty().withMessage('Не указано имя пользователя')
        .custom((value, { req }) => {
            const user = getUser(value);
            if(user) {
                req.__user = user;
                return true;
            } else
                throw new Error('Пользователь с таким именем не найден');
        }),
    body('password').isString().trim().notEmpty().withMessage('Не указан пароль')
        .custom(async (value, { req }) => {
            if(req.__user) {
                const savedPassword = Buffer.from(req.__user.password);
                const salt = Buffer.from(req.__user.salt);
                const password = await pbkdf2Promisified(value, salt, 100000, 32, 'sha256');
                if(timingSafeEqual(savedPassword, password))
                    return true;
                else
                    throw new Error('Неправильный пароль');
            } else
                return true;
        })
];
export { loginV };