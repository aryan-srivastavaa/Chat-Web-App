const socket = io();

let textarea = document.querySelector('#messageInp');
let messageArea = document.querySelector('.container');




do{
  var name= prompt('Please Enter Name you want other to show as:')
}while(!name);

socket.emit('new-user-joined',name);


textarea.addEventListener('keyup',(e)=>{
    if(e.key==='Enter'){
        sendMessage(e.target.value)
        console.log('enter pressed');
    }
})

function sendMessage(message) {
    let msg = {
        user: name,
        message: message.trim()
    }

    //Append Message
    if(msg.message===''){}
    else{appendMessage(msg,'right')
    textarea.value='';
    scrollToBottom();}
    

    //Send to Server
    socket.emit('message',msg)

}




function appendMessage(msg, type){
    let mainDiv = document.createElement('div')

    let className = type;
    mainDiv.classList.add(className, 'message' )


    let markup = `<h4>${msg.user} </h4>
    <p>${msg.message}</p>`

    mainDiv.innerHTML = markup;
    messageArea.appendChild(mainDiv);

}

//Recieving Message

socket.on('message',(msg)=>{
    if(msg.message===''){}
    else{appendMessage(msg,  'left')
    scrollToBottom();}
   
})

function userjoining(naam){
    let userjoins = document.createElement('div');
    userjoins.className+= 'userjoined';

    let joining = `<h2>${naam} has joined the chat </h2>`;
    userjoins.innerHTML = joining;
    messageArea.appendChild(userjoins);




}
socket.on('user-joined',(name)=>{
  
   userjoining(name);


})


function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight;
}