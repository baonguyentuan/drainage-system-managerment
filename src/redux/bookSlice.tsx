import { createSlice } from '@reduxjs/toolkit'
import { OrientationCalculateStatsModel, StationCalculationModel } from '../models/bookModels';

const initialState = {
  structureName: 'test',
  lstBookItem: [
    {
      "idStation": 1,
      "stationStat": [
        {
          "idOrientation": 2,
          "upNumber": 1000,
          "centerNumber": 1030,
          "downNumber": 1060,
          "note": "IV-THO-01"
        },
        {
          "idOrientation": 3,
          "upNumber": 2001,
          "centerNumber": 2105,
          "downNumber": 2210,
          "note": "tc450"
        },
        {
          "idOrientation": 4,
          "upNumber": 2340,
          "centerNumber": 2500,
          "downNumber": 2660,
          "note": "cos gui dinh oc"
        },
        {
          "idOrientation": 5,
          "upNumber": 3012,
          "centerNumber": 3241,
          "downNumber": 4001,
          "note": "DT1"
        }
      ]
    },
    {
      "idStation": 6,
      "stationStat": [
        {
          "idOrientation": 7,
          "upNumber": 1000,
          "centerNumber": 1030,
          "downNumber": 1060,
          "note": "DT1"
        },
        {
          "idOrientation": 8,
          "upNumber": 3012,
          "centerNumber": 3241,
          "downNumber": 4001,
          "note": "DT2"
        }
      ]
    },
    {
      "idStation": 9,
      "stationStat": [
        {
          "idOrientation": 10,
          "upNumber": 1000,
          "centerNumber": 1050,
          "downNumber": 1060,
          "note": "DT2"
        },
        {
          "idOrientation": 11,
          "upNumber": 3012,
          "centerNumber": 2241,
          "downNumber": 4001,
          "note": "DT3"
        }
      ]
    }
  ],
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
    },
    setLstBookCalculate: (state, action) => {
      state.lstBookCalculate = action.payload.lstBookItem
    },
    convertBookToCalculate: (state, action) => {
      let newBook: StationCalculationModel[] = []
      state.lstBookItem.map((station, stationIndex) => {
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
      state.lstBookCalculate = newBook
    }
  }
});

export const { setLstBookItem, setStructureName,convertBookToCalculate,setLstBookCalculate } = bookSlice.actions

export default bookSlice.reducer