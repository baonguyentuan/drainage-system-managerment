import { Button, Popover } from "antd";
import { useEffect } from "react";
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

type Props = {};
const MeasurementBookDetail = (props: Props) => {
  const param = useParams();
  const meaId = param.id === undefined ? "" : param.id;
  const { measurmentBook, measurementOption } = useSelector(
    (state: RootState) => state.measurementBookSlice
  );
  const dispatch: any = useDispatch();
  const areaHtml = document.getElementById("dataArea");
  useEffect(() => {
    dispatch(getMeasurementDetailApi(meaId));
  }, [measurementOption]);
  return (
    <div id="dataArea" className="w-screen h-screen overflow-y-scroll">
      {measurmentBook !== null ? (
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
                  {measurmentBook.orientationLst
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
                                ? selectHtml?.offsetTop - 150
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
          <div className="mt-40">
            <div className="grid grid-cols-6 border-b-2 font-bold">
              <p className="col-span-1">STT</p>
              <p className="col-span-4">Ghi chú</p>
              <p className="col-span-1">Gương</p>
            </div>

            {measurmentBook?.orientationLst.map((orient, index) => {
              return (
                <MeasureOrientation
                  key={orient._id}
                  meaId={meaId}
                  orient={orient}
                  index={index + measurmentBook.startIndex}
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
