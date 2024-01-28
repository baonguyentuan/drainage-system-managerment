import { Button, Drawer } from 'antd'
import React from 'react'
import BookManager from '../components/Book/BookManager'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/configStore'
import { closeDrawer, showDrawer } from '../redux/drawerSlice'
import { BarsOutlined } from '@ant-design/icons'
import { Outlet } from 'react-router-dom'

type Props = {}

const BookLayout = (props: Props) => {
    const { isOpen, pageTitle } = useSelector((state: RootState) => state.drawerSlice)
    let dispatch = useDispatch()
    return (
        <div className='max-w-3xl m-auto p-4 my-4'>
            <Drawer
                title="Quản lý sổ đo"
                placement="left"
                onClose={() => { dispatch(closeDrawer()) }}
                open={isOpen}
                key="left"
            >
                <BookManager />
            </Drawer>
            <div className='flex'>
                <Button onClick={() => { dispatch(showDrawer({ drawerStatus: 'menuBook' })) }}><BarsOutlined /></Button>
                <h1 className='flex-1 text-center text-xl font-bold mb-4'>{pageTitle}</h1>
            </div>
            <Outlet />
        </div>
    )
}

export default BookLayout