#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var restler = require('restler');
var program = require('commander');
var cheerio = require('cheerio');

var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var WEBPAGEURL_DEFAULT = "http://mighty-citadel-7316.herokuapp.com";

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};
/*Asserts a web page is found */
var assertURLExists = function(inurl){
  restler.get(inurl).on('complete', function(webpage){
    if(webpage instanceof Error){
      console.error("%s not found. Exiting.", webpage);
      process.exit(1);
    } 
   // console.log(webpage);
    return webpage;
  }); 
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var cheerioWebPage = function (webpage) {
  return cheerio.load(webpage)
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var checkWebPage = function(webpage, checksfile) {
    $ = cheerioWebPage(webpage);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    //console.log(out +"\n");
    return out;
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
	.option('-u, --url <webpage_url>', 'URL of the webpage', clone(assertURLExists), WEBPAGEURL_DEFAULT)
        .parse(process.argv);
    if(program.file){
      console.log("option == file\n");
     //var  checkJson = checkHtmlFile(program.file, program.checks);
     console.log(JSON.stringify(checkHtmlFile(program.file, program.checks), null, 4));     
    }else{
      //var checkJson2 = checkWebPage(program.url, program.checks);
      console.log("option == url\n");  
      console.log(JSON.stringify(checkWebPage(program.url, program.checks), null, 4));
   }  
    //var outJson = JSON.stringify(checkJson, null, 4);
    //console.log(outJson);
} else {
    exports.checkHtmlFile = checkHtmlFile;
    exports.checkWebPage = checkWebPage;
}
