const fs = require('fs');
const filePath = __dirname + '/data.json'

//
var data = null;
var timestamp = null;
var file_descriptor = fs.openSync(filePath); 

function checkForUpdates(path= filePath){
    const stats = fs.statSync(path);
    return stats.mtime
}

function getUserIndex(id){
    getData();
    for(idx=0; idx<data.length; idx++){
        if(data[idx].id == id){
            return idx
        }
    }
    return undefined
}

function getUserHobbyIndex(id, hobbyId){
    getData();
    let index = getUserIndex(id);
    let userData = data[index];
    for(idx=0; idx<userData.hobbyData.length; idx++){
        if(userData.hobbyData[idx].hobbyId == hobbyId){
            return idx
        }
    }
    return undefined
}

function getTimeDataIndexForHobby(id, hobbyId){
    getData();
    let index = getUserIndex(id);
    let userData = data[index];

    for(idx=0; idx<userData.hobbyTimeData.length; idx++){
        if(userData.hobbyTimeData[idx].hobbyId == hobbyId){
            return idx
        }
    }
    return undefined
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

function findUser(Data){
    getData();
    var usersArray = [];

    for(idx=0; idx<data.length; idx++){
       var infoData =  {id: data[idx].id, name: data[idx].name, password: data[idx].password};
       usersArray.push(infoData);
    }

    for(idx=0; idx<usersArray.length; idx++){
        if(usersArray[idx].name == Data.name && usersArray[idx].password == Data.password){
            return {id: usersArray[idx].id, name: usersArray[idx].name}
        }
    }

    return undefined
}

function checkNames(Data= {name: null}){
    getData();
    var usersArray = [];

    for(idx=0; idx<data.length; idx++){
       var infoData =  {id: data[idx].id, name: data[idx].name, password: data[idx].password};
       usersArray.push(infoData);
    }

    for(idx=0; idx<usersArray.length; idx++){
        if(usersArray[idx].name == Data.name){
            // console.log(usersArray[idx].name, Data.name)
            return "Name already exists"
        }
    }

    return "Status: ok"
}

function getUserData(id){
    getData();
    var index = getUserIndex(id);
    return index == undefined ? "User id not found" : {name: data[index].name, password: data[index].password};
}

function addUser(user_data){
    getData();
    const last_elem = data[data.length - 1]
    var new_id = parseInt(last_elem.id, 10) + 1;
    user_data['id'] = new_id;
    user_data['hobbyData'] = [];
    user_data['hobbyTimeData'] = [];
    data.push(user_data);
    var json = JSON.stringify(data);
    fs.writeFileSync(filePath, json, 'utf8');
    fs.close(file_descriptor, err=>{
        if(err){
            // console.error(err);
            console.log("ERROR: Something went wrong...")
            // alert("ERROR: Something went wrong...")
        }
    })
}

function editUserData(id, Data = {name: null, password: null}){
    getData();
    var userId = getUserIndex(id);

    if(userId !== undefined){
        const userData = data[userId];
        var keys = Object.keys(Data);

        for(var idx=0; idx < keys.length; idx++){
            if( userData[keys[idx]] == Data[keys[idx]]){
                continue
            }else{
                userData[keys[idx]] = Data[keys[idx]]
            }
        }

        var newData = data;
        newData.splice(userId, 1, userData);

        var json = JSON.stringify(newData);
        fs.writeFileSync(filePath, json, 'utf8');
        fs.close(file_descriptor, err=>{
            if(err){
                // console.error(err)
                console.log("ERROR: Something went wrong...")
                // alert("ERROR: Something went wrong...")
            }
        })


    }else{
        console.log("User not found");
        // alert("ERROR: User not found");
        return
    } 
}

function getUserHobby(id, hobbyId){
    getData();
    var index = getUserIndex(id);
    var hobbyIndex = getUserHobbyIndex(id, hobbyId);

    if(index !== undefined){
        const userData = data[index];
        if(hobbyIndex !== undefined){
            return userData.hobbyData[hobbyIndex];
        }else{
            return "Hobby id not found"
        }
    }else{
        console.log("ERROR: User not found");
        // alert("ERROR: User not found");

        return
    } 
}

function getUserHobbies(id){
    getData();
    var index = getUserIndex(id);

    if(index !== undefined){
        const userData = data[index];
        return userData.hobbyData
    }else{
        console.log("ERROR: User not found");
        // alert("ERROR: User not found");
        return
    } 
}

function addHobby(id, Data={hobby: null, idealTime: null, description: null}){
    getData();
    var index = getUserIndex(id);
    if(index !== undefined){
        const userData = data[index];

        if(userData.hobbyData.length !== 0){
            var last_elem = userData.hobbyData[userData.hobbyData.length - 1];
            Data['hobbyId'] = parseInt(last_elem.hobbyId) + 1;
        }else{
            Data['hobbyId'] = 1;
        }
        userData.hobbyData.push(Data);    
        userData.hobbyTimeData.push({hobbyId: String(Data.hobbyId), timeData: []})

        var newData = data;
        newData.splice(index, 1, userData);

        var json = JSON.stringify(newData);
        fs.writeFileSync(filePath, json, 'utf8');
        fs.close(file_descriptor, err=>{
            if(err){
                // console.error(err)
                console.log("ERROR: Something went wrong...")
                // alert("ERROR: Something went wrong...");
            }
        })
    }else{
        console.log("ERROR: User not found");
        // alert("ERROR: User not found");

        return
    } 
}

function removeHobby(id, hobbyId){
    getData();
    var index = getUserIndex(id);
    if(index !== undefined){
        let userData = data[index];

        var hobbyIndex = getUserHobbyIndex(id, hobbyId);
        var hobbyDataIndex = getTimeDataIndexForHobby(id, hobbyId);

        if( hobbyIndex !== undefined){
            userData.hobbyData.splice(hobbyIndex, 1);
            userData.hobbyTimeData.splice(hobbyDataIndex, 1);
        }else{
            console.log("hobbyId not found");
            // alert("ERROR: User not found");

            return
        }

        var newData = data;
        newData.splice(index, 1, userData);

        var json = JSON.stringify(newData);
        fs.writeFileSync(filePath, json, 'utf8');
        fs.close(file_descriptor, err=>{
            if(err){
                // console.error(err)
                console.log("ERROR: Something went wrong...");
                // alert("ERROR: Something went wrong...");

            }
        })
    }else{
        console.log("ERROR: User not found");
        // alert("ERROR: User not found");

        return
    }
}

function editHobbyData(id, Data= {hobbyId: null, hobby: null, description: null, idealTime: null}){
    getData();
    var userId = getUserIndex(id);

    if(userId !== undefined){
        const userData = data[userId];
        var keys = Object.keys(Data);

        var hobbyIndex = getUserHobbyIndex(id, Data.hobbyId);
        for(var idx=0; idx < keys.length; idx++){
            if(Data[keys[idx]] === null){
                continue;
            }else{
                userData.hobbyData[hobbyIndex][keys[idx]] = Data[keys[idx]];
                // console.log(userData)
            }

        }
        // console.log(userData)
            var newData = data;
            newData.splice(userId, 1, userData);

            var json = JSON.stringify(newData);
            fs.writeFileSync(filePath, json, 'utf8');
            fs.close(file_descriptor, err=>{
                if(err){
                    // console.error(err);
                    alert("ERROR: Something went wrong...");

                }
        })
    }else{
        console.log("ERROR: User not found");
        // alert("ERROR: User not found");
        return
    } 
}


function addTimeToHobby(id, Data= {hobbyId: null, timeSegment: null}){
    getData();
    var index = getUserIndex(id);
    if(index !== undefined){
        let userData = data[index];

        var hobbyDataIndex = getTimeDataIndexForHobby(id, Data.hobbyId);
        var hobbyIndex = getUserHobbyIndex(id, Data.hobbyId);

        if( hobbyDataIndex !== undefined){
            userData.hobbyTimeData[hobbyDataIndex].timeData.push({timeSegment: Data.timeSegment, timeStamp: new Date(Date.now()).toLocaleString()})
        }else if(hobbyIndex !== undefined){
            userData.hobbyTimeData.push({hobbyId: Data.hobbyId, timeData: [{timeSegment: Data.timeSegment, timeStamp: new Date(Date.now()).toLocaleString()}]})
        }else{
            console.log("hobbyId not found");
            // alert("hobbyId not found");
            return
        }

        var newData = data;
        newData.splice(index, 1, userData);

        var json = JSON.stringify(newData);
        fs.writeFileSync(filePath, json, 'utf8');
        fs.close(file_descriptor, err=>{
            if(err){
                // console.error(err)
                console.log("ERROR: Something went wrong...");
                // alert("ERROR: Something went wrong...");
            }
        })
    }else{
        // console.log("id not found");
        // alert("ERROR: User not found");
        console.log("ERROR: User not found");

        return
    }
}


function getUserHobbyInfo(id, hobbyId){
    getData();
    var index = getUserIndex(id);

    if(index !== undefined){
        let userData = data[index];

        var hobbyDataIndex = getTimeDataIndexForHobby(id, hobbyId);
        var hobbyIndex = getUserHobbyIndex(id, hobbyId);

        if(hobbyIndex !== undefined){
           var result = [userData.hobbyData[hobbyIndex], userData.hobbyTimeData[hobbyDataIndex]]         
        }else{
            console.log("hobbyId not found");
            // alert("hobbyId not found");
            return
        }
        return result
    }else{
        console.log("ERROR: User not found");
        // alert("ERROR: User not found");

        return
    }
}

function dateParser(LocaleDate= ""){
    var split_data = LocaleDate.split(",");
    var result = split_data[0].split("/")
    return new Date(result)
}

function getWeekCount(date){
    var week_date = new Date(date);
    week_date.setDate(date.getDate()+7);
    return week_date
}

function parseToChartData(Data){
    getData();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    var timeData = Data[1].timeData;
    var chartData = {}
    var weekDate = 0;
    var dataArray = []

    for(idx=0; idx<timeData.length; idx++){
        var date = dateParser(timeData[idx].timeStamp);
 
        if(idx == 0){
            weekCount = getWeekCount(date);
            weekDate = weekCount.getDate();
        }
        // console.log(date.getDate())
        if(date.getDate() > weekDate){
            break;
        }else{
            dataArray.push({"c": [{"v": days[date.getDay()]}, {"v": parseInt(timeData[idx].timeSegment, 10)}]});
            chartData['rows'] = dataArray;
        }
    }

    chartData['cols'] = [
                {"id":"","label":"Days","pattern":"","type":"string"},
                {"id":"","label":"Time Spent","pattern":"","type":"number"}
                ]
    
    chartData['title'] = `${Data[0].hobby} ${(weekDate-6)} - ${weekDate}`;         
    return chartData;
}

function makeDonutChart(id){
    getData();
    var hobbies = getUserHobbies(id)
    var chartData = {}
    var dataArray = []

    for(idx=0; idx<hobbies.length; idx++){        
        dataArray.push({"c": [{"v": hobbies[idx].hobby}, {"v": parseInt(hobbies[idx].idealTime, 10)}]})
    }
    chartData['rows'] = dataArray
    chartData['cols'] = [
                {"id":"","label":"Hobby","pattern":"","type":"string"},
                {"id":"","label":"Ideal time","pattern":"","type":"number"}
                ]
    
    chartData['title'] = `Hobby Data`            
    return chartData
    // console.log(chartData)
}

exports.getData = getData;
exports.data = data;
exports.getUserHobbies = getUserHobbies;
exports.getUserHobby = getUserHobby;
exports.getUserHobbyInfo = getUserHobbyInfo;
exports.parseToChartData = parseToChartData;
exports.findUser = findUser;
exports.editHobbyData = editHobbyData;
exports.removeHobby = removeHobby;
exports.addHobby = addHobby;
exports.getUserData = getUserData;
exports.editUserData = editUserData;
exports.checkNames = checkNames;
exports.addUser = addUser;
exports.addTimeToHobby = addTimeToHobby;
exports.makeDonutChart = makeDonutChart;

