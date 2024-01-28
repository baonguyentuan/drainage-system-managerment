import { createSlice } from '@reduxjs/toolkit'
import { OrientationCalculateStatsModel, StationCalculationModel, StationItemModel } from '../models/bookModels';

const initialState = {
  structureName: '',
  lstBookItem: [] as StationItemModel[],
  lstBookCalculate: [] as StationCalculationModel[]
}

const bookSlice = createSlice({
  name: 'bookSlice',
  initialState,
  reducers: {
    setStructureName: (state, action) => {
      state.structureName = action.payload.structureName
    },
    setLstBookItem: (state, action) => {
      state.lstBookItem = action.payload.lstBookItem
      localStorage.setItem("book", JSON.stringify(state.lstBookItem))
    },
    setLstBookCalculate: (state, action) => {
      state.lstBookCalculate = action.payload.lstBookItem
    },
    convertBookToCalculate: (state, action) => {
      let newBook: StationCalculationModel[] = []
      state.lstBookItem.forEach((station, stationIndex) => {
        let newStation: OrientationCalculateStatsModel[] = []
        station.stationStat.forEach((orientation, orientationIndex) => {
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
      state.lstBookCalculate = newBook
    }
  }
});

export const { setLstBookItem, setStructureName, convertBookToCalculate, setLstBookCalculate } = bookSlice.actions

export default bookSlice.reducer