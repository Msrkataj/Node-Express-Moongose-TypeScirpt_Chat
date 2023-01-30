import { Server } from 'socket.io';
import bcrypt from 'bcrypt';
import User from './models/user';
import Message, { Message as MessageModel } from './models/message';

const activeUsers = {};
const saltRounds = 12;

interface MessagePayload {
  with: {
    name: string;
    id: string;
  };
  messages: MessageModel[];
}

export const initSockets = async (io: Server, session): Promise<void> => {
  io.use((socket, next) => {
    session(socket.request, {}, next);
  });

  io.on(
    'connection',
    async (socket): Promise<void> => {
      const { session: socketSession } = socket.request;
      const req = socket.request;
      const sessionId = req.session.id;

      if (!socketSession.passport) {
        socket.emit('redirectToLogin');
        return;
      }

      const user = await User.findOne({ _id: socketSession.passport.user });
      if (!user) {
        socket.emit('redirectToLogin');
        return;
      }

      socket.join(user._id);
      socket.join('public');

      socket.emit('userData', { id: user._id, name: user.name });
      const sendMessageData = async (
        userOrRoom: string,
        newMessage?: string
      ) => {
        if (!userOrRoom) {
          io.to(user._id).emit('messages', {
            with: null,
            messages: [],
          } as MessagePayload);
          return;
        }

        user.lastActiveRoom = userOrRoom;
        await user.save();

        const messages = await Message.findMessagesByUsers(
          user._id,
          userOrRoom
        );

        const member =
          userOrRoom !== 'public'
            ? await User.findOne({ _id: userOrRoom }).exec()
            : { _id: 'public', name: 'Public' };
        if (!member) {
          io.to(user._id).emit('messages', {
            with: null,
            messages: [],
          } as MessagePayload);
          return;
        }
        const memberData = { name: member.name, id: member._id };

        if (newMessage) {
          const messagePayload = {
            date: new Date(),
            message: newMessage,
            from: user._id,
            to: member._id,
          };
          const message = new Message(messagePayload);
          await message.save();

          const updatedMessages = [...messages, message];
          io.to(user._id).emit('messages', {
            with: memberData,
            messages: updatedMessages,
          });
          io.to(userOrRoom).emit('messages', {
            with: { name: user.name, id: user._id },
            messages: updatedMessages,
          });
          return;
        }

        io.to(user._id).emit('messages', { with: memberData, messages });
      };

      await sendMessageData(user.lastActiveRoom);

      activeUsers[user._id] = {
        id: user.id,
        name: user.name,
      };
      io.sockets.emit('usersList', {
        users: Object.values(activeUsers),
      });
      const passwordUser = async (pas) => {
        const password = bcrypt.hash(pas, saltRounds);
        return password;
      };

      const sendData = async (username, password, name) => {
        const userData = {
          username: username,
          password: await passwordUser(password),
          name: name,
          lastActiveRoom: 'public',
        };
        const newUser = new User(userData);
        await newUser.save();
      };

      socket.on('register', async (reg) => {
        await sendData(reg.username, reg.password, reg.name);
        console.log(user._id)
        io.sockets.emit('registerSuccess', user._id);
      });

      socket.on('logout', async () => {
        req.session.destroy(() => {
          io.to(sessionId);
        });
        socket.leave(user._id);
        socket.emit('delete_cookie', 'foo');
      });

      socket.on('join', async (userOrRoom) => {
        await sendMessageData(userOrRoom);
      });

      socket.on('message', async (payload) => {
        await sendMessageData(payload.to, payload.message);
      });

      socket.on('disconnect', () => {
        activeUsers[user && user._id] = null;
        io.sockets.emit('usersList', {
          users: Object.values(activeUsers),
        });
      });
    }
  );
};

export default {
  initSockets,
};
