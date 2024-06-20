import ListApps from "@/components/ListApps";
import NewApp from "@/components/NewApp";
import axios from "axios";

export const dynamic = 'force-dynamic'

export default async function Home() {
  const {data} = await axios.get(`${process.env.NEXT_PUBLIC_SERVER}/api/v1/manualDeploy/getApp`);

  if(data.status != "success"){
    console.error("Error Fetching apps");
  }

  return(
    <main className="flex justify-center items-center flex-col gap-10 p-5">
      <h2 className="text-3xl text-center">Web Hosting</h2>
      <NewApp/>
      {
        
        <ListApps apps={data.message.apps}/> 
      }
    </main>
  )
}
