import {timeLog} from "./PCKUtils"
//import {Constants} from "./Constants";

const apiReverseProxyUrl = "https://ai.fakeopen.com/api/conversation";
const accessTokenFromEnv = process.env.ACCESS_TOKEN;
const ACCESS_TOKEN_FROM_ENV_BYPASS = "bypass";

export class ChatGPTProxyEngine {

  static async instantiateAPI(model) {
    timeLog(`ChatGPTProxyEngine.instantiateAPI: model:[${model}];`);
    let accessToken;
    if (accessTokenFromEnv == ACCESS_TOKEN_FROM_ENV_BYPASS) {
      timeLog(`ChatGPTProxyEngine.instantiateAPI: getting accessToken from server;`);
      const response = await fetch(`/api/config/access_token`, {
        method: "get",
        headers: {'Content-Type':'application/json'},
      });
      let respJson = await response.json();
      accessToken = respJson.access_token;
    } else {
      timeLog(`ChatGPTProxyEngine.instantiateAPI: getting accessToken from env;`);
      accessToken = accessTokenFromEnv;
    }    
    timeLog(`__accessToken:[${accessToken}];`);
    //timeLog(`ChatGPTProxyEngine.instantiateAPI: accessTokenFromEnv.length:[${accessTokenFromEnv.length}]; accessTokenFromEnv[0...9]:[${accessTokenFromEnv.substring(0,10)}];`);
    //timeLog(`ChatGPTProxyEngine.instantiateAPI: accessTokenFromAPI.length:[${accessTokenFromAPI.length}]; accessTokenFromAPI[0...9]:[${accessTokenFromAPI.substring(0,10)}];`);
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
