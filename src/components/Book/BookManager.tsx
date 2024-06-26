import { Button, Input, Upload } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import configRouter from "../../untils/config/configRouter";
import { formatText } from "../../untils/operate/opetate";
import {
  OrientationStatsModel,
  StationItemModel,
} from "../../models/bookModels";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/configStore";
import { setLstBookItem, setStructureName } from "../../redux/bookSlice";
import { closeDrawer } from "../../redux/drawerSlice";
import { openNotificationWithIcon } from "../../untils/operate/notify";

const { Search } = Input;
type Props = {};
const defaultStationstat: StationItemModel = {
  idStation: -1,
  stationStat: [],
};
const BookManager = (props: Props) => {
  let { structureName, lstBookItem } = useSelector(
    (state: RootState) => state.bookSlice
  );
  const dispatch = useDispatch();
  let navigate = useNavigate();

  return (
    <div className="max-w-3xl m-auto p-4">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Upload
          accept=".txt, .csv"
          showUploadList={false}
          beforeUpload={async (file) => {
            await dispatch(setStructureName({ structureName: "" }));
            await dispatch(setLstBookItem({ lstBookItem: [] }));
            const reader = new FileReader();
            reader.onload = (e) => {
              let lineArr: string =
                typeof e?.target?.result === "string" ? e?.target?.result : "";
              let book: StationItemModel[] = [];
              lineArr.split(/\n/).forEach((line, lineIndex) => {
                let arr: string[] = line.trim().split(/\t/);
                if (arr.length === 5) {
                  book.push({
                    idStation: Date.now() + lineIndex,
                    stationStat: [
                      {
                        idOrientation: Date.now() + lineIndex,
                        upNumber: Number(arr[1]),
                        centerNumber: Number(arr[2]),
                        downNumber: Number(arr[3]),
                        note: arr[4],
                      },
                    ],
                  });
                } else if (arr.length === 4) {
                  if (book.length > 0) {
                    book[book.length - 1].stationStat.push({
                      idOrientation: Date.now() + lineIndex,
                      upNumber: Number(arr[0]),
                      centerNumber: Number(arr[1]),
                      downNumber: Number(arr[2]),
                      note: arr[3],
                    });
                  }
                }
              });
              dispatch(setLstBookItem({ lstBookItem: book }));
            };
            reader.readAsText(file);
            await dispatch(closeDrawer());
            await navigate(`1`, { relative: "route" });
            // Prevent upload
            return false;
          }}
        >
          <Button size="large">Mở sổ đo có sẵn</Button>
        </Upload>
        <Button
          size="large"
          onClick={async () => {
            await dispatch(setStructureName({ structureName: "" }));
            await dispatch(setLstBookItem({ lstBookItem: [] }));
            await dispatch(closeDrawer());
            await navigate(`${configRouter.private.book}/1`);
          }}
        >
          Tạo sổ đo mới
        </Button>
        <Button
          className="col-span-2"
          size="large"
          onClick={async () => {
            let curBook = [];
            const store = localStorage.getItem("book");
            if (store !== "undefined" && store) {
              curBook = JSON.parse(store);
              await dispatch(setLstBookItem({ lstBookItem: curBook }));
              await dispatch(closeDrawer());
              await navigate(`${configRouter.private.book}/1`);
            } else {
              openNotificationWithIcon(
                "error",
                "Không có sổ đo trong bộ nhớ",
                ""
              );
            }
          }}
        >
          Lấy sổ đo từ bộ nhớ
        </Button>
        <Button
          size="large"
          className="col-span-2"
          onClick={() => {
            let renderText = ``;
            lstBookItem.forEach((sta, staIndex) => {
              sta.stationStat.forEach(
                (ori: OrientationStatsModel, oriIndex: number) => {
                  if (oriIndex === 0) {
                    renderText += `${formatText(
                      String(staIndex + 1),
                      5
                    )}\t${formatText(String(ori.upNumber), 5)}\t${formatText(
                      String(ori.centerNumber),
                      5
                    )}\t${formatText(String(ori.downNumber), 5)}\t${
                      ori.note
                    }\n`;
                  } else {
                    renderText += `${formatText(String(" "), 5)}\t${formatText(
                      String(ori.upNumber),
                      5
                    )}\t${formatText(
                      String(ori.centerNumber),
                      5
                    )}\t${formatText(String(ori.downNumber), 5)}\t${
                      ori.note
                    }\n`;
                  }
                }
              );
            });
            const element = document.createElement("a");
            const file = new Blob([renderText], { type: "text/plain" });
            element.href = URL.createObjectURL(file);
            element.download = `${structureName}.txt`;
            document.body.appendChild(element);
            element.click();
          }}
        >
          Xuất sổ đo sang định dạng TXT
        </Button>
      </div>
      <Search size="large" className="mb-2" placeholder="Nhập tên sổ đo" />
      <p className="text-left">Sổ đo gần đây</p>
    </div>
  );
};

export default BookManager;
