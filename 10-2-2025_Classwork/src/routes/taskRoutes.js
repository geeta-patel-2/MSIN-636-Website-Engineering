import express from "express";
import { getTask,createTask, getSpecificTask, updateSpecificTask, deleteSpecificTask } from "../controllers/taskControllers.js";

const taskRouter = express.Router();

taskRouter.get('/',getTask);//LIST of the Tasks
taskRouter.post('/',createTask);// CREATE New Task
taskRouter.get('/:id',getSpecificTask)// Getting Specific Task
taskRouter.put('/:id',updateSpecificTask)// Updating Specific Task
taskRouter.delete('/:id',deleteSpecificTask)// Delete Specific Task


export default taskRouter;
