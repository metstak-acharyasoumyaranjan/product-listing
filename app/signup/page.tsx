"use client";
import { useState } from "react";
import { toast } from "sonner";
import { redirect} from "next/navigation";


export default function SignUpForm(){
    const userInitialData = {
        user_name : "",
        name : "",
        email : "",
        password : ""
    }
    const [signUpData , setSignUpData] = useState(userInitialData)

    async function formSubmit(e){
        e.preventDefault()
        const response = await fetch("http://localhost:3000/api/users",{
            method : "POST" ,
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify(signUpData)
        })

        if(!response.ok) {
            toast.error("Could Not Create Product")
        }

        toast.success("Sign Up successfull")
        redirect("/login")
    }

    return(
        <form onSubmit={formSubmit} className="flex flex-col gap-4 max-w-sm p-4">
            <label>User Name</label>
            <input type="text" onChange={(e)=>setSignUpData({...signUpData , user_name : e.target.value})}/>
            <label>Name</label>
            <input type="text" onChange={(e)=>setSignUpData({...signUpData , name : e.target.value})}/>
            <label>Email</label>
            <input type="text" onChange={(e)=>setSignUpData({...signUpData , email:e.target.value})}/>
            <label>Password</label>
            <input type="text" onChange={(e)=>setSignUpData({...signUpData , password : e.target.value})}/> 
            <button type="submit">Sign Up</button>  
        </form>
    )
}