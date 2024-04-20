import React, { useState } from 'react'
import { OrientationStatsModel, StationItemModel } from '../../models/bookModels'
import { Button, Input, Popconfirm, Popover, Space } from 'antd'
import { EditOutlined, DeleteOutlined, MoreOutlined, CheckOutlined } from '@ant-design/icons'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

type Props = {
    orientation: OrientationStatsModel,
    station: StationItemModel,
    setStation: Function
}

const OrientationCurrent = (props: Props) => {
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
    const deleteOrientation = async () => {
        let newStation = JSON.parse(JSON.stringify(props.station))
        let findIndex = props.station.stationStat.findIndex(ori => ori.idOrientation === orientation.idOrientation)
        if (findIndex !== -1) {
            if (newStation.stationStat.length > 1) {
                newStation.stationStat.splice(findIndex, 1)
            } else {
                props.setStation({
                    idStation: -1,
                    stationStat: []
                })
            }
            await props.setStation(newStation)
        }
    }
    const editOrientation = async () => {
        let newStation = JSON.parse(JSON.stringify(props.station))
        let findIndex = props.station.stationStat.findIndex(ori => ori.idOrientation === orientation.idOrientation)
        if (findIndex !== -1) {
            newStation.stationStat[findIndex] = { ...newStation.stationStat[findIndex], note: editValue }
            await props.setStation(newStation)
        }
    }
    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            key={props.orientation.idOrientation}
            className={`grid grid-cols-7 items-center hover:bg-slate-100 text-sm bg-slate-200 border-b-2 border-white`}>
            <p>{orientation.upNumber}</p>
            <p>{orientation.centerNumber}</p>
            <p>{orientation.downNumber}</p>
            <p>{(orientation.upNumber - orientation.downNumber) / 10}</p>
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
                            deleteOrientation()
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
                    editOrientation()
                }}><CheckOutlined /></Button>
            </Space.Compact> : ''}
        </div>
    )
}

export default OrientationCurrent