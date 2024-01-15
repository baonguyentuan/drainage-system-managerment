import { OrientationCalculateStatsModel, StationItemModel } from "../../models/bookModels"

export const convertBookToCalculate = (book: StationItemModel[]) => {
    let newBook: any[] = []
    book.map((station, stationIndex) => {
        let newStation: OrientationCalculateStatsModel[] = []
        station.stationStat.map((orientation, orientationIndex) => {
            const { idOrientation, upNumber, centerNumber, downNumber, note } = orientation
            let distanceCalculate: number
            if (upNumber === 0 && downNumber !== 0) {
                distanceCalculate = (downNumber + centerNumber) * 0.5
            } else if (downNumber === 0 && upNumber !== 0) {
                distanceCalculate = (upNumber - centerNumber) * 0.5
            } else if (upNumber !== 0 && downNumber !== 0) {
                distanceCalculate = (upNumber - downNumber) / 100
            } else {
                distanceCalculate = 0
            }
            let newOrientation: OrientationCalculateStatsModel = {
                idOrientation: idOrientation,
                upNumber: upNumber,
                downNumber: downNumber,
                centerNumber: centerNumber,
                note: note,
                distance: distanceCalculate,
                elevation: 0,
            }
            newStation.push(newOrientation)
        })
        newBook.push({
            idStation: station.idStation,
            stationStat: newStation
        })
    })
    return newBook
}