import {timeLog} from "../lib/PCKUtils";
import {useState, useRef} from "react";
//import {Landing} from "../pages/landing";
//import {ChatGPTUnofficialProxyAPI} from 'chatgpt';
import {Constants} from "../lib/Constants";
import {Dropdown3} from "../components/Dropdown3";
import {StatusGreenAvailable} from "../components/StatusGreenAvailable";
import {StatusRedBusy} from "../components/StatusRedBusy";
import { StatusBlueAvailable } from "@/components/StatusBlueContinue";

const PLACEHOLDER_QUESTION="What ChatGPT model are you? And what is today's date?";


export default function Conversation() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("n/a");
  const chatgptModelPicked = useRef("n/a");
  const [chatgptState, setChatgptState] = useState(Constants.CHATGPT_CONVERSATION_STATE.FRESH);
  //const [isBusy, setIsBusy] = useState(false);
  const thisConversationId = useRef("");
  const thisParentMessageId = useRef("");

  async function handleQuestionChange(event) {
    //timeLog(`handleQuestionInputChange: 1.0;`);
    setQuestion(event.target.value);
  }

  async function handleAskChatGPT() {
    //timeLog(`handleAskChatGPT: 1.0;`);

    let accessToken = process.env.ACCESS_TOKEN;

    timeLog(`Conversation.handleAskChatGPT: chatgptModelPicked.current:[${chatgptModelPicked.current}];`);
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
    //timeLog(`Conversation.handleAskChatGPT: model:${model}; thisConversationId.current:[${thisConversationId.current}]; thisParentMessageId.current:[${thisParentMessageId.current}];`);
    let apiReverseProxyUrl = "https://ai.fakeopen.com/api/conversation";
    
    const chatgpt = await import('chatgpt');
    const api = new chatgpt.ChatGPTUnofficialProxyAPI({
      accessToken,
      apiReverseProxyUrl,
      model,
    });
    
    let questionToAsk = question == "" ? PLACEHOLDER_QUESTION : question;

    timeLog(`Conversation.handleAskChatGPT: questionToAsk:[${questionToAsk}];`);
    api.sendMessage(questionToAsk, {
      conversationId: thisConversationId.current,
      parentMessageId: thisParentMessageId.current,
    }).then(
      (res) => {
        let answerFromAPI = res.text;
        let newId = res.id;
        let newConversationId = res.conversationId;
        timeLog(`Conversation.handleAskChatGPT: newConversationId:[${newConversationId}]; newId:[${newId}];`);
        //timeLog(`Conversation.handleAskChatGPT: answerFromAPI:[${answerFromAPI}];`);
        thisConversationId.current = newConversationId;
        thisParentMessageId.current = newId;
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
    setChatgptState(Constants.CHATGPT_CONVERSATION_STATE.BUSY);
  }

  function handleResetConversation() {
    timeLog(`Conversation.handleResetConversation: 1.0;`);
    thisConversationId.current = "";
    thisParentMessageId.current = "";
    setChatgptState(Constants.CHATGPT_CONVERSATION_STATE.FRESH);
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
      <p>[Conversation] Use this Chat-GPT proxy to ask ChatGPT anything, in a conversation style (i.e. You can continue to chat with ChatGPT after it answers)</p>  
        <div className="!z-5 relative flex flex-col rounded-[20px] max-w-[600px] md:max-w-[800px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 flex flex-col w-full !p-6 3xl:p-![18px] bg-white undefined">                
          {chatgptState == Constants.CHATGPT_CONVERSATION_STATE.FRESH ? <StatusGreenAvailable></StatusGreenAvailable> : chatgptState == Constants.CHATGPT_CONVERSATION_STATE.BUSY ? <StatusRedBusy></StatusRedBusy> : <StatusBlueAvailable></StatusBlueAvailable>}
          <div className="mb-3">
              <label className="text-sm text-navy-700 dark:text-white font-bold">Question</label>
              <input onChange={handleQuestionChange} placeholder={PLACEHOLDER_QUESTION} value={question} type="text" id="question" name="question" className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200"></input>
              <br/><Dropdown3 ref={chatgptModelPicked} title={"Pick a model:  "}></Dropdown3>
              <button onClick={handleAskChatGPT} className="mt-2 inline-block p-3 rounded-lg shadow-sm bg-indigo-500 text-white">Ask ChatGPT</button>
              <br/><button onClick={handleResetConversation} className="mt-2 inline-block p-3 rounded-lg shadow-sm bg-indigo-500 text-white">Reset ChatGPT to start a new conversation</button>
          </div>
          <div className="mb-3">
            <label for="message" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">From ChatGPT:</label>
            <textarea readOnly value={answer} id="message" rows="4" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="ChatGPT answer goes here..."></textarea>
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