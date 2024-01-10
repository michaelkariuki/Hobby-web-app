const fs = require('fs');
const filePath = __dirname + '/session.json'

var data = null;
var timestamp = null;
var file_descriptor = fs.openSync(filePath); 

function checkForUpdates(path= filePath){
    const stats = fs.statSync(path);
    return stats.mtime
}

function getData(){
    if(timestamp !== checkForUpdates()){
        let rawData = fs.readFileSync(filePath);
        data = JSON.parse(rawData);
        timestamp = checkForUpdates();
    }else{
        return 
    }
}


function editSession(Data= {userId: undefined, name: undefined}){
    getData();

    var seshData = {}
    var dataKeys = Object.keys(Data)

    for(idx=0; idx<dataKeys.length; idx++){
        seshData[dataKeys[idx]] = Data[dataKeys[idx]]
    }
  
    var json = JSON.stringify(seshData);
    fs.writeFileSync(filePath, json, 'utf8');
    fs.close(file_descriptor, err=>{
        if(err){
            // console.error(err)
            console.log("ERROR: Something went wrong...")

        }
    })
}

function getSessionInfo(){
    getData();
    return data;
}

function clearSessionInfo(){
    getData();
    var json = JSON.stringify({});
    fs.writeFileSync(filePath, json, 'utf8');
    fs.close(file_descriptor, err=>{
        if(err){
            // console.error(err)
            console.log("ERROR: Something went wrong...")
        }
    })
}

exports.getSessionInfo = getSessionInfo
exports.editSession = editSession
exports.clearSessionInfo = clearSessionInfo
