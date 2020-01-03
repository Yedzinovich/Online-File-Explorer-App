const children = $('tbody').children();

var children_arr = [];
for(var i = 0; i < children.length; i++){
    children_arr.push(children[i]);
}

const items = [];
children_arr.forEach(element => {
    const rowDetails = {
    name: element.getAttribute('date-name'), 
    size: parseInt(element.getAttribute('date-size')), 
    time: parseInt(element.getAttribute('date-time')), 
    html: element.outerHTML
    };
    items.push(rowDetails);
});

//Sort Status
const sortStatus = {
    name: 'none', 
    size: 'none', 
    time: 'none'
};

const sort_up = (items, type) => {
  items.sort((obj1, obj2) => {
      var val1, val2;
      
      if(type === 'name'){
        val1 = obj1.name.toLowerCase();
        val2 = obj2.name.toLowerCase();
      }
      else if(type === 'size'){
        val1 = obj1.size;
        val2 = obj2.size;    
      }
      else {
        val1 = obj1.time;
        val2 = obj2.time;
      }
      
      if(val1 < val2)
        return -1;
      if(val1 > val2)
        return 1;
      return 0;
  });  
};

const sort_down = (items, type) =>{
    sort_up(items,type);
    items.reverse();
};

//fill table body with items
const fill_table_body = (items) =>{
    const content = items.map(element => element.html.join());
    $('tbody').html(content);
};

//events listeners
document.getElementById('table_head_row').addEventListener('click', event => {
    if(event.target) {
        $('ion-icon').remove();
            
        if(sortStatus[event.target.id] in ['none', 'down']){
            sort_up(items, event.target.id );
            sortStatus[event.target.id] = 'up';
                
            event.target.innerHTML += ' <ion-icon name="arrow-dropup-circle"></ion-icon>';
        }
        else if(sortStatus[event.target.id] === 'up'){
            sort_down(items, event.target.id);
            sortStatus[event.target.id] = 'down';
            event.target.innerHTML += ' <ion-icon name="arrow-dropdown-circle"></ion-icon>'
        }
        fill_table_body(items);
    }
});