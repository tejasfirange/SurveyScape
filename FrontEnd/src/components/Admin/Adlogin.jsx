import React, { useEffect } from 'react'

function Adlogin() {

  useEffect(()=>{
    window.addEventListener('mousemove', function(e) {
      gsap.to('#cur', {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3
      });
    });
  
    document.querySelector("#but").addEventListener('mouseenter', function(){
      gsap.to('#cur', {
        width: '60px',
        height: '60px',
        delay: .3
      })
      gsap.to("#but",{
        fontSize : '40px',
        delay: .3
      })
    })
    document.querySelector("#but").addEventListener('mouseleave', function(){
      gsap.to('#cur', {
        width: '30px',
        height: '30px',
        delay: .3
      })
      gsap.to("#but",{
        fontSize : '30px',
        delay: .3
      })
    })


  },[])

return (

    <div className='main w-full  h-screen bg-[#1c1c1c]'>
          
           <div id='cur' className='hidden md:hidden sm:hidden lg:block w-[30px] h-[30px] z-[999] bg-[#b617ff3d] absolute rounded-full'></div>
           
        <div id='card' className='rounded-[50px] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[90%] h-[85%] lg:w-[28%] lg:h-[fit-content] bg-[#c4c2c22b]'>
            <h1 className='w-[fit-content]  text-[40px] bg-[#a85ca86b] px-3 py-1 rounded-b-[30px] text-purple-300 m-auto '>Login</h1>

            <form className='w-full py-20 flex flex-col '>
              <input className='w-[270px] lg:w-[270px] font-semibold uppercase h-[50px] bg-slate-200 text-zinc-900 text-center text-2xl m-auto rounded-[30px] outline-none' type="text" placeholder='Username' />    
              <input className='mt-[30px] w-[270px] lg:w-[270px] font-semibold uppercase h-[50px] bg-slate-200 text-zinc-900 text-center text-2xl m-auto rounded-[30px] outline-none' type="password" placeholder='Password' />
              <button id='but' className='mt-[30px] w-[270px] font-semibold uppercase h-[50px] bg-green-500 text-black text-center text-2xl m-auto rounded-[30px]'>SUBMIT</button>
              <a href="#">
                <h1 className='mt-[20px] text-[25px] text-purple-300 text-center'>Forgot Password ? <br /> or <a href="">Sign Up</a></h1>
              </a>
            </form>

        </div>
    </div>
  )
}

export default Adlogin