const io = require('socket.io-client');
const socket = io.connect('http://localhost:3000');
const tchat = document.querySelector('#zone_chat');
const messages = document.querySelector('#message');
const users = document.querySelector('#user');
const btn = document.querySelector('#btnClear');
let pseudo='';
document.querySelector('#chat').style.visibility = 'hidden';

btn.addEventListener ('click', e => {
   socket.emit('delete');
});

users.addEventListener ('keypress', e => {
  if (e.keyCode === 13) {
    pseudo = document.querySelector('#user').value;

    if (pseudo.length > 0) {
      socket.emit('connectUser', pseudo);
      socket.emit('init', pseudo);
      document.title = `${pseudo} - ${document.title}`;
      document.querySelector('#chat').style.visibility = '';
      document.querySelector('#login').style.visibility = 'hidden';
      messages.focus();
    }
  }
});
pseudo = document.querySelector('#user').value;


const reset = (message) => {
   let newmessage='';
   let newpseudo='';
    message.forEach(function(e) {  
    const newdiv = document.createElement('div');
    const newbtn = document.createElement('b');
    newmessage = document.createTextNode(e.message);
    newpseudo = document.createTextNode(`${e.pseudo}  : `);
    tchat.appendChild(newdiv);
    newbtn.appendChild(newpseudo);
    newdiv.appendChild(newbtn);
    newdiv.appendChild(newmessage);
  });
};

socket.on('message', data => {
  const newmessage = document.createTextNode (data.message);
  const newbtn = document.createElement('b');
  const newpseudo = document.createTextNode(`${data.pseudo}  : `);
  const newdiv = document.createElement('div');
  tchat.appendChild(newdiv);
  newdiv.appendChild(newbtn);
  newbtn.appendChild(newpseudo);
  newdiv.appendChild(newmessage);
});

socket.on('init', data=> {
  reset(data.message);
});
socket.on('delete', ()=> {
  tchat.innerHTML = ""
});
socket.on('actual', ()=> {
  tchat.innerHTML = ""
});

// send a new user log
socket.on('connectUser', data=> {
  
  const pseudo = document.createTextNode(`${data} : `);
  const message = document.createTextNode('a rejoint le clan');
  const newbtn = document.createElement('b');
  const newdiv = document.createElement('div');
  
  tchat.appendChild(newdiv);
  newdiv.appendChild(newbtn);
  newbtn.appendChild(pseudo);
  newdiv.appendChild(message);
});

messages.addEventListener ('keypress', e => {
  if (e.keyCode === 13) {
    let message = messages.value; 
    
    socket.emit('message', message);  
    const newmessage = document.createTextNode (message);
  const newbtn = document.createElement('b');
  const newpseudo = document.createTextNode(`${pseudo}  : `);
  const newdiv = document.createElement('div');
 tchat.appendChild(newdiv);
  newdiv.appendChild(newbtn);
  newbtn.appendChild(newpseudo);
  newdiv.appendChild(newmessage);
    messages.value = ''; 
    messages.focus(); 
  }
});
