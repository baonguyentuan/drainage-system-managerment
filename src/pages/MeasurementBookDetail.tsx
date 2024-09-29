import { Button, Popover, Radio } from "antd";
import { useEffect, useState } from "react";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/configStore";
import { getMeasurementDetailApi } from "../redux/measurement.slice";
import { useParams } from "react-router-dom";
import MeasureOrientation from "../components/measurement/MeasureOrientation";

import MeasurementControl from "../components/measurement/MeasurementControl";
import { MeasurementOrientationModel } from "../models/measurement.model";

type Props = {};
const MeasurementBookDetail = (props: Props) => {
  const param = useParams();
  const meaId = param.id === undefined ? "" : param.id;
  const { measurmentBook, measurementOption } = useSelector(
    (state: RootState) => state.measurementBookSlice
  );
  const [toltalShow, setTotalShow] = useState<number>(500);
  let reverseBook: MeasurementOrientationModel[] = [];
  if (measurmentBook) {
    if (measurmentBook.orientationLst.length > toltalShow && toltalShow > -1) {
      for (let i = 0; i < toltalShow; i++) {
        reverseBook.push(
          measurmentBook.orientationLst[
            measurmentBook.orientationLst.length - i - 1
          ]
        );
      }
    } else {
      reverseBook = [...measurmentBook.orientationLst].reverse();
    }
  }
  const dispatch: any = useDispatch();
  const areaHtml = document.getElementById("dataArea");
  useEffect(() => {
    dispatch(getMeasurementDetailApi(meaId));
  }, [measurementOption]);
  return (
    <div id="dataArea" className="w-screen h-screen overflow-y-scroll">
      {reverseBook && measurmentBook ? (
        <div>
          <MeasurementControl />
          <div className="fixed bottom-0 right-0 w-14 m-2">
            <Button
              className="border-2 border-blue-300 bg-blue-200"
              onClick={() => {
                areaHtml?.scrollTo({
                  top: 0,
                  left: 0,
                  behavior: "smooth",
                });
              }}
            >
              <ArrowUpOutlined />
            </Button>
            <Popover
              placement="topRight"
              trigger={"click"}
              content={
                <div style={{ maxHeight: 250 }} className="overflow-y-scroll">
                  <Radio.Group
                    value={toltalShow}
                    options={[
                      { label: "500", value: 500 },
                      { label: "Full", value: -1 },
                    ]}
                    onChange={(e) => {
                      setTotalShow(e.target.value);
                    }}
                  />
                  {reverseBook
                    .filter((ori) => ori.stationInfo !== null)
                    .map((ori) => {
                      return (
                        <p
                          key={ori._id}
                          className="border-b-2 p-2 hover:bg-green-200 cursor-pointer"
                          onClick={() => {
                            const selectHtml = document.getElementById(ori._id);
                            areaHtml?.scrollTo({
                              top: selectHtml?.offsetTop
                                ? selectHtml?.offsetTop - window.innerHeight / 2
                                : 100,
                              left: 0,
                              behavior: "smooth",
                            });
                          }}
                        >
                          {ori.stationInfo?.start} Mo {ori.stationInfo?.end}
                        </p>
                      );
                    })}
                </div>
              }
            >
              <Button className="border-2 border-blue-300 bg-blue-200 my-2">
                <ToolOutlined />
              </Button>
            </Popover>
            <Button
              className="border-2 border-blue-300 bg-blue-200"
              onClick={() => {
                areaHtml?.scrollTo({
                  top: areaHtml.scrollHeight,
                  left: 0,
                  behavior: "smooth",
                });
              }}
            >
              <ArrowDownOutlined />
            </Button>
          </div>
          <div className="mt-44">
            <div className="grid grid-cols-6 border-b-2 font-bold">
              <p className="col-span-1">STT</p>
              <p className="col-span-4">Ghi chú</p>
              <p className="col-span-1">Gương</p>
            </div>
            {reverseBook.map((orient, index) => {
              return (
                <MeasureOrientation
                  key={orient._id}
                  meaId={meaId}
                  orient={orient}
                  index={
                    measurmentBook.orientationLst.length -
                    index -
                    1 +
                    measurmentBook.startIndex
                  }
                />
              );
            })}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
export default MeasurementBookDetail;
