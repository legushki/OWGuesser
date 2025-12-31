import "../styles/ScreenshotGuesser.css";
import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCopy } from "@fortawesome/free-solid-svg-icons";
import MapsJson from "../assets/maps.json";
import { useEffect, useState } from "react";
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

  const [map, setMap] = useState();
  const [selectedMap, setSelectedMap] = useState();
  const [attempts, setAttempts] = useState([]);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const allImages = import.meta.glob("../assets/maps/*/*.{png,jpg,jpeg}");
  const [image, setImage] = useState();
  useEffect(() => {
    const today = new Date();
    const rng = seedrandom(
      today.getUTCFullYear() * 10000 +
        (today.getUTCMonth() + 1) * 100 +
        today.getUTCDate()
    );

    let map = null;
    let mapImages = [];
    while (mapImages.length === 0) {
      map = MapsJson[Math.floor(rng() * MapsJson.length)];
      mapImages = Object.keys(allImages).filter((path) =>
        path.includes(`${map}/`)
      );
    }

    setMap({ value: map, label: map });

    const imgNum = Math.floor(rng() * mapImages.length);
    loadImage(mapImages[imgNum]);

    const cookie = Cookies.get("mapsAttempts");
    if (cookie) {
      const prevAttempts = JSON.parse(cookie);
      setAttempts(prevAttempts);
      if (prevAttempts[prevAttempts.length - 1].value == map) {
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
    if (
      selectedMap === null ||
      attempts.length >= 5 ||
      attempts.find((map) => map.value === selectedMap.value)
    )
      return;

    setAttempts([...attempts, selectedMap]);
    updateCookies([...attempts, selectedMap]);

    if (selectedMap.value == map.value) {
      setIsGameFinished(true);
      setIsModalOpen(true);
    }
  };

  const onMapSelect = (map) => setSelectedMap(map);

  const loadImage = async (key) =>
    await allImages[key]().then((result) => setImage(result.default));

  const getAttemptEmojis = () => {
    let emojis = "";
    for (let i = 0; i < attempts.length - 1; i++) emojis += "🔴";
    emojis += "🟢";
    for (let i = emojis.length / 2; i < 5; i++) emojis += "⚪";

    return emojis;
  };

  const [showClipboardMsg, setShowClipboardMsg] = useState(false);
  function ModalContent() {
    const isVictory = attempts[attempts.length - 1].value === map.value;
    const onClipboardCopy = () => {
      const emojis = getAttemptEmojis();
      const clipboardText = "My attempt at guessing today's #OWGuesser map: \n" + emojis + "\nhttps://OWGuesser.com";
      navigator.clipboard.writeText(clipboardText);
      setShowClipboardMsg(true);
      setTimeout(() => setShowClipboardMsg(false), 1500);
    };

    return (
      <>
        <h2>{isVictory ? "You Won!" : "You Lost :("}</h2>
        <div className="your-guess flex-row">
          <span>
            The map is:
            <br />
            {map.label}
          </span>
        </div>
        <div className="flex-row" style={{ width: "100%" }}>
          <div className="your-tries">
            <span>Your tries:</span>
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
      {isModalOpen && map && (
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
        <h1>GUESS THE MAP</h1>
      </div>
      <img className="screenshot" src={image} />
      <MapSelect
        options={options}
        selectedOption={selectedMap}
        onOptionSelect={onMapSelect}
      />
      <button className="btn" onClick={handleSubmit}>
        {isGameFinished ? "RESULTS" : "SUBMIT"}
      </button>
      <div className="flex-column">
        <span className="attempt-counter">
          {"Attempts: " + attempts.length + "/5"}
        </span>
      </div>
    </>
  );
}

export default MapGuesser;
