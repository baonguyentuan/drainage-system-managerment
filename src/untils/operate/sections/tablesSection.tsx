export class LayerCad {
    layerName: string;
    linetype: string;
    lineweight: number;
    color: number;
    layerStatus: number;
    constructor() {
        this.layerName = '';
        this.linetype = '';
        this.lineweight = 0;
        this.color = 0;
        this.layerStatus = 0
    }
    set setLayerName(layerName: string) {
        this.layerName = layerName
    }
    set setLinetype(linetype: string) {
        this.linetype = linetype
    }
    set setColor(color: number) {
        this.color = color
    }
    set setLineweight(lineweight: number) {
        this.lineweight = lineweight
    }
    set setLayerStatus(layerStatus: number) {
        this.layerStatus = layerStatus
    }
    readLayer(line: string[0]) {
        switch (line[0].trim()) {
            case '2':
                this.setLayerName = line[1].trim()
                break;
            case '6':
                this.setLinetype = line[1].trim()
                break;
            case '62':

                this.setColor = Number(line[1].trim())
                break;
            case '70':

                this.setLayerStatus = Number(line[1].trim())
                break;
            case '370':
                if (Number(line[1].trim()) < 1) {
                    this.setLineweight = 1
                } else {
                    this.setLineweight = Number(line[1].trim())
                }
                break;
            default:
                break;
        }
    }
}
export class TextStyleCad {
    styleName: string;
    fontStyle: string;
    textHeight: number;
    widthFactor: number;
    obliqueAngle: number;
    primaryFontName: string;
    constructor() {
        this.styleName = '';
        this.fontStyle = '';
        this.textHeight = 1;
        this.widthFactor = 1;
        this.obliqueAngle = 0;
        this.primaryFontName = ''
    }
    set setStyleName(styleName: string) {
        this.styleName = styleName
    }
    set setFontStyle(fontStyle: string) {
        this.fontStyle = fontStyle
    }
    set setTextHeight(textHeight: number) {
        this.textHeight = textHeight
    }
    set setWidthFactor(widthFactor: number) {
        this.widthFactor = widthFactor
    }
    set setObliqueAngle(obliqueAngle: number) {
        this.obliqueAngle = obliqueAngle
    }
    set setPrimaryFontName(primaryFontName: string) {
        this.primaryFontName = primaryFontName
    }
    readStyle(line: string[]) {
        switch (line[0].trim()) {
            case '2':
                this.setStyleName = line[1].trim()
                break;
            case '3':
                this.setPrimaryFontName = line[1].trim()
                break;
            case '40':
                if (line[1].trim() !== "0.0") {
                    this.setTextHeight = Number(line[1].trim())
                } else {
                    this.setTextHeight = 1
                }
                break;
            case '41':
                this.setWidthFactor = Number(line[1].trim())
                break;
            case '50':
                this.setObliqueAngle = Number(line[1].trim())
                break;
            case '1071':
                this.setFontStyle = line[1].trim()
                break;
            case '1000':
                this.setPrimaryFontName = line[1].trim()
                break;
            default:
                break;
        }
    }
}