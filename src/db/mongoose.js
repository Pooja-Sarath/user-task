const mongoose = require('mongoose');
const connURL = 'mongodb://127.0.0.1:27017';
mongoose.connect(connURL+'/task-manager-api',
{useNewUrlParser:true, useCreateIndex:true, useUnifiedTopology: true , useFindAndModify: false})


// var task = new Tasks({
//     description : "Wash clothes     ",
//     //completed : false
// })

// task.save().then(() =>{
//     console.log(task)
// }).catch((error)=>{
//     console.log(error);
// })