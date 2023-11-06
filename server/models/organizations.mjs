import mongoose from 'mongoose';
const { Schema } = mongoose

const organizationSchema = new Schema(
    {
        companyName: {
            type: String,
            required: true
        },
        companyAdminName: {
            type: String,
            required: true
        },
        date: { type: Date, default: Date.now },
        
        companyEmail: {
            type: String,
            trim: true,
            lowercase: true,
            unique: true,
            required: 'Email address is required',
            // validate: [validateEmail, 'Please fill a valid email address'],
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
        },
        ETCtoken:{
            type:String,
        }

    }
)

const organizationModel = mongoose.model('OrganizationSchema', organizationSchema);


export default organizationModel;