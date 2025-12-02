"use client"
import Image from "next/image";
import { useEffect } from "react";
import { useSelector } from "react-redux";
export default function Home() {
    useEffect(() => {
      document.title = 'Home'; 
    },[]);

  const user=useSelector((state:any)=>state.auth.user)
  const state = useSelector((state: any) => state);
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <h1>home page</h1>
      <p>name:{user?.name}</p>
      <p>email: {user?.email}</p>
<p className="break-words whitespace-pre-wrap">state: {JSON.stringify(state, null, 2)}</p>
    </div>
  );
}
