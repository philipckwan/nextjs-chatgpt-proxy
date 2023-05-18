'use client';

import Image from 'next/image'
import {timeLog} from "../lib/PCKUtils";
import {useState, useRef} from "react";
//import {Landing} from "../pages/landing";
//import {ChatGPTUnofficialProxyAPI} from 'chatgpt';
import {Constants} from "../lib/Constants";
import {Dropdown3} from "../components/Dropdown3";
import {StatusGreenAvailable} from "../components/StatusGreenAvailable";
import {StatusRedBusy} from "../components/StatusRedBusy";

export default function FillInTheBlanks() {

  const [phrase, setPhrase] = useState("高興");
  const [answer, setAnswer] = useState("");
  const chatgptModelPicked = useRef("n/a");
  const [isBusy, setIsBusy] = useState(false);


  async function handlePhraseChange(event) {
    //timeLog(`handlePhraseChange: 1.0;`);
    setPhrase(event.target.value);
  }

  async function handleAskChatGPT() {
    timeLog(`handleAskChatGPT: 1.0; phrase:[${phrase}];`);
    //timeLog(`__chatgpt:[${chatgpt}];`);

    let envSource = process.env.ENV_SOURCE;
    let accessToken = process.env.ACCESS_TOKEN;

    timeLog(`FillInTheBlanks.handleAskChatGPT: chatgptModelPicked.current:[${chatgptModelPicked.current}];`);
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
    timeLog(`FillInTheBlanks.handleAskChatGPT: model:${model};`);

    let apiReverseProxyUrl = "https://ai.fakeopen.com/api/conversation";

    const chatgpt = await import('chatgpt');
    const api = new chatgpt.ChatGPTUnofficialProxyAPI({
      accessToken,
      apiReverseProxyUrl,
      model,
    });
    
    const question=`你是一個小學四年級中文老師。用以下的詞語做填充題的題目。給我不少於五句。每一句不得少於十五個字，不得多於二十五個字。結果要用繁體中文來顯示。句子得難度不可以超過小學四年級，即十歲小孩的程度。請用五條橫線來代替那個詞語。每一句用數字列出來，即"1.","2."。 詞語:${phrase}`;
  
    timeLog(`FillInTheBlanks.handleAskChatGPT: question:[${question}];`);
    api.sendMessage(question).then(
      (res) => {
        let answerFromAPI = res.text;
        timeLog(`FillInTheBlanks.handleAskChatGPT: answerFromAPI:[${answerFromAPI}];`);
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
    //let answerFromAPI = res.text;
    //timeLog(`FillInTheBlanks.handleAskChatGPT: answer:[${answerFromAPI}];`);
    //setAnswer(answerFromAPI);
  }


  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-12">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          ChatGPT Proxy App, by philipckwan [{Constants.APP_VERSION}]
        </p>
      </div>
      <br/>
      <div className="flex flex-col justify-center items-center h-[100vh]">
      <p>Use this Chat-GPT proxy to come up with Chinese fill in the blanks questions</p>  
        <div className="!z-5 relative flex flex-col rounded-[20px] max-w-[600px] md:max-w-[800px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 flex flex-col w-full !p-6 3xl:p-![18px] bg-white undefined">                
          {/*<div className="relative flex flex-row justify-between">
              <h4 className="text-xl font-bold text-navy-700 dark:text-white mb-3">
                  填充題
              </h4>
          </div>*/}
          {isBusy ? <StatusRedBusy></StatusRedBusy> : <StatusGreenAvailable></StatusGreenAvailable>}<br/>
          <div className="mb-3">
              <label className="text-sm text-navy-700 dark:text-white">我想要 ChatGPT 幫我用這個詞語來做填充題：</label>
              <input onChange={handlePhraseChange} value={phrase} type="text" id="phrase" name="phrase" className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200"></input>
              <br/><Dropdown3 ref={chatgptModelPicked} title={"Pick a model:  "}></Dropdown3>
              <button onClick={handleAskChatGPT} className="mt-2 inline-block p-3 rounded-lg shadow-sm bg-indigo-500 text-white">Ask Chat-GPT</button>
          </div>
          <div className="mb-3">
            <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">From ChatGPT:</label>
            <textarea readOnly value={answer} id="message" rows="8" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="ChatGPT answer goes here..."></textarea>
          </div>
        </div>
      </div>
    </main>
  );
  
}
