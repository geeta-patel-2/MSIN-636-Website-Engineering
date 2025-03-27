let TaskList = [{
    id:1,
    task:'Learn EXpress',
    completed:false
},
    {
        id:2,
        task:'Learn Node.js with database',
        completed:false
    }
];

export const getTask = (req,res)=>{
    res.json(TaskList);
}

export const createTask =(req,res) =>{
    const newTask = req.body;
    TaskList.push(newTask);
    res.status(201).json({
        message:'Task Created Successfully.',
        data:newTask
    })
}

/**
 * For Getting task Details According to Request
 * @param {*} req
 * @param {*} res
 */
export const getSpecificTask = (req,res) =>{
    console.log("req.params",req.params);
    const taskId= parseInt(req.params.id);
    console.log("taskID",taskId);
    //how we can find the task from Array?
    let task = TaskList.find(taskResult => taskId === taskResult.id);

    // if we dont have task from tasklist
    if(!task){
        return res.status(404).json({
            message:'No Task Found'
        })
    }

    //Send Correct Task Details
    return res.status(200).json({
        data:task
    })

}
/**
 * For Update task According to Request
 * @param {*} req
 * @param {*} res
 */
export const updateSpecificTask = (req,res) =>{
    console.log("req.params",req.params);
    const taskId= parseInt(req.params.id);
    //Request Payload
    const {task, completed } = req.body;//Short object property Access
    //
    console.log("req.body",req.body.task);

    console.log("taskID",taskId);

    //how we can find the task from Array?
    let ResultTask = TaskList.find(taskResult => taskId === taskResult.id);
    ResultTask = {...ResultTask, task, completed};

    // if we dont have task from tasklist
    if(!task){
        return res.status(404).json({
            message:'No Task Found'
        })
    }

    //Send Correct Task Details
    return res.status(200).json({
        data:ResultTask
    })

}

//Delete Task 
export const deleteSpecificTask = (req,res) =>{
    console.log("req.params",req.params);
    const taskId= parseInt(req.params.id);
    //Request Payload

    console.log("taskID",taskId);

    //how we can find the task from Array?
    let ResultTaskIndex = TaskList.findIndex(taskResult => taskId === taskResult.id);
    console.log("TaskList",TaskList)
    // if we dont have task from tasklist
    if(ResultTaskIndex === -1){
        return res.status(404).json({
            message:'No Task Found'
        })
    }

    //Delete Task from Specific Index
    TaskList.splice(ResultTaskIndex,1);


    //Send Correct Task Details
    return res.status(200).json({
        message:"Task Delete Successfully"
    })

}
