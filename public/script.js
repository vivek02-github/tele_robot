/*
const socket = io('/')  
//specify the path. the server is set up in the root path '/'. Reference to socket
//socket connects to root path of our appl at localhost 3000:/

const myPeer = new Peer(undefined, {
    host: '/',
    port: '3001'
})
// 'undefined' makes server responsible for id
// since we ae connecting to our own host, we specify the root host

const videoGrid = document.getElementById('video-grid')
const myVideo = document.createElement('video')
myVideo.muted = true
// getting a element and creating a video element

const peers = {}

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    addVideoStream(myVideo, stream)

    myPeer.on('call', call => {
        call.answer(stream)
//listen and answer when someone tries to call on myPeer obj and send our stream
        
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })
//responding to videostreams that come in. i.e. Add in the video stream

    socket.on('user-connected', userId => {
        connectToNewUser(userId, stream)
    })
})
// stream contains our video and audio, userid is there's
// we need to allow ourselves connected to by other users so we use sockets. this is our id and stream

socket.on('user-disconnected', userId => {
   // console.log('Disconnected'+userId)
    if (peers[userId]) peers[userId].close()
})
 

myPeer.on('open', id =>{
    socket.emit('join-room', ROOM_ID, id)
    // will sent an event to server
})
// as soon as we are connected to server and our id is generated we need to do this code

//*** test code ****
// socket.on('user-connected' , userId => {
//     console.log('Yo, User connected: ' + userId)
// })

//peer server connects to users and gives us IDs to communicate
//we have access to the peer library because of the script
function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream',userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
    call.on('close',()=>{
        video.remove()
    })

    peers[userId] = call
}
//this is only going to sent our video to the new user
// call variable is going to call new user sending our stream
// when the user sends in their stream we get the event stream 

function addVideoStream(video, stream){
    video.srcObject = stream
    video.addEventListener('loadedmetadata', ()=>{
        video.play()
    })
    videoGrid.append(video)
}
// fn to load stream and video will start playing
// this one has the custom video element on our pg
*/
const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
  host: '/',
  port: '3001'
})
const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  addVideoStream(myVideo, stream)

  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })

  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream)
  })
})

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}