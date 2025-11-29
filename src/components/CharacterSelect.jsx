import Select from "react-select";
import { customSelectStyles } from "../styles/CustomSelectStyles.js";

function CharacterSelect(props) {
  return (
    <Select
      styles={{
        ...customSelectStyles,
        indicatorsContainer: () => ({ display: "none" }),
      }}
      className="select"
      options={props.characterOptions}
      value={props.selectedCharacter}
      onChange={props.onCharacterSelect}
      placeholder="Search for a character..."
      formatOptionLabel={(char) => (
        <div className="character-option">
          <img className="character-portrait" src={`${char.portrait}`} />
          <span>{char.label}</span>
        </div>
      )}
    />
  );
}

export default CharacterSelect;
