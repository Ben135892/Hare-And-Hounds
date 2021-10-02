const io = require('socket.io-client');
const socket = io('http://192.168.1.254:3000'); 
// for deployment and testing with 4g, 'https://hareandhounds.herokuapp.com'
// otherwise 'https://192.168.1.254:3000'
export default socket;
