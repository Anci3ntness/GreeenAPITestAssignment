export default class GreenAPIHandler {
	IdInstance
	ApiTokenInstance
	constructor(IdInstance, ApiTokenInstance) {
		this.IdInstance = IdInstance
		this.ApiTokenInstance = ApiTokenInstance
	}

	async isPhoneValid(phoneNumber) {
		if (phoneNumber.length === 0)
			return {
				isValid: false,
				errMsg: "Введен пустой номер телефона",
			}
		const res = await new Promise((resolve, reject) => {
			fetch(
				`${process.env.REACT_APP_HOST}/waInstance${this.IdInstance}/checkWhatsapp/${this.ApiTokenInstance}`,
				{
					method: "POST",
					body: JSON.stringify({ phoneNumber: +phoneNumber }),
				}
			)
				.then((data) => {
					if (data.ok) return data.json()
					if (data.status === 400) {
						reject({
							isValid: false,
							errMsg: "Неверный формат телефона (Превышен лимит ожидания)",
						})
					} else {
						reject({
							isValid: false,
							errMsg: "Произошла непредвиденная ошибка",
						})
					}
				})
				.then((json) => {
					if (!json)
						reject({
							isValid: false,
							errMsg: "Получен пустой ответ от сервера",
						})
					if (json.existsWhatsapp !== true) {
						reject({
							isValid: false,
							errMsg: "Данного номера нет в WhatsApp",
						})
					}
					resolve({
						isValid: true,
						errMsg: null,
					})
				})
				.catch((err) => {
					reject({
						isValid: false,
						errMsg: "Проверьте правильность номера телефона",
					})
				})
		})
			.then((result) => result)
			.catch((err) => err)
		return res
	}

	async GetStatusInstance() {
		if (this.IdInstance.length === 0 || this.ApiTokenInstance.length === 0)
			return {
				isValid: false,
				errMsg: "Заполните все поля",
			}
		const res = await new Promise((resolve, reject) => {
			fetch(
				`${process.env.REACT_APP_HOST}/waInstance${this.IdInstance}/GetStatusInstance/${this.ApiTokenInstance}`
			)
				.then((data) => {
					if (data.ok) return data.json()
					if (data.status === 401) {
						reject({
							isValid: false,
							errMsg: "Неверный IdInstance или ApiTokenInstance",
						})
					} else {
						reject({
							isValid: false,
							errMsg: "Произошла непредвиденная ошибка",
						})
					}
				})
				.then((json) => {
					if (!json)
						reject({
							isValid: false,
							errMsg: "Получен пустой ответ от сервера",
						})
					if (json.statusInstance !== "online") {
						reject({
							isValid: false,
							errMsg: "Аккаунт не авторизован в WhatsApp",
						})
					}

					resolve({
						isValid: true,
						errMsg: null,
					})
				})
				.catch((err) => {
					reject({
						isValid: false,
						errMsg: "Неверный формат данных",
					})
				})
		})
			.then((result) => result)
			.catch((err) => err)
		return res
	}
	async ReceiveNotification() {
		const res = await new Promise((resolve, reject) => {
			fetch(
				`${process.env.REACT_APP_HOST}/waInstance${this.IdInstance}/ReceiveNotification/${this.ApiTokenInstance}`
			)
				.then((data) => {
					if (data.ok) return data.json()
					if (data.status === 400) {
						reject({
							data: {},
							errMsg: "Ошибка параметра IdInstance или ApiTokenInstance",
						})
					} else {
						reject({
							data: {},
							errMsg: "Произошла непредвиденная ошибка",
						})
					}
				})
				.then((json) => {
					resolve({
						data: json,
						errMsg: null,
					})
				})
				.catch((err) => {
					reject({
						data: {},
						errMsg: "Неверный формат данных",
					})
				})
		})
			.then((result) => result)
			.catch((err) => err)
		return res
	}
	async DeleteNotification(receiptId) {
		const res = await new Promise((resolve, reject) => {
			fetch(
				`${process.env.REACT_APP_HOST}/waInstance${this.IdInstance}/DeleteNotification/${this.ApiTokenInstance}/${receiptId}`,
				{
					method: "DELETE",
				}
			)
				.then((data) => {
					if (data.ok) return data.json()
					if (data.status === 400) {
						reject({
							deleted: false,
							errMsg: "Неверный IdInstance, ApiTokenInstance или receiptId",
						})
					} else {
						reject({
							deleted: false,
							errMsg: "Произошла непредвиденная ошибка",
						})
					}
				})
				.then((json) => {
					if (!json)
						reject({
							deleted: false,
							errMsg: "Получен пустой ответ от сервера",
						})
					if (json.result !== true) {
						reject({
							deleted: false,
							errMsg: "Неверный receiptId",
						})
					}

					resolve({
						deleted: true,
						errMsg: null,
					})
				})
				.catch((err) => {
					reject({
						deleted: false,
						errMsg: "Неверный формат данных",
					})
				})
		})
			.then((result) => result)
			.catch((err) => err)
		return res
	}
	async SendMessage(chatId, message) {
		const res = await new Promise((resolve, reject) => {
			fetch(
				`${process.env.REACT_APP_HOST}/waInstance${this.IdInstance}/SendMessage/${this.ApiTokenInstance}`,
				{
					method: "POST",
					body: JSON.stringify({
						chatId: chatId,
						message: message,
					}),
				}
			)
				.then((data) => {
					if (data.ok) return data.json()
					if (data.status === 400) {
						reject({
							sended: false,
							errMsg: "Аккаунт не авторизован",
						})
					} else {
						reject({
							sended: false,
							errMsg: "Произошла непредвиденная ошибка",
						})
					}
				})
				.then((json) => {
					resolve({
						sended: true,
						errMsg: null,
					})
				})
				.catch((err) => {
					reject({
						sended: false,
						errMsg: "Неверный формат данных",
					})
				})
		})
			.then((result) => result)
			.catch((err) => err)
		return res
	}
}
