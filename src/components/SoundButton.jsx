import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faCheck,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import "../styles/SoundButton.css";

function SoundButton({ isActive, isCorrect, ability, clickEffect }) {
  function getIcon() {
    if (isActive)
      return <FontAwesomeIcon icon={faPause} color="#d0d0d0"></FontAwesomeIcon>;
    else if (isCorrect)
      return <FontAwesomeIcon icon={faCheck} color="#27a7dd"></FontAwesomeIcon>;
    else if (isCorrect === false)
      return <FontAwesomeIcon icon={faXmark} color="#ff0000"></FontAwesomeIcon>;
    else
      return <FontAwesomeIcon icon={faPlay} color="#27a7dd"></FontAwesomeIcon>;
  }
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    if (!ability) return;
    import(`../assets/sound_effects/${ability.name}.ogg`).then((result) =>
      setAudio(new Audio(result.default))
    );
  }, [ability]);

  useEffect(() => {
    if (audio == null) return;
    if(isActive)
    {
      audio.currentTime = 0;
      audio.play();
      
    }
    else audio.pause();
  }, [isActive, audio]);

  return (
    <div className="sound-effects__effect">
      <button className={"sound-effects__button"} onClick={() => clickEffect(audio.duration)}>
        {getIcon()}
      </button>
      <div className="sound-effects__description">
        {isCorrect !== null && (
          <>
            <img
              src={ability.character.portrait}
              className="character-portrait"
            />
            <span style={{ fontWeight: 600 }}>{ability.name}</span>
          </>
        )}
      </div>
    </div>
  );
}

export default SoundButton;
