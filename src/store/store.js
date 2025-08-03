import { configureStore } from "@reduxjs/toolkit"
import projectsReducer from "@/store/slices/projectsSlice"
import contentReducer from "@/store/slices/contentSlice"

export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    content: contentReducer,
  },
})