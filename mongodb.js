//CRUD operations

// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient
// const ObjectID =  mongodb.ObjectID;

const {MongoClient, ObjectID} = require('mongodb');     //shorthand syntax

const connURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

// const id = new ObjectID();  //generates new ID
// console.log(id);
// console.log(id.getTimestamp());

MongoClient.connect(connURL, {useNewUrlParser:true, useUnifiedTopology: true}, (error, client)=>{

    if(error)
        return console.log("Unable to connect to database");

    console.log('Connected properly');
    const db = client.db(databaseName);

    // db.collection('users').insertOne({
    //     name : "Shreya",
    //     age : 27,
    //     //_id : id
    // }, (error, result)=>{
    //     if(error)
    //         return console.log("Unable to insert user");
    //     console.log(result.ops);    //array of documents inserted
    // })

    // db.collection('users').insertMany(
    //     [{name : "Sarath", age :30}, {name : "Sameer", age : 23}], (error, result)=>{
    //         if(error)
    //             return console.log("Unable to connect to database");
    //         console.log(result.ops);
    //     });

    // db.collection('tasks').insertMany(
    //     [{description : "Wash clothes", completed : true},
    //      {description : "Cooking", completed : false},
    //      {description : "Studying", completed : false}], (error,result)=>{

    //         if(error)
    //              return console.log("Unable to connect to database");
    //         console.log(result.ops);
    //      });
    

    // find query returns only cursor and does not have callback function associated
    // db.collection('users').find({name : "Pooja"}).toArray((error,users)=>{
    //     if(error)
    //         return console.log("Error connecting to db");
    //     console.log(users);
        
    // });

    // db.collection('users').find({name : "Pooja"}).count((error,users)=>{
    //     if(error)
    //         return console.log("Error connecting to db");
    //     console.log(users);
        
    // })

    // db.collection('users').updateOne({'age': 27}, {$set : {
    //     'name' : 'ABC'
    // }}).then((result)=>{
    //     console.log(result.modifiedCount);
    // }).catch((error)=>{
    //     console.log(error);
    // })

    // db.collection('tasks').updateMany({completed : false},
    //     {$set : {completed : true}}). then((result)=>{
    //         console.log(result.modifiedCount)
    //     }). catch((error)=>{
    //         console.log(error);
    //     })

    
})

