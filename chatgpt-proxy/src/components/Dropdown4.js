//import {timeLog} from "../lib/PCKUtils";
//import {forwardRef, useRef} from 'react'
import {Constants} from "../lib/Constants";

export function Dropdown4({title, handleChange}) {

  return(
    <div className="border-2">
      <label>{title}</label>
      <select onChange={handleChange} id="models" className="bg-gray-200 text-gray-600 dark:bg-gray-400 dark:text-gray-200">
        <option value={Constants.CHATGPT_MODEL.GPT_3_5_TURBO}>GPT 3.5</option>
        <option value={Constants.CHATGPT_MODEL.GPT_4}>GPT 4</option>
      </select>
    </div>
  )
}
