const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');

const router = new express.Router();

router.post('/tasks', auth, (req,res) =>{

    //const task = new Task(req.body);

    const task = new Task({
        ...req.body,
        owner : req.user._id
    })
    task.save().then(()=>{
        res.status(201).send(task);
    }).catch((error)=>{
        res.status(400).send(error);
    })
})

//Get - /tasks?completed=true
//limit and skip for pagination ?limit=12 ?skip=2
router.get('/tasks', auth, async (req,res)=>{
    const match = {};
    const sort = {};
    if(req.query.completed){
        match.completed = req.query.completed === 'true';
    }

    if(req.query.sort){
        const parts = req.query.sort.split(':');
        sort[parts[0]] = parts[1] === 'desc'? -1 : 1
    }
    try{

        await req.user.populate({
            path : 'tasks',
            match,
            options : {
                limit : parseInt(req.query.limit),
                skip : parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        //await req.user.populate('tasks').execPopulate();
        if(!req.user.tasks)
            res.status(404).send("No tasks found")
        res.send(req.user.tasks);

    }catch(e){
        res.status(500).send(e);
    }
})

router.get('/tasks/:id', auth, async (req,res) =>{

    const id = req.params.id;

    try{
        const task = await Task.findOne({_id : id, owner : req.user._id});
        
        if(!task){
            return res.status(404).send("No such task exsits");
        }
        res.send(task);
    }catch(e){
        res.status(500).send(e);
    }
    // Task.findById(id).then((result)=>{
    //     if(!result)
    //         return res.status(404).send("Task not found");
    //     res.send(result);

    // }).catch((error)=>{
    //     res.status(500).send(error);
    // })
    
});



router.patch('/tasks/:id', auth, async(req,res)=>{
    
    const allowed = ['description','completed'];
    const updates = Object.keys(req.body);
    const isValid = updates.every((up)=>{
        return allowed.includes(up);
    });
    if(!isValid)
        return res.status(400).send("Not all fields given to update");
        
    try{
        const task = await Task.findOne({_id : req.params.id, owner : req.user._id});
        
        //const task = await Task.findById(req.params.id);
        
        //const task = await Task.findByIdAndUpdate(req.params.id,req.body,{new : true, runValidators : true})
        if(!task)
            res.status(404).send("Task not found");
        
        updates.forEach((each)=>{
            task[each] = req.body[each];
        })
        await task.save();

        res.send(task);

    }catch(e){
        res.status(400).send(e);
    }
});


router.delete('/tasks/:id', auth, async(req,res)=>{
    try{
        const task = await Task.findOneAndDelete({_id : req.params.id, owner : req.user._id});

        //const task = await Task.findByIdAndDelete(req.params.id);
        if(!task)
            res.status(404).send("No Task found to delete");

        res.send(task)
    }catch(e){
        res.status(400).send(e);
    }
});

module.exports = router;