import {timeLog} from "../lib/PCKUtils";
import {useState} from "react";
import Link from 'next/link';
import {Constants} from "../lib/Constants";


export default function Landing() {
  timeLog(`index.Landing: 1.1;`);

  return (
    <div>
      <p>This is Landing. [{Constants.APP_VERSION}]</p>
      <p>Go to <Link href="admin">Admin page</Link></p>
      <p>Go to <Link href="fill-in-the-blanks">Fill In the Blanks page</Link></p>
      <p>Go to <Link href="ask-anything">Ask ChatGPT Anything page</Link></p>
    </div>
  );
}