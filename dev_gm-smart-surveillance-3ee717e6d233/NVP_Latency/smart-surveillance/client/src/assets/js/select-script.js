function makeedit(elem) {
    var parentrow = elem.parentElement.parentElement.parentElement;
    var tds = parentrow.getElementsByTagName('td');

    if(elem.checked) {
         tds[4].style.display = "none";
         tds[5].style.display = "block";
         tds[7].style.display = "none";     
         tds[8].style.display = "block";
        } else {
                tds[4].style.display = "block"; 
                tds[5].style.display = "none";
                tds[7].style.display = "block";
                tds[8].style.display = "none";
        }

        }


function enableall(checkdone) {
        var inputs = document.getElementsByClassName('styled');
        for(var i=1; i<inputs.length; i++) {
                inputs[i].checked = checkdone;
                // makeedit(inputs[i]);       
        }
        if(!checkdone) {
                buttontoggle();
        }
}

function editchanges() {
        document.getElementById('editid').style.display='none';
        document.getElementById('saveid').style.display='inline-block';
        document.getElementById('deleteid').style.display='none';
        document.getElementById('cancelid').style.display='inline-block';
        var inputs = document.getElementsByClassName('styled');
        for(var i=1; i<inputs.length; i++) {
                if(inputs[i].checked) {
                makeedit(inputs[i]);   
                }     
        }
}

function buttontoggle() {
        document.getElementById('editid').style.display='inline-block';
        document.getElementById('saveid').style.display='none';
         var inputs = document.getElementsByClassName('styled');
        for(var i=1; i<inputs.length; i++) {
        makeedit(inputs[i]);
        }
}

function savechanges() {
        window.location.reload(true);
}
function cancelcheckbox() {
        // var inputs = document.getElementsByClassName('styled');
        // for(var i=0; i<inputs.length; i++) { 
        // inputs[i].checked=false;
        // }
        window.location.reload(true);
}