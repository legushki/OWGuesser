import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import CharactersJson from '../assets/characters.json'
import { customSelectStyles } from '../styles/CustomSelectStyles'
import { useEffect, useState } from "react";
import Random from '../prng.js'

function FeetGuesser() {

    const characterOptions = CharactersJson.map(char => ({ value: char.key, label: char.name, portrait: char.portrait }));
    
    const [character, setCharacter] = useState();
    const [selectedCharacter, setSelectedCharacter] = useState();
    
    const handleSubmit = () => {
        console.log(selectedCharacter);
    }

    const onCharacterSelect = (char) =>
        setSelectedCharacter(char);

    const allImages = import.meta.glob('../assets/feet/*/*.{png,jpg,jpeg}');
    const [image, setImage] = useState();

    const loadImage = async (key) =>
        await allImages[key]().then(result => setImage(result.default));

    useEffect(() =>
    {
        const char = "lucio"; //choose randomly later
        setCharacter(char);
        const characterImages = Object.keys(allImages)
            .filter(path => path.includes(`${char}/`));

        const today = new Date();
        const rng = new Random(today.getUTCFullYear() * 10000 + (today.getUTCMonth() + 1) * 100 + today.getUTCDate());
        const imgNum = Math.floor(rng.nextFloat() * characterImages.length);
        console.log(characterImages[imgNum]);
        loadImage(characterImages[imgNum]);
        
        
    }, [])

    
    return (
        <>
            <div className="gamemode-header">
                <div className="back-button">
                    <Link to={"/"}>
                        <FontAwesomeIcon icon={faArrowLeft} size="4x" color="#d0d0d0"></FontAwesomeIcon>
                    </Link>
                </div>
                <h1>GUESS THE CHARACTER</h1>
            </div>

            <img className="main-image" src={image} />
            
            <Select styles={{ ...customSelectStyles, indicatorsContainer: () => ({ display: "none" }) }}
                className='select' options={characterOptions}
                value = {selectedCharacter} onChange={onCharacterSelect}
                placeholder="Search for a character..." 
                formatOptionLabel={(char) => (
                    <div className='character-option'>
                        <img className='character-portrait' src={`${char.portrait}`} />
                        <span>{char.label}</span>
                    </div>
                )}/>
            <button className='submit' onClick={handleSubmit}>SUBMIT</button>
        </>
    );
}

export default FeetGuesser;