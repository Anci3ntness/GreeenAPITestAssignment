import React from "react"
import ReactDOM from "react-dom/client"
import "./styles/global/index.css"
import App from "./App"

function StrictApp() {
	return (
		<React.StrictMode>
			<App />
		</React.StrictMode>
	)
}
ReactDOM.createRoot(document.getElementById("root")).render(<StrictApp />)
