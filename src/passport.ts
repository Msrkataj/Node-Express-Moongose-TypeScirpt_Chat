import bcrypt from 'bcrypt';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import { Express } from 'express';

import User from './models/user';

export const guest = {
  username: 'guest',
  password: '$2a$12$6QlaAsDRNKUdSwrLhX7ruu1eq7EmnDk4o1JMkyq4RI9GMugf6bmAW',
  name: 'guest',
  lastActiveRoom: 'public',
};

export const initPassport = (app: Express) => {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      const user = await User.findOne({ username }).exec();
      if (user && (await bcrypt.compare(password, user.password))) {
        return done(null, user);
      }
      console.log(password);
      return done(null, false, {
        message: 'Combination of username and password not found!',
      });
    })
  );

  passport.serializeUser((user, cb) => {
    cb(null, user._id);
  });

  passport.deserializeUser(async (id, cb) => {
    const user = await User.findOne({ _id: id });
    cb(null, user);
  });

  return passport;
};

export default {
  initPassport,
};
