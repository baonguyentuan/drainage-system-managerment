import React, { useState } from 'react'
import { OrientationStatsModel } from '../../models/bookModels'
import { Button, Input, Popconfirm, Popover, Space } from 'antd'
import { BarsOutlined, EditOutlined, DeleteOutlined, MoreOutlined, CheckOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/configStore'
import { setLstBookItem } from '../../redux/bookSlice'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

type Props = {
    orientation: OrientationStatsModel,
    index: number[]
}

const OrientationElevation = (props: Props) => {
    let { lstBookItem } = useSelector((state: RootState) => state.bookSlice)
    let dispatch = useDispatch()
    const [editId, setEditId] = useState(-1)
    const [editValue, setEditValue] = useState('')
    const { orientation } = props
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({ id: props.orientation.idOrientation })
    const style = {
        transform: CSS.Translate.toString(transform), transition
    }
    const deleteOrientation = async (indexStation: number, indexOrientation: number) => {
        let newBook = JSON.parse(JSON.stringify(lstBookItem))
        console.log(indexStation);
        newBook[indexStation].stationStat.splice(indexOrientation, 1)
        await dispatch(setLstBookItem({ lstBookItem: [...newBook] }))
    }
    const editOrientation = async (indexStation: number, indexOrientation: number) => {
        let newBook = JSON.parse(JSON.stringify(lstBookItem))
        newBook[indexStation].stationStat[indexOrientation] = { ...newBook[indexStation].stationStat[indexOrientation], note: editValue }
        await dispatch(setLstBookItem({ lstBookItem: [...newBook] }))
    }
    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            key={props.orientation.idOrientation}
            className={`grid grid-cols-6 items-center hover:bg-slate-100 text-sm bg-slate-200 border-b-2 ${lstBookItem[props.index[0]].stationStat.length - 1 === props.index[1] ? 'border-black' : 'border-white'}`}>
            <p>{orientation.upNumber}</p>
            <p>{orientation.centerNumber}</p>
            <p>{orientation.downNumber}</p>
            <p className=' text-left col-span-2'>{orientation.note}</p>
            <div>
                <Popover placement="topRight" title={"Hành động"} content={<Space>
                    <Button onClick={async () => {
                        await setEditId(orientation.idOrientation)
                        await setEditValue(orientation.note)
                    }}><EditOutlined className='-translate-y-1' /></Button>
                    <Popconfirm
                        title="Delete the task"
                        description="Are you sure to delete this task?"
                        onConfirm={() => {
                            deleteOrientation(props.index[0], props.index[1])
                        }}
                        okType='danger'
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger ><DeleteOutlined className='-translate-y-1' /></Button>
                    </Popconfirm>
                </Space>} trigger="click">
                    <Button type='link' className='-translate-y-1'><MoreOutlined /></Button>
                </Popover>
            </div>
            {orientation.idOrientation === editId ? <Space.Compact className='col-span-5 my-2'>
                <Input value={editValue} onChange={async (event) => {
                    await setEditValue(event.target.value)
                }} />
                <Button color='green' type="default" onClick={async () => {
                    await setEditId(-1)
                    await setEditValue('')
                    editOrientation(props.index[0], props.index[1])
                }}><CheckOutlined /></Button>
            </Space.Compact> : ''}
        </div>
    )
}

export default OrientationElevation