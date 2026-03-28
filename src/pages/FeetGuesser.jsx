import "../styles/ScreenshotGuesser.css";
import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCopy } from "@fortawesome/free-solid-svg-icons";
import CharactersJson from "../assets/characters.json";
import { useEffect, useRef, useState } from "react";
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

  var TOTAL_QUESTIONS = 3;

  const [todaysCharacters, setTodaysCharacters] = useState();
  const [selectedCharacter, setSelectedCharacter] = useState();
  const [attempts, setAttempts] = useState([]);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const allImages = import.meta.glob("../assets/feet/*/*.webp");
  const todaysImages = useRef([]);
  const [loadedImage, setLoadedImage] = useState();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const today = new Date();
    const rng = seedrandom(
      today.getUTCFullYear() * 10000 +
        (today.getUTCMonth() + 1) * 100 +
        today.getUTCDate(),
    );

    let chars = [];
    let charImages = [];

    let failsafe = 0;
    while (chars.length < TOTAL_QUESTIONS) {
      failsafe++;
      if(failsafe >= 10000)
      {
        alert("something went wrong :(");
        break;
      }
      let char = options[Math.floor(rng() * options.length)];
      if (chars.includes(char)) continue;
      let filtered = Object.keys(allImages).filter((path) =>
        path.toLowerCase().includes(`${char.value.toLowerCase()}/`),
      );
      if (filtered.length === 0) continue;
      chars.push(char);
      charImages.push(filtered[Math.floor(rng() * filtered.length)]);
    }
    setTodaysCharacters(chars);
    todaysImages.current = charImages;

    //preload images
    setTimeout(() => {
      for (let i = 0; i < TOTAL_QUESTIONS; i++)
        allImages[todaysImages.current[i]]();
    }, 0);

    loadImage(0);

    const cookie = Cookies.get("feetAttempts");
    if (cookie) {
      const prevAttempts = JSON.parse(cookie);
      setAttempts(prevAttempts);
      loadImage(Math.min(prevAttempts.length, TOTAL_QUESTIONS - 1));
      if (prevAttempts.length === TOTAL_QUESTIONS) {
        setIsGameFinished(true);
        // setIsModalOpen(true);
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
    if (!selectedCharacter) return;

    const newAttempts = [...attempts, selectedCharacter];
    if (newAttempts.length < TOTAL_QUESTIONS) {
      loadImage(newAttempts.length);
    } else {
      setIsGameFinished(true);
      setIsModalOpen(true);
    }
    setSelectedCharacter(null);
    setAttempts(newAttempts);
    updateCookies(newAttempts);
  };

  const loadImage = async (index) => {
    await allImages[todaysImages.current[index]]().then((result) =>
      setLoadedImage(result.default),
    );
    setSelectedImageIndex(index);
  };

  const [showClipboardMsg, setShowClipboardMsg] = useState(false);
  function ModalContent() {
    const onClipboardCopy = () => {
      let emojis = "";
      for (let i = 0; i < attempts.length; i++)
        if (attempts[i].value === todaysCharacters[i].value) emojis += "🟢";
        else emojis += "🔴";
      const clipboardText =
        "My attempt at guessing today's #OWGuesser character: \n" +
        emojis +
        "\nhttps://OWGuesser.com";
      navigator.clipboard.writeText(clipboardText);
      
      setShowClipboardMsg(true);
      setTimeout(() => setShowClipboardMsg(false), 1500);
    };

    return (
    <>
        <h2>RESULTS</h2>
        <span>The characters were:</span>
        <div className="answers-row">
          {todaysCharacters.map((char, index) => (
            <img
              className="big-character-portrait"
              src={char.portrait}
              key={index}
            />
          ))}
        </div>
        <div className="flex-row modal-details">
          <div className="your-tries">
            <span>Your guesses:</span>
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
      {isModalOpen && todaysCharacters && (
        <Modal onClose={() => setIsModalOpen(false)}>{ModalContent()}</Modal>
      )}
      <div className="gamemode">
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
        <img className="screenshot" src={loadedImage} />
        <div className="image-select-buttons">
          {Array.from({ length: TOTAL_QUESTIONS }).map((_, index) => {
            let classname = "";
            if (selectedImageIndex === index) classname += "active ";
            if (attempts[index] != undefined)
              classname +=
                attempts[index].value === todaysCharacters[index].value
                  ? "correct"
                  : "incorrect";
            return (
              <button
                disabled={index > attempts.length}
                className={classname.trim() || undefined}
                key={index}
                onClick={() => loadImage(index)}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
        <CharacterSelect
          selectedCharacter={selectedCharacter}
          characterOptions={options}
          onCharacterSelect={(char) => setSelectedCharacter(char)}
        ></CharacterSelect>
        <button className="btn" onClick={handleSubmit}>
          {isGameFinished ? "RESULTS" : "SUBMIT"}
        </button>
      </div>
    </>
  );
}

export default FeetGuesser;
