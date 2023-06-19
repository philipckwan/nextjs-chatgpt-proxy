import {timeLog} from "../lib/PCKUtils";
import {useState, useRef, useEffect} from "react";
import {Constants} from "../lib/Constants";
import {ChatGPTProxyEngine} from "../lib/ChatGPTProxyEngine";
import {Dropdown4} from "../components/Dropdown4";
import {StatusGreenAvailable} from "../components/StatusGreenAvailable";
import {StatusRedBusy} from "../components/StatusRedBusy";
import {StatusBlueAvailable} from "@/components/StatusBlueContinue";
import { CodeHighlight } from "@/components/CodeHighlight";

const PLACEHOLDER_QUESTION="What ChatGPT model are you? And what is today's date?";
const THREE_GRAVE_ACCENT="```";

export default function Conversation() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [modelPicked, setModelPicked] = useState(Constants.CHATGPT_MODEL.GPT_3_5_TURBO);
  const [chatgptState, setChatgptState] = useState(Constants.CHATGPT_CONVERSATION_STATE.FRESH);
  const conversationIdRef = useRef("");
  const parentMessageIdRef = useRef("");
  const apiRef = useRef();
  const [displayCode, setDisplayCode] = useState(false);
  const [code, setCode] = useState("");

  useEffect(() => {
    timeLog(`Conversation.useEffect[modelPicked]: modelPicked:[${modelPicked}];`);
    // trigger the api to re-instantiate
    apiRef.current = undefined;
    conversationIdRef.current = "";
    parentMessageIdRef.current = "";
  }, [modelPicked]);

  function handleModelPickedChange(event) {
    timeLog(`Conversation.handleModelPickedChange: event.target.value:[${event.target.value}];`);
    setModelPicked(event.target.value);
  }

  async function handleQuestionChange(event) {
    //timeLog(`handleQuestionInputChange: 1.0;`);
    setQuestion(event.target.value);
  }

  async function handleAskChatGPT() {
    timeLog(`Conversation.handleAskChatGPT: 1.0; question:[${question}];`);

    let api = await ChatGPTProxyEngine.getAPI(apiRef, modelPicked);

    let questionToAsk = question == "" ? PLACEHOLDER_QUESTION : question;


    timeLog(`Conversation.handleAskChatGPT: questionToAsk:[${questionToAsk}]; conversationIdRef.current:[${conversationIdRef.current}]; parentMessageIdRef.current:[${parentMessageIdRef.current}];`);
    const onProgress = (partialResponse) => setAnswer(partialResponse.text);
    let sendMessageJson = (conversationIdRef.current != "") ? {conversationId: conversationIdRef.current, parentMessageId: parentMessageIdRef.current, onProgress} : {onProgress};

    timeLog(`Conversation.handleAskChatGPT: sendMessageJson:[${JSON.stringify(sendMessageJson)}];`);
    api.sendMessage(questionToAsk, sendMessageJson).then(
      (res) => {
        let answerFromAPI = res.text;
        let newId = res.id;
        let newConversationId = res.conversationId;
        let matchThreeGraveAccentIdxStart = answerFromAPI.indexOf(THREE_GRAVE_ACCENT);

        timeLog(`Conversation.handleAskChatGPT: newConversationId:[${newConversationId}]; newId:[${newId}]; matchThreeGraveAccentIdxStart:[${matchThreeGraveAccentIdxStart}];`);
        if (matchThreeGraveAccentIdxStart > 0) {
          let matchThreeGraveAccentIdxEnd = answerFromAPI.lastIndexOf(THREE_GRAVE_ACCENT);
          setDisplayCode(true);
          setCode(answerFromAPI.substring(matchThreeGraveAccentIdxStart + THREE_GRAVE_ACCENT.length, matchThreeGraveAccentIdxEnd));
        }
        //timeLog(`Conversation.handleAskChatGPT: answerFromAPI:[${answerFromAPI}];`);
        conversationIdRef.current = newConversationId;
        parentMessageIdRef.current = newId;
        setAnswer(answerFromAPI);
        setChatgptState(Constants.CHATGPT_CONVERSATION_STATE.CONTINUE_CONVERSATION);
      },
      (reason) => {
        let errorMessage = `ERROR - ChatGPT runs into an error trying to answer your question; ${reason};`
        timeLog(errorMessage);
        setAnswer(errorMessage);
        setChatgptState(Constants.CHATGPT_CONVERSATION_STATE.CONTINUE_CONVERSATION);
      },
    );
    setAnswer("");
    setChatgptState(Constants.CHATGPT_CONVERSATION_STATE.BUSY);
    setDisplayCode(false);
  }

  function handleResetConversation() {
    timeLog(`Conversation.handleResetConversation: 1.0;`);
    conversationIdRef.current = "";
    parentMessageIdRef.current = "";
    setChatgptState(Constants.CHATGPT_CONVERSATION_STATE.FRESH);
  }
    
  return (
    <>
    <main className="flex min-h-screen flex-col items-center justify-between px-6 pt-12">
      <div className="flex flex-col justify-center items-center ">
      <p>[Conversation] ChatGPT Proxy App, by philipckwan [{Constants.APP_VERSION}]</p>  

        <div className="!z-5 relative flex flex-col rounded-[20px] max-w-[600px] md:max-w-[800px] bg-white dark:bg-gray-800 dark:text-gray-200 bg-clip-border shadow-3xl shadow-shadow-500 flex flex-col w-full !p-6 3xl:p-![18px]">                
          {chatgptState == Constants.CHATGPT_CONVERSATION_STATE.FRESH ? <StatusGreenAvailable></StatusGreenAvailable> : chatgptState == Constants.CHATGPT_CONVERSATION_STATE.BUSY ? <StatusRedBusy></StatusRedBusy> : <StatusBlueAvailable></StatusBlueAvailable>}
          <div className="mb-3">
              <p><label className="text-sm text-navy-700 dark:text-white font-bold">Question</label></p>
              <p><input onChange={handleQuestionChange} placeholder={PLACEHOLDER_QUESTION} value={question} type="text" id="question" name="question" className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200"></input></p>
              <br/><Dropdown4 title={"Pick a model:  "} handleChange={handleModelPickedChange}></Dropdown4>
              <button onClick={handleAskChatGPT} className="mt-2 inline-block p-3 rounded-lg shadow-sm bg-indigo-500 text-white">Ask ChatGPT</button>
              <br/><button onClick={handleResetConversation} className="mt-2 inline-block p-3 rounded-lg shadow-sm bg-indigo-500 text-white">Reset ChatGPT to start a new conversation</button>
          </div>
          <div className="mb-3">
            <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">From ChatGPT:</label>
            <br/><textarea readOnly value={answer} id="message" rows="8" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="ChatGPT answer goes here..."></textarea>
          </div>
          <div>
            {displayCode && <CodeHighlight code={code}></CodeHighlight>}
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
    </>
  );

}