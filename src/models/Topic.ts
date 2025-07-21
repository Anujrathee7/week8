import mongoose, {Model,Schema,Document} from "mongoose";

interface ITopic extends Document{
    title: string,
    content: string,
    username: string,
    createdAt: Date
}

const TopicSchema: Schema<ITopic> = new Schema({
    title: {type: String , required: true},
    content: {type: String,reqired: true},
    username: {type: String, required: true},
    createdAt: {type: Date, required: true}
})

const Topic: Model<ITopic> = mongoose.model("Topic",TopicSchema)

export {Topic,ITopic}