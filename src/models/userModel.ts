import mongoose, { Document,Model,Schema} from "mongoose";

interface IUser extends Document{
    email: string,
    password: string,
    username: string,
    isAdmin: boolean
}

const UserSchema: Schema<IUser> = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, unique: true},
    username: {type: String, required: true},
    isAdmin: {type: Boolean, required: true}
})

const User: Model<IUser> = mongoose.model('User',UserSchema) 

export {User,IUser}