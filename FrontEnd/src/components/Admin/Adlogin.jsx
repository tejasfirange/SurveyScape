import React from 'react'

function Adlogin() {
  return (
    <div className='main w-full flex items-center justify-center h-screen bg-[#1c1c1c]'>
        <div id='card' className='relative rounded-[50px] w-[90%] h-[85%] lg:w-[25%] lg:h-[65%] bg-[#c4c2c22b]'>
            <div id='cir1' className='hidden lg:block w-[150px] h-[150px]  absolute top-[-50px] left-[-50px] rounded-[50%]'>

            </div>
            <div id='cir1' className='hidden lg:block w-[150px] h-[150px]  absolute bottom-[-50px] right-[-50px] rounded-[50%]'>

            </div>
            <h1 className='w-[fit-content]  text-[40px] bg-[#a85ca86b] px-3 py-1 rounded-b-[30px] text-purple-300 m-auto '>Login</h1>

            <form className='w-full py-20 flex flex-col '>
              <input className='w-[270px] lg:w-[270px] font-semibold uppercase h-[50px] bg-slate-200 text-zinc-900 text-center text-2xl m-auto rounded-[30px] outline-none' type="text" placeholder='Username' />    
              <input className='mt-[30px] w-[270px] lg:w-[270px] font-semibold uppercase h-[50px] bg-slate-200 text-zinc-900 text-center text-2xl m-auto rounded-[30px] outline-none' type="password" placeholder='Password' />
              <button className='mt-[30px] w-[270px] font-semibold uppercase h-[50px] bg-green-500 text-black text-center text-2xl m-auto rounded-[30px]'>SUBMIT</button>
              <a href="#">
                <h1 className='mt-[20px] text-[25px] text-purple-300 text-center'>Forgot Password ?</h1>
              </a>
            </form>

        </div>
    </div>
  )
}

export default Adlogin