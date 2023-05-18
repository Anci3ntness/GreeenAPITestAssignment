import React, { useEffect, useRef, useState } from "react"
import styles from "./ChatPlace.module.css"
import { useDispatch, useSelector } from "react-redux"
import { quit } from "../../app/slices/loginSlice"
import ChatCell from "../ChatCell"
import GreenAPIHandler from "../../utils/GreenAPIHandler"
import ChatArea from "../ChatArea"
import { message as Alert } from "antd"
export default function ChatPlace() {
	const { IdInstance, ApiTokenInstance } = useSelector((state) => state.login)
	const dispatch = useDispatch()
	const [phone, setPhone] = useState("")
	const [chats, setChats] = useState([])
	const [currrentChat, setCurrrentChat] = useState(null)
	const [message, setMessage] = useState("")
	const ref = useRef(null)

	const GH = new GreenAPIHandler(IdInstance, ApiTokenInstance)

	const addChatHandler = async () => {
		const checkValid = await GH.isPhoneValid(phone)
		if (!checkValid.isValid) {
			Alert.error(checkValid.errMsg)
			return
		}
		const chatId = phone + "@c.us"
		if (chats.find((f) => f.id === chatId) !== undefined) {
			Alert.error("Данный чат уже существует")
			return
		}
		setChats((old) => [...old, { id: chatId, messages: [] }])
		setPhone("")
	}
	const sendMessage = async () => {
		await GH.SendMessage(currrentChat, message.trim())
		ref.current.innerText = ""
	}

	const openHTTPChannel = async () => {
		const receiveMsg = async () => {
			const request = await GH.ReceiveNotification()
				.then(async (receiveRes) => {
					if (receiveRes.data === null)
						return {
							receiptId: null,
							errMsg: null,
						}
					if (
						receiveRes.data.body.typeWebhook ===
						"stateInstanceChanged"
					) {
						if (receiveRes.data.body.stateInstance !== "authorized")
							return {
								receiptId: receiveRes.data.receiptId,
								errMsg: "Аккаунт не авторизован",
							}
					} else if (
						receiveRes.data.body.typeWebhook ===
							"incomingMessageReceived" ||
						receiveRes.data.body.typeWebhook ===
							"outgoingMessageReceived" ||
						receiveRes.data.body.typeWebhook ===
							"outgoingAPIMessageReceived"
					) {
						return {
							receiptId: receiveRes.data.receiptId,
							body: receiveRes.data.body,
							errMsg: receiveRes.errMsg,
						}
					}
					return {
						receiptId: receiveRes.data.receiptId,
						errMsg: null,
					}
				})
				.catch((receiveErr) => {
					return {
						receiptId: null,
						errMsg: receiveErr.errMsg,
					}
				})
			if (request.receiptId !== null)
				await GH.DeleteNotification(request.receiptId)
					.then((res) => {
						if (!request.body) return
						if (!res.deleted) return
						setChats((old) => {
							const index = old.findIndex(
								(f) => f.id === request.body.senderData.chatId
							)
							if (index === -1) return [...old]

							const type = request.body.messageData.typeMessage

							if (!type.includes("extMessage")) return [...old]
							const typeQuery =
								request.body.messageData?.textMessageData
									?.textMessage ||
								request.body.messageData
									?.extendedTextMessageData?.text

							old[index].messages.push({
								incoming: type.includes("incoming"),
								sender: request.body.senderData.sender,
								textMessage: typeQuery,
							})

							return [...old]
						})
					})
					.catch((err) => err)
			if (request.errMsg !== null) {
				return request
			}
		}
		while (true) {
			const checker = await sleep(500)
				.then(async () => await receiveMsg())
				.then((res) => {
					if (!!res) return res
					return null
				})
			if (checker !== null) {
				return checker
			}
		}
	}

	function sleep(ms) {
		return new Promise(function (resolve, reject) {
			setTimeout(function () {
				resolve()
			}, ms)
		})
	}
	useEffect(() => {
		;(async () => {
			const checkError = await openHTTPChannel()
			Alert.error(checkError.errMsg)
			dispatch(quit())
		})()

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

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
							tabIndex={-1}
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
							tabIndex={1}
						></input>
						<button
							className={styles.addchat_btn}
							type='button'
							onClick={addChatHandler}
							tabIndex={-1}
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
					<div className={styles.chat_field}>
						<ChatArea
							chat={chats.find((f) => f.id === currrentChat)}
						/>

						<footer>
							<div className={styles.wrapper}>
								<div
									className={styles.text_area}
									contentEditable={true}
									role='textbox'
									spellCheck={true}
									title='Введите сообщение'
									placeholder='Введите текст'
									tabIndex={2}
									ref={ref}
									onInput={({ currentTarget }) => {
										setMessage(
											currentTarget.textContent.slice(
												0,
												10000
											)
										)
									}}
									onKeyDown={(e) => {
										if (
											e.key === "Enter" &&
											e.shiftKey === false
										) {
											e.preventDefault()
											sendMessage()
										}
									}}
									suppressContentEditableWarning
								></div>
							</div>
							<span
								title='Отправить сообщение'
								className={styles.send}
								onClick={sendMessage}
							>
								<svg
									width='32px'
									height='32px'
									viewBox='0 0 24 24'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'
								>
									<g
										id='SVGRepo_bgCarrier'
										strokeWidth='0'
									></g>
									<g
										id='SVGRepo_tracerCarrier'
										strokeLinecap='round'
										strokeLinejoin='round'
									></g>
									<g id='SVGRepo_iconCarrier'>
										<path
											d='M10.5004 11.9998H5.00043M4.91577 12.2913L2.58085 19.266C2.39742 19.8139 2.3057 20.0879 2.37152 20.2566C2.42868 20.4031 2.55144 20.5142 2.70292 20.5565C2.87736 20.6052 3.14083 20.4866 3.66776 20.2495L20.3792 12.7293C20.8936 12.4979 21.1507 12.3822 21.2302 12.2214C21.2993 12.0817 21.2993 11.9179 21.2302 11.7782C21.1507 11.6174 20.8936 11.5017 20.3792 11.2703L3.66193 3.74751C3.13659 3.51111 2.87392 3.39291 2.69966 3.4414C2.54832 3.48351 2.42556 3.59429 2.36821 3.74054C2.30216 3.90893 2.3929 4.18231 2.57437 4.72906L4.91642 11.7853C4.94759 11.8792 4.96317 11.9262 4.96933 11.9742C4.97479 12.0168 4.97473 12.0599 4.96916 12.1025C4.96289 12.1506 4.94718 12.1975 4.91577 12.2913Z'
											stroke='#000000'
											strokeWidth='1'
											strokeLinecap='round'
											strokeLinejoin='round'
										></path>
									</g>
								</svg>
							</span>
						</footer>
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
