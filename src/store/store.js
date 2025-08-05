import { configureStore } from '@reduxjs/toolkit'
import projectsReducer from '@/store/slices/projectsSlice'
import contentReducer from '@/store/slices/contentSlice'
import userReducer from '@/store/slices/userSlice'

export const store = configureStore({
reducer: {
    projects: projectsReducer,
    content: contentReducer,
    user: userReducer,
  },
})