import axios from 'axios';

export const fetchRepos = async (query: string, pageNumber: number) => {
	const fetchReposResp = await axios.get(
		`${
			import.meta.env.VITE_GITHUB_BASE_URL
		}search/repositories?q=${query}&page=${pageNumber}&per_page=50`,
		{
			headers: {
				Accept: 'application/vnd.github+json',
				Authorization: `Bearer ${import.meta.env.VITE_GITHUB_KEY}`,
			},
		}
	);
	return fetchReposResp;
};
