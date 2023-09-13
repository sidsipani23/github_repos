import NoResultsImage from '../assets/NoResultsImage.png';

function NoItemsFound() {
	return (
		<div className='no-items-div'>
			<img
				src={NoResultsImage}
				alt='no-items-found'
				height='200px'
				width='200px'
			/>
			<h1>No results found!</h1>
		</div>
	);
}

export default NoItemsFound;
