import { KmlPlacemarkModel, StyleKmlModel } from "../../../models/ggearthModel";

const convertOrdinateKmlToArrayNumber = (value: string) => {
  const arrOrdinate = value.split(" ");
  return arrOrdinate.map((arr) => {
    return arr.split(",").map((num) => {
      return Number(num);
    });
  });
};
export const PlacemarkKmlParser = (placemarkNode: ChildNode, sub: string[]) => {
  let curPlacemark: KmlPlacemarkModel = {
    id: "",
    name: "",
    description: "",
    sub: [...sub],
    ordinate: [],
    type: 0,
    icon: "",
    imgSrc: [],
  };
  placemarkNode.childNodes.forEach((chil) => {
    chil.childNodes.forEach((xr) => {
      if (chil.nodeName === "styleUrl") {
        curPlacemark.icon = xr.textContent ? xr.textContent : "";
      }
      if (chil.nodeName === "name") {
        curPlacemark.name = xr.textContent ? xr.textContent : "";
      }
      if (chil.nodeName === "description") {
        curPlacemark.description = xr.textContent ? xr.textContent : "";
      }
      if (chil.nodeName === "Point" && xr.nodeName === "coordinates") {
        curPlacemark.ordinate = xr.textContent
          ? convertOrdinateKmlToArrayNumber(xr.textContent)
          : [];
      }
      if (chil.nodeName === "LineString" && xr.nodeName === "coordinates") {
        curPlacemark.ordinate = xr.textContent
          ? convertOrdinateKmlToArrayNumber(xr.textContent)
          : [];
      }
    });
  });
  return curPlacemark;
};
export const StyleKmlParser = (styleNode: HTMLCollectionOf<Element>) => {
  let lstStyle: StyleKmlModel[] = [];
  for (let i = 0; i < styleNode.length; i++) {
    let newStyle: StyleKmlModel = {
      id: "",
      name: styleNode[i].id,
      colorLabel: "",
      scaleIcon: 1,
      colorIcon: "",
      scaleLabel: 1,
      colorLine: "",
      scaleLine: 1,
      colorPoly: "",
      outlinePoly: 1,
      fillPoly: 1,
      description: "",
      icon: "",
    };

    styleNode[i].childNodes.forEach((chil) => {
      if (chil.nodeName === "IconStyle") {
        newStyle.icon = chil.textContent ? chil.textContent.trim() : "";
      }
      if (chil.nodeName === "LineStyle") {
        chil.childNodes.forEach((st) => {
          if (st.nodeName === "color") {
            newStyle.colorLine = chil.textContent
              ? chil.textContent.trim()
              : "";
          }
          if (st.nodeName === "width") {
            newStyle.scaleLine = chil.textContent
              ? Number(chil.textContent.trim())
              : 1;
          }
        });
      }
      if (chil.nodeName === "PolyStyle") {
        chil.childNodes.forEach((st) => {
          if (st.nodeName === "color") {
            newStyle.colorLine = chil.textContent
              ? chil.textContent.trim()
              : "";
          }
          if (st.nodeName === "outline") {
            newStyle.outlinePoly = chil.textContent
              ? Number(chil.textContent.trim())
              : 1;
          }
          if (st.nodeName === "fill") {
            newStyle.fillPoly = chil.textContent
              ? Number(chil.textContent.trim())
              : 1;
          }
        });
      }
    });
    lstStyle.push(newStyle);
  }
  return lstStyle;
};
export const FolderKmlParse = (
  folderNode: ChildNode,
  placemarkLst: KmlPlacemarkModel[],
  sub: string[]
) => {
  folderNode.childNodes.forEach((folderChild) => {
    if (folderChild.nodeName === "name" && folderChild.textContent) {
      sub.push(folderChild.textContent);
    }
    if (folderChild.nodeName === "Placemark") {
      let newPlacemark: KmlPlacemarkModel = PlacemarkKmlParser(
        folderChild,
        sub
      );
      placemarkLst.push(newPlacemark);
    }
    if (folderChild.nodeName === "Folder") {
      FolderKmlParse(folderChild, placemarkLst, sub);
    }
  });
};
