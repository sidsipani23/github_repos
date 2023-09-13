import NavbarComp from './NavbarComp';
import SearchBar from './SearchBar';
import RepoCard from './RepoCard';
import Loading from './Loading';
import { Container } from 'react-bootstrap';
import { useState, useCallback } from 'react';
import { fetchRepos } from '../api';
import { debounce, throttle } from '../utils';
import { ToastContainer, toast } from 'react-toastify';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InfiniteScroll from 'react-infinite-scroll-component';

function Home() {
	const [searchInput, setSearchInput] = useState<string>('');
	const [repoData, setRepoData] = useState<RepoData[] | null>(null);
	const [pageNumber, setPageNumber] = useState<number>(1);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [sortBy, setSortBy] = useState<string>('stars-asc');
	const [totalItemsCount, setTotalItemsCount] = useState<number>(0);
	const [hasMoreData, setHasMoreData] = useState<boolean>(true);

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
						const finalArr: RepoData[] = data.items.map((item) => {
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
							const finalArr: RepoData[] = data.items.map((item) => {
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
						<Form.Select
							className='sort-select'
							value={sortBy}
							onChange={handleSort}>
							<option value='stars-asc'>Sort by: Stars (Low to High)</option>
							<option value='stars-desc'>Sort by: Stars (High to Low)</option>
							<option value='watchersCount-asc'>
								Sort by: Watchers Count (Low to High)
							</option>
							<option value='watchers_count-desc'>
								Sort by: Watchers Count (High to Low)
							</option>
							<option value='score-asc'>Sort by: Score (Low to high)</option>
							<option value='score-desc'>Sort by: Score (High to Low)</option>
							<option value='name-asc'>Sort by: Name</option>
							<option value='created_at-asc'>
								Sort by: CreatedAt (Latest First)
							</option>
							<option value='created_at-desc'>
								Sort by: CreatedAt (Oldest First)
							</option>
							<option value='updated_at-asc'>
								Sort by: UpdatedAt (Latest First)
							</option>
							<option value='updated_at-desc'>
								Sort by: UpdatedAt (Oldest First)
							</option>
						</Form.Select>
					</Col>
				</Row>

				{repoData && repoData.length > 0 && (
					<InfiniteScroll
						style={{ overflow: 'hidden' }}
						dataLength={repoData.length}
						next={() => {
							throttleQueryData(searchInput, true);
						}}
						scrollThreshold={0.9}
						hasMore={hasMoreData}
						loader={<Loading />}
						endMessage={
							<p style={{ textAlign: 'center' }}>
								<b>Yay! You have seen it all</b>
							</p>
						}>
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
					</InfiniteScroll>
				)}
				{isLoading && repoData?.length === 0 ? <Loading /> : null}

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
	watchersCount?: number;
	score?: number;
	createdAt?: string;
	updatedAt?: string;
}
export default Home;
