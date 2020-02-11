const express = require('express');
const app = express();
require('./db/mongoose.js');        // makes sure the file runs and hence connection established with DB
const User = require('./models/user.js');
const Task = require('./models/task.js');
const userRouter = require('./routes/users');
const taskRouter = require('./routes/tasks');

const port = process.env.PORT || 3000;


//app.use((req,res,next) =>{
    //console.log(req.method, req.path);
    //next(); //to proceed ahead and is necessary
    // if(req.method=== 'GET')
    //     res.send('Get cannot proceed ahead')
    // else
    //     next();
//})

app.use(express.json()); //parses incoming json to an object
app.use(userRouter);    
app.use(taskRouter);

// newReq ---> ReqHandler
// with middleware : newReq ---> doSomething(function you wish) ----> ReqHandler

app.listen(port,()=>{
    console.log("Server is running on port: "+port);
});

// const bcrypt = require('bcryptjs');

// const myFunc =async() =>{
//     const password = 'red1234!';
//     const hashPass = await bcrypt.hash(password, 8); //password, number of rounds toq hash
//     console.log(hashPass);

//     const isMatch = await bcrypt.compare('red1234!', hashPass);

//     console.log(isMatch);
// }
// myFunc();

// const jwt = require('jsonwebtoken');

// const func = async()=>{

//     const token = jwt.sign({ _id : '1234'}, 'thisismynewcourse', {expiresIn :'2 days'} );
//     //token is made of 3 pieces: header, id(above), signature(used to verify token)
//     console.log(token);

//     const data = jwt.verify(toekn, 'thisismynewcourse');
//     console.log(data);
// };

// func()

const main = async() =>{
    // const task = await Task.findById('5da8358ac15feb110094bf36');
    // await task.populate('owner'). execPopulate(); //takes the id and fetches whole data related to id automatically
    // //built-in functions in mongodb
    // console.log(task.owner)

    const user = await User.findById('5da83483fbf0dc14f013d080');
    await user.populate('tasks').execPopulate();
    console.log(user.tasks);
}

//main();

const multer = require('multer');
const upload = multer({
    dest : 'images', //place where files must be uploaded and stored, gets created automatically,
    limits: {
        fileSize : 1000000 //in bytes limits size of file to be sent 
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(doc|docx)$/)){
            return cb(new Error ("Please upload a word document"))
        }
        cb(undefined, true)
    }

});

app.post('/upload', upload.single('upload'), async(req,res)=>{

    res.send()
})