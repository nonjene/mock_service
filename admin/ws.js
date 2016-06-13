var ws = new WebSocket('ws://' + window.location.hostname + ":3336");

function htmlToText(html) {
    var tmp = document.createElement("DIV");
    tmp.innerText = html;
    return tmp.innerHTML || "";
}

var container = document.getElementById("jsoneditor");
var options = {
    mode: "tree",
    search: false,
    sortObjectKeys:false,
    modes:["tree","code"]
};
var editor = new JSONEditor(container, options);


// get json
function o(el) {
    var data = {};
    data.id = el["input-id"].value;
    data.body = editor.get();
    ws.send(JSON.stringify(data));
}
function o_import(json){
    editor.set( json );
}
ws.onmessage = function(data) {
    console.log(data.data);
    document.querySelector("#log").innerHTML += "<br>" + htmlToText(data.data);
};
