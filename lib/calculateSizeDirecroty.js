const {execSync} = require('child_process');

const calculateSizeDirecroty = (itemFullStaticPath) => {
    const itemFullStaticPathCleaned = itemFullStaticPath.replace(/\s/g, '\ ');
    const commandOutput = execSync(`du -sh "${itemFullStaticPathCleaned}"`).toString();
    
    //var fileSize = commandOutput.replace(/\s/g, '');
    var fileSize = commandOutput.split("\t");
    //fileSize = fileSize.split('\\');
    fileSize = fileSize[0];
    
    const fileSizeUnit = fileSize.replace(/\d|\./g, '');
    const fileSizeNumber = parseFloat(fileSize.replace(/[a-z]/i, ''));
    
    const units = "BKMGT";
    const fileSizeBytes = fileSizeNumber * Math.pow(1000, units.indexOf(fileSizeUnit));
    
    return [fileSize, fileSizeBytes];
};

module.exports = calculateSizeDirecroty;