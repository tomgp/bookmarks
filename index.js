require('dotenv').config()
const fs = require('fs');
const { GoogleSpreadsheet } = require('google-spreadsheet');
// const creds = require('./.keys/bookmarks-tgp-creds.json'); // the file saved above
// Initialize the sheet - doc ID is the long id in the sheets URL
const sheetID = '10x0DkhnDBOfAV8-cUbDeh1BBTQKuncwEozScRJZV4m4';

const creds = {
  "private_key": process.env.GOOGLE_PRIVATE_KEY,
  "client_email": process.env.CLIENT_EMAIL
};

(async function() {
  const doc = new GoogleSpreadsheet(sheetID);
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo(); // loads document properties and worksheets
  
  Object.entries(doc.sheetsByTitle).forEach(async ([title, worksheet])=>{
    console.log(`Downloading ${title}...`);
    const CSV = await worksheet.downloadAsCSV();
    const location = `data/${title}.csv`
    fs.writeFile(location, CSV, (err)=>{
      if(err){
        console.error(`Problem saving ${title}: ${err}`);
      }else{
        console.log(`Saved ${title} to ${location}`);
      }
    });
  })
})()
.catch(err=>{
  console.log('OOOPS', err);
});
