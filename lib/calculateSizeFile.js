
const calculateSizeFile = (stats) => {

    const fileSizeBytes = stats.size;
    const units = "BKMGT";
    const index = Math.floor(Math.log10(fileSizeBytes)/3);
    
    const fileSizeHuman = (fileSizeBytes/Math.pow(1000, index)).toFixed(1);
    const unit = units[index];
    
    const fileSize = `${fileSizeHuman}${unit}`;
    
    return [fileSize, fileSizeBytes];
};

module.exports = calculateSizeFile;