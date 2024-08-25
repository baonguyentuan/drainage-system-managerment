import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "../redux/configStore";
import {
  getAltitudeDetailApi,
  swapOrientationAltitudeApi,
} from "../redux/altitude.slice";
import { Button } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { SortableContext } from "@dnd-kit/sortable";
import AltitudeOrientation from "../components/Altitude/AltitudeOrientation";

import AltitudeControl from "../components/Altitude/AltitudeControl";
type Props = {};
const AltitudeBookDetail = (props: Props) => {
  const param = useParams();
  const altiId = param.id === undefined ? "" : param.id;
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 10,
    },
  });
  const sensors = useSensors(mouseSensor, touchSensor);
  const { altitudeBook, altitudeOption } = useSelector(
    (state: RootState) => state.altitudeSlice
  );
  const dispatch: any = useDispatch();

  useEffect(() => {
    dispatch(getAltitudeDetailApi(altiId));
  }, [altitudeOption]);
  return (
    <div id="dataArea" className="w-screen h-screen overflow-y-scroll">
      {altitudeBook !== null ? (
        <div>
          <div className="fixed bottom-0 right-0 w-14 m-2 ">
            <Button
              size="large"
              className="border-2 border-blue-300 bg-blue-200"
              onClick={() => {
                const areaHtml = document.getElementById("dataArea");
                areaHtml?.scrollTo({
                  top: 0,
                  left: 0,
                  behavior: "smooth",
                });
              }}
            >
              <ArrowUpOutlined />
            </Button>
            <Button
              size="large"
              className="border-2 border-blue-300 bg-blue-200 mt-2"
              onClick={() => {
                const areaHtml = document.getElementById("dataArea");
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
          <AltitudeControl />
          <div className="px-2">
            <div className="grid grid-cols-6 border-b-2 font-bold mt-60">
              <p className="col-span-1">Trên</p>
              <p className="col-span-1">Giữa</p>
              <p className="col-span-1">Dưới</p>
              <p className="col-span-1">KC</p>
              <p className="col-span-2">Ghi chú</p>
            </div>
            <DndContext
              onDragEnd={(event) => {
                if (event.over?.id) {
                  dispatch(
                    swapOrientationAltitudeApi({
                      altitudeId: altiId,
                      orientationId1: event.active.id.toString(),
                      orientationId2: event.over.id.toString(),
                    })
                  );
                }
              }}
              sensors={sensors}
            >
              <SortableContext
                key={altiId}
                items={altitudeBook.orientationLst.map((orient) =>
                  orient._id.toString()
                )}
              >
                {altitudeBook.orientationLst.map((orient, index) => {
                  return (
                    <AltitudeOrientation
                      key={orient._id}
                      altId={altiId}
                      orient={orient}
                      index={index}
                    />
                  );
                })}
              </SortableContext>
            </DndContext>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default AltitudeBookDetail;
