import { Button, Input, Space } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/configStore";
import { useNavigate } from "react-router-dom";
import {
  createAltitudeApi,
  getAllAltitudeByOrderApi,
} from "../../redux/altitude.slice";

type Props = {};

const AltitudeMenu = (props: Props) => {
  const [name, setName] = useState<string>("");
  const { altitudeLst, altitudeOption } = useSelector(
    (state: RootState) => state.altitudeSlice
  );
  const dispatch: any = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getAllAltitudeByOrderApi(altitudeOption));
  }, [altitudeOption]);
  return (
    <div className="m-4">
      <div>
        {/* <Button size="large">Mở sổ đo có sẵn</Button> */}
        <Space>
          <Input
            size="large"
            placeholder="Tên công trình"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <Button
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
        </Space>
      </div>
      <div>
        <h1 className="font-semibold my-2">Sổ đo gần đây</h1>
        {altitudeLst.map((alti) => {
          return (
            <p
              key={alti._id}
              className="border-b-2 flex justify-between cursor-pointer p-1 hover:bg-green-50"
              onClick={() => {
                navigate(`/altiment/${alti._id}`);
              }}
            >
              <span>{alti.nameStructure}</span>
              <span>{alti.orientationLst.length} điểm</span>
            </p>
          );
        })}
      </div>
    </div>
  );
};

export default AltitudeMenu;
