#!/usr/bin/env node

var child_process = require('child_process');

function runCmd(cmd)
{
  var resp = child_process.execSync(cmd);
  var result = resp.toString('UTF8');
  return result;
}

var cmd = 'curl -d "{ keyword : 3532j2384 }" -H "Content-Type: application/json" -X POST http://localhost:4000/manage/search';  
var result = runCmd(cmd);

console.log(result);
