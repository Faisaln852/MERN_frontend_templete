// store/index.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import storage from 'redux-persist/lib/storage'
import { persistReducer, persistStore } from 'redux-persist'

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
})

// Persist config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // persist only auth
}

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer)

// Store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
    }),
})

// Persistor
export const persistor = persistStore(store)

// ✅ Required for typed hooks
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
