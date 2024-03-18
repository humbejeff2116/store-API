import express, { Request, Response } from 'express';
import logger from 'morgan';
import path from 'path';
import session from 'express-session';
import cookie from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { redisStore } from './cache/index.js';
import http from 'http';
import { 
    configs,
    userRoutes,
    productRoutes,
    walletRoutes,
    orderRoutes,
    collectionRoutes,
    reviewRoutes,
    define__dirname
} from './web/index.js';

const app = express();
const server = http.createServer(app);
const port = configs.app.port || 4000;
const corsOptions = configs.corsOptions;
const __dirname = define__dirname();
const API_VERSION = '/api/v1';

app.disable('x-powered-by');
// enable this if you run server behind a proxy (e.g. nginx)
// app.set('trust proxy', 1);
app.use(helmet());
app.use(logger('dev'));
app.use(cors(corsOptions));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use(cookie(configs.secret.cookieSecret));
app.use(session({
    store: redisStore,
    secret: configs.secret.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: false,
        secure: false,
        httpOnly: false,
        maxAge: 1000 * 60 * 60 * 2 // expires after 2 hours
    }
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(API_VERSION, userRoutes);
app.use(API_VERSION, productRoutes);
app.use(API_VERSION, collectionRoutes);
app.use(API_VERSION, orderRoutes);
app.use(API_VERSION, walletRoutes);
app.use(API_VERSION, reviewRoutes);

app.use((req: Request, res: Response) => {
    console.log("route not found");
    res.status(404).json('route not found');
});

app.use((err, req: Request, res:Response, next) => {
    console.error(err);
    next(err);
})

app.use((err, req: Request, res:Response) => {
    res.status(500).json('internal sever error');
})

server.listen(port, () => {
    return console.log(`app is listening at http://localhost:${port}`);
});

