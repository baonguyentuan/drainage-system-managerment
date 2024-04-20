import { convertColorRgb2HexKml } from "../color";
import {
  configFont,
  convertFont,
  tcvn3TextArr,
  vietTextArr,
  vniTextArr,
} from "../font";
import {
  convertDegToRad,
  convertVn2000ToWgs84,
  cos,
  sin,
} from "../vn2000andWgs84/vn2000ToWgs84";
import { LayerCad, TextStyleCad } from "../sections/tablesSection";
import {
  DxfObjectModel,
  InsertBlockObjectModel,
  PointModel,
  ScaleFactorModel,
  StyleObjectModel,
} from "../../../models/cadModel";
import {
  ArcCad,
  CircleCad,
  HatchCad,
  InsertBlockCad,
  PathCad,
  TextCad,
} from "../sections/entitiesSection";
import { BlockCad } from "../sections/blocksSection";
import {
  BlockKmlModel,
  PathKmlModel,
  PlacemarkKmlModel,
  PolygonKmlModel,
} from "../../../models/ggearthModel";
import {
  lstArc,
  lstBlock,
  lstCircle,
  lstInsert,
  lstLayer,
  lstPath,
  lstPolygon,
  lstText,
  lstTextStyle,
} from "../readFile/readDxf";
export let lstStyle: StyleObjectModel = {
  lstPathStyle: [],
  lstPolygonStyle: [],
  lstPlacemarkStyle: [],
};
const configStyleFromDxf = (
  type: string,
  currentStyle: any,
  lstLayer: LayerCad[]
) => {
  let pathStyle: string = "";
  let currentLayer = lstLayer.findIndex(
    (lay) => lay.layerName === currentStyle.layerName
  );
  if (currentStyle.color === 0) {
    currentStyle.color = Math.abs(lstLayer[currentLayer].color);
  }
  if (type === "path") {
    if (currentStyle.lineweight === 0) {
      currentStyle.lineweight = lstLayer[currentLayer].lineweight / 10;
    }
    let indexStyle = lstStyle.lstPathStyle.findIndex(
      (st) =>
        st.color === currentStyle.color &&
        st.lineweight === currentStyle.lineweight
    );
    if (indexStyle !== -1) {
      pathStyle = lstStyle.lstPathStyle[indexStyle].namePathStyle;
    } else {
      lstStyle.lstPathStyle.push({
        namePathStyle: `path-${lstStyle.lstPathStyle.length + 1}`,
        color: currentStyle.color,
        lineweight: currentStyle.lineweight,
        layerName: lstLayer[currentLayer].layerName,
      });
      pathStyle = `path-${lstStyle.lstPathStyle.length + 1}`;
    }
  } else if (type === "polygon") {
    let indexStyle = lstStyle.lstPolygonStyle.findIndex(
      (st) =>
        st.color === currentStyle.color &&
        st.patternScale === currentStyle.patternScale
    );
    if (indexStyle !== -1) {
      pathStyle = lstStyle.lstPolygonStyle[indexStyle].namePolygonStyle;
    } else {
      lstStyle.lstPolygonStyle.push({
        namePolygonStyle: `polygon-${lstStyle.lstPolygonStyle.length + 1}`,
        color: currentStyle.color,
        patternScale: currentStyle.patternScale,
        layerName: lstLayer[currentLayer].layerName,
      });
      pathStyle = `polygon-${lstStyle.lstPolygonStyle.length + 1}`;
    }
  }
  return pathStyle;
};
const movePointArcordingToBlockProperties = (
  insertPoint: PointModel,
  basePoint: PointModel,
  currentPoint: PointModel,
  scaleFactor: ScaleFactorModel,
  rotationAngle: number
) => {
  let newpX: number = -insertPoint.pX;
  if (currentPoint.pX < 1000) {
    newpX =
      basePoint.pX +
      scaleFactor.sfX *
        (currentPoint.pX - basePoint.pX) *
        cos(convertDegToRad(rotationAngle)) -
      scaleFactor.sfY *
        (currentPoint.pY - basePoint.pY) *
        sin(convertDegToRad(rotationAngle));
  }
  let newpY: number = -insertPoint.pY;
  if (currentPoint.pY < 1000) {
    newpY =
      basePoint.pY +
      scaleFactor.sfX *
        (currentPoint.pX - basePoint.pX) *
        sin(convertDegToRad(rotationAngle)) +
      scaleFactor.sfY *
        (currentPoint.pY - basePoint.pY) *
        cos(convertDegToRad(rotationAngle));
  }
  return [insertPoint.pX + newpX, insertPoint.pY + newpY, insertPoint.pZ];
};
// read text form dxf to kml
export const convertTextFromDxf = (
  dxfObjectText: TextCad[],
  lstTextStyle: TextStyleCad[],
  lstLayer: LayerCad[],
  block: null | InsertBlockObjectModel
) => {
  let renderText: PlacemarkKmlModel[] = dxfObjectText.map(
    (currentText, index) => {
      let refactorText: string = currentText.textValue;
      let findText1 = refactorText.lastIndexOf(";");
      if (findText1 !== -1) {
        refactorText = refactorText.slice(findText1 + 1);
        let findText2 = refactorText.lastIndexOf("}");
        if (findText2 === refactorText.length - 1) {
          refactorText = refactorText.slice(0, findText2 - 1);
        }
      }
      let fontIndex = lstTextStyle.findIndex(
        (style) => style.styleName === currentText.textStyle
      );
      let primaryFont;
      if (fontIndex !== -1) {
        primaryFont = lstTextStyle[fontIndex].primaryFontName;
      } else {
        primaryFont = currentText.textStyle;
      }
      if (block !== null) {
        let { insertPoint, basePoint, scaleFactor, rotationAngle } = block;
        let currentPoint = {
          pX: currentText.firstAlignmentPoint.pX,
          pY: currentText.firstAlignmentPoint.pY,
          pZ: currentText.firstAlignmentPoint.pZ,
        };
        let [pX, pY, pZ] = movePointArcordingToBlockProperties(
          insertPoint,
          basePoint,
          currentPoint,
          scaleFactor,
          rotationAngle
        );
        currentText.firstAlignmentPoint.pX = pX;
        currentText.firstAlignmentPoint.pY = pY;
        currentText.firstAlignmentPoint.pZ = pZ;
      }
      let ordinateFirst = convertVn2000ToWgs84([
        currentText.firstAlignmentPoint.pY,
        currentText.firstAlignmentPoint.pX,
        currentText.firstAlignmentPoint.pZ,
      ]);
      let fontGroup = configFont(primaryFont);
      let currentValue;
      if (fontGroup === "vni") {
        currentValue = convertFont(
          vniTextArr,
          vietTextArr,
          currentText.textValue
        );
      } else if (fontGroup === "tcvn3") {
        currentValue = convertFont(tcvn3TextArr, vietTextArr, refactorText);
      } else {
        currentValue = refactorText;
      }
      let colorValue;
      if (currentText.textColor !== -1) {
        colorValue = convertColorRgb2HexKml(currentText.textColor);
      } else {
        let currentLayer = lstLayer.find(
          (layer) => layer.layerName === currentText.layerName
        );
        if (currentLayer !== undefined) {
          colorValue = convertColorRgb2HexKml(currentLayer.color);
        }
      }
      return {
        id: "string",
        nameStyle: "string",
        point: {
          pX: ordinateFirst[1],
          pY: ordinateFirst[0],
          pZ: ordinateFirst[2],
        },
        textValue: currentValue,
        layerName: currentText.layerName,
        textRotation: currentText.textRotation,
      };
    }
  );
  return renderText;
};
//read path form dxf
export const convertPathFromDxf = (
  dxfObjectPath: PathCad[],
  lstLayer: LayerCad[],
  block: null | InsertBlockObjectModel
) => {
  let renderPath: PathKmlModel[] = dxfObjectPath.map((currentPath, index) => {
    let { layerName, vertex, color, lineweight, id, polylineFlag } =
      currentPath;
    let pathStyle = configStyleFromDxf(
      "path",
      { layerName, color, lineweight },
      lstLayer
    );
    let vertexClose: PointModel = {
      pX: 0,
      pY: 0,
      pZ: 0,
    };
    let renderVertex: PointModel[] = vertex.map((currentVertex, index) => {
      let point;
      if (block !== null) {
        let { insertPoint, basePoint, scaleFactor, rotationAngle } = block;
        let currentPoint = {
          pX: currentVertex.pX,
          pY: currentVertex.pY,
          pZ: currentVertex.pZ,
        };
        let [x, y, z] = movePointArcordingToBlockProperties(
          insertPoint,
          basePoint,
          currentPoint,
          scaleFactor,
          rotationAngle
        );
        point = convertVn2000ToWgs84([y, x, z]);
      } else {
        point = convertVn2000ToWgs84([
          currentVertex.pY,
          currentVertex.pX,
          currentVertex.pZ,
        ]);
      }
      if (index === 0) {
        vertexClose = {
          pX: point[1],
          pY: point[0],
          pZ: point[2],
        };
      }
      if (polylineFlag === 1) {
        return vertexClose;
      }
      return {
        pX: point[1],
        pY: point[0],
        pZ: point[2],
      };
    });
    return {
      id,
      pathName: id,
      nameStyle: pathStyle,
      layerName: layerName,
      vertex: renderVertex,
    };
  });
  return renderPath;
};
export const convertCircleFromDxf = (
  dxfObjectCircle: CircleCad[],
  lstLayer: LayerCad[],
  block: null | InsertBlockObjectModel
) => {
  let renderCircle: PathKmlModel[] = dxfObjectCircle.map(
    (currentCircle, index) => {
      let { id, layerName, centerPoint, color, lineweight, radius } =
        currentCircle;
      let renderPoint: PointModel[] = [];
      let pathStyle = configStyleFromDxf(
        "path",
        { layerName, color, lineweight },
        lstLayer
      );
      if (block !== null) {
        let { insertPoint, basePoint, scaleFactor, rotationAngle } = block;
        let currentPoint = {
          pX: centerPoint.pX,
          pY: centerPoint.pY,
          pZ: centerPoint.pZ,
        };
        let [x, y, z] = movePointArcordingToBlockProperties(
          insertPoint,
          basePoint,
          currentPoint,
          scaleFactor,
          rotationAngle
        );
        centerPoint.pX = x;
        centerPoint.pY = y;
        centerPoint.pZ = z;
        radius = radius * scaleFactor.sfX;
      }
      for (let i = 0; i <= 360; i += 5) {
        let xc, yc;
        xc = centerPoint.pX + radius * cos(convertDegToRad(i));
        yc = centerPoint.pY + radius * sin(convertDegToRad(i));
        let point = convertVn2000ToWgs84([yc, xc, centerPoint.pZ]);
        renderPoint.concat({
          pX: point[1],
          pY: point[0],
          pZ: point[2],
        });
      }
      return {
        id,
        pathName: id,
        nameStyle: pathStyle,
        layerName: layerName,
        vertex: renderPoint,
      };
    }
  );
  return renderCircle;
};
export const convertArcFromDxf = (
  dxfObjectArc: ArcCad[],
  lstLayer: LayerCad[],
  block: null | InsertBlockObjectModel
) => {
  let renderArc: PathKmlModel[] = dxfObjectArc.map((currentArc, index) => {
    let {
      id,
      layerName,
      centerPoint,
      color,
      lineweight,
      radius,
      startAngle,
      endAngle,
    } = currentArc;
    let renderPoint: PointModel[] = [];
    let pathStyle = configStyleFromDxf(
      "path",
      { layerName, color, lineweight },
      lstLayer
    );
    if (block !== null) {
      let { insertPoint, basePoint, scaleFactor, rotationAngle } = block;
      let currentPoint = {
        pX: centerPoint.pX,
        pY: centerPoint.pY,
        pZ: centerPoint.pZ,
      };
      let [x, y, z] = movePointArcordingToBlockProperties(
        insertPoint,
        basePoint,
        currentPoint,
        scaleFactor,
        rotationAngle
      );
      centerPoint.pX = x;
      centerPoint.pY = y;
      centerPoint.pZ = z;
      radius = radius * scaleFactor.sfX;
    }
    let pointStart = convertVn2000ToWgs84([
      centerPoint.pY + radius * sin(convertDegToRad(startAngle)),
      centerPoint.pX + radius * cos(convertDegToRad(startAngle)),
      centerPoint.pZ,
    ]);
    let pointEnd = convertVn2000ToWgs84([
      centerPoint.pY + radius * sin(convertDegToRad(endAngle)),
      centerPoint.pX + radius * cos(convertDegToRad(endAngle)),
      centerPoint.pZ,
    ]);
    renderPoint.concat({
      pX: pointStart[1],
      pY: pointStart[0],
      pZ: pointStart[2],
    });
    for (let i = Math.floor(startAngle) + 1; i <= Math.floor(endAngle); i++) {
      if (i % 5 === 0) {
        let x, y;
        x = centerPoint.pX + radius * cos(convertDegToRad(i));
        y = centerPoint.pY + radius * sin(convertDegToRad(i));
        let point = convertVn2000ToWgs84([y, x, centerPoint.pZ]);
        renderPoint.concat({
          pX: point[1],
          pY: point[0],
          pZ: point[2],
        });
      }
    }
    renderPoint.concat({
      pX: pointEnd[1],
      pY: pointEnd[0],
      pZ: pointEnd[2],
    });
    return {
      id,
      pathName: id,
      nameStyle: pathStyle,
      layerName: layerName,
      vertex: renderPoint,
    };
  });
  return renderArc;
};
export const convertPolygonFromDxf = (
  dxfObjectPolygon: HatchCad[],
  lstLayer: LayerCad[],
  block: null | InsertBlockObjectModel
) => {
  let renderHatch: PolygonKmlModel[] = dxfObjectPolygon.map(
    (currentHatch, index) => {
      let { id, layerName, elevationPoint, color, patternScale } = currentHatch;
      let pathStyle = configStyleFromDxf(
        "polygon",
        { layerName, color, patternScale },
        lstLayer
      );
      let pointClose: PointModel = { pX: 0, pY: 0, pZ: 0 };
      let renderVertex: PointModel[] = elevationPoint.map(
        (currentVertex, index) => {
          if (block !== null) {
            let { insertPoint, basePoint, scaleFactor, rotationAngle } = block;
            let currentPoint = {
              pX: currentVertex.epX,
              pY: currentVertex.epY,
              pZ: currentVertex.epZ,
            };
            let [x, y, z] = movePointArcordingToBlockProperties(
              insertPoint,
              basePoint,
              currentPoint,
              scaleFactor,
              rotationAngle
            );
            currentVertex.epX = x;
            currentVertex.epY = y;
            currentVertex.epZ = z;
          }
          let [pX, pY, pZ] = convertVn2000ToWgs84([
            currentVertex.epY,
            currentVertex.epX,
            currentVertex.epZ,
          ]);
          if (index === 0) {
            pointClose = { pY, pX, pZ };
          }
          return { pY, pX, pZ };
        }
      );
      renderVertex.concat(pointClose);
      return {
        id,
        polygonName: id,
        nameStyle: pathStyle,
        layerName: layerName,
        vertex: renderVertex,
      };
    }
  );
  return renderHatch;
};
export const convertBlockFromDxf = (
  insertBlock: InsertBlockCad[],
  lstBlock: BlockCad[],
  lstTextStyle: TextStyleCad[],
  lstLayer: LayerCad[]
) => {
  let renderBlock: BlockKmlModel = {
    id: "",
    path: [],
    polygon: [],
    placemark: [],
  };
  return insertBlock.map((insert, index) => {
    let { blockName, layerName, insertPoint, scaleFactor, rotationAngle } =
      insert;
    let renderPath: PathKmlModel[] = [];
    let renderPolygon: PolygonKmlModel[] = [];
    let renderText:PlacemarkKmlModel[] = [];
    let renderArc: PathKmlModel[] = [];
    let renderCircle: PathKmlModel[] = [];
    // let renderAttdef;
    // let renderInsert;
    // let renderAttrib;
    let indexBlock = lstBlock.findIndex(
      (block) => block.properties.blockName === blockName
    );
    if (indexBlock !== -1) {
      let { lstPath, lstPolygon, lstArc, lstCircle, lstText } =
        lstBlock[indexBlock];
      let blockInfo = {
        blockName,
        insertPoint,
        scaleFactor,
        rotationAngle,
        basePoint: lstBlock[indexBlock].properties.basePoint,
      };
      for (let obj in lstBlock[indexBlock]) {
        if (obj === "lstPath") {
          renderPath = convertPathFromDxf(lstPath, lstLayer, blockInfo);
        } else if (obj === "lstPolygon") {
          renderPolygon = convertPolygonFromDxf(
            lstPolygon,
            lstLayer,
            blockInfo
          );
        } else if (obj === "lstText") {
          renderText = convertTextFromDxf(
            lstText,
            lstTextStyle,
            lstLayer,
            blockInfo
          );
        } else if (obj === "lstArc") {
          renderArc = convertArcFromDxf(lstArc, lstLayer, blockInfo);
        } else if (obj === "lstCircle") {
          renderCircle = convertCircleFromDxf(lstCircle, lstLayer, blockInfo);
        }
        // else if (obj === 'lstAttdef') {

        // }else if (obj === 'lstAttrib') {

        // }
        renderBlock.path = renderPath.concat(renderArc, renderCircle);
        renderBlock.polygon = renderPolygon;
        // renderBlock.placemark=renderPolygon
      }
    }
    return renderBlock;
  });
};
export const convertObjDxf2Kml = async (dxfObject: DxfObjectModel) => {
  let kmlText = convertTextFromDxf(dxfObject.lstText, dxfObject.lstTextStyle, dxfObject.lstLayer, null);
  let kmlPath = convertPathFromDxf(dxfObject.lstPath, dxfObject.lstLayer, null);
  let kmlArc = convertArcFromDxf(dxfObject.lstArc, dxfObject.lstLayer, null);
  let kmlCircle = convertCircleFromDxf(dxfObject.lstCircle, dxfObject.lstLayer, null);
  let kmlPolygon = convertPolygonFromDxf(dxfObject.lstPolygon, dxfObject.lstLayer, null);
  let kmlBlock = convertBlockFromDxf(
    lstInsert,
    lstBlock,
    lstTextStyle,
    lstLayer
  );
  return {
    layer: lstLayer,
    style: lstStyle,
    textStyle: lstTextStyle,
    block: kmlBlock,
    placemark: kmlText,
    path: kmlPath.concat(kmlArc, kmlCircle),
    polygon: kmlPolygon,
  };
};
