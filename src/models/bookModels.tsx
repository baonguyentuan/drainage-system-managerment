export interface BookSliceMdel{
    structureName:string,
    lstBookItem:StationItemModel[]
}
export interface StationItemModel{
    idStation:number,
    stationStat:OrientationStatsModel[]
}
export interface OrientationStatsModel{
    idOrientation:number,
    upNumber: number,
    centerNumber: number,
    downNumber: number,
    note: string
}
export interface StationCalculationModel{
    idStation:number,
    stationStat:OrientationCalculateStatsModel[]
}
export interface OrientationCalculateStatsModel{
    idOrientation:number,
    upNumber: number,
    centerNumber: number,
    downNumber: number,
    distance:number,
    elevation:number,
    note: string
}
export interface ElevationPointModel{
    name:string,
    elevation:number
}
export interface OrientationPointModel{
    name:string,
    centerNumber:number,
    elevation:number
}