import { Button, Input, Space } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/configStore";
import {
  createMeasurementApi,
  getAllMeasurementByOrderApi,
} from "../../redux/measurement.slice";
import { useNavigate } from "react-router-dom";

type Props = {};

const MeasurementMenu = (props: Props) => {
  const [name, setName] = useState<string>("");
  const { measurementLst, measurementOption } = useSelector(
    (state: RootState) => state.measurementBookSlice
  );
  const dispatch: any = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getAllMeasurementByOrderApi(measurementOption));
  }, [measurementOption]);
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
                createMeasurementApi({
                  nameStructure: name.trim(),
                  orientationLst: [],
                })
              );
            }}
          >
            Tạo sổ đo mới
          </Button>
        </Space>
      </div>
      <div>
        <h1 className="font-semibold my-2">Sổ đo gần đây</h1>
        {measurementLst.map((measure) => {
          return (
            <p
              key={measure._id}
              className="border-b-2 flex justify-between cursor-pointer p-1 hover:bg-green-50"
              onClick={() => {
                navigate(`/measurement/${measure._id}`);
              }}
            >
              <span>{measure.nameStructure}</span>
              <span>{measure.orientationLst.length} điểm</span>
            </p>
          );
        })}
      </div>
    </div>
  );
};

export default MeasurementMenu;
