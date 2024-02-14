import { ElevationPointModel, PointModel, ScaleFactorModel } from "../../../models/cadModel";

export class PathCad {
    id: string;
    layerName: string;
    color: number;
    linetypeName: string;
    linetypeScale: number;
    lineweight: number;
    vertex: PointModel[];
    polylineFlag: number;
    constructor(id: string) {
        this.id = id;
        this.layerName = '';
        this.color = -1;
        this.linetypeName = '';
        this.linetypeScale = 0;
        this.lineweight = -1;
        this.vertex = [];
        this.polylineFlag = 0
    }
    set setLayerName(layerName: string) {
        this.layerName = layerName
    }
    set setColor(color: number) {
        this.color = color
    }
    set setLinetypeName(linetypeName: string) {
        this.linetypeName = linetypeName
    }
    set setLinetypeScale(linetypeScale: number) {
        this.linetypeScale = linetypeScale
    }
    set setLineweight(lineweight: number) {
        this.lineweight = lineweight
    }
    set setVertex(vertexs: PointModel[]) {
        this.vertex = vertexs
    }
    set setPolylineFlag(polylineFlag: number) {
        this.polylineFlag = polylineFlag
    }
    readPath(line: string[]) {
        switch (line[0]) {
            case '6':
                this.setLinetypeName = line[1].trim()
                break;
            case '8':
                this.setLayerName = line[1].trim()
                break;
            case '10':
            case '11':
                this.setVertex = this.vertex.concat({ pX: Number(line[1].trim()), pY: 0, pZ: 0 })
                break;
            case '20':
            case '21':
                let cachesVertexs = [...this.vertex]
                cachesVertexs[cachesVertexs.length - 1].pY = Number(line[1].trim())
                this.setVertex = cachesVertexs
                break;
            case '30':
            case '31':
                // case '38':
                let newVertexs = [...this.vertex]
                newVertexs[newVertexs.length - 1].pZ = Number(line[1].trim())
                this.setVertex = newVertexs
                break;
            case '43':
                if (line[1].trim() !== "") {
                    this.setLineweight = Number(line[1].trim())
                } else {
                    this.setLineweight = -1
                }
                break;
            case '48':
                this.setLinetypeScale = Number(line[1].trim())
                break;
            case '62':
                if (line[1].trim() !== "") {
                    this.setColor = Number(line[1].trim())
                } else {
                    this.setColor = -1
                }
                break;
            case '70':
                this.setPolylineFlag = Number(line[1].trim())
                break;
            default:
                break;
        }
    }
}
export class TextCad {
    id: string;
    layerName: string;
    textValue: string;
    textStyle: string;
    textHeight: number;
    widthFactor: number;
    textRotation: number;
    textColor: number;
    firstAlignmentPoint: PointModel
    secondAlignmentPoint: PointModel
    constructor(id: string) {
        this.id = id;
        this.layerName = '';
        this.textValue = '';
        this.textStyle = '';
        this.textHeight = -1;
        this.widthFactor = 0;
        this.textRotation = 0;
        this.textColor = -1;
        this.firstAlignmentPoint = { pX: 0, pY: 0, pZ: 0 };
        this.secondAlignmentPoint = { pX: 0, pY: 0, pZ: 0 }
    }
    get getFirstAlignmentPoint() {
        return this.firstAlignmentPoint
    }
    set setLayerName(layerName: string) {
        this.layerName = layerName
    }
    set setTextValue(textValue: string) {
        this.textValue = textValue
    }
    set setTextStyle(textStyle: string) {
        this.textStyle = textStyle
    }
    set setTextHeight(textHeight: number) {
        this.textHeight = textHeight
    }
    set setWidthFactor(widthFactor: number) {
        this.widthFactor = widthFactor
    }
    set setTextRotation(textRotation: number) {
        this.textRotation = textRotation
    }
    set setTextColor(textColor: number) {
        this.textColor = textColor
    }
    set setFirstAlignmentPoint(firstAlignmentPoint: PointModel) {
        this.firstAlignmentPoint = firstAlignmentPoint
    }
    set setSecondAlignmentPoint(secondAlignmentPoint: PointModel) {
        this.secondAlignmentPoint = secondAlignmentPoint
    }

    readText(line: string[]) {
        switch (line[0].trim()) {
            case '1':
                this.setTextValue = line[1].trim()
                break;
            case '7':
                this.setTextStyle = line[1].trim()
                break;
            case '8':
                this.setLayerName = line[1].trim()
                break;
            case '10':
                this.setFirstAlignmentPoint = { ...this.firstAlignmentPoint, pX: Number(line[1].trim()) }
                break;
            case '20':
                this.setFirstAlignmentPoint = { ...this.firstAlignmentPoint, pY: Number(line[1].trim()) }
                break;
            case '30':
                this.setFirstAlignmentPoint = { ...this.firstAlignmentPoint, pZ: Number(line[1].trim()) }
                break;
            case '11':
                this.setSecondAlignmentPoint = { ...this.secondAlignmentPoint, pX: Number(line[1].trim()) }
                break;
            case '21':
                this.setSecondAlignmentPoint = { ...this.secondAlignmentPoint, pY: Number(line[1].trim()) }
                break;
            case '31':
                this.setSecondAlignmentPoint = { ...this.secondAlignmentPoint, pZ: Number(line[1].trim()) }
                break;
            case '40':
                if (line[1].trim() !== "") {
                    this.setTextHeight = Number(line[1].trim())
                } else {
                    this.setTextHeight = -1
                }
                break;
            case '41':
                if (line[1].trim() !== "") {
                    this.setWidthFactor = Number(line[1].trim())
                } else {
                    this.setWidthFactor = -1
                }
                break;
            case '50':
                this.setTextRotation = Number(line[1].trim())
                break;
            case '62':
                if (line[1].trim() !== "") {
                    this.setTextColor = Number(line[1].trim())
                } else {
                    this.setTextColor = -1
                }
                break;

            default:
                break;
        }
    }
}
export class HatchCad {
    id: string;
    layerName: string;
    patternName: string;
    patternScale: number;
    color: number;
    numberVertex: number;
    rotationAngel: number;
    elevationPoint: ElevationPointModel[];
    constructor(id: string) {
        this.id = id;
        this.layerName = '';
        this.patternName = '';
        this.patternScale = 0;
        this.color = -1;
        this.numberVertex = 0
        this.rotationAngel = 0;
        this.elevationPoint = [];
    }
    set setLayerName(layerName: string) {
        this.layerName = layerName;
    }
    set setPatternName(patternName: string) {
        this.patternName = patternName;
    }
    set setPatternScale(patternScale: number) {
        this.patternScale = patternScale;
    }
    set setColor(color: number) {
        this.color = color;
    }
    set setRotationAngel(rotationAngel: number) {
        this.rotationAngel = rotationAngel;
    }
    set setElevationPoint(elevationPoint: ElevationPointModel[]) {
        this.elevationPoint = elevationPoint;
    }
    set setNumberVertex(numberVertex: number) {
        this.numberVertex = numberVertex;
    }
    readHatch(line: string[]) {
        switch (line[0]) {
            case '2':
                this.setPatternName = line[1].trim();
                break;
            case '8':
                this.setLayerName = line[1].trim();
                break;
            case '10':
                // case '11':
                if (this.elevationPoint.length > 0 && this.elevationPoint.length <= this.numberVertex) {
                    if (this.elevationPoint[this.elevationPoint.length - 1].status !== true) {
                        let cachesVertexs = [...this.elevationPoint];
                        cachesVertexs[cachesVertexs.length - 1].epX = Number(line[1].trim());
                        this.setElevationPoint = cachesVertexs;
                    }
                }
                break;
            case '20':
                // case '21':
                if (this.elevationPoint.length > 0 && this.elevationPoint.length <= this.numberVertex) {
                    if (this.elevationPoint[this.elevationPoint.length - 1].status !== true) {
                        let cachesVertexs = [...this.elevationPoint];
                        cachesVertexs[cachesVertexs.length - 1].epY = Number(line[1].trim());
                        this.setElevationPoint = cachesVertexs;
                        this.elevationPoint[this.elevationPoint.length - 1].status = true
                    }
                }
                if (this.elevationPoint.length < this.numberVertex) {
                    this.setElevationPoint = this.elevationPoint.concat({ epX: 0, epY: 0, epZ: 0, status: false });

                }
                break;
            case '62':
                if (line[1].trim() !== "") {
                    this.setColor = Number(line[1].trim())
                } else {
                    this.setColor = -1
                }
                break;
            case '72':
                break;
            case '41':
                this.setPatternScale = Number(line[1].trim());
                break;
            case '93':
                this.setElevationPoint = this.elevationPoint.concat({ epX: 0, epY: 0, epZ: 0, status: false });
                this.setNumberVertex = Number(line[1].trim());
                break;
            case '460':
                this.setRotationAngel = Number(line[1].trim());
                break;
        }
    }
}
export class CircleCad {
    id: string;
    layerName: string;
    color: number;
    linetypeName: string;
    linetypeScale: number;
    lineweight: number;
    centerPoint: PointModel;
    radius: number;
    constructor(id: string) {
        this.id = id;
        this.layerName = '';
        this.color = -1;
        this.linetypeName = '';
        this.linetypeScale = 0;
        this.lineweight = -1;
        this.centerPoint = { pX: 0, pY: 0, pZ: 0 };
        this.radius = 0;
    }
    set setLayerName(layerName: string) {
        this.layerName = layerName
    }
    set setColor(color: number) {
        this.color = color
    }
    set setLinetypeName(linetypeName: string) {
        this.linetypeName = linetypeName
    }
    set setLinetypeScale(linetypeScale: number) {
        this.linetypeScale = linetypeScale
    }
    set setLineweight(lineweight: number) {
        this.lineweight = lineweight
    }
    set setCenterPoint(centerPoint: PointModel) {
        this.centerPoint = centerPoint
    }
    set setRadius(radius: number) {
        this.radius = radius
    }
    readCircle(line: string[]) {
        switch (line[0]) {
            case '6':
                this.setLinetypeName = line[1].trim()
                break;
            case '8':
                this.setLayerName = line[1].trim()
                break;
            case '10':
                this.setCenterPoint = { ...this.centerPoint, pX: Number(line[1].trim()) }
                break;
            case '20':
                this.setCenterPoint = { ...this.centerPoint, pY: Number(line[1].trim()) }
                break;
            case '30':
                this.setCenterPoint = { ...this.centerPoint, pZ: Number(line[1].trim()) }
                break;
            case '40':
                this.setRadius = Number(line[1].trim())
                break;
            case '43':
                if (line[1].trim() !== "") {
                    this.setLineweight = Number(line[1].trim())
                } else {
                    this.setLineweight = -1
                }
                break;
            case '48':
                this.setLinetypeScale = Number(line[1].trim())
                break;
            case '62':
                if (line[1].trim() !== "") {
                    this.setColor = Number(line[1].trim())
                } else {
                    this.setColor = -1
                }
                break;
            default:
                break;
        }
    }

}
export class ArcCad {
    id: string;
    layerName: string;
    color: number;
    linetypeName: string;
    linetypeScale: number;
    lineweight: number;
    centerPoint: PointModel;
    radius: number;
    startAngle: number;
    endAngle: number;
    constructor(id: string) {
        this.id = id;
        this.layerName = '';
        this.color = -1;
        this.linetypeName = '';
        this.linetypeScale = -1;
        this.lineweight = 0;
        this.centerPoint = { pX: 0, pY: 0, pZ: 0 };
        this.radius = 0;
        this.startAngle = 0;
        this.endAngle = 0;
    }
    set setLayerName(layerName: string) {
        this.layerName = layerName
    }
    set setColor(color: number) {
        this.color = color
    }
    set setLinetypeName(linetypeName: string) {
        this.linetypeName = linetypeName
    }
    set setLinetypeScale(linetypeScale: number) {
        this.linetypeScale = linetypeScale
    }
    set setLineweight(lineweight: number) {
        this.lineweight = lineweight
    }
    set setCenterPoint(centerPoint: PointModel) {
        this.centerPoint = centerPoint
    }
    set setRadius(radius: number) {
        this.radius = radius
    }
    set setStartAngle(startAngle: number) {
        this.startAngle = startAngle
    }
    set setEndAngle(endAngle: number) {
        this.endAngle = endAngle
    }
    readArc(line: string[]) {
        switch (line[0]) {
            case '6':
                this.setLinetypeName = line[1].trim()
                break;
            case '8':
                this.setLayerName = line[1].trim()
                break;
            case '10':
                this.setCenterPoint = { ...this.centerPoint, pX: Number(line[1].trim()) }
                break;
            case '20':
                this.setCenterPoint = { ...this.centerPoint, pY: Number(line[1].trim()) }
                break;
            case '30':
                this.setCenterPoint = { ...this.centerPoint, pZ: Number(line[1].trim()) }
                break;
            case '40':
                this.setRadius = Number(line[1].trim())
                break;
            case '43':
                if (line[1].trim() !== "") {
                    this.setLineweight = Number(line[1].trim())
                } else {
                    this.setLineweight = -1
                }
                break;
            case '48':
                this.setLinetypeScale = Number(line[1].trim())
                break;
            case '50':
                this.setStartAngle = Number(line[1].trim())
                break;
            case '51':
                this.setEndAngle = Number(line[1].trim())
                break;
            case '62':
                if (line[1].trim() !== "") {
                    this.setColor = Number(line[1].trim())
                } else {
                    this.setColor = -1
                }
                break;
            default:
                break;
        }
    }

}
export class InsertBlockCad {
    id: string;
    blockName: string;
    layerName: string;
    insertPoint: PointModel;
    scaleFactor: ScaleFactorModel;
    rotationAngle: number;
    constructor(id: string) {
        this.id = id;
        this.blockName = '';
        this.layerName = '';
        this.insertPoint = { pX: 0, pY: 0, pZ: 0 };
        this.scaleFactor = { sfX: 1, sfY: 1, sfZ: 1 };
        this.rotationAngle = 0
    }
    set setLayerName(layerName: string) {
        this.layerName = layerName
    }
    set setBlockName(blockName: string) {
        this.blockName = blockName
    }
    set setRotationAngle(rotationAngle: number) {
        this.rotationAngle = rotationAngle
    }
    set setInsertPoint(insertPoint: PointModel) {
        this.insertPoint = insertPoint
    }
    set setScaleFactor(scaleFactor: ScaleFactorModel) {
        this.scaleFactor = scaleFactor
    }
    readInsert(line: string[]) {
        switch (line[0].trim()) {
            case '2':
                this.setBlockName = line[1].trim()
                break;
            case '8':
                this.setLayerName = line[1].trim()
                break;
            case '10':
                this.setInsertPoint = { ...this.insertPoint, pX: Number(line[1].trim()) }
                break;
            case '20':
                this.setInsertPoint = { ...this.insertPoint, pY: Number(line[1].trim()) }
                break;
            case '30':
                this.setInsertPoint = { ...this.insertPoint, pZ: Number(line[1].trim()) }
                break;
            case '41':
                this.setScaleFactor = { ...this.scaleFactor, sfX: Number(line[1].trim()) }
                break;
            case '42':
                this.setScaleFactor = { ...this.scaleFactor, sfY: Number(line[1].trim()) }
                break;
            case '43':
                this.setScaleFactor = { ...this.scaleFactor, sfZ: Number(line[1].trim()) }
                break;
            case '50':
                this.setRotationAngle = Number(line[1].trim())
                break;
            default:
                break;
        }
    }
}
export class AttribCad {
    id: string;
    layerName: string;
    textStartPoint: PointModel;
    alignmentPoint: PointModel;
    textStyleName: string;
    textValue: string;
    textHeight: number;
    horizontalText: number;
    attributeTag: string;
    constructor(id: string) {
        this.id = id
        this.layerName = ''
        this.textStartPoint = { pX: 0, pY: 0, pZ: 0 };
        this.alignmentPoint = { pX: 0, pY: 0, pZ: 0 };
        this.textStyleName = '';
        this.textValue = '';
        this.textHeight = -1;
        this.horizontalText = 1;
        this.attributeTag = ''
    }
    set setLayerName(layerName: string) {
        this.layerName = layerName
    }
    set setTextStartPoint(textStartPoint: PointModel) {
        this.textStartPoint = textStartPoint
    }
    set setAlignmentPoint(alignmentPoint: PointModel) {
        this.alignmentPoint = alignmentPoint
    }
    set setTextStyleName(textStyleName: string) {
        this.textStyleName = textStyleName
    }
    set setTextValue(textValue: string) {
        this.textValue = textValue
    }
    set setTextHeight(textHeight: number) {
        this.textHeight = textHeight
    }
    set setHorizontalText(horizontalText: number) {
        this.horizontalText = horizontalText
    }
    set setAttributeTag(attributeTag: string) {
        this.attributeTag = attributeTag
    }
    readAttrib(line: string[]) {
        switch (line[0].trim()) {
            case '1':
                this.setTextValue = line[1].trim()
                break;
            case '2':
                this.setAttributeTag = line[1].trim()
                break;
            case '7':
                this.setTextStyleName = line[1].trim()
                break;
            case '8':
                this.setLayerName = line[1].trim()
                break;
            case '10':
                this.setTextStartPoint = { ...this.textStartPoint, pX: Number(line[1].trim()) }
                break;
            case '20':
                this.setTextStartPoint = { ...this.textStartPoint, pY: Number(line[1].trim()) }
                break;
            case '30':
                this.setTextStartPoint = { ...this.textStartPoint, pZ: Number(line[1].trim()) }
                break;
            case '11':
                this.setAlignmentPoint = { ...this.alignmentPoint, pX: Number(line[1].trim()) }
                break;
            case '21':
                this.setAlignmentPoint = { ...this.alignmentPoint, pY: Number(line[1].trim()) }
                break;
            case '31':
                this.setAlignmentPoint = { ...this.alignmentPoint, pZ: Number(line[1].trim()) }
                break;
            case '40':
                this.setTextHeight = Number(line[1].trim())
                break;
            case '72':
                this.setHorizontalText = Number(line[1].trim())
                break;
        }
    }
}
export class AttdefCad {
    id: string;
    layerName: string;
    textHeight: number;
    textStyle: string;
    textDefault: string;
    drawDirection: string;
    firstAlignmentPoint: PointModel;
    secondAlignmentPoint: PointModel;
    promtString: string;
    tagString: string;
    attributeFlag: string;
    constructor(id: string) {
        this.id = id;
        this.layerName = '';
        this.textHeight = -1;
        this.textStyle = '';
        this.textDefault = '';
        this.drawDirection = '';
        this.firstAlignmentPoint = { pX: 0, pY: 0, pZ: 0 };
        this.secondAlignmentPoint = { pX: 0, pY: 0, pZ: 0 };
        this.promtString = '';
        this.tagString = '';
        this.attributeFlag = '';
    }
    set setLayerName(layerName: string) {
        this.layerName = layerName
    }
    set setTextHeight(textHeight: number) {
        this.textHeight = textHeight
    }
    set setTextStyle(textStyle: string) {
        this.textStyle = textStyle
    }
    set setTextDefault(textValue: string) {
        this.textDefault = textValue
    }
    set setDrawDirection(drawDirection: string) {
        this.drawDirection = drawDirection
    }
    set setFirstAlignmentPoint(firstAlignmentPoint: PointModel) {
        this.firstAlignmentPoint = firstAlignmentPoint
    }
    set setSecondAlignmentPoint(secondAlignmentPoint: PointModel) {
        this.secondAlignmentPoint = secondAlignmentPoint
    }
    set setPromtString(promtString: string) {
        this.promtString = promtString
    }
    set setTagString(tagString: string) {
        this.tagString = tagString
    }
    set setAttributeFlag(attributeFlag: string) {
        this.attributeFlag = attributeFlag
    }
    readAttdef(line: string[]) {
        switch (line[0]) {
            case '1':
                this.setTextDefault = line[1].trim()
                break;
            case '2':
                this.setTagString = line[1].trim()
                break;
            case '3':
                this.setPromtString = line[1].trim()
                break;
            case '7':
                this.setTextStyle = line[1].trim()
                break;
            case '8':
                this.setLayerName = line[1].trim()
                break;
            case '10':
                this.setFirstAlignmentPoint = { ...this.firstAlignmentPoint, pX: Number(line[1].trim()) }
                break;
            case '20':
                this.setFirstAlignmentPoint = { ...this.firstAlignmentPoint, pY: Number(line[1].trim()) }
                break;
            case '30':
                this.setFirstAlignmentPoint = { ...this.firstAlignmentPoint, pZ: Number(line[1].trim()) }
                break;
            case '11':
                this.setSecondAlignmentPoint = { ...this.secondAlignmentPoint, pX: Number(line[1].trim()) }
                break;
            case '21':
                this.setSecondAlignmentPoint = { ...this.secondAlignmentPoint, pY: Number(line[1].trim()) }
                break;
            case '31':
                this.setSecondAlignmentPoint = { ...this.secondAlignmentPoint, pZ: Number(line[1].trim()) }
                break;
            case '40':
                this.setTextHeight = Number(line[1].trim())
                break;
            case '70':
                this.setAttributeFlag = line[1].trim()
                break;
            case '72':
                this.setDrawDirection = line[1].trim()
                break;
            default:
                break;
        }
    }

}

