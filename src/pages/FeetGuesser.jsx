import "../styles/ScreenshotGuesser.css";
import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCopy } from "@fortawesome/free-solid-svg-icons";
import CharactersJson from "../assets/characters.json";
import { useEffect, useState } from "react";
import seedrandom from "seedrandom";
import CharacterSelect from "../components/CharacterSelect.jsx";
import Modal from "../components/Modal.jsx";
import Countdown from "../components/Countdown.jsx";

function FeetGuesser() {
  const characterOptions = CharactersJson.map((char) => ({
    value: char.key,
    label: char.name,
    portrait: char.portrait,
  }));

  const [character, setCharacter] = useState();
  const [selectedCharacter, setSelectedCharacter] = useState(
    characterOptions[0]
  );
  const [attempts, setAttempts] = useState([]);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);

  const allImages = import.meta.glob("../assets/feet/*/*.{png,jpg,jpeg}");
  const [image, setImage] = useState();
  useEffect(() => {
    const char = {
      value: "lucio",
      portrait: characterOptions[19].portrait,
      label: "Lucio",
    }; // TODO: choose randomly later
    setCharacter(char);
    const characterImages = Object.keys(allImages).filter((path) =>
      path.includes(`${char.value}/`)
    );

    const today = new Date();
    const rng = seedrandom(
      today.getUTCFullYear() * 10000 +
        (today.getUTCMonth() + 1) * 100 +
        today.getUTCDate()
    );
    const imgNum = Math.floor(rng() * characterImages.length);
    console.log(characterImages[imgNum]);
    loadImage(characterImages[imgNum]);
  }, []);

  const handleSubmit = () => {
    if(isGameFinished)
    {
      setIsModalOpen(true);
      return;
    }
    if (
      selectedCharacter === null ||
      attempts.length >= 5 ||
      attempts.find((char) => char.value === selectedCharacter.value)
    )
      return;

    setAttempts([...attempts, selectedCharacter]);
    // TODO:cookie
    if (selectedCharacter.value == character.value) {
      setIsGameFinished(true);
      setIsModalOpen(true);
    }
  };

  const onCharacterSelect = (char) => setSelectedCharacter(char);

  const loadImage = async (key) =>
    await allImages[key]().then((result) => setImage(result.default));

  const [showClipboardMsg, setShowClipboardMsg] = useState(false);
  function ModalContent() {
    const isVictory = attempts.length <= 5;
    const onClipboardCopy = () => {
      let emojis = "";
      for(let i = 0; i<attempts.length - 1; i++) emojis+="🟥";
      emojis += "🟩";
      for(let i = emojis.length / 2; i<5; i++) emojis+="⬜";
      const clipboardText = emojis;
      navigator.clipboard.writeText(clipboardText);
      setShowClipboardMsg(true);
      setTimeout(() => setShowClipboardMsg(false), 1500);
    };

    return (
      <>
        <h2>{isVictory ? "You Won!" : "You Lost :("}</h2>
        <div className="your-guess flex-row">
          <img
            src={character.portrait}
            className="big-character-portrait"
            style={{ width: "5em" }}
          />
          <span>
            The character is:
            <br />
            {character.label}
          </span>
        </div>
        <div className="flex-row" style={{ width: "100%" }}>
          <div className="your-tries">
            <span>Your tries:</span>
            <br />
            <div className="attempt-icons">
              {attempts.map((char, key) => (
                <img
                  src={char.portrait}
                  key={key}
                  className="character-portrait"
                />
              ))}
            </div>
          </div>
          <div className="vertical-divider" />
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
      {isModalOpen && character && (
        <Modal onClose={() => setIsModalOpen(false)}>{ModalContent()}</Modal>
      )}
      <div className="gamemode-header">
        <div className="back-button">
          <Link to="/">
            <FontAwesomeIcon
              icon={faArrowLeft}
              size="4x"
              color="#d0d0d0"
            ></FontAwesomeIcon>
          </Link>
        </div>
        <h1>GUESS THE CHARACTER</h1>
      </div>
      <img className="screenshot" src={image} />
      <CharacterSelect
        selectedCharacter={selectedCharacter}
        characterOptions={characterOptions}
        onCharacterSelect={onCharacterSelect}
      ></CharacterSelect>
      <button className="btn" onClick={handleSubmit}>
        {isGameFinished ? "RESULTS" : "SUBMIT"}
      </button>
      <div className="flex-column">
        <span className="attempt-counter">
          {"Attempts: " + attempts.length + "/5"}
        </span>
        <div className="attempt-icons">
          {attempts.map((char, index) => {
            return (
              <img
                key={index}
                className="character-portrait"
                src={char.portrait}
              ></img>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default FeetGuesser;
