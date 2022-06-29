import { Server } from 'socket.io';

export function init(io: Server) {
  console.log(io);
}

export default {
  init,
};
