import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/configStore'
import { AdjustPathModel, ElevationPointModel, OrientationPointModel, StationCalculationModel } from '../../models/bookModels'
import { Button, Input, Radio } from 'antd'
import { BranchesOutlined, KeyOutlined } from '@ant-design/icons'
import { convertBookToCalculate, setLstBookCalculate } from '../../redux/bookSlice'
import { setPageTitle } from '../../redux/drawerSlice'
import { openNotificationWithIcon } from '../../untils/operate/notify'
const { TextArea } = Input;
type Props = {}
const BookCaculation = (props: Props) => {
    const { structureName, lstBookCalculate } = useSelector((state: RootState) => state.bookSlice)
    const { pageTitle } = useSelector((state: RootState) => state.drawerSlice)
    const dispatch = useDispatch()
    const [key, setKey] = useState(false)
    const [keyValue, setKeyValue] = useState<ElevationPointModel[]>([])
    const [keySelected, setKeySeclected] = useState<string>('')
    const [textboxValue, setTextboxValue] = useState<string>('')
    const [isAdjust, setIsAdjust] = useState(false)
    const [lstAdjust, setLstAdjust] = useState<number[]>([])
    const renderStation = (station: StationCalculationModel[]) => {
        return station.map((stationItem, indexStation) => {
            return <div key={indexStation} className={`text-sm`}>
                {stationItem.stationStat.map((orientation, indexOrientation) => {
                    return <div key={indexOrientation} className={`grid grid-cols-6 items-center ${lstAdjust.findIndex(adj => adj === indexStation) !== -1 ? 'bg-green-300' : ''} `}>
                        <p>{orientation.upNumber}</p>
                        <p>{orientation.centerNumber}</p>
                        <p>{orientation.downNumber}</p>
                        <p className={`${isAdjust ? 'hidden' : 'block'}`}>{orientation.distance}</p>
                        <p className={`${isAdjust ? 'hidden' : 'block'}`}>{orientation.elevation}</p>
                        <p className=' text-left'>{orientation.note}</p>
                        <div className={`${isAdjust ? 'block' : 'hidden'} col-span-2`}>
                            <Button className={`${indexOrientation === stationItem.stationStat.length - 1 || indexOrientation === 0 ? 'hidden' : 'block'} my-2`}><BranchesOutlined /></Button>
                            <Button className={`${stationItem.stationStat.length - 1 === indexOrientation ? 'block' : 'hidden'} my-2`} onClick={() => {
                                let lstAdjustUpdate = [...lstAdjust]
                                let findIndex = lstAdjust.findIndex(adj => adj === indexStation)
                                if (findIndex === -1) {
                                    lstAdjustUpdate.push(indexStation)
                                } else {
                                    lstAdjustUpdate.splice(findIndex, 1)
                                }
                                setLstAdjust(lstAdjustUpdate)
                            }}><KeyOutlined /></Button>
                        </div>

                        {indexOrientation >= stationItem.stationStat.length - 1 ? <hr className='col-span-5 my-2' /> : ''}
                    </div>
                })}
            </div>
        })
    }
    const convertTextboxValueToKeyvalue = (textboxValue: string) => {
        let keyArr: ElevationPointModel[] = []
        textboxValue.split('\n').forEach((text, indexText) => {
            if (text !== "") {
                let test = text.split(/:/)
                keyArr.push({
                    name: test[0],
                    elevation: Number(test[1]),
                })
            }
        })
        setKeyValue(keyArr)
        setKey(false)
    }
    const convertArr2String = () => {
        return keyValue.map(key => `${key.name}: ${key.elevation}`).join('\n')
    }
    useEffect(() => {
        dispatch(convertBookToCalculate({}))
        if (pageTitle !== "Tính toán sổ đo") {
            dispatch(setPageTitle({ pageTitle: "Tính toán sổ đo" }))
        }
    }, [])
    return (
        <div className='m-4'>
            <h1>{structureName}</h1>
            <div>
                <h3 className='m-4'>{`${keyValue.length} điểm gốc`}</h3>
                {key ? <div> <TextArea
                    rows={4}
                    value={textboxValue}
                    onChange={(event) => {
                        setTextboxValue(event.target.value)
                    }} />
                    <Button className='m-4' onClick={() => {
                        convertTextboxValueToKeyvalue(textboxValue)
                    }}>Hoàn Thành</Button></div> : <div>
                    <Radio.Group
                        optionType="button"
                        buttonStyle="solid"
                        onChange={(event) => {
                            setKeySeclected(event.target.value)
                        }} value={keySelected}>
                        {keyValue.map((key, keyIndex) => {
                            return <Radio className='m-2' value={key.name} key={keyIndex}>{`${key.name}: ${key.elevation}`}</Radio>
                        })}
                    </Radio.Group>
                    <Button color='red' className='m-4' onClick={() => {
                        setTextboxValue(convertArr2String())
                        setKey(true)
                    }}>Điểm gốc</Button>
                </div>}
            </div>
            <div className='my-2'>
                {renderStation(lstBookCalculate)}
            </div>
            {isAdjust ? <div>
                <Button onClick={()=>{
                    let lstPath:AdjustPathModel[]=[]
                    if(lstAdjust.length>=3){
                        
                        setIsAdjust(false)
                    }else{
                        openNotificationWithIcon(
                            'error',
                            "Xảy ra lỗi trong quá trình tạo file",
                            "Bạn cần phải chọn ít nhất 2 điểm gốc và 1 điểm mới")
                    }
                }}>Tạo file</Button>
            </div> : <div className='flex justify-around items-center'>
                <Button onClick={() => {
                    let findKey = keyValue.findIndex(key => key.name === keySelected)
                    if (findKey !== -1) {
                        let tempElevationPoint: OrientationPointModel = { name: '', centerNumber: 0, elevation: 0 }
                        let newBook = JSON.parse(JSON.stringify(lstBookCalculate))
                        let elevationArray: ElevationPointModel[] = []
                        lstBookCalculate.forEach((station, stationIndex) => {
                            station.stationStat.forEach((orientation, orientationIndex) => {
                                if (stationIndex === 0 && orientationIndex === 0) {
                                    if (orientation.note === keySelected) {
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
                                    } else {
                                        openNotificationWithIcon(
                                            'error',
                                            "Xảy ra lỗi trong quá trình tính toán",
                                            "Không tìm thấy độ cao gốc")
                                        return
                                    }
                                } else {
                                    if (orientationIndex === 0) {
                                        let findPoint = elevationArray.findIndex(point => point.name === orientation.note)
                                        if (findPoint !== -1) {
                                            tempElevationPoint = {
                                                name: orientation.note,
                                                centerNumber: orientation.centerNumber,
                                                elevation: elevationArray[findPoint].elevation
                                            }
                                            newBook[stationIndex].stationStat[orientationIndex] = { ...newBook[stationIndex].stationStat[orientationIndex], elevation: tempElevationPoint.elevation }
                                        } else {
                                            openNotificationWithIcon(
                                                'error',
                                                "Xảy ra lỗi trong quá trình tính toán",
                                                `Không tìm thấy điểm độ cao ${orientation.note}`)
                                            return
                                        }
                                    } else {
                                        let orientElevation = tempElevationPoint.elevation + tempElevationPoint.centerNumber - orientation.centerNumber
                                        newBook[stationIndex].stationStat[orientationIndex] = { ...newBook[stationIndex].stationStat[orientationIndex], elevation: orientElevation }
                                        elevationArray.push({
                                            name: orientation.note,
                                            elevation: orientElevation
                                        })
                                    }

                                }
                            })
                        })
                        dispatch(setLstBookCalculate({ lstBookItem: [...newBook] }))
                    } else {
                        openNotificationWithIcon(
                            'error',
                            "Xảy ra lỗi trong quá trình tính toán",
                            "Bạn chưa cài đặt độ cao gốc")
                    }
                }}>Tính sổ đo</Button>
                <Button onClick={() => {
                    setIsAdjust(!isAdjust)
                }}>Tạo file bình sai</Button>
            </div>}
            
        </div >
    )
}
export default BookCaculation