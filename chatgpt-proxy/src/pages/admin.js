import {timeLog} from "../lib/PCKUtils";
import {useState} from "react";
import Link from 'next/link';

export default function Admin() {
  const [version, setVersion] = useState("v0.3");

  timeLog(`admin.Admin: 1.1;`);

  return (
    <div>
      <p>This is Admin. [{version}]</p>
      <p>Go to <Link href="admin/">Admin page</Link></p>
    </div>
  );
}