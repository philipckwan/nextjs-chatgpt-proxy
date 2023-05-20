import {timeLog} from "./PCKUtils"
//import {Constants} from "./Constants";

const apiReverseProxyUrl = "https://ai.fakeopen.com/api/conversation";
const accessToken = process.env.ACCESS_TOKEN;

export class ChatGPTProxyEngine {

  static async instantiateAPI(model) {
    timeLog(`ChatGPTProxyEngine.instantiateAPI: model:[${model}];`);

    const chatgpt = await import('chatgpt');
    const api = new chatgpt.ChatGPTUnofficialProxyAPI({
      accessToken,
      apiReverseProxyUrl,
      model,
    });

    return api;
  }

  static async getAPI(apiRef, model) {
    timeLog(`ChatGPTProxyEngine.getAPI: apiRef.current:[${apiRef.current}]; model:[${model}];`);
    if (apiRef.current == undefined) {
      apiRef.current = await this.instantiateAPI(model);
    }
    return apiRef.current;
  }

}

//exports.ChatGPTProxyEngine = ChatGPTProxyEngine;
