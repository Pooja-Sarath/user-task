const express = require('express');
const multer = require('multer');
const User = require('../models/user');
const auth = require('../middleware/auth');

const router = new express.Router();

router.post('/users', async(req,res)=>{
    
    const user = new User(req.body);
    const token = await user.generateAuthToken();
    try{
        await user.save();
        res.status(201).send({user, token})
    }catch(error){
        res.status(400).send(error);
    }
    
    // user.save().then(()=>{
    //     res.status(201).send(user);             //201 - created status code
    // }).catch((error)=>{
    //     res.status(400).send(error);
    // })
    
});

//runs middleware first and then rout handler (only if auth calls next)
router.get('/users/me', auth ,async (req,res) =>{

    res.send(req.user);     //got info from auth
    // try{
    //     const users = await User.find({})
    //     res.send(users);
    // }catch(e){
    //     res.status(500).send(e);
    // }
    // User.find({}).then((result)=>{
    //     res.send(result);
    // }).catch((error)=>{
    //     res.status(500).send(error);
    // })
});

// router.get('/users/:id', async(req,res) =>{

//     const id = req.params.id;

//     try{
//         const user = await User.findById(id);

//         if(!user)
//             return res.status(404).send("User not found");
//         res.send(user)
//     }catch(e){
//         res.status(500).send(e);
//     }
//     // User.findById(id).then((result)=>{
//     //     if(!result)
//     //         return res.status(404).send("User not found");
//     //     res.send(result);

//     // }).catch((error)=>{
//     //     res.status(500).send(error);
//     // })

// });


//Update bypasses middleware and saves directly hench split findById and update
router.patch('/users/me', auth, async(req,res)=>{
    
    const allowed = ['name', 'age', 'password', 'email'];
    const updates = Object.keys(req.body);
    const isValid = updates.every((up)=>{
        return allowed.includes(up);
    });
    if(!isValid)
        return res.status(400).send("Not all fields given to update");

    try{
        //const user = await User.findById(req.user._id);

        updates.forEach((each)=>{
            req.user[each] = req.body[each];
        });

        await req.user.save();
        //const user = await User.findByIdAndUpdate(req.params.id,req.body,{new : true, runValidators : true})

        res.send(req.user);

    }catch(e){
        res.status(400).send(e);
    }
});

router.delete('/users/me', auth, async(req,res)=>{
    try{
        // const user = await User.findByIdAndDelete(req.user._id);
        // if(!user)
        //     res.status(404).send("No user found to delete")

        await req.user.remove();
        res.send(req.user)
    }catch(e){
        res.status(400).send(e);
    }
});

router.post('/users/login', async (req,res) =>{
    try{
        
        const user = await User.findByCredentials(req.body.email, req.body.password) //user defined func
        const token = await user.generateAuthToken();

        res.send({user: user, token}); //internally calls toJSON to hide password and tokens
    }catch(e){
        res.status(400).send(e);
    }
})


router.post('/users/logout', auth, async(req,res)=>{
    try{
        //remove token from tokens array
        req.user.tokens = req.user.tokens.filter((tok)=>{
            return tok.token !== req.token;
        });

        await req.user.save();

        res.send("Logged out")
    }catch(e){
        res.status(500).send();
    }
});

router.post('/users/logoutAll', auth, async(req,res)=>{
    try{
        //remove token from tokens array
        req.user.tokens = [];

        await req.user.save();

        res.send("Logged out of all session")
    }catch(e){
        res.status(500).send();
    }
});

const upload = multer({
    //dest : 'avatar', //place where files must be uploaded and stored, gets created automatically
    limits: {
        fileSize : 1000000 //in bytes limits size of file to be sent 
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error ("Please upload an image file"))
        }
        cb(undefined, true)
    }
});

router.post('/users/me/avatar', auth, upload.single('avatar'), async(req,res)=>{
    req.user.avatar = req.file.buffer;
    await req.user.save();
    res.send();
}, (error, req,res, next) =>{
    res.status(400). send({error : error.message}); //handle express middleware errors
});

router.delete('/users/me/avatar', auth, async(req,res)=>{
    req.user.avatar = undefined;
    await req.user.save();
    res.send("Deleted profile pic")
})

router.get('/users/:id/avatar', async(req,res) =>{

    try{
        const user = await User.findById(req.params.id);
        
        if(!user || !user.avatar){
                throw new Error()
        }

        res.set('Content-Type', 'image/jpg');
        res.send(user.avatar);
    }catch(e){
        res.status(404).send("Image not found");
    }
})
module.exports = router;