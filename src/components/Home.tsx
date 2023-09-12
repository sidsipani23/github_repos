import NavbarComp from './NavbarComp';
import SearchBar from './SearchBar';
import RepoCard from './RepoCard';
import Loading from './Loading';
import { Container } from 'react-bootstrap';
import { useState, useCallback } from 'react';
import { fetchRepos } from '../api';
import { debounce } from '../utils';
import { ToastContainer, toast } from 'react-toastify';

function Home() {
	const [searchInput, setSearchInput] = useState<string>('');
	const [repoData, setRepoData] = useState<RepoData[] | null>(null);
	const [pageNumber, setPageNumber] = useState<number>(1);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	async function handleSearch(event: React.ChangeEvent): Promise<void> {
		try {
			const { value } = event.target as HTMLInputElement;
			setSearchInput(value);
			if (value) {
				debouncedQueryData(value);
			}
		} catch (err) {
			setIsLoading(false);
			notify('Something went wrong!');
		}
	}
	async function queryData(value: string) {
		try {
			if (value) {
				setIsLoading(true);
				const fetchReposResp = await fetchRepos(value, pageNumber);
				const { data } = fetchReposResp;
				if (data.items.length > 0) {
					const finalArr: RepoData[] = data.items.map((item) => {
						return {
							id: item.id,
							userName: item.owner?.login,
							repoName: item.name,
							avatar: item.owner?.avatar_url,
							stars: item.stargazers_count,
							description: item.description,
							languages: item.language,
						};
					});
					setRepoData(finalArr);
					setIsLoading(false);
				}
			}
		} catch (err) {
			notify('Something went wrong!');
		} finally {
			setIsLoading(false);
		}
	}
	const debouncedQueryData = useCallback(debounce(queryData, 2000), [repoData]);
	const notify = (message: string) => toast.error(message);

	return (
		<>
			<NavbarComp />
			<Container>
				<SearchBar searchInput={searchInput} handleSearch={handleSearch} />
				{repoData &&
					repoData.length > 0 &&
					repoData.map((repo) => {
						return (
							<div className='repodata-div' key={repo.id}>
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
				{isLoading ? <Loading /> : null}
				<ToastContainer />
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
	id: number;
}
export default Home;
