import { io } from 'socket.io-client';

class SocketSingleton {
  constructor() {
    if (!SocketSingleton.instance) {
    console.log('2')
      SocketSingleton.instance = io.connect();
    }
  }

  getInstance() {
    console.log('3')
    return SocketSingleton.instance;
  }
}

export default SocketSingleton;
