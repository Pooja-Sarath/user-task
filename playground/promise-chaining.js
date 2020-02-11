
require('../src/db/mongoose');
const User = require('../src/models/user');
const Task = require('../src/models/task');

//5da58ae2a0a4a105283bb065

// User.findByIdAndUpdate('5da58ae2a0a4a105283bb065',{age : 26}).then((user)=>{
//     console.log(user);
//     return User.countDocuments({age : 26})
// }).then((total)=>{
//     console.log(total)
// }).catch((e)=>{
//     console.log(e)
// });

// Task.findByIdAndDelete('').then((task)=>{
//     console.log(task);
//     return Task.countDocuments({completed : false})
// }).then((count)=>{
//     console.log(count)
// }).catch((e)=>{
//     console.log(e);
// })

const updateAndCount = async(id,age) =>{
    const user = await User.findByIdAndUpdate(id, {age: age})
    const count = await User.countDocuments({age});
    return count
}

updateAndCount('5da58ae2a0a4a105283bb065', 25).then((result)=>{
    console.log(result)
}).catch((error)=>{
    console.log(error);
})