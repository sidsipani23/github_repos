import { Navbar, Container } from 'react-bootstrap';
import GitHubIcon from '../assets/GitHubIcon.svg';
function NavbarComp() {
	return (
		<>
			<Navbar className='bg-body-tertiary' sticky='top'>
				<Container>
					<div className='nav-div'>
						<img
							alt='github-icon'
							src={GitHubIcon}
							width='30'
							height='30'
							className='d-inline-block align-top'
						/>{' '}
						<span className='nav-title'>GitHub Repos</span>
					</div>
				</Container>
			</Navbar>
		</>
	);
}

export default NavbarComp;
