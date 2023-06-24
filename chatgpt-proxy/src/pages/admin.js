import {timeLog} from "@/lib/PCKUtils";
import {useState} from "react";
import {Constants} from "@/lib/Constants";

export default function Admin() {
  const [passphrase, setPassphrase] = useState("");
  const [chatgptAccessToken, setChatgptAccessToken] = useState("");
  const [message, setMessage] = useState("");

  async function handleUpdateChatGPTAcessToken() {
    timeLog(`Admin.handleUpdateChatGPTAcessToken: 1.0; passphrase:[${passphrase}]; chatgptAccessToken.length:[${chatgptAccessToken.length}]; chatgptAccessToken[0...10]:[${chatgptAccessToken.substring(0,10)}];`);
    let new_token = chatgptAccessToken;
    const response = await fetch(`/api/config/access_token`, {
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
       passphrase,
       new_token,
      })
    });
    let respJson = await response.json();
    setMessage(respJson.message);
  }

  return (
    <>
    <main className="flex min-h-screen flex-col items-center justify-between px-4 pt-8">
      <div className="flex flex-col justify-between items-center w-full">
        <div>[Admin] ChatGPT Proxy App, by philipckwan [{Constants.APP_VERSION}]</div>
        <div className="!z-5 relative flex flex-col rounded-[20px] max-w-[600px] md:max-w-[800px] bg-white dark:bg-gray-800 dark:text-gray-200 bg-clip-border shadow-3xl w-full !p-6 3xl:p-![18px]">
          <div>
            To obtain ChatGPT access token:<br/>
            https://chat.openai.com/api/auth/session
          </div>
          <div className="flex flex-row items-center">
            <div className="m-2">Passphrase</div>
            <div className="m-2">
              <input onChange={e => setPassphrase(e.target.value)}  value={passphrase} type="text" id="passphrase" name="phrase" className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200"></input>
            </div>
          </div>
          <div className="flex flex-row items-center">
            <div className="m-2">New ChatGPT Access Token</div>
            <div className="m-2">
              <input onChange={e => setChatgptAccessToken(e.target.value)}  value={chatgptAccessToken} type="text" id="chatgptAccessToken" name="phrase" className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200"></input>
            </div>
          </div>
          <div>
          <button onClick={handleUpdateChatGPTAcessToken} className="mt-2 inline-block p-3 rounded-lg shadow-sm bg-indigo-500 text-white">Update ChatGPT Access Token</button>
          </div>
          <div className="flex flex-row items-center">
            <div className="m-2">Update results</div>
            <div className="m-2">{message}</div>
          </div>
        </div>
      </div>
    </main>
    </>
  );
}