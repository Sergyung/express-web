import { body } from "express-validator";

const todoV = [
    body('title').isString().trim().notEmpty().withMessage('Заголовок не указан'),
    body('desc').isString().trim()
];
export { todoV };