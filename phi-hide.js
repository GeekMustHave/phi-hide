// --- phi-hide.js  GeekMustHave
//     06/29/18

// -- Standard libs
const fs = require('fs');

// --- Command Line Interface CLI libraries, not required but, I wanted to up the cute content
const chalk       = require('chalk');
const clear       = require('clear');
const figlet      = require('figlet');
//const inquirer    = require('inquirer');

// --- ReadLine-Sync, better Sync control over terminal input
const readLineSync         = require('readline-sync');

// -- Abbrevation for console.log
const log = console.log;

// --- Fail for parms and other checks
let fail = false;

let inFile = "";
let outFile = "";
let phiFile = "";
let phiText = "";
let inputText = "";
let phiJSON = {};
let pause = '';

// --- Minimist is a parameter parsing function slice(2) is that arguments after 0=node, 1=program name
//     argv function for all parameters
const parms = require('minimist')(process.argv.slice(2));
//const parmsJson = JSON.stringify(parms, null, 4);
//log(`parms: ${parmsJson}`);

// --- Handle arguments send as --inFile abc.json --outFile abc.lll --phiFile alpha.json
if (!parms.hasOwnProperty('inFile')){fail=true}else{inFile=parms['inFile']}
if (!parms.hasOwnProperty('outFile')){fail=true}else{outFile=parms['outFile']}
if (!parms.hasOwnProperty('phiFile')){fail=true}else{phiFile=parms['phiFile']}



//let inFile = "./postman-test-run.json";
//let outFile = "./postman-test-run.out.json";
//let phiFile = "./phi-list.json" ;


/***********************************************
 * Let's get ready to rumble
 * 
 * 
 **********************************************/
  clear();
  console.log( chalk.yellow(figlet.textSync('PHI-Hide', {horizontalLayout: 'full'})  ));
 
  if(fail){
    log(chalk.green(`PHI-Hide Syntax:
    
    node phi-hide --inFile aaaa.json --outFile bbb.txt --phiFile hide.json 
   
    The -outFile will automatically be written over if it exist.

    The -outFile can be the same name ad the -inFile.

    `));
    // --- Compiled app's will close with process.exit so a pause is needed
    pause = readLineSync.keyIn('Press any key to continue...');
    process.exit(1);   //--- Exit with error

  } 
  

  
  log(chalk.blue(`Input File:  `) + chalk.yellow(`${inFile}`));
  log(chalk.blue(`Output File: `) + chalk.yellow(`${outFile}`));
  log(chalk.blue(`PHI File:    `) + chalk.yellow(`${phiFile}`));
  log("");


  // --- readFileSync used because files are small

  try {
    inputText = fs.readFileSync(inFile, 'UTF8'); 
    log(chalk.blue(`Input file:  `) + chalk.yellow(`${inFile} loaded.`))
  } catch (e) {
      fail = true;
      log(chalk.blue(`*** Error ${inFile}: ` + chalk.red(`File is missing`)));
      log(chalk.red(`PHI-Hide cancelled due to errors`));
      // --- Compiled app's will close with process.exit so a pause is needed
      pause = readLineSync.keyIn('Press any key to continue...');    
      process.exit(1);   //--- Exit with error
  }

  // console.log(inputText);

  try {
    phiText = fs.readFileSync(phiFile, 'UTF8');  
    log(chalk.blue(`PHI file:    `) + chalk.yellow(`${phiFile} loaded.`))
  } catch (e) {
      fail = true;
      log(chalk.blue(`*** Error ${phiFile}: ` + chalk.red(`File is missing`)));
      log(chalk.red(`PHI-Hide cancelled due to errors`));
      // --- Compiled app's will close with process.exit so a pause is needed
      pause = readLineSync.keyIn('Press any key to continue...'); 
      process.exit(1);   //--- Exit with error
  }

  // -- Loop through PHI pairs and replace beneficiary ID with abbrev
  phiJSON = JSON.parse(phiText);
  let thisText = "";
  let thatText = "";
  //let outText = "";
  let count = 0;

  log("");
  log(chalk.blue('Processing...'));
  phiJSON.forEach(replacePair => {
    // --- global change requires a /text/g    
    thisText = replacePair.beneID;
    // log(thisText );
    thatText = replacePair.abbrev;
    // --- Count Occurances of thisText, the RegExp with 'g' is global count, || [] handles no occurance
    count = (inputText.match(new RegExp(thisText, 'g')) || []).length;
    log(chalk.yellow(`Abbrev: ${thatText} replace will be done ${count} times`))
    // --- Reference: https://stackoverflow.com/questions/1144783/how-to-replace-all-occurrences-of-a-string-in-javascript
    //     'g' is global
    inputText = inputText.replace(new RegExp(thisText, 'g'), thatText);
  });

  //log(`Input Text: ${inputText}`);

  // --- Write output
  fs.writeFileSync( outFile, inputText);
  log("");
  log(chalk.blue(`Output file written:  `) + chalk.yellow(`${outFile}`));
 
  console.log( chalk.yellow(figlet.textSync('Done', {horizontalLayout: 'full'})  ));