import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store/store'

export interface UserState {
  isAuth: boolean,
  id: number | null,
  username: string | null,
  role: string | null
}

export const initialUser: UserState = {
  isAuth: false,
  id: null,
  username: null,
  role: null
}

export const userSlice = createSlice({
  name: 'user',
  initialState: initialUser,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      return { ...state, ...action.payload }
    },
  }
})

export const { setUser } = userSlice.actions;
export const selectUser = (state: RootState) => state.user;
export default userSlice.reducer;