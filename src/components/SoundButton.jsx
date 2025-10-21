import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import charactersJson from '../assets/characters.json';
import "../styles/SoundButton.css"

function SoundButton({ isActive, isCorrect, ability, clickEffect }) {

    function getIcon() {
        if (isActive) return <FontAwesomeIcon icon={faPause} color="#d0d0d0"></FontAwesomeIcon>
        else if (isCorrect) return <FontAwesomeIcon icon={faCheck} color="#27a7dd"></FontAwesomeIcon>
        else if (isCorrect === false) return <FontAwesomeIcon icon={faXmark} color="#ff0000"></FontAwesomeIcon>
        else return <FontAwesomeIcon icon={faPlay} color="#27a7dd"></FontAwesomeIcon>
    }

   const [character, setCharacter] = useState(null); 
   const [audio, setAudio] = useState(null);

   useEffect(() =>
    {
        const char = charactersJson.find(char => char.abilities.includes(ability));
        setCharacter(char ? {
            name: char.name,
            portrait: char.portrait,
            ability: ability,
        } : console.error("ability not found"));
        // const url = import(`../assets/sound_effects/${ability}.ogg`).default;
        import(`../assets/sound_effects/${ability}.ogg`)
        .then(result => setAudio(new Audio(result.default)));
    }, [])

    useEffect(() =>{
        if(audio == null) return;
        isActive ? audio.play() : audio.pause();
    }, [isActive, audio])

    return (
        <div className="sound-effects__effect">
            <button className={"sound-effects__button"} onClick={clickEffect}>
                {getIcon()}
            </button>
            <div className="sound-effects__description">
                {isCorrect !== null && character !== null && (
                    <>
                        <img src={character.portrait} className="character-portrait" />
                        <span style={{ fontWeight: 600 }}>{ability}</span>
                    </>)}
            </div>
        </div>
    );
}

export default SoundButton;