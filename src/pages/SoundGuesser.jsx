import "../styles/SoundGuesser.css";
import { customSelectStyles } from "../styles/CustomSelectStyles";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCopy } from "@fortawesome/free-solid-svg-icons";
import SoundButton from "../components/SoundButton";
import Select from "react-select";
import Modal from "../components/Modal";
import Countdown from "../components/Countdown";
import CharacterSelect from "../components/CharacterSelect";
import CharactersJson from "../assets/characters.json";
import RecordedAbilitiesJson from "../assets/recordedAbilities.json";
import seedrandom from "seedrandom";
import Cookies from "js-cookie";

function SoundGuesser() {
  const [buttonStates, setButtonStates] = useState(
    Array.from({ length: 4 }, () => ({ isActive: false, isCorrect: null }))
  );
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [selectedAbility, setSelectedAbility] = useState(null);
  const [isGameFinished, setIsGameFinished] = useState(false);

  const [lastPickedButton, setLastPickedButton] = useState({
    ability: null,
    index: null,
  });

  const characterOptions = CharactersJson.map((hero) => ({
    value: hero.key,
    label: hero.name,
    portrait: hero.portrait,
  }));
  const [abilityOptions, setAbilityOptions] = useState([]);
  const [randomAbilities, setRandomAbilities] = useState([]);
  const [attempts, setAttempts] = useState([null, null, null, null]);

  useEffect(() => {
    const today = new Date();
    const rng = seedrandom(
      today.getUTCFullYear() * 10000 +
        (today.getUTCMonth() + 1) * 100 +
        today.getUTCDate()
    );
    let abilities = [];
    let recorded = [...RecordedAbilitiesJson];
    let failsafe = 0;
    while (abilities.length < 4 && failsafe < 1000) {
      const name = recorded[Math.floor(rng() * recorded.length)];
      const char = CharactersJson.find((c) => c.abilities.includes(name));
      if (!abilities.some((ability) => ability.name === name)) {
        abilities = [...abilities, { name: name, character: char }];
      }
      failsafe++;
    }
    setRandomAbilities(abilities);

    const cookie = Cookies.get("soundAttempts");
    if (cookie) {
      const prevAttempts = JSON.parse(cookie);
      setAttempts(prevAttempts);
      let newStates = [...buttonStates];
      prevAttempts.forEach((attempt, index) => {
        newStates[index].isCorrect =
          attempt && attempt === abilities[index].name;
      });
      setButtonStates(newStates);
      if (prevAttempts.every((attempt) => attempt !== null)) {
        setIsGameFinished(true);
        setIsModalOpen(true);
      }
    }
  }, []);

  const updateCookies = (attempts) => {
    const midnight = new Date();
    midnight.setUTCHours(23, 59, 59, 99);
    Cookies.set("soundAttempts", JSON.stringify(attempts), {
      expires: midnight,
    });
  };

  const onCharacterSelect = (character) => {
    setSelectedCharacter(character);
    setSelectedAbility(null);
    let abilities = CharactersJson.find(
      (hero) => hero.key == character.value
    ).abilities;
    setAbilityOptions(
      abilities.map((ability) => ({ value: ability, label: ability }))
    );
  };
  const onAbilitySelect = (ability) => setSelectedAbility(ability);

  const handleClick = async (ability, index) => {
    setLastPickedButton({ ability: ability, index: index });

    const newStates = buttonStates.map((state, i) =>
      index === i
        ? { ...state, isActive: !state.isActive }
        : { ...state, isActive: false }
    );
    setButtonStates(newStates);
  };

  const handleSubmit = () => {
    if (isGameFinished) {
      setIsModalOpen(true);
      return;
    }
    if (!selectedAbility || !lastPickedButton.ability) return;
    if (buttonStates[lastPickedButton.index].isCorrect !== null) return;

    let newStates = [...buttonStates];
    newStates[lastPickedButton.index].isCorrect =
      selectedAbility.value === lastPickedButton.ability.name;
    newStates[lastPickedButton.index].isActive = false;

    let updatedAttempts = [...attempts];
    updatedAttempts[lastPickedButton.index] = selectedAbility.value;
    updateCookies([...updatedAttempts]);
    setAttempts([...updatedAttempts]);
    setButtonStates(newStates);

    if (updatedAttempts.every((attempt) => attempt !== null)) {
      setIsGameFinished(true);
      setIsModalOpen(true);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showClipboardMsg, setShowClipboardMsg] = useState(false);
  function ModalContent() {
    const onClipboardCopy = () => {
      let emojis = "";
      attempts.forEach((attempt, index) => {
        if (attempt == randomAbilities[index].name) emojis += "✅";
        else emojis += "❌";
      });
      
      navigator.clipboard.writeText(clipboardText);
      setShowClipboardMsg(true);
      setTimeout(() => setShowClipboardMsg(false), 1500);
    };

    let attemptPortraits = [];
    attempts.forEach((attempt) => {
      attemptPortraits.push(
        CharactersJson.find((char) => char.abilities.includes(attempt)).portrait
      );
    });

    return (
      <>
        <h2 style={{ marginBottom: 0 }}>Results:</h2>
        <div className="your-tries">
          <table className="results-table">
            <tbody>
              {randomAbilities.map((ability, index) => (
                <tr key={index}>
                  <td>
                    <img
                      src={ability.character.portrait}
                      className="character-portrait"
                    />
                    <span>{ability.name}</span>
                  </td>
                  <td>
                    <img
                      src={attemptPortraits[index]}
                      className="character-portrait"
                    />
                    <span>{attempts[index]}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="timer">
          <span>Until next game:</span>
          <br />
          <Countdown />
        </div>
        <div className="flex-row modal-button-row">
          <button className="btn secondary" onClick={onClipboardCopy}>
            SHARE
          </button>
          <Link to={"/"}>
            <button className="btn">OTHER GAMES</button>
          </Link>
        </div>
        {showClipboardMsg && (
          <>
            <div className="clipboard-text">
              <FontAwesomeIcon icon={faCopy} />
              <span>Copied to clipboard</span>
            </div>
          </>
        )}
      </>
    );
  }

  return (
    <>
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>{ModalContent()}</Modal>
      )}
      <div className="gamemode-header">
        <div className="back-button">
          <Link to={"/"}>
            <FontAwesomeIcon
              icon={faArrowLeft}
              size="4x"
              color="#d0d0d0"
            ></FontAwesomeIcon>
          </Link>
        </div>
        <h1>GUESS THE ABILITIES</h1>
      </div>
      <div className="sound-effects">
        {randomAbilities &&
          buttonStates.map((state, index) => (
            <SoundButton
              isCorrect={state.isCorrect}
              key={index}
              isActive={state.isActive}
              ability={randomAbilities[index]}
              clickEffect={() => handleClick(randomAbilities[index], index)}
            ></SoundButton>
          ))}
      </div>
      <div className="ability-selection">
        <CharacterSelect
          selectedCharacter={selectedCharacter}
          characterOptions={characterOptions}
          onCharacterSelect={onCharacterSelect}
        ></CharacterSelect>
        <Select
          styles={customSelectStyles}
          className="select"
          options={abilityOptions}
          onChange={onAbilitySelect}
          placeholder="Select an ability..."
          value={selectedAbility}
        ></Select>
      </div>
      <button className="btn" onClick={handleSubmit}>
        {isGameFinished ? "RESULTS" : "SUBMIT"}
      </button>
    </>
  );
}

export default SoundGuesser;
