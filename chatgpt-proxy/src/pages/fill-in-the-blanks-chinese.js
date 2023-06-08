import {timeLog} from "../lib/PCKUtils";
import {useState, useRef, useEffect} from "react";
import {Constants} from "../lib/Constants";
import {ChatGPTProxyEngine} from "../lib/ChatGPTProxyEngine";
import {Dropdown4} from "../components/Dropdown4";
import {StatusGreenAvailable} from "../components/StatusGreenAvailable";
import {StatusRedBusy} from "../components/StatusRedBusy";

const PLACEHOLDER_PHRASE="小心翼翼";
const SENTENCE_START_DELIMITERS=/[0-9]*\./;
//const SENTENCE_END_DELIMITERS=/！|。|？/;

const CHINESE_PERIOD="。";
const CHINESE_EXCLAMATION_MARK="！";
const CHINESE_QUESTION_MARK="？";

export default function FillInTheBlanksChinese() {

  const [phrase, setPhrase] = useState("");
  const [answer, setAnswer] = useState("");
  const [modelPicked, setModelPicked] = useState(Constants.CHATGPT_MODEL.GPT_3_5_TURBO);
  const [isBusy, setIsBusy] = useState(false);
  const conversationIdRef = useRef("");
  const parentMessageIdRef = useRef("");
  const [answersSplit, setAnswersSplit] = useState(["","","","",""]);
  const [copied, setCopied] = useState(0);
  const apiRef = useRef();

  useEffect(() => {
    timeLog(`FillInTheBlanksChinese.useEffect[modelPicked]: modelPicked:[${modelPicked}];`);
    // trigger the api to re-instantiate
    apiRef.current = undefined;
    conversationIdRef.current = "";
    parentMessageIdRef.current = "";
  }, [modelPicked]);

  function handleModelPickedChange(event) {
    timeLog(`FillInTheBlanksChinese.handleModelPickedChange: event.target.value:[${event.target.value}];`);
    setModelPicked(event.target.value);
  }

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

  function splitAnswers(answerInput) {
    let answerTest = `      1. 我得到一個全對的成績，真是___的！
    2. 昨天下了一整天的雨，今天終於晴天了，大家都很___。
    3. 爸爸媽媽說我們要去遊樂園玩，我真的好___！
    4. 姐姐從遠方回來了，全家人都非常___。
    5. 學校舉辦了一場有趣的聯歡晚會，大家玩得非常___！
    你好嗎？
    我很好。`
    //timeLog(`__splitAnswers: answerTest:[${answerTest}];`);
    let answer = answerInput;
    let count = 0;
    let results = [];
    do {
      let a = answer.indexOf(CHINESE_PERIOD) < 0 ? Number. MAX_SAFE_INTEGER : answer.indexOf(CHINESE_PERIOD);
      let b = answer.indexOf(CHINESE_EXCLAMATION_MARK) < 0 ? Number. MAX_SAFE_INTEGER : answer.indexOf(CHINESE_EXCLAMATION_MARK);
      let c = answer.indexOf(CHINESE_QUESTION_MARK) < 0 ? Number. MAX_SAFE_INTEGER : answer.indexOf(CHINESE_QUESTION_MARK);
      let firstEndMatched = Math.min(a, b, c);
      let firstLine = answer.substring(0, firstEndMatched + 1);
      answer = answer.substring(firstEndMatched + 1);
      let firstLineSplit = firstLine.split(SENTENCE_START_DELIMITERS);
      for (let j = 0; j < firstLineSplit.length; j++) {
        let bLine = firstLineSplit[j].trim();
        if (bLine == "") continue;
        results.push(bLine);
      }
      count++;
    } while (answer.length > 0 && count < 10)
    return results;
  }


  async function handleAskChatGPT() {
    timeLog(`FillInTheBlanksChinese.handleAskChatGPT: 1.0; phrase:[${phrase}];`);

    //splitAnswers("123");
    //if (1 == 1) return;

    let api = await ChatGPTProxyEngine.getAPI(apiRef, modelPicked);
    
    let phraseToAsk = phrase == "" ? PLACEHOLDER_PHRASE : phrase;
    const questionToAsk=`你是一個小學四年級中文老師。用以下的詞語做填充題的題目。給我不少於五句。每一句不得少於十五個字，不得多於二十五個字。結果要用繁體中文來顯示。句子得難度不可以超過小學四年級，即十歲小孩的程度。請用五條橫線來代替那個詞語。詞語:${phraseToAsk}`;
  
    timeLog(`FillInTheBlanksChinese.handleAskChatGPT: questionToAsk:[${questionToAsk}]; conversationIdRef.current:[${conversationIdRef.current}]; parentMessageIdRef.current:[${parentMessageIdRef.current}];`);
    api.sendMessage(questionToAsk, {
      conversationId: conversationIdRef.current,
      parentMessageId: parentMessageIdRef.current,
    }).then(
      (res) => {
        let answerFromAPI = res.text;
        let newId = res.id;
        let newConversationId = res.conversationId;
        timeLog(`FillInTheBlanksChinese.handleAskChatGPT: newConversationId:[${newConversationId}]; newId:[${newId}];`);
        timeLog(`FillInTheBlanksChinese.handleAskChatGPT: answerFromAPI:[${answerFromAPI}];`);
        conversationIdRef.current = newConversationId;
        parentMessageIdRef.current = newId;
        setAnswer(answerFromAPI);
        
        let newAnswersSplit = splitAnswers(answerFromAPI);
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

    setAnswer("");
    setAnswersSplit(["","","","",""])
    setIsBusy(true);
  }


  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-6 pt-12">

      <div className="flex flex-col justify-center items-center h-[100vh]">
      <p>ChatGPT Proxy App, by philipckwan [{Constants.APP_VERSION}]</p>
      
        <div className="!z-5 relative flex flex-col rounded-[20px] max-w-[600px] md:max-w-[800px] bg-white dark:bg-gray-800 dark:text-gray-200 bg-clip-border shadow-3xl shadow-shadow-500 flex flex-col w-full !p-6 3xl:p-![18px]">
          {isBusy ? <StatusRedBusy></StatusRedBusy> : <StatusGreenAvailable></StatusGreenAvailable>}<br/>
          <div className="mb-3">
              <label className="text-sm text-navy-700 dark:text-white">我想要 ChatGPT 幫我用這個詞語來做填充題：</label>
              <input onChange={handlePhraseChange} placeholder={PLACEHOLDER_PHRASE} value={phrase} type="text" id="phrase" name="phrase" className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200"></input>
              
              <br/><Dropdown4 title={"Pick a model:  "} handleChange={handleModelPickedChange}></Dropdown4>
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
