import { Button, Col, Drawer, Form, Input, InputNumber, Popover, Row, Space, Upload } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { useSelector, useDispatch } from 'react-redux'
import { useFormik } from 'formik'
import React, { useState } from 'react'
import { string } from 'yup'
import { BookItemModel, StationStatsModel } from '../../models/bookModels'
import { BarsOutlined, EditOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons'
import BookManager from './BookManager'
import { RootState } from '../../redux/configStore'
type Props = {}

let defaultStationStatValue: StationStatsModel = {
    idOrientation: -1,
    upNumber: 0,
    centerNumber: 0,
    downNumber: 0,
    note: ""
}
const renderStation = (station: BookItemModel[]) => {
    return station.map((stationItem, indexStation) => {
        return <div key={indexStation} className='text-sm'>
            {stationItem.stationStat.map((orientation, indexOrientation) => {
                return <div className='grid grid-cols-5 '>
                    <p>{orientation.upNumber}</p>
                    <p>{orientation.centerNumber}</p>
                    <p>{orientation.downNumber}</p>
                    <p className=' text-left'>{orientation.note}</p>
                    <div>
                        <Popover placement="topRight" title={"Hành động"} content={<Space>
                            <Button><EditOutlined /></Button>
                            <Button><DeleteOutlined /></Button>
                        </Space>} trigger="click">
                            <Button type='link'><MoreOutlined /></Button>
                        </Popover>
                    </div>
                </div>
            })}
            {indexStation >= station.length - 1 ? <hr className='col-span-5 my-2' /> : ''}
        </div>
    })
}
function Book({ }: Props) {
    const [open, setOpen] = useState(false);
    let { structureName, lstBookItem } = useSelector((state: RootState) => state.bookSlice)
    let [currentStation, setCurrentStation] = useState<StationStatsModel[]>([])
    const formik = useFormik({
        initialValues: defaultStationStatValue,
        onSubmit: () => {

        }
    })
    let accuracy = (formik.values.upNumber + formik.values.downNumber) / 2 - formik.values.centerNumber
    let distance = (formik.values.upNumber - formik.values.downNumber) / 10
    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };
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
                            // setStructureName(event.target.value)
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
                                console.log(typeof value);
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
                    <p className='col-span-2'><span>Khoảng cách cộng dồn: </span><span>10m</span></p>
                </div>
                <Space >
                    <Button disabled={formik.values.centerNumber !== 0 ? false : true} onClick={async () => {
                        if (formik.values.centerNumber !== 0) {
                            let stationUpdate = [...currentStation]
                            stationUpdate.push({
                                idOrientation: Date.now(),
                                upNumber: formik.values.upNumber,
                                centerNumber: formik.values.centerNumber,
                                downNumber: formik.values.downNumber,
                                note: formik.values.note,
                            })
                            await formik.setFieldValue('upNumber', 0)
                            await formik.setFieldValue('centerNumber', 0)
                            await formik.setFieldValue('downNumber', 0)
                            await formik.setFieldValue('note', '')
                            await setCurrentStation(stationUpdate)
                        }
                    }}>Thêm điểm mia</Button>
                    <Button disabled={currentStation.length > 1 ? false : true} onClick={async () => {
                        let lstUpdate = [...lstBookItem]
                        // lstUpdate.push(currentStation)
                        await formik.setFieldValue('upNumber', 0)
                        await formik.setFieldValue('centerNumber', 0)
                        await formik.setFieldValue('downNumber', 0)
                        await formik.setFieldValue('note', '')
                        // await setLstBookItem(lstUpdate)
                        await setCurrentStation([])
                    }}>Kết thúc trạm</Button>
                </Space>
            </div>
            <div className='bg-slate-200 my-2' >
                {renderStation([{
                    idStation: -1,
                    stationStat: currentStation
                }])}
            </div>
            <div className='my-2'>
                {renderStation(lstBookItem)}
            </div>
        </div >
    )
}

export default Book