//modules
const url = require('url');
const path = require('path');
const fs = require('fs');

//imports
const buildBreadCrump = require('./breadcrump.js');
const buildMainContent = require('./mainContent.js');
const getMimeType = require('./getMimeType.js');

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
        console.log(`lstatSync Error: ${err}`);
    }
    
    if(stats.isDirectory()){
        var data = fs.readFileSync(path.join(staticBasePath, 'project_files/index.html'), 'utf-8');
        
        var pathElements = pathname.split('/').reverse();
        pathElements = pathElements.filter(element => element !== '');
        var folderName = pathElements[0];
        if(folderName === undefined){
            folderName = "Home";
        }
        
        const breadcrumb = buildBreadCrump(pathname);
        const mainContent = buildMainContent(fullStaticPath, pathname);
        
        data = data.replace('Page_title', folderName);
        data = data.replace('pathname', breadcrumb);
        data = data.replace('mainContent', mainContent);
        
        response.statusCode = 200;
        response.write(data);
        return response.end();
    }
    
    if(!stats.isFile()){
        response.statusCode = 401;
        response.write('401: Access denied!');
        console.log('not a file!');
        return response.end();
    }
    
    var fileDetails = {};
    fileDetails.extname = path.extname(fullStaticPath);
    
    var stat;
    try{
        stat = fs.statSync(fullStaticPath);
    }catch(err){
        console.log(`Error: ${err}`);
    }
    fileDetails.size = stat.size;
    
    getMimeType(fileDetails.extname)
    .then(mime => {
        var head = {};
        var options = {};
        var statusCode = 200;
        
        //Different filetypes options to display
        head['Content-Type'] = mime;
        if(fileDetails.extname === 'pdf'){
            header['Content-Disposition'] = 'inline';
            //header['Content-Disposition'] = 'attachment;filename=file.pdf';
        }
        if(RegExp('audio').test(mime) || RegExp('video').test(mime)){
            //accept-ranges
            head['Accept-Ranges'] = 'bytes';
            const range = request.headers.range;
            if(range){
                //get start and end
                const start_end = range.replace(/bytes=/, "").split('-');
                const start = parseInt(start_end[0]);
                const end = (start_end[1] ? parseInt(start_end[1]) : fileDetails.size - 1);
                

                head['Content-Range'] = `byes ${start} - ${end}/${fileDetails.size}`;
                head['Content-Length'] = end - start + 1;
                statusCode = 206; 
                
                options = {start, end};
            }

        }
        
        
        const fileStream = fs.createReadStream(fullStaticPath, options);
        response.writeHead(statusCode, head);
        fileStream.pipe(response);
        
        //events
        fileStream.on('close', () => {
            return response.end();
        });
        fileStream.on('error', (error) => {
            console.log(error.code);
            response.statusCode = 404;
            response.write('404: File streaming error!');
            return response.end();
        });
        
        
    })
    .catch(err => {
        response.statusCode = 500;
        response.write('500: Internal server error!');
        console.log(`Promise error ${err}`);
        return response.end();
    });
        
}

module.exports = respond;