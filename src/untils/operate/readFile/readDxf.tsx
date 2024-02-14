import { MAX_NUMBER_OBJECT } from "../../config/configCad";
import { formatText } from "../opetate";
import { BlockCad } from "../sections/blocksSection";
import {
  ArcCad,
  AttdefCad,
  AttribCad,
  CircleCad,
  HatchCad,
  InsertBlockCad,
  PathCad,
  TextCad,
} from "../sections/entitiesSection";
import { LayerCad, TextStyleCad } from "../sections/tablesSection";
let lstGroup: string[][] = [];
export let lstText: TextCad[] = [];
export let lstPolygon: HatchCad[] = [];
export let lstPath: PathCad[] = [];
export let lstCircle: CircleCad[] = [];
export let lstArc: ArcCad[] = [];
export let lstTextStyle: TextStyleCad[] = [];
export let lstLayer: LayerCad[] = [];
export let lstBlock: BlockCad[] = [];
export let lstInsert: InsertBlockCad[] = [];
export let lstAttDef: AttdefCad[] = [];
export let lstAttRib: AttribCad[] = [];
export const readDxfFile = async (file: File) => {
  let id = 0;
  let fr = new FileReader();
  fr.readAsText(file);
  fr.onload = (e) => {
    const text: string =
      typeof e?.target?.result === "string" ? e?.target?.result : "";

    const lines = text.split("\n");
    let cachesSection: string[] = [];
    lines.map((line, index) => {
      let lineSlice = line.trim();
      if ((index + 1) % 2 !== 0) {
        cachesSection.push(lineSlice.trim());
      } else {
        cachesSection.push(lineSlice.trim());
        lstGroup.push(cachesSection);
        cachesSection = [];
      }
    });
    let sectionStatus = "";
    let status = "";
    let objectProperty: any;
    lstGroup.map((section, index) => {
      //set section
      if (section[0] === "0" && section[1] === "SECTION") {
        sectionStatus = "";
      }
      if (sectionStatus === "") {
        if (section[0] === "2") {
          sectionStatus = section[1];
        }
      }
      //entities
      if (sectionStatus === "TABLES") {
        if (section[0] === "0") {
          if (status === "style") {
            lstTextStyle.push(objectProperty);
          } else if (status === "layer") {
            lstLayer.push(objectProperty);
          }
          status = "";
          if (section[1] === "STYLE") {
            status = "style";
            objectProperty = new TextStyleCad();
          } else if (section[1] === "LAYER") {
            status = "layer";
            objectProperty = new LayerCad();
          }
        }
        if (status === "style") {
          objectProperty.readStyle(section);
        } else if (status === "layer") {
          objectProperty.readLayer(section);
        }
      } else if (sectionStatus === "ENTITIES") {
        if (section[0] === "0") {
          if (status === "text") {
            lstText.push(objectProperty);
          } else if (status === "path") {
            lstPath.push(objectProperty);
          } else if (status === "circle") {
            lstCircle.push(objectProperty);
          } else if (status === "arc") {
            lstArc.push(objectProperty);
          } else if (status === "insert") {
            lstInsert.push(objectProperty);
          } else if (status === "attrib") {
            lstAttRib.push(objectProperty);
          } else if (status === "polygon") {
            lstPolygon.push(objectProperty);
          }
          status = "";
          if (section[1] === "TEXT" || section[1] === "MTEXT") {
            status = "text";
            objectProperty = new TextCad(
              `text-${formatText(String(id++), MAX_NUMBER_OBJECT)}`
            );
          } else if (
            section[1] === "LINE" ||
            section[1] === "LWPOLYLINE" ||
            section[1] === "POLYLINE"
          ) {
            status = "path";
            objectProperty = new PathCad(
              `path-${formatText(String(id++), MAX_NUMBER_OBJECT - 2)}`
            );
          } else if (section[1] === "ARC") {
            status = "arc";
            objectProperty = new ArcCad(
              `arc-${formatText(String(id++), MAX_NUMBER_OBJECT - 2)}`
            );
          } else if (section[1] === "CIRCLE") {
            status = "circle";
            objectProperty = new CircleCad(
              `circle-${formatText(String(id++), MAX_NUMBER_OBJECT - 2)}`
            );
          } else if (section[1] === "INSERT") {
            status = "insert";
            objectProperty = new InsertBlockCad(
              `insert-${formatText(String(id++), MAX_NUMBER_OBJECT - 2)}`
            );
          } else if (section[1] === "ATTRIB") {
            status = "attrib";
            objectProperty = new AttribCad(
              `attrib-${formatText(String(id++), MAX_NUMBER_OBJECT - 2)}`
            );
          } else if (section[1] === "HATCH") {
            status = "polygon";
            objectProperty = new HatchCad(
              `hatch-${formatText(String(id++), MAX_NUMBER_OBJECT)}`
            );
          }
        }
        if (status === "text") {
          objectProperty.readText(section);
        } else if (status === "path") {
          objectProperty.readPath(section);
        } else if (status === "arc") {
          objectProperty.readArc(section);
        } else if (status === "circle") {
          objectProperty.readCircle(section);
        } else if (status === "insert") {
          objectProperty.readInsert(section);
        } else if (status === "attrib") {
          objectProperty.readAttrib(section);
        } else if (status === "polygon") {
          objectProperty.readHatch(section);
        }
      } else if (sectionStatus === "BLOCKS") {
        if (section[0] === "0") {
          if (status === "block" && section[1] === "BLOCK") {
            lstBlock.push(objectProperty);
            status = "";
          } else if (status === "attdef") {
            lstAttDef.push(objectProperty);
            status = "";
          }
          if (section[1] === "BLOCK") {
            status = "block";
            objectProperty = new BlockCad(
              `block-${formatText(String(id++), MAX_NUMBER_OBJECT)}`
            );
          } else if (section[1] === "ATTDEF") {
            status = "attdef";
            objectProperty = new AttdefCad(
              `attdef-${formatText(String(id++), MAX_NUMBER_OBJECT)}`
            );
          }
        }
        if (status === "block") {
          objectProperty.readBlockProperties(section);
        } else if (status === "attdef") {
          objectProperty.readAttdef(section);
        }
      }
    });
  };
};
