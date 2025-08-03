import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  contents: [],
  activeContent: null,
  seoScore: 0,
  entities: [],
  serpResults: [],
  loading: false,
  error: null,
}

const contentSlice = createSlice({
  name: "content",
  initialState,
  reducers: {
    setContents: (state, action) => {
      state.contents = action.payload
      state.loading = false
      state.error = null
    },
    addContent: (state, action) => {
      state.contents.unshift(action.payload)
    },
    setActiveContent: (state, action) => {
      state.activeContent = action.payload
    },
    updateContent: (state, action) => {
      const index = state.contents.findIndex(c => c.Id === action.payload.Id)
      if (index !== -1) {
        state.contents[index] = action.payload
      }
      if (state.activeContent?.Id === action.payload.Id) {
        state.activeContent = action.payload
      }
    },
    setSeoScore: (state, action) => {
      state.seoScore = action.payload
    },
    setEntities: (state, action) => {
      state.entities = action.payload
    },
    setSerpResults: (state, action) => {
      state.serpResults = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
      if (action.payload) {
        state.error = null
      }
    },
    setError: (state, action) => {
      state.error = action.payload
      state.loading = false
    },
  },
})

export const {
  setContents,
  addContent,
  setActiveContent,
  updateContent,
  setSeoScore,
  setEntities,
  setSerpResults,
  setLoading,
  setError,
} = contentSlice.actions

export default contentSlice.reducer