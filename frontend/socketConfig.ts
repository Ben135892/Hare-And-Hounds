const io = require('socket.io-client');
const socket = io('https://hareandhounds.herokuapp.com'); 
// for deployment and testing with 4g, 'https://hareandhounds.herokuapp.com'
// otherwise 'http://192.168.1.254:3000'
export default socket;
