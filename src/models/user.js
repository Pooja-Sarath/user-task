const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

const UserSchema = new mongoose.Schema(
    {
        name : { type : String, required : true, trim : true},
        email : { type : String , required : true, trim : true, lowercase : true, unique : true,
        validate(value){
            if(!validator.isEmail(value))
                throw new Error("Email is invalid")
        }},
        age : {type : Number, default : 0,
        validate(value) {
            if(value <0 )
                throw new Error("Age must be poitive number")
            } 
        },
        password :{ type : String, required : true,trim : true, minlength : 7,
        validate(value){
            if(value.toLowerCase().includes('password'))
                throw new Error ('Password cannot conatin "Password"');
        }},
        tokens :[{
            token : {type : String, required :true}
        }],
        avatar : {type : Buffer}
    },
    {
        timestamps :  true
    }
);

//virtual property, nothing stores in reality just an association
UserSchema.virtual('tasks', {
    ref : 'Task',
    localField : '_id',
    foreignField : 'owner'

})


//methods - corresponds to method on individual method
UserSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, 'thisismynewcourse');

    user.tokens = user.tokens.concat({token:token});
    await user.save()
    return token;
}

UserSchema.methods.toJSON = function(){
    const user = this;
    const requiredData = user.toObject()

    delete requiredData.password;
    delete requiredData.tokens;

    return requiredData;
}
//statics- coresponds to methods on UserSchema as a whole
UserSchema.statics.findByCredentials = async(email,password) =>{
    
    const user = await User.findOne({email : email});
    
    if(!user)
         throw new Error ("User not found");
    const isValid = await bcrypt.compare(password, user.password);
    
    if(!isValid)
        throw new Error ("User not found");

    return user;
} 

//middleware
UserSchema.pre('save', async function(next){
    const user = this;
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
})


//middleware - delete tasks associated with removal of user
UserSchema.pre('remove', async function(next){
    const user = this;
    await Task.deleteMany({owner : user._id})
    next();
})

const User = mongoose.model('User',UserSchema);
module.exports = User;