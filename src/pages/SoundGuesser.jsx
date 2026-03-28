import "../styles/SoundGuesser.css";
import { customSelectStyles } from "../styles/CustomSelectStyles";
import { Link } from "react-router";
import { useEffect, useRef, useState } from "react";
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
  var TOTAL_QUESTIONS = 4;

  const [buttonStates, setButtonStates] = useState(
    Array.from({ length: TOTAL_QUESTIONS }, () => ({ isActive: false, isCorrect: null })),
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
  const [todaysAbilities, setTodaysAbilities] = useState([]);
  const [attempts, setAttempts] = useState(Array.from({ length: TOTAL_QUESTIONS }, () => null));

  useEffect(() => {
    // const today = new Date();
    // const rng = seedrandom(
    //   today.getUTCFullYear() * 10000 +
    //   (today.getUTCMonth() + 1) * 100 +
    //   today.getUTCDate(),
    // );
    // let abilities = [];
    // let recorded = [...RecordedAbilitiesJson];
    // let failsafe = 0;
    // while (abilities.length < TOTAL_QUESTIONS && failsafe < 1000) {
    //   const name = recorded[Math.floor(rng() * recorded.length)];

    //   const char = CharactersJson.find((c) =>
    //     c.abilities.map(n => n.toLowerCase()).includes(name.toLowerCase()));
    //   if (char == undefined) continue;
    //   if (!abilities.some((ability) => ability.name.toLowerCase() == name.toLowerCase())) {
    //     abilities = [...abilities, { name: name, character: char }];
    //   }
    //   failsafe++;
    // }
    const abilities = chooseAbilities();
    setTodaysAbilities(abilities);

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
        // setIsModalOpen(true);
      }
    }
  }, []);

  const chooseAbilities = () => {
    const today = new Date();
    const rng = seedrandom(
      today.getUTCFullYear() * 10000 +
      (today.getUTCMonth() + 1) * 100
    );
    let recorded = [...RecordedAbilitiesJson];
    //random shuffle based on current month
    for (let i = recorded.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));

      [recorded[i], recorded[j]] = [recorded[j], recorded[i]];
    }
    let startingIndex = ((today.getUTCDate() - 1) * TOTAL_QUESTIONS) % recorded.length;

    let chosenAbilities = [];
    let steps = TOTAL_QUESTIONS;
    for (let i = 0; i < steps; i++) {
      const name = recorded[(startingIndex + i) % recorded.length];
      const char = CharactersJson.find((c) =>
        c.abilities.map(n => n.toLowerCase()).includes(name.toLowerCase()));
      if (char == undefined) {
        console.error("error finding an ability, retrying");
        steps +=1;
        continue;
      }
      chosenAbilities.push({ name: name, character: char });
    }
    return chosenAbilities;
  }

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
      (hero) => hero.key == character.value,
    ).abilities;
    setAbilityOptions(
      abilities.map((ability) => ({ value: ability, label: ability })),
    );
  };
  const onAbilitySelect = (ability) => setSelectedAbility(ability);

  const timeoutRef = useRef();
  const handleClick = async (ability, index, duration) => {
    setLastPickedButton({ ability: ability, index: index });

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      const newStates = buttonStates.map((state) => ({
        ...state,
        isActive: false,
      }));
      setButtonStates(newStates);
    }, duration * 1000);

    const newStates = buttonStates.map((state, i) =>
      index === i
        ? { ...state, isActive: !state.isActive }
        : { ...state, isActive: false },
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
        if (attempt == todaysAbilities[index].name) emojis += "✅";
        else emojis += "❌";
      });
      const clipboardText =
        "My attempt at guessing today's #OWGuesser sound effects: \n" +
        emojis +
        "\nhttps://OWGuesser.com";
      navigator.clipboard.writeText(clipboardText);
      setShowClipboardMsg(true);
      setTimeout(() => setShowClipboardMsg(false), 1500);
    };

    let attemptPortraits = [];
    attempts.forEach((attempt) => {
      attemptPortraits.push(
        CharactersJson.find((char) => char.abilities.includes(attempt))
          .portrait,
      );
    });

    return (
      <>
        <h2 style={{ marginBottom: 0 }}>RESULTS</h2>
        <div className="your-tries">
          <table className="results-table">
            <tbody>
              {todaysAbilities.map((ability, index) => (
                <tr key={index}>
                  <td>
                    <div>
                      <img
                        src={ability.character.portrait}
                        className="character-portrait"
                      />
                      <span>{ability.name}</span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <img
                        src={attemptPortraits[index]}
                        className="character-portrait"
                      />
                      <span
                        className={
                          attempts[index] !== todaysAbilities[index].name
                            ? "incorrect-text"
                            : undefined
                        }
                      >
                        {attempts[index]}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="modal-details">
          <div className="timer">
            <span>Until next game:</span>
            <br />
            <Countdown />
          </div>
        </div>
        <div className="flex-row modal-button-row">
          <button className="btn secondary" onClick={onClipboardCopy}>
            SHARE
          </button>
          <Link to={"/"}>
            <button className="btn" tabIndex={-1}>OTHER GAMES</button>
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
      <div className="gamemode">
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
          {todaysAbilities &&
            buttonStates.map((state, index) => (
              <SoundButton
                isCorrect={state.isCorrect}
                key={index}
                isActive={state.isActive}
                ability={todaysAbilities[index]}
                clickEffect={(duration) =>
                  handleClick(todaysAbilities[index], index, duration)
                }
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
      </div>
    </>
  );
}

export default SoundGuesser;
