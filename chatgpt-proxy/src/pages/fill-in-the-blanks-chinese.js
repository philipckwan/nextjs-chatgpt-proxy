import {timeLog} from "../lib/PCKUtils";
import {useState, useRef} from "react";
import {Constants} from "../lib/Constants";
import {Dropdown3} from "../components/Dropdown3";
import {StatusGreenAvailable} from "../components/StatusGreenAvailable";
import {StatusRedBusy} from "../components/StatusRedBusy";

//const model = Constants.CHATGPT_MODEL.GPT_4;
const apiReverseProxyUrl = "https://ai.fakeopen.com/api/conversation";
const accessToken = process.env.ACCESS_TOKEN;
const PLACEHOLDER_PHRASE="小心翼翼";

export default function FillInTheBlanksChinese() {

  const [phrase, setPhrase] = useState("");
  const [answer, setAnswer] = useState("");
  const chatgptModelPicked = useRef("n/a");
  const [isBusy, setIsBusy] = useState(false);
  const thisConversationId = useRef("");
  const thisParentMessageId = useRef("");
  const [answersSplit, setAnswersSplit] = useState(["","","","",""]);
  const [copied, setCopied] = useState(0);

  async function handlePhraseChange(event) {
    setPhrase(event.target.value);
  }

  function handleCopyToClipboard(idxPlusOne) {
    timeLog(`FillInTheBlanksChinese.handleCopyToClipboard: idxPlusOne:${idxPlusOne};`);
    let idxToCopy = idxPlusOne - 1;
    navigator.clipboard.writeText(answersSplit[idxToCopy]).then(
      (res) => {
        timeLog(`FillInTheBlanksChinese.handleCopyToClipboard: copy success!`);
        setCopied(idxPlusOne);
      }, (reason) => {
        timeLog(`FillInTheBlanksChinese.handleCopyToClipboard: copy failed!`);
      }
    )
  }

  async function handleAskChatGPT() {
    timeLog(`FillInTheBlanksChinese.handleAskChatGPT: 1.0; phrase:[${phrase}];`);

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
    timeLog(`FillInTheBlanksChinese.handleAskChatGPT: model:[${model}];`);

    const chatgpt = await import('chatgpt');
    const api = new chatgpt.ChatGPTUnofficialProxyAPI({
      accessToken,
      apiReverseProxyUrl,
      model,
    });
    
    let phraseToAsk = phrase == "" ? PLACEHOLDER_PHRASE : phrase;
    const questionToAsk=`你是一個小學四年級中文老師。用以下的詞語做填充題的題目。給我不少於五句。每一句不得少於十五個字，不得多於二十五個字。結果要用繁體中文來顯示。句子得難度不可以超過小學四年級，即十歲小孩的程度。請用五條橫線來代替那個詞語。每一句用###來分隔開來。 詞語:${phraseToAsk}`;
  
    timeLog(`FillInTheBlanksChinese.handleAskChatGPT: questionToAsk:[${questionToAsk}];`);
    api.sendMessage(questionToAsk, {
      conversationId: thisConversationId.current,
      parentMessageId: thisParentMessageId.current,
    }).then(
      (res) => {
        let answerFromAPI = res.text;
        let newId = res.id;
        let newConversationId = res.conversationId;
        timeLog(`FillInTheBlanksChinese.handleAskChatGPT: newConversationId:[${newConversationId}]; newId:[${newId}];`);
        timeLog(`FillInTheBlanksChinese.handleAskChatGPT: answerFromAPI:[${answerFromAPI}];`);
        thisConversationId.current = newConversationId;
        thisParentMessageId.current = newId;
        setAnswer(answerFromAPI);
        let answersSplit = answerFromAPI.split("###");
        let newAnswersSplit = [];
        for(let i = 0; i < answersSplit.length; i++) {
          let anAnswer = answersSplit[i];
          let firstDot = anAnswer.indexOf(".");
          anAnswer = anAnswer.substring(firstDot+1).trim();
          timeLog(`[${i}]:[${anAnswer}];`);
          if (anAnswer == "") {
            // do nothing
          } else {
            newAnswersSplit.push(anAnswer);
          }
        }
        setAnswersSplit(newAnswersSplit);
        setCopied(0);
        setIsBusy(false);
      },
      (reason) => {
        let errorMessage = `ERROR - ChatGPT runs into an error trying to answer your question; ${reason};`
        timeLog(errorMessage);
        setAnswer(errorMessage);
        setCopied(0);
        setIsBusy(false);
      },
    );
    /*
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
    */
    setIsBusy(true);
  }


  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-6 pt-12">
      {/*
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          ChatGPT Proxy App, by philipckwan [{Constants.APP_VERSION}]
        </p>
      </div>
      <br/>
      */}
      <div className="flex flex-col justify-center items-center h-[100vh]">
      <p>ChatGPT Proxy App, by philipckwan [{Constants.APP_VERSION}]</p>
      {/*<p>Use this Chat-GPT proxy to come up with Chinese fill in the blanks questions</p>  */}
        <div className="!z-5 relative flex flex-col rounded-[20px] max-w-[600px] md:max-w-[800px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 flex flex-col w-full !p-6 3xl:p-![18px] bg-white undefined">                
          {/*<div className="relative flex flex-row justify-between">
              <h4 className="text-xl font-bold text-navy-700 dark:text-white mb-3">
                  填充題
              </h4>
          </div>*/}
          {isBusy ? <StatusRedBusy></StatusRedBusy> : <StatusGreenAvailable></StatusGreenAvailable>}<br/>
          <div className="mb-3">
              <label className="text-sm text-navy-700 dark:text-white">我想要 ChatGPT 幫我用這個詞語來做填充題：</label>
              <input onChange={handlePhraseChange} placeholder={PLACEHOLDER_PHRASE} value={phrase} type="text" id="phrase" name="phrase" className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200"></input>
              <br/><Dropdown3 ref={chatgptModelPicked} title={"Pick a model:  "}></Dropdown3>
              <button onClick={handleAskChatGPT} className="mt-2 inline-block p-3 rounded-lg shadow-sm bg-indigo-500 text-white">Ask Chat-GPT</button>
          </div>
          <div className="mb-3">
            <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">From ChatGPT:</label> 
            <div className="mt-1">1.{answersSplit[0]} <button onClick={() => handleCopyToClipboard(1)} className="inline-block p-1 rounded-lg shadow-sm bg-indigo-500 text-white">{copied == 1 ? "Copied" : "Copy"}</button></div>
            <div className="mt-1">2.{answersSplit[1]} <button onClick={() => handleCopyToClipboard(2)} className="inline-block p-1 rounded-lg shadow-sm bg-indigo-500 text-white">{copied == 2 ? "Copied" : "Copy"}</button></div>
            <div className="mt-1">3.{answersSplit[2]} <button onClick={() => handleCopyToClipboard(3)} className="inline-block p-1 rounded-lg shadow-sm bg-indigo-500 text-white">{copied == 3 ? "Copied" : "Copy"}</button></div>
            <div className="mt-1">4.{answersSplit[3]} <button onClick={() => handleCopyToClipboard(4)} className="inline-block p-1 rounded-lg shadow-sm bg-indigo-500 text-white">{copied == 4 ? "Copied" : "Copy"}</button></div>
            <div className="mt-1">5.{answersSplit[4]} <button onClick={() => handleCopyToClipboard(5)} className="inline-block p-1 rounded-lg shadow-sm bg-indigo-500 text-white">{copied == 5 ? "Copied" : "Copy"}</button></div>
            <br/><textarea readOnly value={answer} id="message" rows="8" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="ChatGPT answer goes here..."></textarea>
          </div>
        </div>
      </div>
    </main>
  );
  
}
