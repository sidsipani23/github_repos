import InfiniteScroll from 'react-infinite-scroll-component';
import Loading from './Loading';
import RepoCard from './RepoCard';

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
interface InfiniteScrolling {
	repoData: RepoData[] | null;
	throttleQueryData: (...args: any[]) => void;
	searchInput: string;
	hasMoreData: boolean;
}

function InfiniteScrolling({
	repoData,
	throttleQueryData,
	searchInput,
	hasMoreData,
}: InfiniteScrolling) {
	return (
		<>
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
						<p style={{ textAlign: 'center', margin: '1rem' }}>
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
		</>
	);
}

export default InfiniteScrolling;
