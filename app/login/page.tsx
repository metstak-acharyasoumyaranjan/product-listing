"use client";

import { useState } from "react";
import { validateLoginForm } from "@/lib/utils/actions/user.action";
import { redirect } from 'next/navigation';



export default function LogInPage(){
    const [logInData , setLogInData] = useState({
        user_name : "",
        password : ""
    })

    const[logInStatus , setLogInStatus] = useState(false)

    async function handleFormSubmission(e) {
        e.preventDefault();

        const response = await validateLoginForm(logInData.user_name, logInData.password);
        
        if (!response || !response.success) {
            console.error(response?.error || "Login failed");
            redirect('/login')
        }

        redirect('/products/add')

    }

    return(
        <form className="flex flex-col gap-4 max-w-sm p-4">
            <label>Enter User Name</label>
            <input type="text" value={logInData.user_name} onChange={(e)=>setLogInData({...logInData , user_name : e.target.value})}/>
            <label>Enter Password</label>
            <input type="text" value={logInData.password} onChange={(e)=>setLogInData({...logInData , password : e.target.value})}/>
            <button type="submit" onClick={handleFormSubmission}>LOGIN</button>
        </form>
    )
}