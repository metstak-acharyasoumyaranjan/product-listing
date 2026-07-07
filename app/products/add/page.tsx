import ProductAddingPage from "@/ui/ProductAdd";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Users } from "@/model/Users";
import { session } from "@/model/Session";
import { connectDB } from "@/lib/mongodb";


export default async function Page(){
  const cookieStore = await cookies()
  const sessionId = cookieStore.get("session_id")?.value;

  if(!sessionId){
    redirect("/login")
  }

  await connectDB()
  const sessionRecord = await session.findOne({session_id : sessionId})
  const userId = sessionRecord.user
  const userRecord = await Users.findOne({_id : userId})
  const userName = userRecord.user_name


  return (
    <div>
    <div>
      <h1>Hello {userName}</h1>
    </div>
    <ProductAddingPage />
    </div>
  )
}