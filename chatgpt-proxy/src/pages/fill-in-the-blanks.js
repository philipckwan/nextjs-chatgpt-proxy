'use client';

import Image from 'next/image'
import {timeLog} from "../lib/PCKUtils";
import {useState, useRef} from "react";
//import {Landing} from "../pages/landing";
//import {ChatGPTUnofficialProxyAPI} from 'chatgpt';
import {Constants} from "../lib/Constants";
import {Dropdown3} from "../components/Dropdown3";

export default function FillInTheBlanks() {

  const [phrase, setPhrase] = useState("擴散");
  const [answer, setAnswer] = useState("n/a");
  const chatgptModelPicked = useRef("n/a");


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
    
    const question=`你是一個小學四年級中文老師。用以下的詞語做填充題的題目。給我不少於五句。每一句不得少於十五個字，不得多於二十五個字。結果要用繁體中文來顯示。句子得難度不可以超過小學四年級，即十歲小孩的程度。 詞語:${phrase}`;
  
    timeLog(`FillInTheBlanks.handleAskChatGPT: question:[${question}];`);
    const res = await api.sendMessage(question);
    let answerFromAPI = res.text;
    timeLog(`FillInTheBlanks.handleAskChatGPT: answer:[${answerFromAPI}];`);
    setAnswer(answerFromAPI);
  }

  //return(<Landing></Landing>);

  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          ChatGPT Proxy App, by philipckwan [v0.11]
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
          <div className="mb-3">
              <label className="text-sm text-navy-700 dark:text-white font-bold">詞語</label>
              <input onChange={handlePhraseChange} value={phrase} type="text" id="phrase" name="phrase" className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200"></input>
              <br/><Dropdown3 ref={chatgptModelPicked} title={"Pick a model:  "}></Dropdown3>
              <button onClick={handleAskChatGPT} className="mt-2 inline-block p-3 rounded-lg shadow-sm bg-indigo-500 text-white">Ask Chat-GPT</button>
          </div>
          <div>
            <p>From Chat-GPT: {answer}</p>
          </div>
        </div>
      </div>
    </main>
  );
  
}
