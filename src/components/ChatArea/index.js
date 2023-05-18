import React, { useEffect, useRef } from "react"
import styles from "./ChatArea.module.css"
export default function ChatArea(props) {
	const messagesEndRef = useRef(null)

	useEffect(() => {
		if (!messagesEndRef.current) return
		messagesEndRef.current?.scrollIntoView()
	}, [props])

	return (
		<div className={styles.root}>
			<div className={styles.msg_area}>
				{props.chat.messages.map((e, i) => {
					return (
						<div className={styles.msg_wrapper} key={i}>
							<span
								className={styles.msg_text}
								style={
									e.incoming === true
										? {
												alignSelf: "flex-start",
												borderTopLeftRadius: 0,
												backgroundColor:
													"var(--rui_white)",
										  }
										: {
												alignSelf: "flex-end",
												borderTopRightRadius: 0,
												backgroundColor:
													"var(--outgoing_color)",
										  }
								}
							>
								{e.textMessage}
							</span>
						</div>
					)
				})}
				<span ref={messagesEndRef} />
			</div>
		</div>
	)
}
