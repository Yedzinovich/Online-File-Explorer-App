const fs = require('fs');
const path = require('path');

const calculateSizeDirecroty = require('./calculateSizeDirecroty.js');
const calculateSizeFile = require('./calculateSizeFile.js');

const buildMainContent = (fullStaticPath, pathname) => {
    var mainContent = '';
    var items;
    
    try{
        items = fs.readdirSync(fullStaticPath);
    }catch(err){
        console.log(`readdirSync error: ${err}`);
        return `<div class="alert alert-danger">Internal Server Error</div>`;
    }
    
    //remove hidden files
    items = items.filter(element => element !== '.DS_Store');
    
    //Home Directory hide project files
    if(pathname === '/'){
        items = items.filter(element => element !== 'project_files');
    }
    
    items.forEach(item => {
        const link = path.join(pathname, item);
        
        var itemDetails = {};
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
            
            [itemDetails.size, itemDetails.sizeBytes] = calculateSizeFile(itemDetails.stats);
        }
        
        itemDetails.timeStamp = parseInt(itemDetails.stats.mtimeMs);
        itemDetails.date = new Date(itemDetails.timeStamp);
        itemDetails.date = itemDetails.date.toLocaleString();
        
        mainContent += `<tr data-name="${item}" data-size="${itemDetails.sizeBytes}" data-time="${itemDetails.timeStamp}">
                            <td>${itemDetails.icon}<a href="${link}" target='${itemDetails.stats.isFile() ? "_blank": ""}'> ${item}</a></td>
                            <td>${itemDetails.size}</td>
                            <td>${itemDetails.date}</td>
                            <td></td>
                        </tr>`;
    });
    
    return mainContent;
};

module.exports = buildMainContent;