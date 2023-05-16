import {timeLog} from "../lib/PCKUtils";
import {forwardRef, useRef} from 'react'

export const Dropdown3 = forwardRef(function Dropdown3({title}, ref) {
  //timeLog(`Dropdown3: ref.current:${ref.current}; title:${props.title};`);

  function handleSelectChange(event) {
    timeLog(`Dropdown3.handleSelectChange: 1.0; event.target.value:[${event.target.value}];`);
    ref.current = event.target.value;
  }

  return(
    <div className="border-2">
      <label>{title}</label>
      <select onChange={handleSelectChange} id="models">
        <option value="GPT_3_5_TURBO">GPT 3.5</option>
        <option value="GPT_4">GPT 4</option>
      </select>
    </div>
  )

});