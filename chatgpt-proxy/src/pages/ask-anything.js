import {timeLog} from "../lib/PCKUtils";
import {useState, useRef} from "react";
//import {Landing} from "../pages/landing";
//import {ChatGPTUnofficialProxyAPI} from 'chatgpt';
import {Constants} from "../lib/Constants";
import {Dropdown} from "../components/Dropdown";
import {Dropdown2} from "../components/Dropdown2";
import {Dropdown3} from "../components/Dropdown3";
import {StatusGreenAvailable} from "../components/StatusGreenAvailable";
import {StatusRedBusy} from "../components/StatusRedBusy";

export default function AskAnything() {
  const [question, setQuestion] = useState("Hello ChatGPT! What ChatGPT model are you?");
  const [answer, setAnswer] = useState("n/a");
  const chatgptModelPicked = useRef("n/a");
  const [isBusy, setIsBusy] = useState(false);

  async function handleQuestionChange(event) {
    //timeLog(`handleQuestionInputChange: 1.0;`);
    setQuestion(event.target.value);
  }

  async function handleAskChatGPT() {
    //timeLog(`handleAskChatGPT: 1.0;`);

    let envSource = process.env.ENV_SOURCE;
    let accessToken = process.env.ACCESS_TOKEN;

    timeLog(`AskAnything.handleAskChatGPT: chatgptModelPicked.current:[${chatgptModelPicked.current}];`);
    let model = Constants.CHATGPT_MODEL.GPT_3_5_TURBO;
    switch(chatgptModelPicked.current) {
      case "n/a":
      case "GPT_3_5_TURBO":
        model = Constants.CHATGPT_MODEL.GPT_3_5_TURBO;
      break;
      case "GPT_4":
        model = Constants.CHATGPT_MODEL.GPT_4;
      break;
    }
    timeLog(`AskAnything.handleAskChatGPT: model:${model};`);
    let apiReverseProxyUrl = "https://ai.fakeopen.com/api/conversation";
    
    const chatgpt = await import('chatgpt');
    const api = new chatgpt.ChatGPTUnofficialProxyAPI({
      accessToken,
      apiReverseProxyUrl,
      model,
    });
    
    timeLog(`AskAnything.handleAskChatGPT: question:[${question}];`);
    api.sendMessage(question).then(
      (res) => {
        let answerFromAPI = res.text;
        timeLog(`AskAnything.handleAskChatGPT: answerFromAPI:[${answerFromAPI}];`);
        setAnswer(answerFromAPI);
        setIsBusy(false);
      },
      (reason) => {
        let errorMessage = `ERROR - ChatGPT runs into an error trying to answer your question; ${reason};`
        timeLog(errorMessage);
        setAnswer(errorMessage);
        setIsBusy(false);
      },
    );
    setIsBusy(true);
  }

  function handleTest() {
    timeLog(`handleTest: 1.0;`);
    timeLog(`__chatgptModelPicked.current:[${chatgptModelPicked.current}];`);
  }

    
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          ChatGPT Proxy App, by philipckwan [{Constants.APP_VERSION}]
        </p>
      </div>
      <br/>
      <div className="flex flex-col justify-center items-center h-[100vh]">
      <p>Use this Chat-GPT proxy to ask ChatGPT anything. (seems GPT-4 takes more time to reply than GPT-3.5 though)</p>  
        <div className="!z-5 relative flex flex-col rounded-[20px] max-w-[600px] md:max-w-[800px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 flex flex-col w-full !p-6 3xl:p-![18px] bg-white undefined">                
          {isBusy ? <StatusRedBusy></StatusRedBusy> : <StatusGreenAvailable></StatusGreenAvailable>}
          <div className="mb-3">
              <label className="text-sm text-navy-700 dark:text-white font-bold">Question</label>
              <input onChange={handleQuestionChange} value={question} type="text" id="question" name="question" className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200"></input>
              <br/><Dropdown3 ref={chatgptModelPicked} title={"Pick a model:  "}></Dropdown3>
              <button onClick={handleAskChatGPT} className="mt-2 inline-block p-3 rounded-lg shadow-sm bg-indigo-500 text-white">Ask ChatGPT</button>
          </div>
          <div className="border-2">
            <p>From ChatGPT:</p>
            <textarea value={answer} rows="8" cols="80" readOnly/>
          </div>
        </div>
      </div>
      <br/>
      {/*
      <div>
        <button onClick={handleTest} className="mt-2 inline-block p-3 rounded-lg shadow-sm bg-indigo-500 text-white">Test</button>
      </div>
      */}
    </main>
  );

}