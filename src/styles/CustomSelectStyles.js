export const customSelectStyles = {
  dropdownIndicator: (base) => ({
    ...base,
    padding: "0",
  }),
  indicatorsContainer: (base) => ({
    ...base,
    width: "1.5em",
    height: "100%"
  }),
  menu: (base) => ({
    ...base,
    marginTop: "1em"
  }),
  menuList: (base) => ({
    ...base,
    maxHeight: "15em",
    overflow: "auto",
    paddingTop: "0.2em",
    paddingBottom: "0.2em",
  }),
  control: (base, state) => ({
    ...base,
    padding: "0.2em",
    borderRadius: "0.3em",
    borderWidth: "0",
    height: "2.5em",
    transition: "0",
    minHeight: "3.5em",
    boxShadow: state.isFocused ? "0 0 0 0.2em #2684FF" : "",
  }),
  valueContainer: (base) => ({
    ...base,
    padding: "0.5em",
  }),
  input: (base) => ({
    ...base,
    padding: "0",
    margin: "0"
  }),
  option: (base) => ({
    ...base,
    padding: "0.6em 0.8em 0.8em 0.6em",
    // paddingRight: "0.5em",
    // paddingUp: "0.5em"
  }),
  noOptionsMessage: (base) => ({
    ...base,
    padding: "0"
  })
};
