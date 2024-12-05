import React from "react";
import {
  UploadOutlined,
  PushpinOutlined,
  LineOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Button, Radio, Slider, SliderSingleProps, Space, Upload } from "antd";
import {
  KmlPlacemarkModel,
  StyleKmlModel,
  StyleMapKmlModel,
} from "../../models/ggearthModel";
import { DocumentKmlParse } from "../../untils/operate/kml/kmlParser";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/configStore";
import {
  setCurKmlObject,
  setKmlObject,
  setMapOtion,
  setMapPosition,
} from "../../redux/mapmanager.slice";
type Props = {};
const formatter: NonNullable<SliderSingleProps["tooltip"]>["formatter"] = (
  value
) => `${value}%`;
const MapControl = (props: Props) => {
  const { mapOption, kmlObject, curKmlObject } = useSelector(
    (state: RootState) => state.mapmanagerSlice
  );
  const dispatch = useDispatch();
  let pathStr: string = "";
  const setPathStr = (value: string) => {
    pathStr = value;
    return "";
  };
  const onChangeShowKmlItem = (ind: number) => {
    let newKml = [...kmlObject];
    newKml[ind].isShow = !newKml[ind].isShow;
    dispatch(setKmlObject(newKml));
  };
  const onChangeShowKmlFolder = (folderName: string) => {
    let newKml = [...kmlObject];
    newKml.forEach((it) => {
      if (it.sub.join("\\") === folderName) {
        it.isShow = !it.isShow;
      }
    });
    dispatch(setKmlObject(newKml));
  };
  return (
    <div
      className="absolute left-2 top-2  bg-slate-50 overflow-y-auto p-2 "
      style={{
        zIndex: 500,
        maxHeight: window.innerHeight - 16,
        width: "90%",
        maxWidth: 500,
      }}
    >
      <Space>
        <Button size="large">
          <SettingOutlined />
        </Button>
        <Radio.Group
          size="large"
          optionType="button"
          buttonStyle="solid"
          options={[
            { value: 1, label: "Satellite" },
            { value: 0, label: "Street" },
          ]}
          value={mapOption.mapType}
          onChange={(e) => {
            dispatch(setMapOtion({ ...mapOption, mapType: e.target.value }));
          }}
        />
        <Upload
          className=""
          accept=".kml"
          showUploadList={false}
          beforeUpload={async (file) => {
            let lstPlacemark: KmlPlacemarkModel[] = [];
            let lstStyle: StyleKmlModel[] = [];
            let lstStyleMap: StyleMapKmlModel[] = [];
            const reader = new FileReader();
            reader.onload = (e) => {
              let lineArr: string =
                typeof e?.target?.result === "string" ? e?.target?.result : "";
              const parser = new DOMParser();
              const xmlDoc = parser.parseFromString(lineArr, "text/xml");
              const docElementLst = xmlDoc.getElementsByTagName("Document");
              if (docElementLst.length > 0) {
                let subName: string[] = [];
                DocumentKmlParse(
                  docElementLst[0],
                  lstPlacemark,
                  lstStyle,
                  lstStyleMap,
                  subName
                );
              } else {
                console.log("fail");
              }
              dispatch(setKmlObject(lstPlacemark));
            };
            reader.readAsText(file);
            return false;
          }}
        >
          <Button size="large" type="default" className=" bg-slate-100">
            <UploadOutlined />
          </Button>
        </Upload>
        <Slider
          style={{ minWidth: 100 }}
          tooltip={{ formatter }}
          value={mapOption.mapOpacity * 100}
          onChange={(value) => {
            dispatch(setMapOtion({ ...mapOption, mapOpacity: value / 100 }));
          }}
        />
      </Space>
      {kmlObject.map((kmlItem, index) => {
        return (
          <div className="text-left pl-2 ">
            {kmlItem.sub.join("\\") !== pathStr ? (
              <div className="flex justify-start pl-1 hover:bg-blue-200">
                <input
                  type="checkbox"
                  checked={kmlItem.isShow}
                  onChange={() => {
                    onChangeShowKmlFolder(kmlItem.sub.join("\\"));
                  }}
                />
                <p className="font-semibold">{kmlItem.sub.join("\\")}</p>
                {setPathStr(kmlItem.sub.join("\\"))}
              </div>
            ) : (
              ""
            )}
            {kmlItem.ordinate.length > 1 ? (
              <div
                className={`pl-4 hover:bg-blue-200 ${
                  kmlItem.id === curKmlObject?.id ? "bg-blue-300" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={kmlItem.isShow}
                  onChange={() => {
                    onChangeShowKmlItem(index);
                  }}
                />
                <LineOutlined />
                <span
                  className="text-left pl-2 cursor-pointer"
                  onClick={() => {
                    dispatch(
                      setMapPosition([
                        kmlItem.ordinate[0][1],
                        kmlItem.ordinate[0][0],
                      ])
                    );

                    dispatch(setCurKmlObject(kmlItem));
                  }}
                >
                  {kmlItem.name}
                </span>
              </div>
            ) : (
              <div
                className={`pl-4 hover:bg-blue-200 ${
                  kmlItem.id === curKmlObject?.id ? "bg-blue-300" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={kmlItem.isShow}
                  onChange={() => {
                    onChangeShowKmlItem(index);
                  }}
                />
                <PushpinOutlined />
                <span
                  className="text-left pl-2 cursor-pointer"
                  onClick={() => {
                    dispatch(
                      setMapPosition([
                        kmlItem.ordinate[0][1],
                        kmlItem.ordinate[0][0],
                      ])
                    );

                    dispatch(setCurKmlObject(kmlItem));
                  }}
                >
                  {kmlItem.name}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MapControl;
