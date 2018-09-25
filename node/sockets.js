module.exports = function (io, db) {
    io.on('connection', (socket) => {
       socket.on('connect', (payload) => {

       });
       socket.on('disconnect', (payload) => {

       });
       socket.on('add_message', (payload) => {
           const data = JSON.parse(payload);
           const username = data.username;
           const message = data.message;
           const timestamp = new Date(Date.now());
           console.log('[' + timestamp + '] ' + username + ': ' + message);
           io.emit('on_message', JSON.stringify({ username: username, message: message, timestamp: timestamp }));
           db.collection('messages').insertOne({ username: username, message: message, timestamp: timestamp });
       });
    });

    console.log('Sockets setup complete!')
};