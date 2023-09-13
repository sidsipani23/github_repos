import NavbarComp from './NavbarComp';
import SearchBar from './SearchBar';
import { Container } from 'react-bootstrap';
import { useState, useCallback } from 'react';
import { fetchRepos } from '../api';
import { debounce, throttle } from '../utils';
import { ToastContainer, toast } from 'react-toastify';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Loading from './Loading';
import InfiniteScrolling from './InfiniteScrolling';
import SelectComp from './SelectComp';
import NoItemsFound from './NoItemsFound';

interface RepoData {
	userName?: string;
	repoName?: string;
	avatar?: string;
	stars?: number;
	description?: string;
	languages?: string;
	id: number;
	watchersCount?: number;
	score?: number;
	createdAt?: string;
	updatedAt?: string;
}

interface RepoItem {
	id: number;
	owner: { login: string; avatar_url: string };
	name: string;
	stargazers_count: number;
	description: string;
	language: string;
	watchers_count: number;
	score: number;
	created_at: string;
	updated_at: string;
}

function Home() {
	const [searchInput, setSearchInput] = useState<string>('');
	const [repoData, setRepoData] = useState<RepoData[] | null>(null);
	const [pageNumber, setPageNumber] = useState<number>(1);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [sortBy, setSortBy] = useState<string>('stars-asc');
	const [totalItemsCount, setTotalItemsCount] = useState<number>(0);
	const [hasMoreData, setHasMoreData] = useState<boolean>(true);
	const [isDataAvailable, setIsDataAvailable] = useState<boolean>(true);

	async function handleSearch(event: React.ChangeEvent): Promise<void> {
		try {
			const { value } = event.target as HTMLInputElement;
			setSearchInput(value);
			setRepoData([]);
			if (value) {
				debouncedQueryData(value);
			}
		} catch (err) {
			setIsLoading(false);
			notify('Something went wrong!');
		}
	}
	async function queryData(
		value: string,
		shouldPageNumberChange: boolean = false,
		sortByCurrent: string = ''
	) {
		try {
			if (value) {
				if (!shouldPageNumberChange) {
					setRepoData([]);
					setIsLoading(true);
					const [sort, orderOfSort] = sortByCurrent
						? sortByCurrent.split('-')
						: sortBy.split('-');
					const fetchReposResp = await fetchRepos(value, 1, sort, orderOfSort);
					const { data } = fetchReposResp;
					if (data.items.length > 0) {
						const finalArr: RepoData[] = data.items.map((item: RepoItem) => {
							return {
								id: item.id,
								userName: item.owner?.login,
								repoName: item.name,
								avatar: item.owner?.avatar_url,
								stars: item.stargazers_count,
								description: item.description,
								languages: item.language,
								watchersCount: item.watchers_count,
								score: item.score,
								createdAt: item.created_at,
								updatedAt: item.updated_at,
							};
						});
						setRepoData(finalArr);
						setIsLoading(false);
						setTotalItemsCount(data.total_count);
						setPageNumber(1);
					} else {
						setIsDataAvailable(false);
					}
				} else {
					setIsLoading(true);
					const currentPageNumber = pageNumber;
					setPageNumber((prevPageNumber) => prevPageNumber + 1);
					const totalPages = Math.ceil(totalItemsCount / 50);
					let hasMorePages = true;
					if (Object.is(totalPages, currentPageNumber)) {
						hasMorePages = false;
						setHasMoreData(false);
					}
					if (hasMorePages) {
						const [sort, orderOfSort] = sortBy.split('-');
						const fetchReposResp = await fetchRepos(
							value,
							currentPageNumber + 1,
							sort,
							orderOfSort
						);
						const { data } = fetchReposResp;
						if (data.items.length > 0) {
							const finalArr: RepoData[] = data.items.map((item: RepoItem) => {
								return {
									id: item.id,
									userName: item.owner?.login,
									repoName: item.name,
									avatar: item.owner?.avatar_url,
									stars: item.stargazers_count,
									description: item.description,
									languages: item.language,
									watchersCount: item.watchers_count,
									score: item.score,
									createdAt: item.created_at,
									updatedAt: item.updated_at,
								};
							});
							setRepoData([...(repoData as RepoData[]), ...finalArr]);
						}
					}
				}
			}
		} catch (err) {
			console.log(err);
			notify('Something went wrong!');
		} finally {
			setIsLoading(false);
		}
	}
	const debouncedQueryData = useCallback(debounce(queryData, 700), [sortBy]);
	const throttleQueryData = useCallback(throttle(queryData, 700), [
		repoData?.length,
	]);
	const notify = (message: string) => toast.error(message);
	async function handleSort(event: React.ChangeEvent) {
		const { value } = event.target as HTMLInputElement;
		setSortBy(value);
		await queryData(searchInput, false, value);
		return;
	}
	return (
		<>
			<NavbarComp />
			<Container>
				<Row>
					<Col md={9} xs={6} sm={6}>
						<SearchBar searchInput={searchInput} handleSearch={handleSearch} />
					</Col>
					<Col>
						<SelectComp sortBy={sortBy} handleSort={handleSort} />
					</Col>
				</Row>
				<InfiniteScrolling
					searchInput={searchInput}
					repoData={repoData}
					throttleQueryData={throttleQueryData}
					hasMoreData={hasMoreData}
				/>
				{isLoading && repoData?.length === 0 ? <Loading /> : null}
				<ToastContainer />
				{!isDataAvailable && <NoItemsFound />}
			</Container>
		</>
	);
}

export default Home;
