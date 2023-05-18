import React, { useState } from "react"
import styles from "./LoginPlace.module.css"
import { useDispatch } from "react-redux"
import { login } from "../../app/slices/loginSlice"
import GreenAPIHandler from "../../utils/GreenAPIHandler"
import { message as Alert } from "antd"
export default function LoginPlace() {
	const [IdInstance, setIdInstance] = useState("")
	const [ApiTokenInstance, setApiTokenInstance] = useState("")

	const dispatch = useDispatch()

	const submitHandler = async () => {
		const checkLogin = await new GreenAPIHandler(
			IdInstance,
			ApiTokenInstance
		).GetStatusInstance()
		if (!checkLogin.isValid) {
			Alert.error(checkLogin.errMsg)
			return
		}
		dispatch(login({ IdInstance, ApiTokenInstance }))
		setIdInstance("")
		setApiTokenInstance("")
	}
	return (
		<div className={styles.root}>
			<h2 className={styles.title}>Вход в аккаунт Green API</h2>
			<div className={styles.inputPlace}>
				<input
					title='Введите ваш IdInstance'
					placeholder='IdInstance'
					value={IdInstance}
					onChange={({ target }) => setIdInstance(target.value)}
				/>
				<input
					title='Введите ваш ApiTokenInstance'
					placeholder='ApiTokenInstance'
					value={ApiTokenInstance}
					onChange={({ target }) => setApiTokenInstance(target.value)}
				/>
			</div>
			<div className={styles.submitPlace}>
				<button
					className={styles.submit_btn}
					type='button'
					onClick={submitHandler}
				>
					Войти
				</button>
			</div>
		</div>
	)
}
