import React, { useEffect } from 'react'
import gsap from 'gsap'
import { useGSAP} from '@gsap/react'
import { use } from 'react'

function Landing() {



  return (
    <div className='main w-full  h-screen bg-[#1c1c1c]'>
        <div className='w-full py-5 lg:px-10 px-5 relative flex items-center justify-between'>
            <div className='hidden lg:flex text-2xl gap-[20px] text-zinc-500 font-semibold'>
             <a href="">

              <h1> Contribute </h1>
            </a> 
           </div>
           <div  className="name tracking-[18px] lg:mx-auto">
              <h1   className='lg:text-[40px] text-[30px] leading-tight font-bold text-[#ffffff]'>Survey</h1>
              <h4   className='lg:text-[25px] text-[20px] font-semibold leading-tight -mt-[5px] text-[#fff] ml-[90px] lg:ml-[130px]'>Scape</h4>
           </div>
            <i className="ri-menu-5-line block text-[30px]  text-white lg:hidden"></i>
           <div className='hidden lg:flex text-2xl gap-[20px] text-zinc-500 font-semibold'>
            <a href="#"><h1>Works</h1></a>
            <a href="#"><h1>Contact</h1></a>
            
          
           </div>
        </div>
        <div id="main" className='w-full flex mt-[120px] lg:mt-[50px] justify-center'>
          <div id="heading">
            <h1 id='name' className='px-10 text-center text-[15vw] lg:text-[7vw]   font-semibold text-sky-600'>Create.</h1>
            <h1 id='name' className='px-10 mx-auto text-[15vw] lg:text-[7vw] mt-[-25px] font-semibold text-sky-600'>Visualise.</h1>
            <h1 id='name' className='px-10 mt-[-25px] text-center text-[15vw] lg:text-[7vw]  font-semibold text-sky-600'>Grow.</h1>
          </div>
        </div>
    </div>
  )
}

export default Landing