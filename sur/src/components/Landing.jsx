import React from 'react'
import gsap from 'gsap'
import { useGSAP} from '@gsap/react'
import { use } from 'react'

function Landing() {
  return (
    <div className='w-full  h-screen bg-[#1c1c1c]'>
        <div className='w-full py-5 lg:px-10 px-5 relative flex items-center justify-between'>
            <div className='hidden lg:flex text-2xl gap-[20px] text-zinc-500 font-semibold'>
             <a href="">
              <h1> Contribute </h1>
            </a> 
           </div>
           <div className="name lg:mx-auto">
              <h1   className='lg:text-[40px] text-[30px] leading-tight font-bold text-[#3c3c96]'>Survey</h1>
              <h4   className='lg:text-[25px] text-[20px] font-semibold leading-tight -mt-[15px] text-[#412bcc] ml-[90px] lg:ml-[120px]'>Scape</h4>
           </div>
            <i className="ri-menu-5-line block text-[30px] text-black lg:hidden"></i>
           <div className='hidden lg:flex text-2xl gap-[20px] text-zinc-500 font-semibold'>
            <a href="#"><h1>Works</h1></a>
            <a href="#"><h1>Contact</h1></a>
            
            
          
           </div>
        </div>
        <div id="main" className='w-full flex'>
          <div id="heading">
            <h1 className='px-10 text-[7vw]  mt-[50px] font-semibold text-sky-600'>Survey.</h1>
            <h1 className='px-10 text-[7vw]  font-semibold text-sky-600'>Visualise.</h1>
            <h1 className='px-10 text-[7vw]  font-semibold text-sky-600'>Grow.</h1>
          </div>
        </div>
    </div>
  )
}

export default Landing