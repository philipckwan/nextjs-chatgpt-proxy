import '../styles/globals.css';
import {timeLog} from "../lib/PCKUtils";

export default function MyApp({ Component, pageProps }) {
  timeLog(`_app.MyApp: 1.1;`);
  return <Component {...pageProps} />;
}