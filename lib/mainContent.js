const fs = require('fs');
const path = require('path');

const calculateSizeDirecroty = require('./calculateSizeDirecroty.js');

const buildMainContent = (fullStaticPath, pathname) => {
    var mainContent = '';
    var items;
    
    try{
        items = fs.readdirSync(fullStaticPath);
    }catch(err){
        console.log(`readdirSync error: ${err}`);
        return `<div class="alert alert-danger">Internal Server Error</div>`;
    }
    
    items.forEach(item => {
        const link = path.join(pathname, item);
        
        //icon
        var itemDetails = {};
        //var icon;
        //var stats;
        
        const itemFullStaticPath = path.join(fullStaticPath, item);
        try{
            itemDetails.stats = fs.statSync(itemFullStaticPath);
        }catch(err){
            console.log(`statSync error: ${err}`);
            mainContent `<div class="alert alert-danger">Internal Server Error</div>`;
            return false;
        }
        
        if(itemDetails.stats.isDirectory()){
            itemDetails.icon = '<ion-icon name="folder"></ion-icon>';
            
            [itemDetails.size, itemDetails.sizeBytes] = calculateSizeDirecroty(itemFullStaticPath);
        }
        else if(itemDetails.stats.isFile()){
            itemDetails.icon = '<ion-icon name="document"></ion-icon>';
            
            //[itemDetails.size, itemDetails.sizeBytes] = calculateSizeFile();
        }
        
        mainContent += `<tr>
                            <td>${itemDetails.icon}<a href="${link}"> ${item}</a></td>
                            <td>${itemDetails.size}</td>
                            <td></td>
                        </tr>`;
    });
    
    return mainContent;
};

module.exports = buildMainContent;