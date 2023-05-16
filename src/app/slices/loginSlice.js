import { createSlice } from "@reduxjs/toolkit"

export const loginSlice = createSlice({
	name: "counter",
	initialState: {
		isLoggedIn: false,
		IdInstance: "",
		ApiTokenInstance: "",
	},
	reducers: {
		login: (state, { payload }) => {
			state.isLoggedIn = true
			state.IdInstance = payload.IdInstance
			state.ApiTokenInstance = payload.ApiTokenInstance
		},
		quit: (state) => {
			state.isLoggedIn = false
			state.IdInstance = ""
			state.ApiTokenInstance = ""
		},
	},
})

export const { login, quit } = loginSlice.actions

export default loginSlice.reducer
