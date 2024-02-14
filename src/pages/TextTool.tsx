import { Tabs } from 'antd';
import React from 'react'
import ImportCad from '../components/TextTool/ImportCad';
import ConvertFont from '../components/TextTool/ConvertFont';

type Props = {}

const TextTool = (props: Props) => {
    return (
        <div className='mx-auto' style={{ maxWidth: 1200 }}>
            <h1 className='text-xl font-bold my-4'> Công cụ xử lý text</h1>
            <Tabs
                tabPosition="left"
                items={[
                    {
                        key:"importCad",
                        label:"Nhập text vào CAD",
                        children:<ImportCad/>
                    },
                    {
                        key:"covertFont",
                        label:"Chuyển đổi font",
                        children:<ConvertFont/>
                    }
                ]}
            />
        </div>
    )
}

export default TextTool