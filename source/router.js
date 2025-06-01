import { Router, urlencoded, static as staticMiddleware } from "express";
import methodOverride from 'method-override';
import cookieParser from "cookie-parser";
import session from "express-session";
import _FileStore from 'session-file-store';
import { flash } from "express-flash-message";

import { registerPage, register, loginPage, login, logout } from "./controllers/users.js";
import { mainPage, detailPage, addPage, add, setDone, remove, setOrder, addendumWrapper, mostActiveUsers } from './controllers/todos.js';
import { requestToContext, handleErrors, extendFlashAPI, getErrors, loadCurrentUser, isGuest, isLoggedIn } from "./middleware.js";
import { todoV, registerV, loginV } from "./validators.js";
import { mainErrorHandler, error500Handler} from './error-handlers.js';

const FileStore = _FileStore(session);
const router = Router();

router.use('/uploaded', staticMiddleware('storage/uploaed'));
router.use(staticMiddleware('public'));
router.use(urlencoded({extended: true}));
router.use(methodOverride('_method'));

router.use(cookieParser());
router.use(requestToContext);

router.use(session({
  store: new FileStore({
    path: './storage/sessions',
    reapAsync: true,
    reapSyncFallback: true,
    fallbackSessionFn: () => {
      return {};
    },
    logFn: () => {}
  }),
  secret: 'abcdefgh',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60
  }
}));
router.use(flash({sessionKeyName: 'flash-message'}));
router.use(extendFlashAPI);
router.use(loadCurrentUser);

router.get('/register', isGuest, getErrors, registerPage);
router.post('/register', isGuest, registerV, handleErrors, register);
router.get('/login', isGuest, getErrors, loginPage);
router.post('/login', isGuest, loginV, handleErrors, login);

router.use(isLoggedIn);

router.get('/mostactive', mostActiveUsers);
router.post('/logout', logout);
router.get('/add', getErrors, addPage);
router.post('/add', addendumWrapper, todoV, handleErrors, add);
router.get('/:id', detailPage);
router.put('/:id', setDone);
router.delete('/:id', remove);
router.post('/setorder', setOrder);
router.get('/', mainPage);

router.use(mainErrorHandler, error500Handler);

export default router;