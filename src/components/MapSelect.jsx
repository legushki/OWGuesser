import Select from "react-select";
import { customSelectStyles } from "../styles/CustomSelectStyles.js";

function MapSelect(props) {
  return (
    <Select
      styles={{
        ...customSelectStyles,
        indicatorsContainer: () => ({ display: "none" }),
      }}
      className="select"
      options={props.options}
      value={props.selectedOption}
      onChange={props.onOptionSelect}
      placeholder="Search for a map..."
    />
  );
}

export default MapSelect;