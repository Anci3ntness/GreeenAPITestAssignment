import React, { useState } from "react"
import styles from "./LoginPlace.module.css"

export default function LoginPlace() {
	const [IdInstance, setIdInstance] = useState("")
	const [ApiTokenInstance, setApiTokenInstance] = useState("")
	const submitHandler = async () => {
		await fetch(
			`${process.env.REACT_APP_HOST}/waInstance${IdInstance}/getStateInstance/${ApiTokenInstance}`
		)
			.then((data) => {
				if (data.status === 401) {
					console.log("Аккаунта не существует")
					return
				}
				return data.json()
			})
			.then((json) => {
				if (!json) return
				if (json?.stateInstance !== "authorized")
					console.log("Аккаунт не авторизован в WhatsApp")
			})
			.catch((err) => {
				console.log(err)
			})
	}
	return (
		<div className={styles.root}>
			<h2 className={styles.title}>Вход в аккаунт Green API</h2>
			<div className={styles.inputPlace}>
				<input
					placeholder='IdInstance'
					value={IdInstance}
					onChange={({ target }) => setIdInstance(target.value)}
				/>
				<input
					placeholder='ApiTokenInstance'
					value={ApiTokenInstance}
					onChange={({ target }) => setApiTokenInstance(target.value)}
				/>
			</div>
			<div className={styles.submitPlace}>
				<button className={styles.submit} onClick={submitHandler}>
					Войти
				</button>
			</div>
		</div>
	)
}
