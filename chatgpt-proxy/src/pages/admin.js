import {timeLog} from "../lib/PCKUtils";
import {useState} from "react";
import Link from 'next/link';
import {Constants} from "../lib/Constants";

export default function Admin() {

  timeLog(`admin.Admin: 1.1;`);

  return (
    <div>
      <p>This is Admin. [{Constants.APP_VERSION}]</p>
      <p>Go to <Link href="admin/">Admin page</Link></p>
    </div>
  );
}