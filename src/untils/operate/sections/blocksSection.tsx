
import { BlockPropertiesModel } from "../../../models/cadModel.js";
import { MAX_NUMBER_OBJECT } from "../../config/configCad";
import { formatText } from "../opetate";
import { ArcCad, AttdefCad, AttribCad, CircleCad, HatchCad, InsertBlockCad, PathCad, TextCad } from "./entitiesSection";
let status = '';
let idBlockObject = 0
let objectProperty: any;
export class BlockCad {
    id: string;
    properties: BlockPropertiesModel;
    lstPath: PathCad[];
    lstPolygon: HatchCad[];
    lstText: TextCad[];
    lstArc: ArcCad[];
    lstCircle: CircleCad[];
    lstAttdef: AttdefCad[];
    lstInsertBlock: InsertBlockCad[];
    lstAttrib: AttribCad[];
    constructor(id: string) {
        this.id = id;
        this.properties = {
            blockName: '',
            layerName: '',
            basePoint: { pX: 0, pY: 0, pZ: 0 },
            xrefPathName: '',
            blockDescripstion: '',
            blockStatus: 0
        };
        this.lstPath = [];
        this.lstPolygon = [];
        this.lstText = [];
        this.lstArc = [];
        this.lstCircle = [];
        this.lstAttdef = [];
        this.lstInsertBlock = [];
        this.lstAttrib = []
    }
    set setProperties(properties: BlockPropertiesModel) {
        this.properties = properties
    }
    set setLstPath(path: PathCad[]) {
        this.lstPath = path
    }
    set setLstPolygon(polygon: HatchCad[]) {
        this.lstPolygon = polygon
    }
    set setLstText(text: TextCad[]) {
        this.lstText = text
    }
    set setLstArc(arc: ArcCad[]) {
        this.lstArc = arc
    }
    set setLstCircle(circle: CircleCad[]) {
        this.lstCircle = circle
    }
    set setLstAttdef(attdef: AttdefCad[]) {
        this.lstAttdef = attdef
    }
    set setLstInsertBlock(insert: InsertBlockCad[]) {
        this.lstInsertBlock = insert
    }
    set setLstAttrib(attrib: AttribCad[]) {
        this.lstAttrib = attrib
    }
    readBlockInfo(line: string[]) {
        switch (line[0].trim()) {
            case '1':
                this.setProperties = { ...this.properties, xrefPathName: line[1].trim() }
                break;
            case '2':
                this.setProperties = { ...this.properties, blockName: line[1].trim() }
                break;
            case '4':
                this.setProperties = { ...this.properties, blockDescripstion: line[1].trim() }
                break;
            case '8':
                this.setProperties = { ...this.properties, layerName: line[1].trim() }
                break;
            case '10':
                this.setProperties = { ...this.properties, basePoint: { ...this.properties.basePoint, pX: Number(line[1].trim()) } }
                break;
            case '20':
                this.setProperties = { ...this.properties, basePoint: { ...this.properties.basePoint, pY: Number(line[1].trim()) } }
                break;
            case '30':
                this.setProperties = { ...this.properties, basePoint: { ...this.properties.basePoint, pZ: Number(line[1].trim()) } }
                break;
            case '70':
                this.setProperties = { ...this.properties, blockStatus: Number(line[1].trim()) }
                break;
            default:
                break;
        }
        
        
    }
    readBlockProperties(line: string[]) {
        if (line[0] === '0') {
            if (status === 'text') {
                this.setLstText = this.lstText.concat(objectProperty)
            } else if (status === 'path') {
                this.setLstPath = this.lstPath.concat(objectProperty)
            } else if (status === 'circle') {
                this.setLstCircle = this.lstCircle.concat(objectProperty)
            } else if (status === 'arc') {
                this.setLstArc = this.lstArc.concat(objectProperty)
            } else if (status === 'insert') {
                this.setLstInsertBlock = this.lstInsertBlock.concat(objectProperty)
            } else if (status === 'attrib') {
                this.setLstAttrib = this.lstAttrib.concat(objectProperty)
            } else if (status === 'polygon') {
                this.setLstPolygon = this.lstPolygon.concat(objectProperty)
            } else if (status === 'attdef') {
                this.setLstAttdef = this.lstAttdef.concat(objectProperty)
            }
            status = ''
            if (line[1] === 'TEXT' || line[1] === 'MTEXT') {
                status = 'text'
                objectProperty = new TextCad(`${this.id}-text-${formatText(String(idBlockObject++), MAX_NUMBER_OBJECT - 2)}`)
            } else if (line[1] === 'LINE' || line[1] === 'LWPOLYLINE' || line[1] === 'POLYLINE') {
                status = 'path'
                objectProperty = new PathCad(`${this.id}-path-${formatText(String(idBlockObject++), MAX_NUMBER_OBJECT - 2)}`)
            } else if (line[1] === 'ARC') {
                status = 'arc'
                objectProperty = new ArcCad(`${this.id}-arc-${formatText(String(idBlockObject++), MAX_NUMBER_OBJECT - 2)}`)
            } else if (line[1] === 'CIRCLE') {
                status = 'circle'
                objectProperty = new CircleCad(`${this.id}-circle-${formatText(String(idBlockObject++), MAX_NUMBER_OBJECT - 2)}`)
            } else if (line[1] === 'INSERT') {
                status = 'insert'
                objectProperty = new InsertBlockCad(`${this.id}-insert-${formatText(String(idBlockObject++), MAX_NUMBER_OBJECT - 2)}`)
            } else if (line[1] === 'ATTRIB') {
                status = 'attrib'
                objectProperty = new AttribCad(`${this.id}-attrib-${formatText(String(idBlockObject++), MAX_NUMBER_OBJECT - 2)}`)
            } else if (line[1] === 'HATCH') {
                status = 'polygon'
                objectProperty = new HatchCad(`${this.id}-hatch-${formatText(String(idBlockObject++), MAX_NUMBER_OBJECT - 2)}`)
            } else if (line[1] === 'ATTDEF') {
                status = 'attdef'
                objectProperty = new AttdefCad(`${this.id}-attdef-${formatText(String(idBlockObject++), MAX_NUMBER_OBJECT - 2)}`)
            } else if (line[1] === 'BLOCK') {
                status = 'block'
                idBlockObject = 0
            }
        }
        if (status === 'text') {
            objectProperty.readText(line)
        } else if (status === 'path') {
            objectProperty.readPath(line)
        } else if (status === 'arc') {
            objectProperty.readArc(line)
        } else if (status === 'circle') {
            objectProperty.readCircle(line)
        } else if (status === 'insert') {
            objectProperty.readInsert(line)
        } else if (status === 'attrib') {
            objectProperty.readAttrib(line)
        } else if (status === 'polygon') {
            objectProperty.readHatch(line)
        } else if (status === 'attdef') {
            objectProperty.readAttdef(line)
        } else if (status === 'block') {
            this.readBlockInfo(line)
        }
    }
}