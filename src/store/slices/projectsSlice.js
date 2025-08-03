import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  projects: [],
  activeProject: null,
  loading: false,
  error: null,
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
} = projectsSlice.actions

export default projectsSlice.reducer