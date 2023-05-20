import {timeLog} from "../lib/PCKUtils";
import {useState, useRef, useEffect} from "react";
import {Constants} from "../lib/Constants";
import {ChatGPTProxyEngine} from "../lib/ChatGPTProxyEngine";
import {Dropdown4} from "../components/Dropdown4";
import {StatusGreenAvailable} from "../components/StatusGreenAvailable";
import {StatusRedBusy} from "../components/StatusRedBusy";

const PLACEHOLDER_NUMQUESTIONS="12";
const PLACEHOLDER_GRADE="2";

const OPEN_SQUARE_BRACKET = "[";
const CLOSE_SQUARE_BRACKET = "]";

export default function FillInTheBlanksPrepositions() {

  const [numQuestions, setNumQuestions] = useState("");
  const [grade, setGrade] = useState("");
  const [answer, setAnswer] = useState("");
  const [answerWithBlanks, setAnswerWithBlanks] = useState("");
  const [modelPicked, setModelPicked] = useState(Constants.CHATGPT_MODEL.GPT_3_5_TURBO);
  const [isBusy, setIsBusy] = useState(false);
  const conversationIdRef = useRef("");
  const parentMessageIdRef = useRef("");
  const [answersSplit, setAnswersSplit] = useState(["","","","",""]);
  const [copied, setCopied] = useState(0);
  const apiRef = useRef();

  useEffect(() => {
    timeLog(`FillInTheBlanksPrepositions.useEffect[modelPicked]: modelPicked:[${modelPicked}];`);
    // trigger the api to re-instantiate
    apiRef.current = undefined;
    conversationIdRef.current = "";
    parentMessageIdRef.current = "";
  }, [modelPicked]);

  function handleModelPickedChange(event) {
    timeLog(`FillInTheBlanksPrepositions.handleModelPickedChange: event.target.value:[${event.target.value}];`);
    setModelPicked(event.target.value);
  }

  function handleNumQuestionsChange(event) {
    setNumQuestions(event.target.value);
  }

  function handleGradeChange(event) {
    setGrade(event.target.value);
  }

  function handleCopyToClipboard(idx) {
    timeLog(`FillInTheBlanksPrepositions.handleCopyToClipboard: idx:${idx};`);
    let textToCopy;
    if (idx == 1) {
      textToCopy = answer;
    } else {
      textToCopy = answerWithBlanks;
    }
    navigator.clipboard.writeText(textToCopy).then(
      (res) => {
        timeLog(`FillInTheBlanksPrepositions.handleCopyToClipboard: copy success!`);
        setCopied(idx);
      }, (reason) => {
        timeLog(`FillInTheBlanksPrepositions.handleCopyToClipboard: copy failed!`);
      }
    )
  }

  function createAnswerWithBlanks(answerInput) {
    let answer = answerInput;
    let results = "";
    while (true) {
      let nextOpenBracketMatched = answer.indexOf(OPEN_SQUARE_BRACKET);
      if (nextOpenBracketMatched <= 0) break;
      results += answer.substring(0, nextOpenBracketMatched) + "_____";
      let nextClosedBracketMatched = answer.indexOf(CLOSE_SQUARE_BRACKET);
      answer = answer.substring(nextClosedBracketMatched + 1);
    }
    timeLog(`FillInTheBlanksPrepositions.createAnswerWithBlanks: results:[${results}];`);
    return results;
  }

  async function handleAskChatGPT() {
    timeLog(`FillInTheBlanksPrepositions.handleAskChatGPT: 1.0; grade:[${grade}]; numQuestions:[${numQuestions}];`);

    let api = await ChatGPTProxyEngine.getAPI(apiRef, modelPicked);

    let gradeToAsk = grade == "" ? PLACEHOLDER_GRADE : grade;
    let numQuestionsToAsk = numQuestions == "" ? PLACEHOLDER_NUMQUESTIONS : numQuestions;
    //const questionToAsk=`You are a grade 4 English teacher. I want you to write an English exercise on prepositions. Write a few paragraphs of a story with a broad usage of prepositions. For the prepositions words, enclose the answer with brackets so that I know that they are the questions. The paragraph should contain around ${numQuestionsToAsk} questions in total.`;
    //const questionToAsk=`You are a grade ${gradeToAsk} English teacher. I want you to write an English exercise on prepositions. Write a few paragraphs of a story with a broad usage of prepositions. There should no more than ${numQuestionsToAsk} questions. For the prepositions words, enclose the answer with brackets.`;
    //const questionToAsk=`You are an English teacher. I want you to write an English story that are suitable for students of grade ${gradeToAsk}. Then, among the story, highlight no more than ${numQuestionsToAsk} uses of prepositions, enclose them with brackets.`;
    const questionToAsk=`Pretend that you are an English teacher. Write a short story suitable for grade ${gradeToAsk} students. Then, find the prepositions in this story and enclosed them with square brackets.`
    //const questionToAsk=`Pretend that you are an English teacher. Write 10 sentences that uses prepositions. Enclose the prepositions with brackets. The sentences should be suitable for grade ${gradeToAsk} students.`;
  
    timeLog(`FillInTheBlanksPrepositions.handleAskChatGPT: questionToAsk:[${questionToAsk}]; conversationIdRef.current:[${conversationIdRef.current}]; parentMessageIdRef.current:[${parentMessageIdRef.current}];`);
    let sendMessageJson = (conversationIdRef.current != "") ? {conversationId: conversationIdRef.current, parentMessageId: parentMessageIdRef.current} : {};

    timeLog(`FillInTheBlanksPrepositions.handleAskChatGPT: sendMessageJson:[${JSON.stringify(sendMessageJson)}];`);
    api.sendMessage(questionToAsk, sendMessageJson).then(
      (res) => {
        let answerFromAPI = res.text;
        let newId = res.id;
        let newConversationId = res.conversationId;
        timeLog(`FillInTheBlanksPrepositions.handleAskChatGPT: newConversationId:[${newConversationId}]; newId:[${newId}];`);
        //timeLog(`FillInTheBlanksPrepositions.handleAskChatGPT: answerFromAPI:[${answerFromAPI}];`);
        conversationIdRef.current = newConversationId;
        parentMessageIdRef.current = newId;
        setAnswer(answerFromAPI);
        let newAnswerWithBlanks = createAnswerWithBlanks(answerFromAPI);
        setAnswerWithBlanks(newAnswerWithBlanks);
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

    setCopied(0);
    setAnswer("");
    setAnswerWithBlanks("");
    setIsBusy(true);
  }


  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-6 pt-12">

      <div className="flex flex-col justify-center items-center h-[100vh]">
      <p>ChatGPT Proxy App, by philipckwan [{Constants.APP_VERSION}]</p>
      
        <div className="!z-5 relative flex flex-col rounded-[20px] max-w-[600px] md:max-w-[800px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 flex flex-col w-full !p-6 3xl:p-![18px] bg-white undefined">                
          {isBusy ? <StatusRedBusy></StatusRedBusy> : <StatusGreenAvailable></StatusGreenAvailable>}<br/>
          <div className="mb-3">
              <p><label className="text-lg text-navy-700 dark:text-white">I want ChatGPT to help me to come up with questions for prepositions, in the form of a short story</label></p>
              {/*<p>Around how many questions? <input onChange={handleNumQuestionsChange} placeholder={PLACEHOLDER_NUMQUESTIONS} value={numQuestions} type="text" id="numQuestions" name="numQuestions" className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200"></input></p>*/}
              <p><br/>For what grade student?<input onChange={handleGradeChange} placeholder={PLACEHOLDER_GRADE} value={grade} type="text" id="grade" name="grade" className="mt-1 flex h-8 w-full items-center justify-center rounded-xl border bg-white/0 p-1 text-sm outline-none border-gray-200"></input></p>
              {/*<br/><Dropdown3 ref={chatgptModelPicked} title={"Pick a model:  "}></Dropdown3>*/}
              <br/><Dropdown4 title={"Pick a model:  "} handleChange={handleModelPickedChange}></Dropdown4>
              <button onClick={handleAskChatGPT} className="mt-2 inline-block p-3 rounded-lg shadow-sm bg-indigo-500 text-white">Ask Chat-GPT</button>
          </div>
          <div className="mb-3">
            <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">From ChatGPT:</label> 
            {/*
            <div className="mt-1">1.{answersSplit[0]} <button onClick={() => handleCopyToClipboard(1)} className="inline-block p-1 rounded-lg shadow-sm bg-indigo-500 text-white">{copied == 1 ? "Copied" : "Copy"}</button></div>
            <div className="mt-1">2.{answersSplit[1]} <button onClick={() => handleCopyToClipboard(2)} className="inline-block p-1 rounded-lg shadow-sm bg-indigo-500 text-white">{copied == 2 ? "Copied" : "Copy"}</button></div>
            <div className="mt-1">3.{answersSplit[2]} <button onClick={() => handleCopyToClipboard(3)} className="inline-block p-1 rounded-lg shadow-sm bg-indigo-500 text-white">{copied == 3 ? "Copied" : "Copy"}</button></div>
            <div className="mt-1">4.{answersSplit[3]} <button onClick={() => handleCopyToClipboard(4)} className="inline-block p-1 rounded-lg shadow-sm bg-indigo-500 text-white">{copied == 4 ? "Copied" : "Copy"}</button></div>
            <div className="mt-1">5.{answersSplit[4]} <button onClick={() => handleCopyToClipboard(5)} className="inline-block p-1 rounded-lg shadow-sm bg-indigo-500 text-white">{copied == 5 ? "Copied" : "Copy"}</button></div>
            */}
            <p>
              <label htmlFor="message" className="block mb-2 text-xs font-medium text-gray-900 dark:text-white">Text with prepositions (answers) shown:</label> 
              <textarea readOnly value={answer} id="message" rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="ChatGPT answer goes here..."></textarea>
              <button onClick={() => handleCopyToClipboard(1)} className="inline-block my-1 p-1 rounded-lg shadow-sm bg-indigo-500 text-white">{copied == 1 ? "Copied" : "Copy"}</button>
            </p>
            <br/>
            <p>
              <label htmlFor="message" className="block mb-2 text-xs font-medium text-gray-900 dark:text-white">Text with prepositions (answers) replaced by underlines (blanks):</label> 
              <textarea readOnly value={answerWithBlanks} id="message" rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="ChatGPT answer goes here..."></textarea>
              <button onClick={() => handleCopyToClipboard(2)} className="inline-block my-1 p-1 rounded-lg shadow-sm bg-indigo-500 text-white">{copied == 2 ? "Copied" : "Copy"}</button>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
  
}
