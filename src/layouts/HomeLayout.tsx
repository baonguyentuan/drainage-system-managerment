import { Button, Space } from 'antd'
import React from 'react'
import { Outlet } from 'react-router-dom'

type Props = {}

const HomeLayout = (props: Props) => {
  return (
    <div className='w-full'>
      {/* <div className=' bg-slate-200 px-4 py-2 flex justify-end'>
        <Space className='mx-auto'>
          <Button className=' bg-red-300'>Login</Button>
          <Button>Register</Button>
        </Space>
      </div> */}
      <Outlet />
    </div>
  )
}

export default HomeLayout