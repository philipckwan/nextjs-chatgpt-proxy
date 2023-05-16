import {timeLog} from "../lib/PCKUtils";
import {useState} from "react";
import Link from 'next/link';

export default function Landing() {
  const [version, setVersion] = useState("v0.2");

  timeLog(`index.Landing: 1.1;`);

  return (
    <div>
      <p>This is Landing. [{version}]</p>
      <p>Go to <Link href="admin">Admin page</Link></p>
      <p>Go to <Link href="fill-in-the-blanks">Fill In the Blanks page</Link></p>
      <p>Go to <Link href="ask-anything">Ask ChatGPT Anything page</Link></p>
    </div>
  );
}