import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/configStore'
import { StationItemModel } from '../../models/bookModels'
import { Button, Input, InputNumber, Popconfirm, Popover, Space } from 'antd'
import { KeyOutlined, CheckOutlined } from '@ant-design/icons'
type Props = {}

const BookCaculation = (props: Props) => {
    let { structureName, lstBookItem } = useSelector((state: RootState) => state.bookSlice)
    const [key, setKey] = useState(-1)
    const [keyValue, setKeyValue] = useState<number>(0)
    const renderStation = (station: StationItemModel[]) => {
        return station.map((stationItem, indexStation) => {
            return <div key={indexStation} className='text-sm'>
                {stationItem.stationStat.map((orientation, indexOrientation) => {
                    return <div key={indexOrientation} className='grid grid-cols-7 hover:bg-slate-100'>
                        <p>{orientation.upNumber}</p>
                        <p>{orientation.centerNumber}</p>
                        <p>{orientation.downNumber}</p>
                        <p className=' text-left'>{orientation.note}</p>
                        {orientation.idOrientation === key ? <Space.Compact className='col-span-2 my-2'>
                            <InputNumber value={keyValue} onChange={async (value) => {
                                await setKeyValue(Number(value))
                            }} />
                            <Button color='green' type="default" onClick={async () => {
                                setKey(-1)
                            }}><CheckOutlined /></Button>
                        </Space.Compact> : <p className=' text-left'>{keyValue}</p>}
                        <div>
                            <Button type='link' onClick={() => {
                                setKey(orientation.idOrientation)
                            }}><KeyOutlined /></Button>
                            {/* <Button type='link' onClick={() => {
                                setKey(orientation.idOrientation)
                            }}><KeyOutlined /></Button> */}
                        </div>
                        {indexOrientation >= stationItem.stationStat.length - 1 ? <hr className='col-span-5 my-2' /> : ''}
                    </div>
                })}
            </div>
        })
    }
    return (
        <div>
            <h1>{structureName}</h1>
            <div className='my-2'>
                {renderStation(lstBookItem)}
            </div>
        </div>
    )
}

export default BookCaculation