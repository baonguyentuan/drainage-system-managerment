import { Button, Col, Drawer, Form, Input, InputNumber, Row, Space, } from 'antd'
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import TextArea from 'antd/es/input/TextArea'
import { useSelector, useDispatch } from 'react-redux'
import { useFormik } from 'formik'
import React, { useState } from 'react'
import { StationItemModel, OrientationStatsModel } from '../../models/bookModels'
import { BarsOutlined } from '@ant-design/icons'
import BookManager from './BookManager'
import { RootState } from '../../redux/configStore'
import { setLstBookItem, setStructureName } from '../../redux/bookSlice'
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import OrientationElevation from './OrientationElevation';
type Props = {}

const defaultOrientationValue: OrientationStatsModel = {
    idOrientation: -1,
    upNumber: 0,
    centerNumber: 0,
    downNumber: 0,
    note: ""
}
const defaultStationValue: StationItemModel = {
    idStation: -1,
    stationStat: []
}

function Book({ }: Props) {
    const [open, setOpen] = useState(false);
    let { structureName, lstBookItem } = useSelector((state: RootState) => state.bookSlice)
    let [currentStation, setCurrentStation] = useState<StationItemModel>(defaultStationValue)
    let dispatch = useDispatch()
    const formik = useFormik({
        initialValues: defaultOrientationValue,
        onSubmit: () => {
        }
    })
    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: { distance: 10 }
    })
    const touchSensor = useSensor(TouchSensor, {
        activationConstraint: {
            delay: 250,
            tolerance: 10
        }
    })
    const sensors = useSensors(mouseSensor, touchSensor)
    let accuracy = (formik.values.upNumber + formik.values.downNumber) / 2 - formik.values.centerNumber
    let distance = (formik.values.upNumber - formik.values.downNumber) / 10
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };
    const sortOrientation = async (event: any) => {
        let activeId: number = event.active.id
        let index: number = -1
        lstBookItem.map((station, staIndex) => {
            let oriIndex = station.stationStat.findIndex(orientation => orientation.idOrientation === activeId)
            if (oriIndex !== -1) {
                index = staIndex
            }
        })
        if (index !== -1) {
            let newBook = JSON.parse(JSON.stringify(lstBookItem))
            let activeIndex = lstBookItem[index].stationStat.findIndex(orientation => orientation.idOrientation === event.active.id)
            let overIndex = lstBookItem[index].stationStat.findIndex(orientation => orientation.idOrientation === event.over.id)
            newBook[index].stationStat = arrayMove(newBook[index].stationStat, activeIndex, overIndex)
            await dispatch(setLstBookItem({ lstBookItem: [...newBook] }))
        }
    }
    const renderStation = (station: StationItemModel[]) => {
        return station.map((stationItem, indexStation) => {
            return <SortableContext key={stationItem.idStation} items={stationItem.stationStat.map(orient => orient.idOrientation)}
            >
                {stationItem.stationStat.map((orientation, indexOrientation) => {
                    return <OrientationElevation key={orientation.idOrientation} orientation={orientation} index={[indexStation, indexOrientation]} />
                })}
                {station.length > 1 ? <hr className='border-2 border-black' /> : ''}
            </SortableContext>
        })
    }
    return (
        <div className='max-w-3xl m-auto p-4 my-4'>
            <Drawer
                title="Quản lý sổ đo"
                placement="left"
                onClose={onClose}
                open={open}
                key="left"
            >
                <BookManager />
            </Drawer>
            <div className='flex'>
                <Button onClick={showDrawer}><BarsOutlined /></Button>
                <h1 className='flex-1 text-center text-xl font-bold mb-4'>Sổ đo Thủy chuẩn</h1>
            </div>
            <Form labelAlign='left'>
                <Col span={24}>
                    <Form.Item
                        label='Tên công trình'
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 20 }}>
                        <Input name='structureName' value={structureName} onChange={(event) => {
                            dispatch(setStructureName({ structureName: event.target.value }))
                        }} />
                    </Form.Item>
                </Col>
                <Row gutter={8}>
                    <Col span={8}>
                        <Form.Item
                            label='Trên'
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}>
                            <InputNumber name='upNumber' value={formik.values.upNumber.toString()} onChange={(value) => {
                                if (value !== null) {
                                    formik.setFieldValue('upNumber', value)
                                } else {
                                    formik.setFieldValue('upNumber', 0)

                                }
                            }} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label='Giữa'
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}>
                            <InputNumber name='centerNumber' value={formik.values.centerNumber} onChange={(value) => {
                                if (value !== null) {
                                    formik.setFieldValue('centerNumber', value)
                                } else {
                                    formik.setFieldValue('centerNumber', 0)
                                }
                            }} />

                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label='Dưới'
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}>
                            <InputNumber name='downNumber' value={formik.values.downNumber} onChange={(value) => {
                                if (value !== null) {
                                    formik.setFieldValue('downNumber', value)
                                } else {
                                    formik.setFieldValue('downNumber', 0)
                                }
                            }} />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item label='Ghi chú' labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
                    <TextArea name='note' value={formik.values.note} rows={2} onChange={(event) => {
                        formik.setFieldValue('note', event.target.value)
                    }} />
                </Form.Item>
            </Form>
            <div>
                <div className='grid grid-cols-2 mb-4'>
                    <p className={Math.abs(accuracy) > 1.5 ? "text-red-400" : ""}><span>Sai số: </span><span>{accuracy}</span></p>
                    <p><span>Khoảng cách: </span><span>{distance}m</span></p>
                    <p className='col-span-2'><span>Khoảng cách cộng dồn: </span><span>{lstBookItem.reduce((acc, station) => {
                        return acc + ((station.stationStat[0].upNumber - station.stationStat[0].downNumber) / 10) - ((station.stationStat[station.stationStat.length - 1].upNumber - station.stationStat[station.stationStat.length - 1].downNumber) / 10)
                    }, 0)}</span></p>
                </div>
                <Space >
                    <Button disabled={formik.values.centerNumber !== 0 ? false : true} onClick={async () => {
                        if (formik.values.centerNumber !== 0) {
                            let orientationCurrent: OrientationStatsModel
                            orientationCurrent = {
                                idOrientation: Date.now(),
                                upNumber: formik.values.upNumber,
                                centerNumber: formik.values.centerNumber,
                                downNumber: formik.values.downNumber,
                                note: formik.values.note,
                            }
                            let stationUpdate: StationItemModel = { ...currentStation }
                            stationUpdate.idStation = Date.now()
                            stationUpdate.stationStat.push(orientationCurrent)
                            await formik.setFieldValue('upNumber', 0)
                            await formik.setFieldValue('centerNumber', 0)
                            await formik.setFieldValue('downNumber', 0)
                            await formik.setFieldValue('note', '')
                            await setCurrentStation(stationUpdate)
                        }
                    }}>Thêm điểm mia</Button>
                    <Button disabled={currentStation.stationStat.length > 1 ? false : true} onClick={async () => {
                        let lstUpdate = [...lstBookItem]
                        lstUpdate.push(currentStation)
                        await dispatch(setLstBookItem({ lstBookItem: lstUpdate }))
                        await formik.setFieldValue('upNumber', 0)
                        await formik.setFieldValue('centerNumber', 0)
                        await formik.setFieldValue('downNumber', 0)
                        await formik.setFieldValue('note', '')
                        await setCurrentStation({
                            idStation: -1,
                            stationStat: []
                        })
                    }}>Kết thúc trạm</Button>
                </Space>
            </div>
            <DndContext onDragEnd={sortOrientation} sensors={sensors}>
                <div className='bg-slate-200 my-2' >
                    {renderStation([currentStation])}
                </div>
                <div className='my-2'>
                    {renderStation(lstBookItem)}
                </div>
            </DndContext>
        </div >
    )
}

export default Book