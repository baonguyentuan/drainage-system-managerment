import { convertColorRgb2HexKml } from "../color";
import {
  configFont,
  convertFont,
  tcvn3TextArr,
  vietTextArr,
  vniTextArr,
} from "../font";
import { TEXT_SIZE_HEIGHT, TEXT_SIZE_WIDTH } from "../../config/configCad";
import {
  convertDegToRad,
  convertVn2000ToWgs84,
  cos,
  sin,
} from "../vn2000andWgs84/vn2000ToWgs84";
import { LayerCad, TextStyleCad } from "../sections/tablesSection";
import {
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
    let newpX =
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
    let newpY =
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
export const renderStyleFromDxf = (
  style: StyleObjectModel,
  weightObj: number
) => {
  let pathStyleRender: string = "";
  let polygonStyleRender: string = "";
  for (let st in style) {
    if (st === "lstPolygonStyle") {
      polygonStyleRender = style[st].reduce((acc, currentStyle) => {
        return (
          acc +
          `	<Style id="${currentStyle.namePolygonStyle}">
        <PolyStyle>
          <fill>0</fill>
          <color>${convertColorRgb2HexKml(currentStyle.color)}</color>
        </PolyStyle>
      </Style>
      `
        );
      }, ``);
    } else if (st === "lstPathStyle") {
      pathStyleRender = style[st].reduce((acc, currentStyle) => {
        return (
          acc +
          `	<Style id="${currentStyle.namePathStyle}">
        <LineStyle>
          <color>${convertColorRgb2HexKml(currentStyle.color)}</color>
          <width>${
            weightObj === 0 ? currentStyle.lineweight : weightObj
          }</width>
        </LineStyle>
      </Style>
      `
        );
      }, ``);
    }
  }
  return pathStyleRender + polygonStyleRender;
};
//read text form dxf to kml
export const renderTextFromDxf = (
  dxfObjectText: TextCad[],
  lstTextStyle: TextStyleCad[],
  lstLayer: LayerCad[],
  block: null | InsertBlockObjectModel
) => {
  let renderText = dxfObjectText.reduce((accumulator, currentText) => {
    let refactorText: string = currentText.textValue;
    let findText1 = refactorText.lastIndexOf(";");
    if (findText1 !== -1) {
      refactorText = refactorText.slice(findText1 + 1);
      let findText2 = refactorText.lastIndexOf("}");
      if (findText2 === refactorText.length - 1) {
        refactorText = refactorText.slice(0, findText2 - 1);
      }
    }
    let lengthText = currentText.textValue.split("").length;
    let fontIndex = lstTextStyle.findIndex(
      (style) => style.styleName === currentText.textStyle
    );
    let primaryFont;
    if (fontIndex !== -1) {
      primaryFont = lstTextStyle[fontIndex].primaryFontName;
    } else {
      primaryFont = currentText.textStyle;
    }
    let textHeight;
    if (currentText.textHeight !== -1) {
      textHeight = currentText.textHeight;
    } else {
      textHeight = lstTextStyle[fontIndex].textHeight;
    }
    let widthFactor;
    if (currentText.widthFactor !== -1) {
      widthFactor = currentText.widthFactor;
    } else {
      widthFactor = lstTextStyle[fontIndex].widthFactor;
    }
    let radRotation = convertDegToRad(currentText.textRotation);
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
    let scaleWidth = TEXT_SIZE_WIDTH * textHeight * widthFactor * lengthText;
    let scaleHeight = TEXT_SIZE_HEIGHT * textHeight * widthFactor;
    let pX0 =
      currentText.firstAlignmentPoint.pX +
      (scaleWidth / 2) * cos(radRotation) -
      scaleHeight * sin(radRotation);
    let pY0 =
      currentText.firstAlignmentPoint.pY +
      (scaleWidth / 2) * sin(radRotation) -
      scaleHeight * cos(radRotation);
    let pX1 = pX0 - scaleWidth * 7 * cos(radRotation);
    let pY1 = pY0 - scaleWidth * 7 * sin(radRotation);
    let pX2 = pX0 + scaleWidth * 7 * cos(radRotation);
    let pY2 = pY0 + scaleWidth * 7 * sin(radRotation);
    let ordinateFirst = convertVn2000ToWgs84([
      pY1,
      pX1,
      currentText.firstAlignmentPoint.pZ,
    ]);
    let ordinateSecond = convertVn2000ToWgs84([
      pY2,
      pX2,
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
    return (
      accumulator +
      `<Placemark>
            <name>${currentValue}</name>
            <styleUrl>#linestyle0</styleUrl>
            <description>${currentText.layerName}</description>
            <LineString>
              <coordinates>
                ${ordinateFirst[1]},${ordinateFirst[0]},${ordinateFirst[2]}
                ${ordinateSecond[1]},${ordinateSecond[0]},${ordinateSecond[2]} 
              </coordinates>
            </LineString>
          </Placemark>
          `
    );
  }, ``);
  return renderText;
};
//read path form dxf
export const renderPathFromDxf = (
  dxfObjectPath: PathCad[],
  lstLayer: LayerCad[],
  block: null | InsertBlockObjectModel
) => {
  let renderPath = dxfObjectPath.reduce((accumulator, currentPath) => {
    let { layerName, vertex, color, lineweight, id, polylineFlag } =
      currentPath;
    let pathStyle = configStyleFromDxf(
      "path",
      { layerName, color, lineweight },
      lstLayer
    );
    let renderVertex = ``;
    let vertexClose;
    vertex.map((currentVertex, index) => {
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
        vertexClose = ` ${point[1]},${point[0]},${point[2]}
        `;
      }
      renderVertex += ` ${point[1]},${point[0]},${point[2]}
            `;
    });
    if (polylineFlag === 1) {
      renderVertex += vertexClose;
    }
    return (
      accumulator +
      `
    <Placemark>
        <name>${id}</name>
        <description>${layerName}</description>
        <styleUrl>#${pathStyle}</styleUrl>
        <LineString>
          <coordinates>
            ${renderVertex}
          </coordinates>
        </LineString>
      </Placemark>
      `
    );
  }, ``);
  return renderPath;
};
//read circle from dxf
export const renderCircleFromDxf = (
  dxfObjectCircle: CircleCad[],
  lstLayer: LayerCad[],
  block: null | InsertBlockObjectModel
) => {
  let renderItemCircle = ``;
  let renderCircle = dxfObjectCircle.reduce((acc, currentCircle) => {
    let { id, layerName, centerPoint, color, lineweight, radius } =
      currentCircle;
    // let { cPX, cPY, cPZ } = centerPoint;
    let renderPoint = ``;
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
      renderPoint += `${point[1]},${point[0]},${point[2]}
      `;
    }
    renderItemCircle += `<Placemark>
        <name>${id}</name>
        <description>${layerName}</description>
        <styleUrl>#${pathStyle}</styleUrl>
        <LineString>
          <coordinates>
            ${renderPoint}
          </coordinates>
        </LineString>
      </Placemark>
      `;
    return acc + renderItemCircle;
  }, ``);
  return renderCircle;
};
//read arc from dxf
export const renderArcFromDxf = (
  dxfObjectArc: ArcCad[],
  lstLayer: LayerCad[],
  block: null | InsertBlockObjectModel
) => {
  let renderItemArc = ``;
  let renderArc = dxfObjectArc.reduce((acc, currentArc) => {
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
    let renderPoint = ``;
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
    renderPoint += `${pointStart[1]},${pointStart[0]},${pointStart[2]}
    `;
    for (let i = Math.floor(startAngle) + 1; i <= Math.floor(endAngle); i++) {
      if (i % 5 === 0) {
        let x, y;
        x = centerPoint.pX + radius * cos(convertDegToRad(i));
        y = centerPoint.pY + radius * sin(convertDegToRad(i));
        let point = convertVn2000ToWgs84([y, x, centerPoint.pZ]);
        renderPoint += `${point[1]},${point[0]},${point[2]}
        `;
      }
    }
    renderPoint += `${pointEnd[1]},${pointEnd[0]},${pointEnd[2]}
    `;
    renderItemArc += `<Placemark>
        <name>${id}</name>
        <description>${layerName}</description>
        <styleUrl>#${pathStyle}</styleUrl>
        <LineString>
          <coordinates>
            ${renderPoint}
          </coordinates>
        </LineString>
      </Placemark>
      `;
    return acc + renderItemArc;
  }, ``);
  return renderArc;
};
//read hatch form dxf
export const renderPolygonFromDxf = (
  dxfObjectPolygon: HatchCad[],
  lstLayer: LayerCad[],
  block: null | InsertBlockObjectModel
) => {
  let renderPath = dxfObjectPolygon.reduce((accumulator, currentPath) => {
    let { id, layerName, elevationPoint, color, patternScale } = currentPath;
    let pathStyle = configStyleFromDxf(
      "polygon",
      { layerName, color, patternScale },
      lstLayer
    );
    let renderVertex = ``;
    let pointClose;
    elevationPoint.map((currentVertex, index) => {
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
        pointClose = ` ${pY},${pX},${pZ}
        `;
      }
      renderVertex += ` ${pY},${pX},${pZ}
            `;
    });
    renderVertex += pointClose;
    return (
      accumulator +
      `
    <Placemark>
        <name>${id}</name>
        <description>${layerName}</description>
        <styleUrl>#${pathStyle}</styleUrl>
        <Polygon>
				<tessellate>1</tessellate>
				<outerBoundaryIs>
					<LinearRing>
						<coordinates>
            ${renderVertex}
						</coordinates>
					</LinearRing>
				</outerBoundaryIs>
			</Polygon>
      </Placemark>
      `
    );
  }, ``);
  return renderPath;
};
//read block form dxf
export const renderBlockFromDxf = (
  insertBlock: InsertBlockCad[],
  lstBlock: BlockCad[],
  lstTextStyle: TextStyleCad[],
  lstLayer: LayerCad[]
) => {
  let renderBlock = ``;
  insertBlock.map((insert, index) => {
    let { blockName, layerName, insertPoint, scaleFactor, rotationAngle } =
      insert;
    let renderPath;
    let renderPolygon;
    let renderText;
    let renderArc;
    let renderCircle;
    let renderAttdef;
    let renderInsert;
    let renderAttrib;
    let indexBlock = lstBlock.findIndex(
      (block) => block.properties.blockName === blockName
    );
    // insertPoint, basePoint, currentPoint, scaleFactor, rotationAngel
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
          renderPath = renderPathFromDxf(lstPath, lstLayer, blockInfo);
        } else if (obj === "lstPolygon") {
          renderPolygon = renderPolygonFromDxf(lstPolygon, lstLayer, blockInfo);
        } else if (obj === "lstText") {
          renderText = renderTextFromDxf(
            lstText,
            lstTextStyle,
            lstLayer,
            blockInfo
          );
        } else if (obj === "lstArc") {
          renderArc = renderArcFromDxf(lstArc, lstLayer, blockInfo);
        } else if (obj === "lstCircle") {
          renderCircle = renderCircleFromDxf(lstCircle, lstLayer, blockInfo);
        }
        // else if (obj === 'lstAttdef') {

        // }else if (obj === 'lstAttrib') {

        // }
        renderBlock += `${lstText.length !== 0 ? renderText : ``}    
        ${lstPath.length !== 0 ? renderPath : ``}
        ${lstArc.length !== 0 ? renderArc : ``}
        ${lstCircle.length !== 0 ? renderCircle : ``}
        ${lstPolygon.length !== 0 ? renderPolygon : ``}`;
      }
    }
  });
  return renderBlock;
};
