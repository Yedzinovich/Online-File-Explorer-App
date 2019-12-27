//modules
const path = require('path');

const buildBreadCrump = pathname => {
    const pathChunks = pathname.split('/').filter(element => element !== '');
    
    var breadcrumb = `<li class="breadcrumb-item"><a href="#">Home</a></li>`;
    
    var link = '/';
    pathChunks.forEach((item, index) => {
        if(index !== pathChunks.length - 1){
            link = path.join(link, item);
            breadcrumb += `<li class="breadcrumb-item"><a href="${link}">${item}</a></li>`;
        }
        else{
            breadcrumb += `<li class="breadcrumb-item active" aria-current="page">${item}</li>`;
        }
    });
    return breadcrumb;
};

module.exports = buildBreadCrump;