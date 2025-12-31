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
import Cookies from "js-cookie";

function FeetGuesser() {
  const options = CharactersJson.map((char) => ({
    value: char.key,
    label: char.name,
    portrait: char.portrait,
  }));

  const [character, setCharacter] = useState();
  const [selectedCharacter, setSelectedCharacter] = useState(
    options[0]
  );
  const [attempts, setAttempts] = useState([]);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const allImages = import.meta.glob("../assets/feet/*/*.{png,jpg,jpeg}");
  const [image, setImage] = useState();
  useEffect(() => {
    const today = new Date();
    const rng = seedrandom(
      today.getUTCFullYear() * 10000 +
        (today.getUTCMonth() + 1) * 100 +
        today.getUTCDate()
    );

    let char = null;
    let charImages = [];
  
    while (charImages.length === 0) {
      char = options[Math.floor(rng() * options.length)];
      charImages = Object.keys(allImages).filter((path) =>
        path.includes(`${char.value}/`)
      );
    }
    setCharacter(char);
    const imgNum = Math.floor(rng() * charImages.length);
    loadImage(charImages[imgNum]);

    const cookie = Cookies.get("feetAttempts");
    if (cookie) {
      const prevAttempts = JSON.parse(cookie);
      setAttempts(prevAttempts);
      if (prevAttempts[prevAttempts.length - 1].value == char.value) {
        setIsGameFinished(true);
        setIsModalOpen(true);
      }
    }
  }, []);

  const updateCookies = (attempts) => {
    const midnight = new Date();
    midnight.setUTCHours(23, 59, 59, 99);
    Cookies.set("feetAttempts", JSON.stringify(attempts), {
      expires: midnight,
    });
  };

  const handleSubmit = () => {
    if (isGameFinished) {
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
    updateCookies([...attempts, selectedCharacter]);

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
      for (let i = 0; i < attempts.length - 1; i++) emojis += "🟥";
      emojis += "🟩";
      for (let i = emojis.length / 2; i < 5; i++) emojis += "⬜";
      const clipboardText = "My attempt at guessing today's #OWGuesser character: \n" + emojis + "\nhttps://OWGuesser.com";
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
        characterOptions={options}
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
