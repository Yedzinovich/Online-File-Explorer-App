//modules
const url = require('url');
const path = require('path');
const fs = require('fs');

//imports
const buildBreadCrump = require('./breadcrump');

const staticBasePath = path.join(__dirname, '..', 'static');

const respond = (request, response) => {
    var pathname = url.parse(request.url, true).pathname;
    if(pathname === '/favicon.ico'){
        return false;
    }
    
    pathname = decodeURIComponent(pathname);
    
    const fullStaticPath = path.join(staticBasePath, pathname);
    
    if(!fs.existsSync(fullStaticPath)){
        console.log(`${fullStaticPath} does not exist`);
        response.write('404: File not found!');
        response.end();
        return false;
    }
    
    var stats;
    try{
        stats = fs.lstatSync(fullStaticPath);
    }catch(err){
        console.log(`lstatSync Erroe: ${err}`);
    }
    
    if(stats.isDirectory()){
        var data = fs.readFileSync(path.join(staticBasePath, 'project_files/index.html'), 'utf-8');
        
        var pathElements = pathname.split('/').reverse();
        pathElements = pathElements.filter(element => element !== '');
        const folderName = pathElements[0]; 
        data = data.replace('Page_title', folderName);
        
        const breadcrumb = buildBreadCrump(pathname);
        
        response.statusCode = 200;
        response.write(data);
        response.end();
        
}

module.exports = respond;