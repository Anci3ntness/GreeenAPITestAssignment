import React from "react"
import ReactDOM from "react-dom/client"
import "./styles/global/index.css"
import App from "./App"
import { Provider } from "react-redux"
import store from "./app/store"
function StrictApp() {
	return (
		<React.StrictMode>
			<Provider store={store}>
				<App />
			</Provider>
		</React.StrictMode>
	)
}
ReactDOM.createRoot(document.getElementById("root")).render(<StrictApp />)
