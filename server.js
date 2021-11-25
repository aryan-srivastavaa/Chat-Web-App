const express = require('express');
const app = express();
const http = require('http').createServer(app);

app.use(express.urlencoded()); 

app.use(express.static(__dirname+'/public'));

const PORT = process.env.PORT ||3000;



// mongoose related stuff

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/ChatApp', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
   console.log(' we are connected!');
});


const kittySchema = new mongoose.Schema({
    name: String,
    email: String,
    pass: String
    
  });

  kittySchema.methods.speak = function speak() {
    // const greeting = this.name
    //   ? "Meow name is " + this.name
    //   : "I don't have a name";
    // console.log(greeting);
  };

//Model making
const Kitten = mongoose.model('UserData', kittySchema);








http.listen(PORT,()=>{
    console.log(`listening on Port ${PORT}`);
})

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/loginpage.html');
})
app.get('/loggedin',(req,res)=>{
    res.sendFile(__dirname+'/login.html');
})
app.get('/signin',(req,res)=>{
    res.sendFile(__dirname+'/signup.html');
})



app.post('/signin_credentials',(req,res)=>{
   let fluffy = new Kitten({ name: req.body.uname, email:req.body.uemail, pass:req.body.upass });
    fluffy.save(function (err, UserData) {
        if (err) return console.error(err);
        UserData.speak();
         });
console.log(req.body.uname,req.body.uemail,req.body.upass);
res.send("Posted successfully");
})



//Checking Login Credentials
app.post('/chatpage',(req,res)=>{
    let naam = req.body.uname;
    let p = req.body.upass;



    if(Kitten.find({ name: naam  })){
        Kitten.find({ name: naam  }, (err,person)=>{
        
            if(person[0].name == naam && person[0].pass ==p){
                
                 res.sendFile(__dirname + '/index.html');
             }
             else{
                 res.send("Wrong credentials Entered");
             }
         });
    }
    
   else{
       res.send("Wrong Credentials");
   }

    
    
    
})

//Socket Related Stuff

const users = {};
const io = require('socket.io')(http);


io.on('connection',(socket)=>{

  console.log('connected');
 
  
  socket.on('new-user-joined',name=>{
      console.log('user joined');
      users[socket.id] = name;
    
      socket.broadcast.emit('user-joined', name)

  })


  socket.on('message',(msg)=>{
       socket.broadcast.emit('message',msg)
  })
})