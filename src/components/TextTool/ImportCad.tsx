import React, { useState } from 'react'
import { Button, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import configDxf from '../../untils/config/configDxf';
const { Option } = Select;
const { TextArea } = Input;
type Props = {}
const baseOrdinate = 1000
const baseDistance = 50
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
                let finalContent: string
                arr = []
                contentRender = ``
                doc.split('\n').map((text, indexText) => {
                    let arrDoc: string[]
                    arrDoc = []
                    if (text !== "") {
                        text.split('\t').map((textItem, indexTextItem) => {
                            contentRender += `
0
TEXT
    5
B${indexTextItem}${indexText}
330
1F
100
AcDbEntity
    8
0
100
AcDbText
    10
${baseOrdinate + baseDistance * indexTextItem}
    20
${baseOrdinate + baseDistance * indexText / 2}
    30
0.0
    40
4.022976867721411
    1
${textItem}
100
AcDbText`
                        })
                    }
                })
                finalContent = configDxf.header + contentRender + configDxf.footer
                const writeToTextFile = (text: string, fileName: string) => {
                    let textFile: string | null;
                    textFile = null;
                    const makeTextFile = (text: string) => {
                        const data = new Blob([text], {
                            type: 'text/plain',
                        });
                        if (textFile !== null) {
                            window.URL.revokeObjectURL(textFile);
                        }
                        textFile = window.URL.createObjectURL(data);
                        return textFile;
                    };
                    const link = document.createElement('a');
                    link.setAttribute('download', fileName);
                    link.href = makeTextFile(text);
                    link.click();
                };
                writeToTextFile(finalContent, 'output.dxf');


            }}>Xuất sang file CAD</Button>
        </div>
    )
}

export default ImportCad