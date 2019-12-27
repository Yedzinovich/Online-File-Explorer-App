const {execSync} = require('child_process');

try{
    const result = execSync('du -sh ""').toString();
}catch(err){
    console.log(`Error: ${err}`);
}