'use client';

import Image from 'next/image'
import {timeLog} from "../lib/PCKUtils";
import {useState} from "react";
//import {ChatGPTUnofficialProxyAPI} from 'chatgpt';


const ACCESS_TOKEN="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1UaEVOVUpHTkVNMVFURTRNMEZCTWpkQ05UZzVNRFUxUlRVd1FVSkRNRU13UmtGRVFrRXpSZyJ9.eyJodHRwczovL2FwaS5vcGVuYWkuY29tL3Byb2ZpbGUiOnsiZW1haWwiOiJ6am9yazAxQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlfSwiaHR0cHM6Ly9hcGkub3BlbmFpLmNvbS9hdXRoIjp7InVzZXJfaWQiOiJ1c2VyLVMwWnBTbjkxaE8ySGQ0N04yNWdsdlZLciJ9LCJpc3MiOiJodHRwczovL2F1dGgwLm9wZW5haS5jb20vIiwic3ViIjoiYXV0aDB8NjNkNjI2OWJkNDgwYzM3NzlmYjRmNGMyIiwiYXVkIjpbImh0dHBzOi8vYXBpLm9wZW5haS5jb20vdjEiLCJodHRwczovL29wZW5haS5vcGVuYWkuYXV0aDBhcHAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTY4MzI4MzU3MSwiZXhwIjoxNjg0NDkzMTcxLCJhenAiOiJUZEpJY2JlMTZXb1RIdE45NW55eXdoNUU0eU9vNkl0RyIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwgbW9kZWwucmVhZCBtb2RlbC5yZXF1ZXN0IG9yZ2FuaXphdGlvbi5yZWFkIG9mZmxpbmVfYWNjZXNzIn0.IanRsf1kOYSjVsw00W30232mLDJw8SmTi56uuyPcu1x7sC1RmqFU7b4En30Wz8nmdL4ZmvKDTVXdnpAjC_vPzm5ws3SRymBJgN5gjToyKNczlkVD1nAo9IXDgjvISoCNGVcF-FSmqObQlLTNWb6kJDpJ3ked7Q9Zflb4VT6gmmko_iwextl_pj4E9BxSfOD65sJaqI192iugSUyyiJAfwAg1FzFuBT48x7hlnk6sKdfvHtV4kKXBlP5wExZHhdi131eQ_i-jxD-xKkbXNObZzvd9zr0nux8NzDyqAqiW6iWNakL4TdRSnz7AiCgKs4NauJhyEzzJZrUgZZGHIWh4vQ";

export default function Home() {
  const [phraseInput, setPhraseInput] = useState("擴散");
  const [answers, setAnswers] = useState("n/a");

  async function handlePhraseInputChange(event) {
    timeLog(`handlePhraseInputChange: 1.0;`);
    setPhraseInput(event.target.value);
  }


  async function handleAskChatGPT() {
    timeLog(`handleAskChatGPT: 1.0; phraseInput:[${phraseInput}];`);
    //timeLog(`__chatgpt:[${chatgpt}];`);
    
    const chatgpt = await import('chatgpt');
    const api = new chatgpt.ChatGPTUnofficialProxyAPI({
      accessToken: ACCESS_TOKEN,
      apiReverseProxyUrl: "https://ai.fakeopen.com/api/conversation",
      model: 'gpt-4',
    })
    
    const query=`你是一個小學四年級中文老師。用以下的詞語做填充題的題目。給我不少於五句。每一句不得少於十五個字，不得多於二十五個字。結果要用繁體中文來顯示。句子得難度不可以超過小學四年級，即十歲小孩的程度。 詞語:${phraseInput}`;
  
    timeLog(`query:[${query}];`);
    const res = await api.sendMessage(query);
    timeLog(`res.text:[${res.text}];`);
    //timeLog(`res:[${JSON.stringify(res)}];`);
    setAnswers(res.text);

  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          ChatGPT Proxy App, by philipckwan [v0.5]
        </p>
      </div>
      <br/>
      <div className="flex flex-col justify-center items-center h-[100vh]">
      <p>Use this Chat-GPT proxy to come up with Chinese fill in the blanks questions</p>  
        <div className="!z-5 relative flex flex-col rounded-[20px] max-w-[300px] md:max-w-[400px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 flex flex-col w-full !p-6 3xl:p-![18px] bg-white undefined">                
          <div className="relative flex flex-row justify-between">
              <h4 className="text-xl font-bold text-navy-700 dark:text-white mb-3">
                  填充題
              </h4>
          </div>
          <div className="mb-3">
              <label className="text-sm text-navy-700 dark:text-white font-bold">詞語</label>
              <input onChange={handlePhraseInputChange} value={phraseInput} type="text" id="phraseInput" name="phraseInput" className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200"></input>
              <button onClick={handleAskChatGPT} className="mt-2 inline-block p-3 rounded-lg shadow-sm bg-indigo-500 text-white">Ask Chat-GPT</button>
          </div>
          <div>
            <p>From Chat-GPT: {answers}</p>
          </div>
        </div>
        
      </div>

    </main>
  )
}
