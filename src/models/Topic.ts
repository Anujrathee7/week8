import mongoose, {Model,Schema,Document} from "mongoose";

interface ITask extends Document{
    title: string,
    content: string,
    username: string,
    createdAt: Date
}

const TaskSchema: Schema<ITask> = new Schema({
    title: {type: String , required: true},
    content: {type: String,reqired: true},
    username: {type: String, required: true},
    createdAt: {type: Date, required: true}
})

const Task: Model<ITask> = mongoose.model("Task",TaskSchema)

export {Task,ITask}