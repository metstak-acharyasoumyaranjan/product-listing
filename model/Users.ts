import mongoose , {Schema} from "mongoose";
import bcrypt from "bcrypt";


const UserSchema = new Schema(
    {
        user_name : {
            type : String ,
            lowercase : true,
            trim : true,
            required : [true , 'User name is required'] ,
            unique : true,
        },

        name : {
            type : String,
            required :  [true , 'Full Name is required'] ,
        },

        email : {
            type : String ,
            required :  [true , 'Email address is required'],
            unique :  true,
            lowercase : true ,
            trim :  true,
            match : [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
        },
        password : {
            type : String ,
            required : [true , "Password is required"],
            trim : true
        },
        role : {
            type : String,
            enum : {
                values : ['user' , 'admin'],
            },
            default : 'user'
        },
    },
    {
        timestamps : true
    }
)

UserSchema.pre("save" , async function (){
    if(!this.isModified("password")) return ;

    this.password = await bcrypt.hash(this.password , 12)
})

export const Users = mongoose.models.Users || mongoose.model("Users" , UserSchema)