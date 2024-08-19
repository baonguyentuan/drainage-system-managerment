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
import { RightOutlined, UploadOutlined } from "@ant-design/icons";
type Props = {};

const AltitudeMenu = (props: Props) => {
  const [name, setName] = useState<string>("");
  const { altitudeLst, altitudeOption } = useSelector(
    (state: RootState) => state.altitudeSlice
  );
  const [orientDtoLst, setOrientDtoLst] = useState<
    AltitudeOrientationDtoModel[]
  >([]);

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
        <div>
          <div className="grid grid-cols-5 border-b-2 font-bold">
            <p className="col-span-1">Trên</p>
            <p className="col-span-1">Giữa</p>
            <p className="col-span-1">Dưới</p>
            <p className="col-span-2">Ghi chú</p>
          </div>
          {orientDtoLst.map((ori, index) => {
            return (
              <div className="grid grid-cols-5" key={index}>
                {ori.isStart && index !== 0 ? (
                  <hr className="col-span-5 border-2" />
                ) : (
                  ""
                )}
                <p className="col-span-1">{ori.topNumber}</p>
                <p className="col-span-1">{ori.centerNumber}</p>
                <p className="col-span-1">{ori.bottomNumber}</p>
                <p className="col-span-2 text-left">{ori.note}</p>
              </div>
            );
          })}
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
              <p className="col-span-2">{alti.nameStructure}</p>
              <p>{alti.orientationLst.length} điểm</p>
              <div className="col-span-2">
                {alti.orientationLst.length === 0 && orientDtoLst.length > 0 ? (
                  <Button
                    size="large"
                    onClick={() => {
                      dispatch(
                        createOrientationApi({
                          altitudeId: alti._id,
                          orientDtoLst,
                        })
                      );
                    }}
                  >
                    <UploadOutlined />
                  </Button>
                ) : (
                  ""
                )}
                <Button
                  size="large"
                  onClick={() => {
                    navigate(`/altitude/${alti._id}`);
                  }}
                >
                  <RightOutlined />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AltitudeMenu;
