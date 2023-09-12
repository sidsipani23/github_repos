import NavbarComp from './NavbarComp';
import SearchBar from './SearchBar';
import RepoCard from './RepoCard';
import { Container } from 'react-bootstrap';
import { useState } from 'react';

function Home() {
	const [searchInput, setSearchInput] = useState<string>('');
	const [repoData, setRepoData] = useState<RepoData[] | null>(null);
	function handleSearch(event: React.ChangeEvent): void {}

	return (
		<>
			<NavbarComp />
			<Container>
				<SearchBar searchInput={searchInput} handleSearch={handleSearch} />
				{repoData &&
					repoData.length > 0 &&
					repoData.map((repo) => {
						return (
							<div className='repodata-div'>
								<RepoCard
									userName={repo.userName}
									repoName={repo.repoName}
									avatar={repo.avatar}
									stars={repo.stars}
									description={repo.description}
									languages={repo.languages}
								/>
							</div>
						);
					})}
			</Container>
		</>
	);
}

interface RepoData {
	userName?: string;
	repoName?: string;
	avatar?: string;
	stars?: number;
	description?: string;
	languages?: string;
}
export default Home;
