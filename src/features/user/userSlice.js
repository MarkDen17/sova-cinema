import { createSlice } from '@reduxjs/toolkit'

export const initialUserData = {
  isAuth: false,
  id: null,
  username: null,
  role: null
}

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    userData: initialUserData,
  },
  reducers: {
    setUser: (state, action) => {
      state.userData = { ...action.payload }
    },
  }
})

export const { setUser } = userSlice.actions

export default userSlice.reducer