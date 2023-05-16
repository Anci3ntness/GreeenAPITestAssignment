import React, { useState } from "react"
import styles from "./ChatPlace.module.css"
import { useDispatch, useSelector } from "react-redux"
import { quit } from "../../app/slices/loginSlice"
import ChatCell from "../ChatCell"
import whatsAppClient from "@green-api/whatsapp-api-client"

export default function ChatPlace() {
	const { IdInstance, ApiTokenInstance } = useSelector((state) => state.login)
	const dispatch = useDispatch()
	const [phone, setPhone] = useState("")
	const [chats, setChats] = useState([])
	const [currrentChat, setCurrrentChat] = useState(null)
	const isPhoneValid = async () => {
		if (phone.length === 0) return false
		return await fetch(
			`${process.env.REACT_APP_HOST}/waInstance${IdInstance}/checkWhatsapp/${ApiTokenInstance}`,
			{ method: "POST", body: JSON.stringify({ phoneNumber: +phone }) }
		)
			.then((data) => {
				if (data.ok) return data.json()
				if (data.status === 400) {
					console.log(
						"Неверный формат телефона (Превышен лимит ожидания)"
					)
					return false
				} else {
					console.log("Произошла непредвиденная ошибка")
					return false
				}
			})
			.then((json) => {
				if (!json) return false
				if (json.existsWhatsapp !== true) {
					console.log("Данного номера нет в WhatsApp")
					return false
				}
				return true
			})
			.catch((err) => {
				console.log("Проверьте правильность номера телефона")
				return false
			})
	}

	const addChatHandler = async () => {
		const isValid = await isPhoneValid()
		if (!isValid) return
		const chatId = phone + "@c.us"
		if (chats.includes(chatId)) return
		setChats((old) => [...old, { id: chatId, messages: [] }])
		setPhone("")
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
							title='Выйти из аккаунта'
							className={styles.quit_btn}
							type='button'
							onClick={() => dispatch(quit())}
						>
							Выйти
						</button>
					</div>
					<div className={styles.field_group}>
						<input
							value={phone}
							className={styles.addchat}
							title='Введите номер телефона получателя'
							placeholder='Новый чат'
							onChange={({ target }) => {
								setPhone(target.value)
							}}
							onKeyDown={(e) => {
								if (e.key === "Enter") addChatHandler()
							}}
						></input>
						<button
							className={styles.addchat_btn}
							type='button'
							onClick={addChatHandler}
						>
							Добавить
						</button>
					</div>
				</header>
				<span className={styles.divider} />
				<div className={styles.list}>
					{chats.map((e) => {
						return (
							<ChatCell
								className={
									currrentChat === e.id
										? styles.selected
										: null
								}
								key={e.id}
								tel={e.id.replace("@c.us", "")}
								onClick={() =>
									setCurrrentChat((old) => {
										if (old === e.id) return null
										return e.id
									})
								}
							/>
						)
					})}
				</div>
			</div>
			<div className={styles.main}>
				{currrentChat ? (
					<div>
						{chats
							.find((f) => f.id === currrentChat)
							?.messages.map((e) => {
								return <div>{e}</div>
							})}
					</div>
				) : (
					<h3 className={styles.placeholder}>
						Добавьте/выберите чат
					</h3>
				)}
			</div>
		</div>
	)
}
