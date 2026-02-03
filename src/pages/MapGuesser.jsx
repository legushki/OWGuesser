import "../styles/ScreenshotGuesser.css";
import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCopy } from "@fortawesome/free-solid-svg-icons";
import MapsJson from "../assets/maps.json";
import { useEffect, useRef, useState } from "react";
import seedrandom from "seedrandom";
import MapSelect from "../components/MapSelect.jsx";
import Modal from "../components/Modal.jsx";
import Countdown from "../components/Countdown.jsx";
import Cookies from "js-cookie";

function MapGuesser() {
  const options = MapsJson.map((map) => ({
    value: map,
    label: map,
  }));

  var TOTAL_QUESTIONS = 3;

  const [todaysMaps, setTodaysMaps] = useState();
  const [selectedMap, setSelectedMap] = useState(options[0]);
  const [attempts, setAttempts] = useState([]);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const allImages = import.meta.glob("../assets/maps/*/*.{png,jpg,jpeg}");
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

    let maps = [];
    let mapImages = [];

    while (maps.length < TOTAL_QUESTIONS) {
      let map = options[Math.floor(rng() * options.length)];
      if (maps.includes(map)) continue;
      let filtered = Object.keys(allImages).filter((path) =>
        path.includes(`${map.value}/`),
      );
      if (filtered.length === 0) continue;
      maps.push(map);
      mapImages.push(filtered[Math.floor(rng() * filtered.length)]);
    }
    setTodaysMaps(maps);
    todaysImages.current = mapImages;

    loadImage(0);

    const cookie = Cookies.get("mapsAttempts");
    if (cookie) {
      const prevAttempts = JSON.parse(cookie);
      setAttempts(prevAttempts);
      loadImage(Math.min(prevAttempts.length, TOTAL_QUESTIONS - 1));
      if (prevAttempts.length === TOTAL_QUESTIONS) {
        setIsGameFinished(true);
        setIsModalOpen(true);
      }
    }
  }, []);

  const updateCookies = (attempts) => {
    const midnight = new Date();
    midnight.setUTCHours(23, 59, 59, 99);
    Cookies.set("mapsAttempts", JSON.stringify(attempts), {
      expires: midnight,
    });
  };

  const handleSubmit = () => {
    if (isGameFinished) {
      setIsModalOpen(true);
      return;
    }
    if (selectedMap === null) return;

    const newAttempts = [...attempts, selectedMap];
    if (newAttempts.length < TOTAL_QUESTIONS) {
      loadImage(newAttempts.length);
    } else {
      setIsGameFinished(true);
      setIsModalOpen(true);
    }
    setAttempts(newAttempts);
    updateCookies(newAttempts);
  };

  const loadImage = async (index) => {
    await allImages[todaysImages.current[index]]().then((result) =>
      setLoadedImage(result.default),
    );
    setSelectedImageIndex(index);
  };

  const getAttemptEmojis = () => {
    let emojis = "";
    for (let i = 0; i < attempts.length; i++)
      if (attempts[i].value === todaysMaps[i].value) emojis += "🟢";
      else emojis += "🔴";
    return emojis;
  };

  const [showClipboardMsg, setShowClipboardMsg] = useState(false);
  function ModalContent() {
    const onClipboardCopy = () => {
      const emojis = getAttemptEmojis();
      const clipboardText =
        "My attempt at guessing today's #OWGuesser map: \n" +
        emojis +
        "\nhttps://OWGuesser.com";
      navigator.clipboard.writeText(clipboardText);
      setShowClipboardMsg(true);
      setTimeout(() => setShowClipboardMsg(false), 1500);
    };

    return (
      <>
        <h2>RESULTS</h2>
        <span>The maps were:</span>
        <div className="answers-column">
          {todaysMaps.map((map, index) => (
            <h2 key={index}>{map.label}</h2>
          ))}
        </div>
        <div className="flex-row modal-details">
          <div className="your-tries">
            <span>Your guesses:</span>
            <br />
            <div className="attempt-icons">
              <span>{getAttemptEmojis()}</span>
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
      {isModalOpen && todaysMaps && (
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
          <h1>GUESS THE MAP</h1>
        </div>
        <img className="screenshot" src={loadedImage} />
        <div className="image-select-buttons">
          {Array.from({ length: TOTAL_QUESTIONS }).map((_, index) => {
            let classname = "";
            if (selectedImageIndex === index) classname += "active ";
            if (attempts[index] != undefined)
              classname +=
                attempts[index].value === todaysMaps[index].value
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
        <MapSelect
          options={options}
          selectedOption={selectedMap}
          onOptionSelect={(map) => setSelectedMap(map)}
        />
        <button className="btn" onClick={handleSubmit}>
          {isGameFinished ? "RESULTS" : "SUBMIT"}
        </button>
      </div>
    </>
  );
}

export default MapGuesser;
