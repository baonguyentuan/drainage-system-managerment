import { Button, Input, Space, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/configStore";
import { useNavigate } from "react-router-dom";
import {
  createAltitudeApi,
  createOrientationApi,
  getAllAltitudeByOrderApi,
} from "../../redux/altitude.slice";
import {
  AltitudeBookModel,
  AltitudeDtoModel,
  AltitudeOrientationDtoModel,
  AltitudeUploadDtoModel,
} from "../../models/altitude.models";
import {
  RightOutlined,
  UploadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
type Props = {};
interface AdjustModel {
  start: string;
  end: string;
  distanceTotal: number;
  altitudeTotal: number;
}
const AltitudeMenu = (props: Props) => {
  const [name, setName] = useState<string>("");
  const { altitudeLst, altitudeOption } = useSelector(
    (state: RootState) => state.altitudeSlice
  );
  const [orientDtoLst, setOrientDtoLst] = useState<
    AltitudeOrientationDtoModel[]
  >([]);
  const [adjustSelected, setAdjustSelected] = useState<number[]>([]);
  const [adjustLst, setAdjustLst] = useState<AdjustModel[]>([]);
  const dispatch: any = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getAllAltitudeByOrderApi(altitudeOption));
  }, [altitudeOption]);
  return (
    <div className="m-4">
      <div>
        <div className="grid grid-cols-6 gap-2">
          <Input
            className="col-span-6 md:col-span-4"
            size="large"
            placeholder="Tên công trình"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <Button
            className="col-span-5 md:col-span-1"
            disabled={name.trim() === "" ? true : false}
            size="large"
            onClick={() => {
              const response = dispatch(
                createAltitudeApi({
                  nameStructure: name.trim(),
                  orientationLst: [],
                })
              );
              console.log(response);
            }}
          >
            Tạo sổ đo mới
          </Button>
          <Upload
            className=""
            accept=".txt, .csv"
            showUploadList={false}
            beforeUpload={async (file) => {
              let lst: AltitudeOrientationDtoModel[] = [];
              const reader = new FileReader();
              reader.onload = (e) => {
                let lineArr: string =
                  typeof e?.target?.result === "string"
                    ? e?.target?.result
                    : "";
                lineArr.split(/\n/).forEach((line, lineIndex) => {
                  let arr: string[] = line.trim().split(/\t/);
                  if (arr.length === 5) {
                    lst.push({
                      placemarkId: null,
                      topNumber: Number(arr[1]),
                      centerNumber: Number(arr[2]),
                      bottomNumber: Number(arr[3]),
                      note: arr[4],
                      isStart: true,
                    });
                  } else if (arr.length === 4) {
                    lst.push({
                      placemarkId: null,
                      topNumber: Number(arr[0]),
                      centerNumber: Number(arr[1]),
                      bottomNumber: Number(arr[2]),
                      note: arr[3],
                      isStart: false,
                    });
                  }
                });
                setOrientDtoLst(lst);
                setName(file.name);
              };
              reader.readAsText(file);
              return false;
            }}
          >
            <Button size="large">
              <UploadOutlined />
            </Button>
          </Upload>
        </div>
      </div>

      {orientDtoLst.length > 0 ? (
        <div className="grid grid-cols-3 mt-2">
          <div className="col-span-2">
            <div className="grid grid-cols-5 border-b-2 font-bold">
              <p className="col-span-1">Trên</p>
              <p className="col-span-1">Giữa</p>
              <p className="col-span-1">Dưới</p>
              <p className="col-span-2">Ghi chú</p>
            </div>
            {orientDtoLst.map((ori, index) => {
              let checkIndex = adjustSelected.findIndex((adj) => adj === index);
              return (
                <div
                  className={`grid grid-cols-6 ${
                    checkIndex === -1 ? "bg-white" : "bg-green-100"
                  }`}
                  key={index}
                >
                  {ori.isStart && index !== 0 ? (
                    <hr className="col-span-6 border-2" />
                  ) : (
                    ""
                  )}
                  <p className="col-span-1">{ori.topNumber}</p>
                  <p className="col-span-1">{ori.centerNumber}</p>
                  <p className="col-span-1">{ori.bottomNumber}</p>
                  <p className="col-span-2 text-left">{ori.note}</p>
                  <Button
                    type="link"
                    onClick={() => {
                      if (checkIndex !== -1) {
                        setAdjustSelected(adjustSelected.splice(index, 1));
                      } else {
                        setAdjustSelected(adjustSelected.concat(index));
                      }
                    }}
                  >
                    <RightOutlined />
                  </Button>
                </div>
              );
            })}
          </div>
          <div>
            <div className="grid grid-cols-4 border-b-2 font-bold">
              <p className="col-span-1">Khởi đầu</p>
              <p className="col-span-1">Kết thúc</p>
              <p className="col-span-1">Khoảng cách</p>
              <p className="col-span-1">Chênh cao</p>
            </div>
            {adjustLst.map((adj, index) => {
              return (
                <div className="grid grid-cols-4">
                  <p className="col-span-1">{adj.start}</p>
                  <p className="col-span-1">{adj.end}</p>
                  <p className="col-span-1">{adj.distanceTotal}</p>
                  <p className="col-span-1">{adj.altitudeTotal}</p>
                  <hr />
                </div>
              );
            })}
            <Button
              onClick={() => {
                let flagStart: boolean = false;
                let start: string = "";
                let end: string = "";
                let distanceTotal: number = 0;
                let altitudeTotal: number = 0;
                let adjLst: AdjustModel[] = [];
                orientDtoLst.forEach((ori, index) => {
                  let checkIndex = adjustSelected.findIndex(
                    (adj) => adj === index
                  );
                  if (checkIndex === -1) {
                    if (flagStart && ori.isStart) {
                      distanceTotal +=
                        (ori.topNumber - ori.bottomNumber) / 10 +
                        (orientDtoLst[index - 1].topNumber -
                          orientDtoLst[index - 1].bottomNumber) /
                          10;
                      altitudeTotal +=
                        ori.centerNumber - orientDtoLst[index - 1].centerNumber;
                    }
                    if (!flagStart && ori.isStart) {
                      distanceTotal += (ori.topNumber - ori.bottomNumber) / 10;
                      altitudeTotal += ori.centerNumber;
                      flagStart = true;
                    }
                  } else {
                    if (flagStart) {
                      end = ori.note;
                      distanceTotal += (ori.topNumber - ori.bottomNumber) / 10;
                      altitudeTotal -= ori.centerNumber;
                      adjLst.push({
                        start,
                        end,
                        distanceTotal: Number(distanceTotal.toFixed(1)),
                        altitudeTotal,
                      });
                      end = "";
                      distanceTotal = 0;
                      altitudeTotal = 0;
                      if (index < orientDtoLst.length - 1) {
                        start = orientDtoLst[index + 1].note;
                      } else {
                        start = "";
                      }
                      flagStart = false;
                    } else {
                      start = ori.note;
                      distanceTotal = (ori.topNumber - ori.bottomNumber) / 10;
                      altitudeTotal = ori.centerNumber;
                      flagStart = true;
                    }
                  }
                });
                setAdjustLst(adjLst);
              }}
            >
              Tính
            </Button>
            <Button
              onClick={async () => {
                let responseCreate = await dispatch(
                  createAltitudeApi({ nameStructure: name, orientationLst: [] })
                );
                if (responseCreate.meta.requestStatus === "fulfilled") {
                  await dispatch(
                    createOrientationApi({
                      altitudeId: responseCreate.payload.data._id,
                      orientDtoLst: orientDtoLst,
                    })
                  );
                }
              }}
            >
              Upload
            </Button>
          </div>
        </div>
      ) : (
        ""
      )}

      <div>
        <h1 className="font-semibold my-2">Sổ đo gần đây</h1>
        {altitudeLst.map((alti) => {
          return (
            <div
              key={alti._id}
              className="border-b-2 grid grid-cols-5 items-center p-1 hover:bg-green-50"
            >
              <p className="col-span-3 text-left">{alti.nameStructure}</p>
              <p>{alti.orientationLst.length} điểm</p>

              <Button
                size="large"
                onClick={() => {
                  navigate(`/altitude/${alti._id}`);
                }}
              >
                <RightOutlined />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AltitudeMenu;
