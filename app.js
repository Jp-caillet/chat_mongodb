const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const MongoClient = require('mongodb').MongoClient;
const dbName = 'chat';
const assert = require('assert');
const url = 'mongodb://localhost:27017';
 
app.use ('/', express.static(path.join(`${__dirname}/public`)));
app.get ('/', (req, res) => {
  res.sendfile('./index.html');
});

const deleteBDD = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('message');
  
  select(db, function(result){
        if(result.length != 0){
          collection.drop(function(err, result) {
            assert.equal(err, null);
            callback(result);
          });
        }
  }); 
};

const insertDocuments = (db,pseudo,message,callback)=> {
      const collection = db.collection('message');
      collection.insert([
        {pseudo : pseudo, message : message,}
      ], function(error, result) {
        assert.equal(error, null);
        assert.equal(1, result.ops.length);
        assert.equal(1, result.result.n);
        callback(result);
      });
};

const select= function(db, callback) {
  const collection = db.collection('message');
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    callback(docs);
    return docs;
  });
};

io.sockets.on('connection', socket => {
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    const db = client.db(dbName);
    socket.on('init', pseudo => {
      socket.pseudo = pseudo;
      select(db, function(result){
         const message =  {'pseudo':pseudo, 'message': result};
        socket.emit('init', message);
      });
    });
    

  socket.on('delete',()=> {  
      deleteBDD(db, function() {});
      socket.emit('delete');
      socket.broadcast.emit('actual');
    });


  socket.on('connectUser', pseudo => {
      socket.pseudo = pseudo;
      let message =`${pseudo} a rejoint le Clan`;
      
      insertDocuments( db, pseudo, message, function(){});
      socket.broadcast.emit('connectUser', pseudo);
    });

socket.on('message', message => {
      socket.broadcast.emit('message', {'pseudo': socket.pseudo, 'message': message});
      insertDocuments( db, socket.pseudo, message, function(){});
    });

  
    
    
    
  });
});

server.listen(3000);
