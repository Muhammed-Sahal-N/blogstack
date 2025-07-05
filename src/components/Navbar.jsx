import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import Image from './Image';
import { SignedIn, SignedOut, SignInButton, useAuth, UserButton } from "@clerk/clerk-react";

function Navbar() {
    const [open, setOpen] = useState(false);
    const {getToken} = useAuth()
    useEffect(()=>{
      getToken().then((token)=>console.log(token))
    },[])
  return (
      
      
    <div className='w-full h-16 md:h-20 flex items-center justify-between'>
           {/* logo */}
        <Link to='/' className='flex items-center gap-4 text-2xl font-bold'>
            <Image src="logoo.png" alt="sahal logo  " className="w-8 h-8" width={32} height={32}  />       <span> BLOG STACK</span>

        </Link>
        {/* mobile menu */}
        <div className="md:hidden">
            {/* mobile button */}
            <div className="cursor-pointer text-4xl"
          onClick={() => setOpen((prev) => !prev)}>
              {open ? "x":"☰"}
          </div>
          {/* mobile link */}
          <div className={`w-full h-screen bg-[#e6e6ff] flex flex-col items-center justify-center gap-8 font-medium text-lg absolute top-16 transition-all ease-in-out ${
            open ? "-right-0" : "-right-[100%]"
          }`}>
        <Link to="/" onClick={()=>setOpen(false)}>Home</Link>
        <Link to="/posts?sort=trending" onClick={()=>setOpen(false)}>Trending</Link>
        <Link to="/posts?sort=popular" onClick={()=>setOpen(false)}>Most Popular</Link>
        {/* <Link to="/" onClick={()=>setOpen(false)}>About</Link>  */}
        <SignedOut>
        <Link to="/login" onClick={()=>setOpen(false)}>
            <button className="py-2 px-4 rounded-3xl bg-blue-800 text-white" >Login</button>
        </Link>
        </SignedOut>
          </div>

        </div>
        {/* desktop menu */}
        <div className="hidden md:flex items-center gap-8 xl:gap-12 font-medium"> 
        <Link to='/'>Home</Link>
        <Link to='/posts?sort=trending'>Trending</Link>
        <Link to='/posts?sort=popular'>Most Popular</Link>
        {/* <Link to='/'>About</Link> */}
        <SignedOut>
        <Link to='/login'>
            <button className="py-2 px-4 rounded-3xl bg-blue-800 text-white" >Login</button>
        </Link>
        </SignedOut>
        
        {/* <SignInButton /> */}
      
      <SignedIn>
        <UserButton />
      </SignedIn>
        </div>
        

    </div>
  )
}

export default Navbar