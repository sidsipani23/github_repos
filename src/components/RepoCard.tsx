import Card from 'react-bootstrap/Card';
import StarIcon from '../assets/StarIcon.svg';
interface RepoCardProps {
	userName?: string;
	repoName?: string;
	avatar?: string;
	stars?: number;
	description?: string;
	languages?: string;
}
function RepoCard({
	userName,
	repoName,
	avatar,
	stars,
	description,
	languages,
}: RepoCardProps) {
	return (
		<>
			<Card className='repocard'>
				<Card.Header className='repocard-header'>
					<div>
						<img src={avatar} alt='avatar' height='25rem' />
						<span>{userName}</span>
					</div>
					<div>
						<span>{stars}</span> <img src={StarIcon} className='star-icon' />
					</div>
				</Card.Header>
				<Card.Body>
					<Card.Title>{repoName}</Card.Title>
					<Card.Text>
						{description && description?.length > 150
							? `${description?.slice(-150)}...`
							: description}
					</Card.Text>
				</Card.Body>
				{languages ? (
					<Card.Footer>
						<Card.Text>
							<b>Language Used:</b> {languages}
						</Card.Text>
					</Card.Footer>
				) : (
					''
				)}
			</Card>
		</>
	);
}

export default RepoCard;
