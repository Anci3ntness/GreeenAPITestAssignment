import React from "react"
import styles from "./ChatCell.module.css"
export default function ChatCell({ tel, onClick, className }) {
	return (
		<div className={`${styles.root} ${className}`} onClick={onClick}>
			Чат с{" "}
			{tel.replace(
				/^(\d)(\d{3})(\d{3})(\d{2})(\d{2})$/,
				"+$1($2)$3-$4-$5"
			)}
		</div>
	)
}
