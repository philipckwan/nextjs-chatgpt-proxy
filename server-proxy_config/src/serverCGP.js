import express from "express";
import {timeLog} from "./PCKUtils.js"
import {Constants} from "./Constants.js"
import {} from 'dotenv/config';
import CryptoJS from "crypto-js";

const app = express();
app.use(express.json());

let accessToken = "n/a";

/* This below helps with CORS for calling from other places like a nextjs
 https://stackoverflow.com/questions/65058598/nextjs-cors-issue
*/
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
if (req.method == "OPTIONS") {
  res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
  return res.status(200).json({});
}
next();
});

/**
 * GET /version
 * 
 */
app.get("/version", (req, res) => {
  timeLog(`serverCGP: get /version;`);
  let apiResponse = {name: Constants.name, version: Constants.version, uuid: Constants.uuid,};
  res.json(apiResponse);
});


app.post("/config/access_token", (req, res) => {
  timeLog(`serverCGP: post /config/access_token: 1.0;`);
  let passphrase = req.body.passphrase;
  let new_token = req.body.new_token;
  timeLog(`serverCGP: post /config/access_token/:passphrase/:new_token: passphrase:[${passphrase}], new_token:[${new_token}];`);
  let passphraseHash = CryptoJS.MD5(passphrase);
  if (process.env.PASSPHRASE_HASH == passphraseHash) {
    accessToken = new_token;
    res.json({status:"OK", message:"token updated successfully"});
  } else {
    res.json({status:"ERROR", message:"token update failed"});
  }
})

app.get("/config/access_token", (req, res) => {

  timeLog(`serverCGP: get /config/access_token;`);
  res.json({access_token: accessToken});
})


app.listen(5000, () => {
  //timeLog("serverBattleship: Server started on port 5000 pck; 3.3");
  timeLog(`serverCGP: Server started on port 5000; pck: version:${Constants.version};`);

})