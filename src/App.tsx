import './App.css';
import Container from './components/Container/Container';
import Header from './components/Header/Header';
import Main from './components/Main/Main';
import Modal from './components/Modal/Modal';

function App() {
	return (
		<Container>
			<Header />
			<Main />
			<Modal />
		</Container>
	);
}

export default App;
