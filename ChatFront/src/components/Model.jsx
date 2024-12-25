import React from 'react'

const Model = ({isModelOpen,setIsModelOpen,children}) => {
    if(!isModelOpen) return;

  return (
    <div className='fixed inset-0 items-center justify-center z-50'>
      
        {/* <div className='bg-white rounded-lg shadow-lg p-6 w-full max-w-md'>
            <button className='absolute top-4 right-4 text-gray-300 text-3xl '
            onClick={()=>setIsModelOpen(false)}
            >
                &times;
            </button> */}
            <div>
            {children}
        </div>
    </div>
  )
}

export default Model;
