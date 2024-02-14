import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/configStore'
import { AdjustPathModel, ElevationPointModel, OrientationPointModel, StationCalculationModel } from '../../models/bookModels'
import { Button, Input, Radio } from 'antd'
import { BranchesOutlined, KeyOutlined } from '@ant-design/icons'
import { convertBookToCalculate, setLstBookCalculate, setLstBookItem } from '../../redux/bookSlice'
import { setPageTitle } from '../../redux/drawerSlice'
import { openNotificationWithIcon } from '../../untils/operate/notify'
const { TextArea } = Input;
type Props = {}
type AdjustPointPosition = {
    station: number,
    orientation: number
}
const BookCaculation = (props: Props) => {
    const { structureName, lstBookCalculate, lstBookItem } = useSelector((state: RootState) => state.bookSlice)
    const { pageTitle } = useSelector((state: RootState) => state.drawerSlice)
    const dispatch = useDispatch()
    const [key, setKey] = useState(false)
    const [keyValue, setKeyValue] = useState<ElevationPointModel[]>([])
    const [keySelected, setKeySeclected] = useState<string>('')
    const [textboxValue, setTextboxValue] = useState<string>('')
    const [lstAdjust, setLstAdjust] = useState<AdjustPointPosition[]>([])
    const renderStation = (station: StationCalculationModel[]) => {
        return station.map((stationItem, indexStation) => {
            return <div key={stationItem.idStation} className={`text-sm border-b-2`}>
                {stationItem.stationStat.map((orientation, indexOrientation) => {
                    return <div key={orientation.idOrientation} className={`grid grid-cols-7 items-center ${lstAdjust.findIndex(adj => adj.station === indexStation && adj.orientation === indexOrientation) !== -1 ? 'bg-green-300' : ''} `}>
                        <p>{orientation.upNumber}</p>
                        <p>{orientation.centerNumber}</p>
                        <p>{orientation.downNumber}</p>
                        <p >{orientation.distance}</p>
                        <p >{orientation.elevation}</p>
                        <p className=' text-left'>{orientation.note}</p>
                        <div >
                            <Button className={`${indexOrientation === stationItem.stationStat.length - 1 || indexOrientation === 0 ? 'hidden' : 'block'} my-2`} onClick={async () => {
                                let tempStation1 = JSON.parse(JSON.stringify(stationItem))
                                tempStation1.idStation = Date.now()
                                console.log(tempStation1.stationStat.length, indexOrientation + 1, tempStation1.stationStat.length - indexOrientation - 1);
                                tempStation1.stationStat.splice(indexOrientation + 1, tempStation1.stationStat.length - indexOrientation - 1)

                                let tempStation2 = JSON.parse(JSON.stringify(stationItem))
                                tempStation2.idStation = Date.now()
                                tempStation2.stationStat.splice(0, indexOrientation )
                                let bookUpdate = JSON.parse(JSON.stringify(lstBookItem))
                                bookUpdate.splice(
                                    indexStation, 2, { ...tempStation1 }, { ...tempStation2 })
                                await dispatch(setLstBookItem({ lstBookItem: [...bookUpdate] }))
                            }}><BranchesOutlined /></Button>
                            <Button className={`${stationItem.stationStat.length - 1 === indexOrientation || indexOrientation === 0 ? 'block' : 'hidden'} my-2`} onClick={() => {
                                let lstAdjustUpdate = [...lstAdjust]
                                let findIndex = lstAdjust.findIndex(adj => adj.station === indexStation && adj.orientation === indexOrientation)
                                if (findIndex === -1) {
                                    lstAdjustUpdate.push({
                                        station: indexStation,
                                        orientation: indexOrientation
                                    })
                                } else {
                                    lstAdjustUpdate.splice(findIndex, 1)
                                }
                                setLstAdjust(lstAdjustUpdate)
                            }}><KeyOutlined /></Button>
                        </div>
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
    }, [lstBookItem])
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
            <div className='flex justify-around items-center'>
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
                    let lstPath: AdjustPathModel[] = []
                    let tempAdj: AdjustPathModel = {
                        startPoint: '',
                        endPoint: '',
                        elevation: 0,
                        distance: 0,
                    }
                    if (lstAdjust.length >= 3) {
                        lstBookCalculate.forEach((station, indexStation) => {
                            station.stationStat.forEach((orientation, indexOrientation) => {
                                let compareIndex = lstAdjust.findIndex(adj => adj.station === indexStation && adj.orientation === indexOrientation)
                                if (compareIndex === -1) {
                                    if (indexOrientation === station.stationStat.length - 1) {
                                        tempAdj.elevation += station.stationStat[0].centerNumber - station.stationStat[station.stationStat.length - 1].centerNumber
                                        tempAdj.distance += (station.stationStat[0].upNumber - station.stationStat[0].downNumber + station.stationStat[station.stationStat.length - 1].upNumber - station.stationStat[station.stationStat.length - 1].downNumber) / 10
                                    }
                                } else {
                                    if (indexOrientation === 0) {
                                        tempAdj.startPoint = orientation.note
                                        tempAdj.endPoint = ''
                                        tempAdj.elevation = 0
                                        tempAdj.distance = 0
                                    } else {
                                        tempAdj.endPoint = orientation.note
                                        tempAdj.elevation += station.stationStat[0].centerNumber - station.stationStat[station.stationStat.length - 1].centerNumber
                                        tempAdj.distance += (station.stationStat[0].upNumber - station.stationStat[0].downNumber + station.stationStat[station.stationStat.length - 1].upNumber - station.stationStat[station.stationStat.length - 1].downNumber) / 10
                                        lstPath.push({ ...tempAdj })
                                        tempAdj.startPoint = orientation.note
                                        tempAdj.endPoint = ''
                                        tempAdj.elevation = 0
                                        tempAdj.distance = 0
                                    }
                                }
                            })
                        })
                        let renderText = ``
                        lstPath.forEach((path, pathIndex) => {
                            renderText += `${path.startPoint}\t${path.endPoint}\t${path.elevation}\t${path.distance}\n`
                        })
                        if (renderText !== ``) {
                            const element = document.createElement("a");
                            const file = new Blob([renderText], { type: 'text/plain' });
                            element.href = URL.createObjectURL(file);
                            element.download = `${structureName}-bs.txt`;
                            document.body.appendChild(element);
                            element.click();
                        } else {
                            openNotificationWithIcon(
                                'error',
                                "Xảy ra lỗi trong quá trình tạo file",
                                "File trống")
                        }
                    } else {
                        openNotificationWithIcon(
                            'error',
                            "Xảy ra lỗi trong quá trình tạo file",
                            "Bạn cần phải chọn ít nhất 2 điểm gốc và 1 điểm mới")
                    }
                }}>Tạo file bình sai</Button>
            </div>
        </div >
    )
}
export default BookCaculation