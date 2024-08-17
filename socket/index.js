// create a socket.io instance
const io = require('socket.io')(3000, {
  cors: {
    origin: "https://ed-6541751501979648.educative.run",
  }
});

// list of users
let users = [];

// add user to the list
function addUser(userId, socketId) {
  // if a user is not on the list, add it 
  !users.some(user => user.userId === userId) && users.push({ userId, socketId });
}

// listen for a connection
io.on('connection', socket => {
  console.log('New user connected');

  socket.on('addUser', userId => {
    // add a user to the list
    addUser(userId, socket.id);
    // send the list of users to the client
    io.emit('getUsers', users);
  });

  socket.on('sendMessage', ({ senderId, receiverId, message }) => {
    // find the user that we want to send the message to
    const user = users.find(user => user.userId === receiverId);
    
    // send the message to the user
    io.to(user.socketId).emit('getMessage', {
      senderId,
      message
    });
  });

  // when the user disconnects
  socket.on('disconnect', () => {
    console.log('User disconnected');
    
    // remove user from the list
    users = users.filter(user => user.socketId !== socket.id);
    io.emit('getUsers', users);
  });
});