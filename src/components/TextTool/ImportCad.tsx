import React, { useState } from 'react'
import { Button, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { string } from 'yup';
import { log } from 'console';
const { Option } = Select;
const { TextArea } = Input;
type Props = {}
const baseOrdinate = 1000
const baseDistance = 1000
let renderValue = (value: string | null) => {
    if (value) {
        return value.trim()
    } else {
        return "0"
    }
}
const ImportCad = (props: Props) => {
    let [doc, setDoc] = useState<string>('')
    return (
        <div>
            <Form>
                <Form.Item>
                    <TextArea
                        className='my-4'
                        placeholder='nhập văn bản'
                        rows={10}
                        onChange={(event) => {
                            setDoc(event.target.value)
                        }}
                    />
                </Form.Item>
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item label={"Khoảng cách text (m)"}>
                            <InputNumber className='w-full' placeholder='Nhập khoảng cách text (m)' />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label={"Cỡ chữ"}>
                            <InputNumber className='w-full' placeholder='Nhập cỡ chữ' />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label={"Font chữ"}>
                            <Select
                                placeholder="Chọn font chữ"
                                defaultValue={"unicode"}
                            >
                                <Option value="unicode">UNICODE</Option>
                                <Option value="tcvn3">TCVN3</Option>
                                <Option value="vni">VNI</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            <Button onClick={() => {
                let arr: any[]
                let contentRender: string
                arr = []
                contentRender = ``
                console.log(doc.split('\n'));

                doc.split('\n').map((text, indexText) => {
                    let arrDoc: string[]
                    arrDoc = []
                    if (text !== "") {
                        text.split('\t').map((textItem, indexTextItem) => {
                            contentRender += `
                    0
                    TEXT
                    5
                    C644
                    330
                    1F
                    100
                    AcDbEntity
                      8
                    !CBKT text
                    100
                    AcDbText
                     10
                     ${baseOrdinate + indexTextItem * baseDistance}
                     20
                     ${baseOrdinate + indexText * baseDistance}
                     30
                     0
                     40
                    7
                      1
                    ${renderValue(textItem)}
                     50
                    0
                      7
                    Q
                    `

                        })
                    }
                })

            }}>Xuất sang file CAD</Button>
        </div>
    )
}

export default ImportCad