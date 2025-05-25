import { database, saveDatabase, getObjectId } from "./__loaddatabase.js";

const users = database.users;

export function getUser(name) {
    return users.find((el) => el.username === name);
}

export function addUser(user) {
    user._id = getObjectId();
    users.push(user);
    saveDatabase();
}