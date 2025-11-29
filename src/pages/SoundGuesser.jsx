import '../styles/SoundGuesser.css'
import { Link } from "react-router"
import { useEffect, useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import SoundButton from "../components/SoundButton"
import Select from "react-select"
import CharactersJson from '../assets/characters.json'
import { customSelectStyles } from '../styles/CustomSelectStyles'

function SoundGuesser() {

    const stateTemplate = {
        isActive: false,
        isCorrect: null
    }

    const [buttonStates, setButtonStates] = useState(Array.from({ length: 4 }, () => stateTemplate));
    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const [selectedAbility, setSelectedAbility] = useState(null);

    const characters = CharactersJson;
    const characterOptions = characters.map(hero => ({ value: hero.key, label: hero.name, portrait: hero.portrait }));
    const [abilityOptions, setAbilityOptions] = useState([]);

    const onCharacterSelect = (character) => {
        setSelectedCharacter(character);
        setSelectedAbility(null);
        let abilities = characters.find(hero => hero.key == character.value).abilities;
        setAbilityOptions(abilities.map(ability => ({ value: ability, label: ability })));
    }
    const onAbilitySelect = (ability) => setSelectedAbility(ability);

    const [lastPickedAbility, setLastPickedAbility] = useState({ value: null, index: null });

    const handleClick = async (ability, index, sound) => {
        setLastPickedAbility({ value: ability, index: index });

        const newStates = buttonStates.map((state, i) =>
            (index === i ? { ...state, isActive: !state.isActive } : { ...state, isActive: false }));
        setButtonStates(newStates);
    }

    const handleSubmit = () => {
        if (!selectedAbility || !lastPickedAbility.value) return;

        let newStates = [...buttonStates];
        newStates[lastPickedAbility.index].isCorrect = selectedAbility.value === lastPickedAbility.value;
        newStates[lastPickedAbility.index].isActive = false;
        setButtonStates(newStates);
    }

    return (
        <>
            <div className="gamemode-header">
                <div className="back-button">
                    <Link to={"/"}>
                        <FontAwesomeIcon icon={faArrowLeft} size="4x" color="#d0d0d0"></FontAwesomeIcon>
                    </Link>
                </div>
                <h1>GUESS THE ABILITIES</h1>
            </div>
            <div className="sound-effects">
                {
                    buttonStates.map((state, index) => {
                        const ability = "Sound Barrier";
                        return (
                            <SoundButton isCorrect={state.isCorrect} key={index} isActive={state.isActive} ability={ability}
                                clickEffect={() => handleClick(ability, index)} ></SoundButton>
                        );
                    })
                }
            </div>
            <div className="ability-selection">
                <Select styles={{...customSelectStyles, indicatorsContainer: () => ({ display: "none" })}}
                    className='select' options={characterOptions} onChange={onCharacterSelect}
                    placeholder="Search for a character..." value={selectedCharacter}
                    formatOptionLabel={(character) => (
                        <div className='character-option'>
                            <img className='character-portrait' src={`${character.portrait}`} />
                            <span>{character.label}</span>
                        </div>
                    )}></Select>
                <Select styles={customSelectStyles} 
                    className='select' options={abilityOptions} onChange={onAbilitySelect}
                    placeholder="Select an ability..." value={selectedAbility}></Select>
            </div>
            <button className='btn' onClick={handleSubmit}>SUBMIT</button>
        </>
    );
}

export default SoundGuesser;