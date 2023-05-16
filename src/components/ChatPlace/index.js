import React, { useState } from "react"
import styles from "./ChatPlace.module.css"
import { useDispatch, useSelector } from "react-redux"
import { quit } from "../../app/slices/loginSlice"

export default function ChatPlace() {
	const { IdInstance, ApiTokenInstance } = useSelector((state) => state.login)
	const dispatch = useDispatch()
	const [phone, setPhone] = useState(0)

	const isPhoneValid = async () => {
		await fetch(
			`${process.env.REACT_APP_HOST}/waInstance${IdInstance}/checkWhatsapp/${ApiTokenInstance}`,
			{ method: "POST", body: JSON.stringify({ phoneNumber: +phone }) }
		)
			.then((data) => {
				if (data.ok) return data.json()
				if (data.status === 400) {
					console.log(
						"Неверный формат телефона (Превышен лимит ожидания)"
					)
					return
				} else {
					console.log("Произошла непредвиденная ошибка")
					return
				}
			})
			.then((json) => {
				if (!json) return
				if (json.existsWhatsapp !== true) {
					console.log("Данного номера нет в WhatsApp")
					return
				}
			})
			.catch((err) => {
				console.log("Проверьте правильность номера телефона")
			})
	}
	return (
		<div className={styles.root}>
			<div className={styles.chatlist}>
				<header>
					<div
						className={styles.field_group}
						style={{ marginBottom: "1em" }}
					>
						<div>
							Ваш IdInstance: <i>{IdInstance}</i>
						</div>
						<button
							className={styles.quit_btn}
							type='button'
							onClick={() => dispatch(quit())}
						>
							Выйти
						</button>
					</div>
					<div className={styles.field_group}>
						<input
							className={styles.addchat}
							title='Введите номер телефона получателя'
							placeholder='Новый чат'
							onChange={({ target }) => {
								setPhone(target.value)
							}}
						></input>
						<button
							className={styles.addchat_btn}
							type='button'
							onClick={isPhoneValid}
						>
							Добавить
						</button>
					</div>
				</header>
				<span className={styles.divider} />
				<div className={styles.list}></div>
			</div>
			<div className={styles.main}></div>
		</div>
	)
}
