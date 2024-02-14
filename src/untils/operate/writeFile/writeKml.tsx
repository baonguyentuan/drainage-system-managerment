import { DxfObjectModel, StyleObjectModel } from "../../../models/cadModel";
import {
  renderPathFromDxf,
  renderTextFromDxf,
  renderStyleFromDxf,
  renderPolygonFromDxf,
  renderArcFromDxf,
  renderBlockFromDxf,
  renderCircleFromDxf,
  lstStyle,
} from "../writeFile/dxfToKml";
let arrObject = {
  textObject: ``,
  pathObject: ``,
  areaObject: ``,
  blockObject: ``,
};

export const writeKmlFile = (
  fileName: string,
  dxfObject: DxfObjectModel,
  weightObj: number
) => {
  let titleFile = fileName.split(".");
  let renderKmlContent = `<?xml version="1.0" encoding="UTF-8"?>
    <kml xmlns="http://www.opengis.net/kml/2.2"
    xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:kml="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom">
    <Document>
      <name>${titleFile[0]}</name>
      <Style id="linestyle0">
      <LineStyle>
        <width>0</width>
        <gx:labelVisibility>1</gx:labelVisibility>
      </LineStyle>
    </Style>

      `;
  let {
    lstText,
    lstTextStyle,
    lstLayer,
    lstPath,
    lstPolygon,
    lstArc,
    lstCircle,
    lstInsert,
    lstBlock,
  } = dxfObject;
  // let lstStyle: StyleObjectModel = {
  //   lstPathStyle: [],
  //   lstPolygonStyle: [],
  //   lstPlacemarkStyle: [],
  // };
  let renderText;
  let renderPath;
  let renderPolygon;
  let renderArc;
  let renderCircle;
  let renderBlock;
  let renderStyle;
  for (const obj in arrObject) {
    if (obj === "textObject") {
      renderText = renderTextFromDxf(lstText, lstTextStyle, lstLayer, null);
    } else if (obj === "pathObject") {
      renderPath = renderPathFromDxf(lstPath, lstLayer, null);
      renderArc = renderArcFromDxf(lstArc, lstLayer, null);
      renderCircle = renderCircleFromDxf(lstCircle, lstLayer, null);
    } else if (obj === "areaObject") {
      renderPolygon = renderPolygonFromDxf(lstPolygon, lstLayer, null);
    } else if (obj === "blockObject") {
      renderBlock = renderBlockFromDxf(
        lstInsert,
        lstBlock,
        lstTextStyle,
        lstLayer
      );
    }
  }
  renderStyle = renderStyleFromDxf(lstStyle, weightObj);
  renderKmlContent += renderStyle;
  for (const obj in arrObject) {
    if (obj === "textObject") {
      if (lstText.length !== 0) {
        renderKmlContent += `	<Folder>
        <name>Point Features</name>
        ${renderText}
        </Folder>
        `;
      }
    } else if (obj === "pathObject") {
      if (
        lstArc.length !== 0 ||
        lstCircle.length !== 0 ||
        lstPath.length !== 0
      ) {
        renderKmlContent += `	<Folder>
        <name>Path Features</name>
        ${lstPath.length !== 0 ? renderPath : ``}
        ${lstArc.length !== 0 ? renderArc : ``}
        ${lstCircle.length !== 0 ? renderCircle : ``}
        </Folder>
        `;
      }
    } else if (obj === "areaObject") {
      if (lstPolygon.length !== 0) {
        renderKmlContent += `	<Folder>
        <name>Area Features</name>
        ${renderPolygon}
        </Folder>
        `;
      }
    } else if (obj === "blockObject") {
      if (lstInsert.length !== 0) {
        renderKmlContent += `	<Folder>
        <name>Block Features</name>
        ${renderBlock}
        </Folder>
        `;
      }
    }
  }
  renderKmlContent += `</Document>
      </kml>`;
  const link = document.createElement("a");
  const file = new Blob([renderKmlContent], { type: "text/plain" });
  link.href = URL.createObjectURL(file);
  link.download = `${titleFile[0]}.kml`;
  link.click();
  URL.revokeObjectURL(link.href);
};
