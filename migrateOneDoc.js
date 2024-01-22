import fetch from 'node-fetch';
import {Headers} from 'node-fetch';
import markdown2confluence from '@shogobg/markdown2confluence';


const auth = "<paper auth token>";
const user = "<user name / email>"
const token = "<confluence auth token>>";
const space = "<confluence space>";

async function getTitle(auth, docId) {

  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + auth);
  myHeaders.append("Content-Type", "application/json");
  
  var raw = JSON.stringify({"doc_id":docId});
  
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  
  const metadataResponse = await fetch("https://api.dropboxapi.com/2/paper/docs/get_metadata", requestOptions);
  const response = await metadataResponse.json();
  return response.title;
}

async function getMarkdown(auth, docId) {
  var myHeaders = new Headers();
  myHeaders.append("Dropbox-API-Arg", "{\"doc_id\": \"" + docId + "\", \"export_format\":\"markdown\"}");
  myHeaders.append("Authorization", "Bearer " + auth);

  var raw = "";

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  const downloadResponse = await fetch("https://api.dropboxapi.com/2/paper/docs/download", requestOptions);
  const response = await downloadResponse.text();
  return response;
}

async function uploadToConfluence(username, token, space, title, content) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append('Authorization', 'Basic ' + Buffer.from(username + ":" + token, "utf8").toString("base64"));

  var raw = JSON.stringify({"type":"page","title":title,"space":{"key":space},"body":{"storage":{"value":content,"representation":"wiki"}}});

  var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
  };

  const response = await fetch("https://mendix.atlassian.net/wiki/rest/api/content", requestOptions);
  return "success";
}

export default async function go(docId) {
  const title = await getTitle(auth,docId);
  const md = await getMarkdown(auth,docId);
  const confluence =  markdown2confluence(md);
  uploadToConfluence(user,token, space, title, confluence);
}
