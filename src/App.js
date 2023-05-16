import { useSelector } from "react-redux"
import ChatPlace from "./components/ChatPlace"
import LoginPlace from "./components/LoginPlace"
import "./styles/global/App.css"

function App() {
	const { isLoggedIn } = useSelector((state) => state.login)
	return (
		<div className='App'>{isLoggedIn ? <ChatPlace /> : <LoginPlace />}</div>
	)
}

export default App
