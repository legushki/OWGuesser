import '../styles/GamemodeButton.css'
import { Link } from 'react-router';


function GamemodeButton ({image, title, desc, url})
{
    return (
    <Link to={url}>
        <div className="gamemode-button">
                <div className="gamemode-image-bar">
                    <img src={`/icons/${image}`} alt="" />
                </div>
                <div className='description-bar'>
                    <h1>{title}</h1>
                    <p>{desc}</p>
                </div>
        </div>
    </Link>
    )
}

export default GamemodeButton;
