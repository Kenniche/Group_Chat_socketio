// Import express and path modules.
const express = require( 'express' );
// create the express app
const app = express();
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const session = require('express-session');

app.use(session({
    secret: 'yesican',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))
app.use(express.static(__dirname + '/static'));
app.get('/', function(req, res) {
    res.render('index.ejs');
});
io.sockets.on('connection', function(socket) {
    socket.on('username', function(username) {
        socket.username = username;
        io.emit('online', '✔️' + socket.username + ' is Joining the Chat!');
    });
    socket.on('disconnect', function(username) {
        io.emit('online', '❌' + socket.username + ' left the chat.');
    })
    socket.on('chat', function(sms) {
        io.emit('chat', '<strong>' + socket.username + '</strong>: ' + sms);
    });
});
const server = http.listen(9090, function() {
    console.log('Listening on port 9090');
});