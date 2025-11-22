let io;

module.exports = {
  // Called in server.js to initialize the instance
  setIO: (ioInstance) => {
    io = ioInstance;
  },
  // Called in controllers/routes to get the instance
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  }
};