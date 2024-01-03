import { Button, Input, Upload } from 'antd'
import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import configRouter from '../../untils/config/configRouter';

const { Search } = Input;
type Props = {}

const BookManager = (props: Props) => {
  let [structureName, setStructureName] = useState<string>('')
  let [lstBookItem, setLstBookItem] = useState<any[]>([])
  let navigate=useNavigate()
  const renderLstBook = () => {

  }
  return (
    <div className='max-w-3xl m-auto my-4'>
      <div className='grid grid-cols-2 gap-4 mb-4'>
        <Upload
          multiple={false}
          accept='.json'
          onChange={(file) => {
            // let reader=new FileReader()
            // reader.readAsText(file.file)
            // reader.onloadend=(evt)=>{
            //   console.log(evt);

            // }

          }}>
          <Button>Mở sổ đo có sẵn</Button>
        </Upload>

        <Button onClick={async () => {
          await setStructureName('')
          await setLstBookItem([])

        }}>Tạo sổ đo mới</Button>
        <Button className='col-span-2'>Xuất sổ đo sang định dạng TXT</Button>
        <Button className='col-span-2' onClick={()=>{navigate(configRouter.private.book_caculate)}}>Tính toán sổ đo</Button>
      </div>
      <Search className='mb-2' placeholder="Nhập tên sổ đo" />
      <p className='text-left'>Sổ đo gần đây</p>
    </div>
  )
}

export default BookManager