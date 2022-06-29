import bcrypt from 'bcrypt';
import express from 'express';
import session from 'express-session';
import exhbs from 'express-handlebars';
import bodyParser from 'body-parser';
import cors from 'cors';
import http from 'http';
import socketIo from 'socket.io';
import morgan from 'morgan';
import { AddressInfo } from 'net';
import path from 'path';

import { APP_PORT } from './config/app';
import { connectToMongoose } from './models';
import api from './api';
import { init as initSockets } from './sockets';

(async function runApp(): Promise<void> {
  try {
    const app = express();
    const server = new http.Server(app);

    // Add basic middlewares
    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(morgan('combined'));

    // Add templating engine
    // Add your config here
    const hbs = exhbs.create({
      helpers: {},
    });

    // Add new engine to ExpressJS
    app.engine('handlebars', hbs.engine);

    // Set chosen view engine
    app.set('view engine', 'handlebars');

    // Set views path
    app.set('views', 'views');

    // Static dir
    app.use(express.static(path.join(__dirname, 'public')));

    app.use(
      session({
        resave: false,
        saveUninitialized: true,
        secret: bcrypt.hashSync('CHAT_SESSION_SECRET', 5),
      })
    );

    // 404 supports
    app.use((req, res) => {
      res.status(404).json({
        message: 'Not found',
        status: 404,
      });
    });

    // Connect to the database
    await connectToMongoose();

    // Add routing
    app.use(api);

    const io = socketIo(server);
    initSockets(io);

    const serverInstance = server.listen(APP_PORT, () => {
      console.log(
        `Listening on port ${(serverInstance.address() as AddressInfo).port}`
      );
    });
  } catch (err) {
    console.log('Problems initializing the app', err);
    process.exit(1);
  }
})();
