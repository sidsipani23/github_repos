import Form from 'react-bootstrap/Form';

interface SearchBarProps {
	searchInput: string;
	handleSearch: (event: React.ChangeEvent) => void;
}
function SearchBar({ searchInput, handleSearch }: SearchBarProps) {
	return (
		<div className='search-div'>
			<Form.Control
				type='text'
				id='searchInput'
				value={searchInput}
				onChange={handleSearch}
				aria-describedby='searchInput'
				placeholder='Enter the name of the repository that you want to search!'
			/>
		</div>
	);
}

export default SearchBar;
