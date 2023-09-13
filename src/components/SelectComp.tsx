import Form from 'react-bootstrap/Form';

function SelectComp({ sortBy, handleSort }: SelectCompProps) {
	return (
		<>
			<Form.Select className='sort-select' value={sortBy} onChange={handleSort}>
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
		</>
	);
}
interface SelectCompProps {
	sortBy: string;
	handleSort: (event: React.ChangeEvent) => Promise<void>;
}
export default SelectComp;
