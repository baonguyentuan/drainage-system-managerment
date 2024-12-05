import {
  KmlPlacemarkModel,
  StyleKmlModel,
  StyleMapKmlModel,
} from "../../../models/ggearthModel";
import { configColorFromKml } from "../color";

const convertOrdinateKmlToArrayNumber = (value: string) => {
  const arrOrdinate = value.split(" ");
  return arrOrdinate.map((arr) => {
    return arr.split(",").map((num) => {
      return Number(num);
    });
  });
};
export const PlacemarkKmlParser = (
  placemarkNode: ChildNode,
  sub: string[],
  lstStyle: StyleKmlModel[],
  lstStyleMap: StyleMapKmlModel[]
) => {
  let curPlacemark: KmlPlacemarkModel = {
    id: "",
    name: "",
    description: "",
    sub: [...sub],
    ordinate: [],
    type: 0,
    icon: "",
    colorLabel: "ffffff",
    scaleIcon: 1,
    colorIcon: "ffffff",
    scaleLabel: 1,
    colorLine: "ffffff",
    scaleLine: 1,
    colorPoly: "ffffff",
    outlinePoly: 1,
    fillPoly: 1,
    imgSrc: [],
    isShow: true,
  };
  placemarkNode.childNodes.forEach((chil) => {
    chil.childNodes.forEach((xr) => {
      if (chil.nodeName === "styleUrl") {
        curPlacemark.icon = xr.textContent ? xr.textContent.trim() : "";
        let temp = xr.textContent ? xr.textContent.trim() : "";
        if (temp !== "") {
          let findIndex = xr.textContent
            ? lstStyleMap.findIndex(
                (st) => st.name === temp.slice(1, temp.length)
              )
            : -1;
          if (findIndex !== -1) {
            let findStyleIndex = lstStyle.findIndex(
              (st) =>
                st.name ===
                lstStyleMap[findIndex].normal.slice(
                  1,
                  lstStyleMap[findIndex].normal.length
                )
            );
            if (findStyleIndex !== -1) {
              curPlacemark.icon = lstStyle[findStyleIndex].icon;
              curPlacemark.colorLabel = lstStyle[findStyleIndex].colorLabel;
              curPlacemark.scaleIcon = lstStyle[findStyleIndex].scaleIcon;
              curPlacemark.colorIcon = lstStyle[findStyleIndex].colorIcon;
              curPlacemark.scaleLabel = lstStyle[findStyleIndex].scaleLabel;
              curPlacemark.colorLine = lstStyle[findStyleIndex].colorLine;
              curPlacemark.scaleLine = lstStyle[findStyleIndex].scaleLine;
              curPlacemark.colorPoly = lstStyle[findStyleIndex].colorPoly;
              curPlacemark.outlinePoly = lstStyle[findStyleIndex].outlinePoly;
              curPlacemark.fillPoly = lstStyle[findStyleIndex].fillPoly;
            }
          }
        }
      }
      if (chil.nodeName === "name") {
        curPlacemark.name = xr.textContent ? xr.textContent.trim() : "";
      }
      if (chil.nodeName === "description") {
        let temp = xr.textContent
          ? xr.textContent.trim().split('<img style="max-width:500px;" ')
          : [];
        temp.forEach((desc) => {
          if (desc.trim() !== "" && desc.trim() !== "<br/>") {
            let findEnd = desc.search("<br/>");
            if (desc.includes("src")) {
              let findStart = desc.search("google earth");
              if (findEnd === -1) {
                curPlacemark.imgSrc.push(
                  desc.slice(findStart, desc.length - 1).trim()
                );
              } else {
                curPlacemark.imgSrc.push(
                  desc.slice(findStart, findEnd - 2).trim()
                );
              }
            } else {
              if (findEnd === -1) {
                curPlacemark.description += desc;
              } else {
                curPlacemark.description += desc.slice(0, findEnd);
              }
            }
          }
        });
      }
      if (chil.nodeName === "Point" && xr.nodeName === "coordinates") {
        curPlacemark.ordinate = xr.textContent
          ? convertOrdinateKmlToArrayNumber(xr.textContent.trim())
          : [];
        curPlacemark.id = xr.textContent ? xr.textContent : "";
      }
      if (chil.nodeName === "LineString" && xr.nodeName === "coordinates") {
        curPlacemark.ordinate = xr.textContent
          ? convertOrdinateKmlToArrayNumber(xr.textContent.trim())
          : [];
        curPlacemark.id = xr.textContent ? xr.textContent : "";
      }
    });
  });
  return curPlacemark;
};
export const StyleKmlParser = (
  styleNode: ChildNode,
  lstStyle: StyleKmlModel[]
) => {
  let newStyle: StyleKmlModel = {
    id: "",
    name: "",
    colorLabel: "ffffff",
    scaleIcon: 1,
    colorIcon: "ffffff",
    scaleLabel: 1,
    colorLine: "ffffff",
    scaleLine: 1,
    colorPoly: "ffffff",
    outlinePoly: 1,
    fillPoly: 1,
    description: "",
    icon: "",
  };

  styleNode.childNodes.forEach((chil, index) => {
    if (index === 0 && chil.parentElement?.id) {
      newStyle.id = chil.parentElement.id;
      newStyle.name = chil.parentElement.id;
    }
    if (chil.nodeName === "IconStyle") {
      chil.childNodes.forEach((chilItem) => {
        if (chilItem.nodeName === "color" && chilItem.textContent) {
          newStyle.colorIcon = configColorFromKml(chilItem.textContent.trim());
        }
        if (chilItem.nodeName === "Icon" && chilItem.textContent) {
          newStyle.icon = chilItem.textContent.trim();
        }
      });
    }
    if (chil.nodeName === "LineStyle") {
      chil.childNodes.forEach((st) => {
        if (st.nodeName === "color") {
          newStyle.colorLine = st.textContent
            ? configColorFromKml(st.textContent.trim())
            : "ffffff";
        }
        if (st.nodeName === "width") {
          newStyle.scaleLine = st.textContent
            ? Number(st.textContent.trim())
            : 1;
        }
      });
    }
    if (chil.nodeName === "PolyStyle") {
      chil.childNodes.forEach((st) => {
        if (st.nodeName === "color") {
          newStyle.colorLine = st.textContent
            ? configColorFromKml(st.textContent.trim())
            : "ffffff";
        }
        if (st.nodeName === "outline") {
          newStyle.outlinePoly = st.textContent
            ? Number(st.textContent.trim())
            : 1;
        }
        if (st.nodeName === "fill") {
          newStyle.fillPoly = st.textContent
            ? Number(st.textContent.trim())
            : 1;
        }
      });
    }
  });
  lstStyle.push(newStyle);
};
export const StyleMapKmlParser = (
  styleNode: ChildNode,
  lstStyleMap: StyleMapKmlModel[]
) => {
  let newStyleMap: StyleMapKmlModel = {
    id: "",
    name: "",
    highlight: "",
    normal: "",
  };
  styleNode.childNodes.forEach((chil, index) => {
    if (index === 0 && chil.parentElement?.id) {
      newStyleMap.id = chil.parentElement.id;
      newStyleMap.name = chil.parentElement.id;
    }
    if (chil.nodeName === "Pair") {
      let temp = "";
      chil.childNodes.forEach((st) => {
        if (st.nodeName === "key") {
          temp = st.textContent ? st.textContent.trim() : "";
        }
        if (
          st.nodeName === "styleUrl" &&
          (temp === "normal" || temp === "highlight")
        ) {
          newStyleMap[temp] = st.textContent ? st.textContent.trim() : "";
        }
      });
    }
  });
  lstStyleMap.push(newStyleMap);
};
export const FolderKmlParse = (
  folderNode: ChildNode,
  placemarkLst: KmlPlacemarkModel[],
  sub: string[],
  lstStyle: StyleKmlModel[],
  lstStyleMap: StyleMapKmlModel[]
) => {
  let newSub: string[] = [...sub];
  folderNode.childNodes.forEach((folderChild) => {
    if (folderChild.nodeName === "name" && folderChild.textContent) {
      newSub.push(folderChild.textContent.trim());
    }
    if (folderChild.nodeName === "Placemark") {
      let newPlacemark: KmlPlacemarkModel = PlacemarkKmlParser(
        folderChild,
        newSub,
        lstStyle,
        lstStyleMap
      );
      placemarkLst.push(newPlacemark);
    }
    if (folderChild.nodeName === "Folder") {
      FolderKmlParse(folderChild, placemarkLst, newSub, lstStyle, lstStyleMap);
    }
  });
};
export const DocumentKmlParse = (
  documentNode: ChildNode,
  placemarkLst: KmlPlacemarkModel[],
  lstStyle: StyleKmlModel[],
  lstStyleMap: StyleMapKmlModel[],
  sub: string[]
) => {
  let newSub: string[] = [...sub];

  documentNode.childNodes.forEach((docChild) => {
    if (docChild.nodeName === "name" && docChild.textContent) {
      newSub.push(docChild.textContent.trim());
    }
    if (docChild.nodeName === "Style") {
      StyleKmlParser(docChild, lstStyle);
    }
    if (docChild.nodeName === "StyleMap") {
      StyleMapKmlParser(docChild, lstStyleMap);
    }
    if (docChild.nodeName === "Placemark") {
      let newPlacemark: KmlPlacemarkModel = PlacemarkKmlParser(
        docChild,
        newSub,
        lstStyle,
        lstStyleMap
      );
      placemarkLst.push(newPlacemark);
    }
    if (docChild.nodeName === "Folder") {
      FolderKmlParse(docChild, placemarkLst, newSub, lstStyle, lstStyleMap);
    }
    if (docChild.nodeName === "Document") {
      DocumentKmlParse(docChild, placemarkLst, lstStyle, lstStyleMap, newSub);
    }
  });
};
