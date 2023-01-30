import session from 'express-session';
import fileStoreInitializer from 'session-file-store';

export const initSession = (app) => {
    const FileStore = fileStoreInitializer(session);

    const sessionMiddleware = session({
        resave: false,
        saveUninitialized: false,
        secret: `$2a$12$y8LqpnDLiD8NyZnzXyj9TuqHGjA82c7/te2o0irKICr5M3KLvS7F6`,
        store: new FileStore({}),
    });
    app.use(sessionMiddleware);

    return sessionMiddleware;
};

export default {
    initSession,
};