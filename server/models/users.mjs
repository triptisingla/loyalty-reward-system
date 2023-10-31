import mongoose from 'mongoose';
const { Schema } = mongoose

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        organisation: {
            type: String,
            required: true
        },
        date: { type: Date, default: Date.now },
        
        hidden: Boolean,
        // _someId: { type: Schema.Types.ObjectId },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            unique: true,
            required: 'Email address is required',
            // validate: [validateEmail, 'Please fill a valid email address'],
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
        },
        password: {
            type: String,
            required: true
        },
        ETCtoken:{
            type:String,
        }

    }
)

const userModel = mongoose.model('UserSchema', userSchema);


export default userModel;