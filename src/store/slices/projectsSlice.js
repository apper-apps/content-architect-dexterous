import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  projects: [],
  activeProject: null,
  loading: false,
  error: null,
  analysisData: null,
  analysisLoading: false,
  liveAnalysisResults: [],
  pdfGenerating: false,
}

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setProjects: (state, action) => {
      state.projects = action.payload
      state.loading = false
      state.error = null
    },
    addProject: (state, action) => {
      state.projects.unshift(action.payload)
    },
    setActiveProject: (state, action) => {
      state.activeProject = action.payload
    },
    updateProject: (state, action) => {
      const index = state.projects.findIndex(p => p.Id === action.payload.Id)
      if (index !== -1) {
        state.projects[index] = action.payload
      }
      if (state.activeProject?.Id === action.payload.Id) {
        state.activeProject = action.payload
      }
    },
    deleteProject: (state, action) => {
      state.projects = state.projects.filter(p => p.Id !== action.payload)
      if (state.activeProject?.Id === action.payload) {
        state.activeProject = null
      }
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
    setAnalysisData: (state, action) => {
      // Ensure fresh analysis data with timestamp
      const analysisWithMeta = {
        ...action.payload,
        isLiveData: true,
        analysisTimestamp: Date.now(),
        isFresh: true
      }
      state.analysisData = analysisWithMeta
      state.analysisLoading = false
    },
    setAnalysisLoading: (state, action) => {
      state.analysisLoading = action.payload
    },
    addLiveAnalysisResult: (state, action) => {
      // Add fresh analysis result with live data indicators
      const resultWithMeta = {
        ...action.payload,
        isLiveAnalysis: true,
        timestamp: Date.now(),
        source: 'real-time'
      }
      state.liveAnalysisResults.unshift(resultWithMeta)
      // Keep only the last 50 results for better performance tracking
      if (state.liveAnalysisResults.length > 50) {
        state.liveAnalysisResults = state.liveAnalysisResults.slice(0, 50)
      }
    },
    clearAnalysisData: (state) => {
      state.analysisData = null
      state.analysisLoading = false
    },
    setPdfGenerating: (state, action) => {
      state.pdfGenerating = action.payload
    },
    clearLiveAnalysisResults: (state) => {
      state.liveAnalysisResults = []
    },
  },
})

export const {
  setProjects,
  addProject,
  setActiveProject,
  updateProject,
  deleteProject,
  setLoading,
  setError,
  setAnalysisData,
  setAnalysisLoading,
  addLiveAnalysisResult,
  clearAnalysisData,
  setPdfGenerating,
  clearLiveAnalysisResults,
} = projectsSlice.actions

export default projectsSlice.reducer