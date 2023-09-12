import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarComp from './components/NavbarComp';
import SearchBar from './components/SearchBar';
import { Container } from 'react-bootstrap';
import { useState } from 'react';

function App() {
	const [searchInput, setSearchInput] = useState<string>('');
	function handleSearch(event: React.ChangeEvent): void {}
	return (
		<>
			<NavbarComp />
			<Container>
				<SearchBar searchInput={searchInput} handleSearch={handleSearch} />
			</Container>
		</>
	);
}

export default App;
