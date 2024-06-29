import React from "react";
import './style.scss';

export default function CustomSelect(props) {
  const { value, option, name, label, handleChange } = props;
  return (
    <div className="custom-selectbox-frame">
      {label?.length && <label for={name}>{label}:</label>}
      <select 
        name={name} 
        id={name} 
        value={value}
        onChange={(event) => {
          if ( typeof handleChange=== 'function')
          handleChange(event?.currentTarget?.value)
        }}
      >
        {option?.map((optionItem, optionIndex) => {
          return (
            <option key={`option-name-${optionIndex}-${new Date().getTime()}`} value={optionItem?.value}>{optionItem?.label}</option>
          )
        })}
      </select>
    </div>
  );
}
