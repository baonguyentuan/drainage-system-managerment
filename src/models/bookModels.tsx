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