const express = require('express')
const app = express()
const http = require('http').createServer(app);

var admin = require("firebase-admin");

var serviceAccount = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();


const io = require('socket.io')(http, {
    cors: {
      origins: ['http://localhost:4200']
    }
  });
io.on('connection', function (socket) {
    console.log('User Connected');

    db.collection('colors').get().then(r=>r.forEach((doc) => {
      socket.emit('colors', doc.data())
    }))
    
    socket.on('color', color => {
     db.collection('colors').doc('5M1GKs5YOsKNjVnZwWgI')
       .update({ [`${color.boxNum}`] : [ color.color1, color.color2, color.color3 ] })
        io.sockets.emit('newColor', color);
    })

    socket.on('disconnect', function () {
            console.log('user disconnected');
    });
});

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const port = process.env.PORT || 8000;
http.listen(port, () => console.log(`Running server on port `+port))

