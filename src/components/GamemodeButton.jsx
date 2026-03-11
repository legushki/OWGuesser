import '../styles/GamemodeButton.css'
import { Link } from 'react-router';


function GamemodeButton({ title, desc, url }) {
    return (
        <Link to={url} className="gamemode-button">
                <div className="gamemode-image-bar" />
                <div className='description-bar'>
                    <h1>{title}</h1>
                    <p>{desc}</p>
                </div>
        </Link>
    )
}

export default GamemodeButton;
