import { Button, Input, Upload } from 'antd'
import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import configRouter from '../../untils/config/configRouter';
import { formatText } from '../../untils/operate/opetate';
import { OrientationStatsModel } from '../../models/bookModels';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/configStore';
import { setLstBookItem, setStructureName } from '../../redux/bookSlice';

const { Search } = Input;
type Props = {}

const BookManager = (props: Props) => {
  let { structureName, lstBookItem } = useSelector((state: RootState) => state.bookSlice)
  const dispatch = useDispatch()
  let navigate = useNavigate()
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
          await dispatch(setStructureName({ structureName: "" }))
          await dispatch(setLstBookItem({ lstBookItem: [] }))

        }}>Tạo sổ đo mới</Button>
        <Button className='col-span-2' onClick={() => {
          let curBook = []
          const store = localStorage.getItem("book")
          if (store) {
            curBook = JSON.parse(store)
          } else {
            curBook = []
          }
          dispatch(setLstBookItem({ lstBookItem: curBook }))
        }}>Lấy sổ đo từ bộ nhớ</Button>
        <Button className='col-span-2' onClick={() => {
          let renderText = ``
          lstBookItem.map((sta, staIndex) => {
            sta.stationStat.map((ori: OrientationStatsModel, oriIndex: number) => {
              if (oriIndex === 0) {
                renderText += `${formatText(String(staIndex + 1))}    ${formatText(String(ori.upNumber))}    ${formatText(String(ori.centerNumber))}  ${formatText(String(ori.downNumber))}  ${ori.note}\n`
              } else {
                renderText += `${formatText(String(" "))}    ${formatText(String(ori.upNumber))}    ${formatText(String(ori.centerNumber))}  ${formatText(String(ori.downNumber))}  ${ori.note}\n`
              }
            })
            renderText += `\n`
          })
          const element = document.createElement("a");
          const file = new Blob([renderText], { type: 'text/plain' });
          element.href = URL.createObjectURL(file);
          element.download = `${structureName}.txt`;
          document.body.appendChild(element);
          element.click();
        }}>Xuất sổ đo sang định dạng TXT</Button>
        <Button className='col-span-2' onClick={() => { navigate(configRouter.private.book_caculate) }}>Tính toán sổ đo</Button>
      </div>
      <Search className='mb-2' placeholder="Nhập tên sổ đo" />
      <p className='text-left'>Sổ đo gần đây</p>
    </div>
  )
}

export default BookManager