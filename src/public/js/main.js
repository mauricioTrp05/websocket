function updateMessage(message){
    let area = document.getElementById('mensajes');
    area.innerHTML += message + '\n';
  }
// Manejo del mensaje WebSocket
const URL = "http://localhost:3000";
const socket = io(URL);
//

socket.on('connect', () => {
    console.log('Successfully connected!');
  });
  socket.on('upConnection', (data) => {
    console.log(data);
  });
  socket.on('downConnection', (data) => {
    console.log(data);
  });
  socket.on('messageReceived', (data) => {
    console.log(data);
    updateMessage(data[0])
  });