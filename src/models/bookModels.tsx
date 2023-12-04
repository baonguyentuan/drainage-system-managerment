export interface BookSliceMdel{
    structureName:string,
    lstBookItem:BookItemModel[]
}
export interface BookItemModel{
    idStation:number,
    stationStat:StationStatsModel[]
}
export interface StationStatsModel{
    idOrientation:number,
    upNumber: number,
    centerNumber: number,
    downNumber: number,
    note: string
}