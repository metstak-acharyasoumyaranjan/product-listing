import mongoose , { Schema } from "mongoose";
import crypto from "crypto";

const SessionSchema = new Schema({
    user : {
        type : Schema.Types.ObjectId,
        ref : 'users',
        required : true
    },
    session_id : {
        type : String,
        unique : true
    },
    expires_at : {
        type : Date ,
        default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        expires : 0
    },
    validity : {
        type : String, 
        enum : {
            values : ['valid' , 'invalid']
        },
        default : 'valid'
    }
},
{
    timestamps : true
}
)

SessionSchema.pre("validate" , function(){
    this.session_id = crypto.randomUUID();
})

export const session = mongoose.models.session || mongoose.model("session" , SessionSchema)