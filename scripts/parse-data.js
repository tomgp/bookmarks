import { csvParse } from 'd3-dsv';
import fs from 'fs';
import path from 'path';

const dataDir = './data';
const csvFileList = fs.readdirSync(dataDir)
  .filter(fileName=>(fileName.indexOf('.csv') > 0));

csvFileList.forEach(fileName=>{
  const data = csvParse(fs.readFileSync(path.join(dataDir,fileName),'utf-8'), parseRow);
  const [sheetName] = fileName.split('.');
  console.log(sheetName, data);
});

function parseRow(row){
  // if the column name is encapsulated by [] then it's value is a comma separated list which should be split into an array 
  const parsed = {};
  const listExpression = new RegExp(/^\[.+\]$/, 'i');
  Object.entries(row).forEach(([header, value])=>{
    let headerName = header;
    let parsedValue = value;
    if(listExpression.test(header)){
      headerName = header.split(/[\[\]]/)[1];
      parsedValue = value.split(',').map(e=>String(e).trim());
    }
    parsed[headerName] = parsedValue;
  })
  return parsed;
}