import React from 'react'

const Header = () => {
  return (
    <div>
        <div className='flex items-end justify-between'>
            <h1 className='text-xl font-medium'>Hello <br /><span className='text-2xl font-semibold'>Jaskirat</span></h1>
            <button className='bg-red-600 text-lg font-medium text-white px-5 py-2 rounded-sm'>Logout</button>
        </div>
    </div>
  )
}

export default Header