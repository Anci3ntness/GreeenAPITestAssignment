import React, { useState } from "react"
import styles from "./LoginPlace.module.css"
import { useDispatch } from "react-redux"
import { login } from "../../app/slices/loginSlice"
export default function LoginPlace() {
	const [IdInstance, setIdInstance] = useState("")
	const [ApiTokenInstance, setApiTokenInstance] = useState("")

	const dispatch = useDispatch()

	const submitHandler = async () => {
		await fetch(
			`${process.env.REACT_APP_HOST}/waInstance${IdInstance}/GetStatusInstance/${ApiTokenInstance}`
		)
			.then((data) => {
				if (data.ok) return data.json()
				if (data.status === 401) {
					console.log("Неверный IdInstance или ApiTokenInstance")
					return
				} else {
					console.log("Произошла непредвиденная ошибка")
					return
				}
			})
			.then((json) => {
				if (!json) return
				if (json.statusInstance !== "online") {
					console.log("Аккаунт не авторизован в WhatsApp")
					return
				}
				dispatch(login({ IdInstance, ApiTokenInstance }))
				setIdInstance("")
				setApiTokenInstance("")
			})
			.catch((err) => {
				console.log("Неверный формат данных")
			})
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
