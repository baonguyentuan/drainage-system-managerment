import { Button, Popover } from "antd";
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
  const { measurmentBook } = useSelector(
    (state: RootState) => state.measurementBookSlice
  );
  let stationLst: MeasurementOrientationModel[][] = [];

  const [currentStation, setCurrentStation] = useState<number>(
    stationLst.length - 1
  );
  if (measurmentBook) {
    measurmentBook.orientationLst.forEach((ori) => {
      if (ori.stationInfo) {
        stationLst.push([ori]);
      } else {
        stationLst[stationLst.length - 1].push(ori);
      }
    });
  }
  const dispatch: any = useDispatch();
  const areaHtml = document.getElementById("dataArea");

  useEffect(() => {
    dispatch(getMeasurementDetailApi(meaId));
  }, [meaId]);
  useEffect(() => {
    if (currentStation !== stationLst.length - 1) {
      setCurrentStation(stationLst.length - 1);
    }
  }, [measurmentBook]);
  return (
    <div id="dataArea" className="w-screen h-screen overflow-y-scroll">
      {stationLst && measurmentBook ? (
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
                  {stationLst.map((sta, index) => {
                    return (
                      <p
                        key={sta[0]._id}
                        className={`border-b-2 p-2 hover:bg-green-300 cursor-pointer ${
                          index === currentStation ? "bg-green-200" : ""
                        }`}
                        onClick={() => {
                          setCurrentStation(index);
                        }}
                      >
                        {sta[0].stationInfo?.start} Mo {sta[0].stationInfo?.end}
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
            {currentStation !== -1 && stationLst.length > 0
              ? stationLst[currentStation].reverse().map((orient, index) => {
                  let startNum = stationLst.reduce((acc, cur, indexStart) => {
                    if (currentStation > indexStart) {
                      return acc + cur.length;
                    } else {
                      return acc;
                    }
                  }, 0);
                  return (
                    <MeasureOrientation
                      key={orient._id}
                      meaId={meaId}
                      orient={orient}
                      index={
                        stationLst[currentStation].length -
                        index -
                        1 +
                        measurmentBook.startIndex +
                        startNum
                      }
                    />
                  );
                })
              : ""}
            {currentStation === -1 && stationLst.length > 0
              ? stationLst[stationLst.length - 1]
                  .reverse()
                  .map((orient, index) => {
                    let startNum = stationLst.reduce((acc, cur, indexStart) => {
                      console.log(indexStart, acc);
                      if (stationLst.length > indexStart) {
                        return acc + cur.length;
                      } else {
                        return acc;
                      }
                    }, 0);

                    return (
                      <MeasureOrientation
                        key={orient._id}
                        meaId={meaId}
                        orient={orient}
                        index={
                          -index - 1 + measurmentBook.startIndex + startNum
                        }
                      />
                    );
                  })
              : ""}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
export default MeasurementBookDetail;
