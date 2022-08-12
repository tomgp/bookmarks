
>Google Spreadsheets can be used as simple and collaborative databases, they make getting a data driven site going much easier than traditional databases. 

&mdash; [Jessica Lord](http://jlord.us/sheetsee.js/), creator of Sheetsee

# Using a Google Sheet &amp; Github Actions to drive a website

## The Problem

Working, [as I do](https://www.2x2.graphics), on data driven web sites I've often faced the need to bridge the gap between the data being provided by journalists, researchers, or other subject matter specialists and publishing that information to a live website. 

Data driven website such as [election results services](https://ig.ft.com/us-elections/results/), [electricity usage tracers](https://electricinsights.co.uk/#/dashboard?period=7-days&start=2017-04-14&&_k=9lhek8) and so on rarely share a data format and so can be hard to squeeze into typical content management systems without a lot of customisation (time &amp; money).

## Solution

Over the years I've used (and written) a variety of systems which seek to make the data-to-websites process easier by leveraging the Google sheets' API.

Google sheets has many advantages but the most important are that it's already familiar to many people and that collaboration is core to the way the software works(permissions, history tracking, simultaneous editing).

It occurred to me a while back that it's probably feasible to achieve most of the stuff I'm interested re getting a Google spreadsheet onto a website with GitHub actions. Github actions can be triggered manually, by some event on the repo e.g. creating a pull request, or on a cron-like timer which can provide a good degree of flexibility in terms of how and when data is added to a project/published.

### Overview

On our project repository we'll create a Github action which ... 
  1. Runs a NodeJS script to gets the contents of a Google spreadsheet and saves it as a set of CSVs
  2. Checks in the results of that script (a set of CSVs) to the repository

## Step by step

OK. In this section I'll outline the step you need to follow to set this up. for your repo/ Google sheet.

Pre-requisites: You should have [NodeJS]() and [Git]() installed on your computer. You should have a Github account and Google account. I'm assuming you're using Linux or MacOS.

### Set up a NodeJS project and a git hub repo

Make a new directory for your project:
```sh
mkdir myNewProject
```
Move to project directory:
```sh
cd myNewProject
```
Initialise the Node project, (for the prompts just accept the defaults, you can always edit the `package.json` file later):
```sh
npm init 
```

OK, now let's initialise a git repo in our project directory..

```sh
git init
```
before we add anything to the repo we should add a `.gitignore` file the easiest thing to do is get [githubs basic one for Node projects](https://github.com/github/gitignore/blob/main/Node.gitignore)

```sh
curl https://raw.githubusercontent.com/github/gitignore/main/Node.gitignore > .gitignore
```

now lets do our first commit
```sh
git add .
git commit -m "start of a new project"
```

Finally create a GitHub repo, there are a few ways to do this but I normally do it through the website on [this page](https://github.com/new) and follow the instructions to add that remote repo to your existing local project. 

OK. So now you should have an empty NodeJS project on your local computer connected to a GitHub repository.

### Create a service account on google and share your sheet with it

### Write the node script

The only direct dependency we'll be needing is [google-spreadsheet](https://www.npmjs.com/package/google-spreadsheet) which wraps googles own NodeJS client library to provide a more friendly/ intuitive way of dealing with spreadsheets, let's install it:

```sh
npm i google-spreadsheet
```

### Create the github action

### Next steps




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


## Prior Art

 * I came across [Jessica Lord](http://jlord.us/sheetsee.js/)'s __[SheetSee](http://jlord.us/sheetsee.js/)__ way back in 2012, it was the first time I'd seen anyone using Google sheets as a kind of CMS. It's client side  which is both a strength and weakness.
 * __[Bertha](https://github.com/Financial-Times/bertha)__ I believe [Luke Kavanagh](https://github.com/kavanagh) initially developed this (or it's immediate forerunner) to power the FTs 2012 US election coverage. By the time I left the FT in 2017 it was an integral part of their online setup. As well as powering a big chunk of the data journalism and graphics work it was used to manage configurations for other systems. Because it updates in more or less real time you have to place trust in those editing the spreadsheet. 
 * __[ExpreCSV](https://github.com/aftertheflood/exprecsv)__ was my attempt to formalize the code I'd written time after time for quick prototyping work it borrows some ideas from Bertha around providing additional structure via column and sheet naming conventions whilst jettisoning a bunch of stuff that I never used. It's a bit half baked.
 * With __[Laundromat](https://github.com/signal-noise/laundromat)__ [Marcel Kornblum](https://marcelkornblum.com/project-laundromat-bac78ba82bb2) took a slightly different tack. Instead of directly providing an API endpoint that updates alongside the Google sheet Laundromat instead sends spreadsheet data to a git repository and creates a pull request allowing for an additional QA step. This means that parsing the resulting spreadsheets into JSON (or whatever) if required is an additional step, often carried out in CI.