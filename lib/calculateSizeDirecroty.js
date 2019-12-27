const {execSync} = require('child_process');

const calculateSizeDirecroty = (itemFullStaticPath) => {
    const itemFullStaticPathCleaned = itemFullStaticPath.replace(/\s/g, '\ ');
    const commandOutput = execSync(`du -sh "${itemFullStaticPathCleaned}"`).toString();
    console.log(commandOutput);
    
    //var fileSize = commandOutput.replace(/\s/g, '');
    var fileSize = commandOutput.split("\t");
    //fileSize = fileSize.split('\\');
    fileSize = fileSize[0];
    
    const fileSizeUnit = fileSize.replace(/\d|\./g, '');
    
    const fileSizeNumber = fileSize.replace(/[a-z]/i, '');
    console.log(fileSizeNumber);
    
    return [fileSize, 110*1000*1000];
};

module.exports = calculateSizeDirecroty;