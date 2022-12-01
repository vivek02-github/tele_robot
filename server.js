const express = require('express')   //basic code for starting and running server
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

//socket now knows which server to talk to. Server is based on express server.

const {v4: uuidV4} = require('uuid')
//v4, a function?,renaming uudiv4

app.set('view engine','ejs') //render our views? we are using ejs view engine
app.use(express.static('public'))//static folder?

app.get('/',(req,res) =>{
    res.redirect(`/${uuidV4()}`)
})
//setting up get route. Will create a new room and redirect the user to that room as we dont have a homepage for this wbsite

app.get('/:room', (req,res) =>{
    res.render('room', {roomId: req.params.room})
})
//here /:room is a dynamic parameter.

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
         console.log(roomId, userId)
         socket.join(roomId)
         socket.broadcast.to(roomId).emit('user-connected' , userId)
         
         socket.on('disconnect',() => {
            socket.broadcast.to(roomId).emit('user-disconnected',userId)
         })
    })
})
/*this is going to run anytime when a user connects to our webpage
Note: socket=> is the actual socket the user is connecting through
Events/setting up event listener
1. join room. When we call this event it will execute the code inside socket.on
Current socket has to join a room(same room). Anything happens to the room we sent it to the room
Broadcast msg to room. to all but not curent user who just joined.
*/ 

server.listen(3000) 
// start server on port 3000

