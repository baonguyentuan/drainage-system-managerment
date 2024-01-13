import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/configStore'
import { ElevationPointModel, OrientationPointModel, StationCalculationModel, StationItemModel } from '../../models/bookModels'
import { Button, Checkbox, Input, InputNumber, Popconfirm, Popover, Radio, Space } from 'antd'
import { KeyOutlined, CheckOutlined } from '@ant-design/icons'
import { convertBookToCalculate, setLstBookCalculate } from '../../redux/bookSlice'
const { TextArea } = Input;
type Props = {}

const BookCaculation = (props: Props) => {
    let { structureName, lstBookCalculate } = useSelector((state: RootState) => state.bookSlice)
    const dispatch = useDispatch()
    const [key, setKey] = useState(false)
    const [keyValue, setKeyValue] = useState<ElevationPointModel[]>([])
    const [keySelected, setKeySeclected] = useState<string>('')
    const [textboxValue, setTextboxValue] = useState<string>('')
    const renderStation = (station: StationCalculationModel[]) => {
        return station.map((stationItem, indexStation) => {
            return <div key={indexStation} className='text-sm'>
                {stationItem.stationStat.map((orientation, indexOrientation) => {
                    return <div key={indexOrientation} className='grid grid-cols-6 hover:bg-slate-100'>
                        <p>{orientation.upNumber}</p>
                        <p>{orientation.centerNumber}</p>
                        <p>{orientation.downNumber}</p>
                        <p>{orientation.distance}</p>
                        <p>{orientation.elevation}</p>
                        <p className=' text-left'>{orientation.note}</p>
                        {indexOrientation >= stationItem.stationStat.length - 1 ? <hr className='col-span-5 my-2' /> : ''}
                    </div>
                })}
            </div>
        })
    }
    const convertTextboxValueToKeyvalue = (textboxValue: string) => {
        let keyArr: ElevationPointModel[] = []
        textboxValue.split('\n').map((text, indexText) => {
            if (text !== "") {
                let test = text.split(/\s/)
                keyArr.push({
                    name: test[0],
                    elevation: Number(test[1]),
                })
            }
        })
        setKeyValue(keyArr)
        setKey(false)
    }
    useEffect(() => {
        dispatch(convertBookToCalculate({}))
    }, [])
    return (
        <div className='m-4'>
            <h1>{structureName}</h1>
            <div>
                <h3 className='m-4'>{`${keyValue.length} điểm gốc`}</h3>

                <Radio.Group
                    optionType="button"
                    buttonStyle="solid"
                    onChange={(event) => {
                        setKeySeclected(event.target.value)
                    }} value={keySelected}>
                    {keyValue.map((key, keyIndex) => {
                        return <Radio value={key.name} key={keyIndex}>{`${key.name}: ${key.elevation}`}</Radio>
                    })}

                </Radio.Group>

                {key ? <div> <TextArea
                    rows={4}
                    onChange={(event) => {
                        setTextboxValue(event.target.value)
                    }} />
                    <Button className='m-4' onClick={() => {
                        convertTextboxValueToKeyvalue(textboxValue)
                    }}>Hoàn Thành</Button></div> : <Button className='m-4' onClick={() => {
                        setKey(true)
                    }}>Thêm điểm gốc</Button>}
            </div>
            <div className='my-2'>
                {renderStation(lstBookCalculate)}
            </div>
            <div className='flex justify-around items-center'>
                <Button onClick={() => {
                    let flag: boolean = false
                    let findKey = keyValue.findIndex(key => key.name === keySelected)
                    if (findKey !== -1) {
                        let tempElevationPoint: OrientationPointModel = { name: '', centerNumber: 0, elevation: 0 }
                        let newBook = JSON.parse(JSON.stringify(lstBookCalculate))
                        let elevationArray: ElevationPointModel[] = []
                        let baseStation = lstBookCalculate.map((station, stationIndex) => {
                            let baseOrientation = station.stationStat.map((orientation, orientationIndex) => {
                                if (flag) {
                                    let findPoint = elevationArray.findIndex(point => point.name === orientation.note)
                                    if (findPoint !== -1) {
                                        tempElevationPoint = {
                                            name: orientation.note,
                                            centerNumber: orientation.centerNumber,
                                            elevation: elevationArray[findPoint].elevation
                                        }
                                        newBook[stationIndex].stationStat[orientationIndex] = { ...newBook[stationIndex].stationStat[orientationIndex], elevation: tempElevationPoint.elevation }

                                    } else {
                                        let orientElevation = tempElevationPoint.elevation + tempElevationPoint.centerNumber - orientation.centerNumber
                                        newBook[stationIndex].stationStat[orientationIndex] = { ...newBook[stationIndex].stationStat[orientationIndex], elevation: orientElevation }
                                        elevationArray.push({
                                            name: orientation.note,
                                            elevation: orientElevation
                                        })
                                    }
                                } else {
                                    if (orientation.note === keySelected) {
                                        flag = true
                                        tempElevationPoint = {
                                            name: keyValue[findKey].name,
                                            centerNumber: orientation.centerNumber,
                                            elevation: keyValue[findKey].elevation
                                        }
                                        elevationArray.push({
                                            name: tempElevationPoint.name,
                                            elevation: tempElevationPoint.elevation
                                        })
                                        newBook[stationIndex].stationStat[orientationIndex] = { ...newBook[stationIndex].stationStat[orientationIndex], elevation: tempElevationPoint.elevation }
                                    }
                                }
                            })

                        })
                        console.log(elevationArray);
                        dispatch(setLstBookCalculate({ lstBookItem: [...newBook] }))
                    }
                }}>Tính sổ đo</Button>
                <Button>Tạo file bình sai</Button>
            </div>
        </div>
    )
}

export default BookCaculation