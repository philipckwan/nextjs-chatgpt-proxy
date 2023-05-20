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
      <p>Go to <Link href="conversation">Conversation with ChatGPT</Link></p>
      <p>Go to <Link href="fill-in-the-blanks-chinese">Fill In the Blanks (Chinese) page</Link></p>
      <p>Go to <Link href="fill-in-the-blanks-prepositions">Fill In the Blanks (Prepositions) page</Link></p>
    </div>
  );
}