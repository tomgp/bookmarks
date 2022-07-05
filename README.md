
# Making up a Github action that gets a google sheet, does some transforms and stuff, commits the result to a repo 

our spreadsheet

https://docs.google.com/spreadsheets/d/10x0DkhnDBOfAV8-cUbDeh1BBTQKuncwEozScRJZV4m4/edit#gid=0

## Lets start with googles [NodeJS quickstart](https://developers.google.com/sheets/api/quickstart/nodejs)

0. Make a new node project: `npm init` and a new git repo `git init` etc. and push to Github TODO:find a link for git basics
1. Do some Google setup: In Google's dashboard, as per _NodeJS quickstart_  [Create a project](https://developers.google.com/workspace/guides/create-project) and [enable the _Google Sheets API_](https://developers.google.com/workspace/guides/enable-apis) [here it is](https://console.cloud.google.com/apis/library/sheets.googleapis.com). [Create credentials](https://developers.google.com/workspace/guides/create-credentials)

We're going to try and use a [Service account](https://developers.google.com/workspace/guides/create-credentials#service-account) so that we can keep our spreadsheet private

2. Install the client library `npm i google-spreadsheet` which is much more friendly than googles default 

here's my minimal script 
```js
const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('./.keys/bookmarks-tgp-creds.json'); // the file saved from the credential creation process. make sure you don't add it to git!
// Initialize the sheet - doc ID is the long id in the sheets URL

(async function() {

  const doc = new GoogleSpreadsheet('<your sheet id here');
  await doc.useServiceAccountAuth(creds);

  await doc.loadInfo(); // loads document properties and worksheets
  console.log(doc.title);

  const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
  console.log(sheet.title);
  console.log(sheet.rowCount);
})();
```