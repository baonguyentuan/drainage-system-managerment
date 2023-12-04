import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  structureName: '',
  lstBookItem: [
    {
      "idStation": 1,
      "stationStat": [
        {
          "idOrientation": 1,
          "upNumber": 1000,
          "centerNumber": 1030,
          "downNumber": 1060,
          "note": "IV-THO-01"
        },
        {
          "idOrientation": 2,
          "upNumber": 2001,
          "centerNumber": 2105,
          "downNumber": 2210,
          "note": "tc450"
        },
        {
          "idOrientation": 3,
          "upNumber": 2340,
          "centerNumber": 2500,
          "downNumber": 2660,
          "note": "cos gui dinh oc"
        },
        {
          "idOrientation": 4,
          "upNumber": 3012,
          "centerNumber": 3241,
          "downNumber": 4001,
          "note": "DT1"
        }
      ]
    },
    {
      "idStation": 2,
      "stationStat": [
        {
          "idOrientation": 1,
          "upNumber": 1000,
          "centerNumber": 1030,
          "downNumber": 1060,
          "note": ""
        },
        {
          "idOrientation": 4,
          "upNumber": 3012,
          "centerNumber": 3241,
          "downNumber": 4001,
          "note": "DT2"
        }
      ]
    },
    {
      "idStation": 2,
      "stationStat": [
        {
          "idOrientation": 1,
          "upNumber": 1000,
          "centerNumber": 1030,
          "downNumber": 1060,
          "note": ""
        },
        {
          "idOrientation": 4,
          "upNumber": 3012,
          "centerNumber": 3241,
          "downNumber": 4001,
          "note": "DT2"
        }
      ]
    }
  ]
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
    }
  }
});

export const { } = bookSlice.actions

export default bookSlice.reducer