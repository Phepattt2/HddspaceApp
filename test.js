// const { parse } = require('path');
// const si = require('systeminformation');
// const { threadId } = require('worker_threads');


// async function Hddmem() {

//     let threshold = 70
//     let data = await si.fsSize()
//     let totalHddmem = 0 
//     let usedHddmem = 0 
//     let freeHddmem = 0 
//     let usedPercent = 0
//     const send = []

//     console.log(data)
//     for (let i = 0; i < data.length; i++) {
//         console.log(data[i].fs)
//         if ( data[i].fs.includes('/media') == false) {
//         totalHddmem += parseFloat((data[i].size))
//         usedHddmem += parseFloat((data[i].used))
//         send.push(data[i].fs,data[i].size,data[i].used)
//         }
// }
// freeHddmem = totalHddmem - usedHddmem
// usedPercent = (usedHddmem * 100/totalHddmem).toFixed(2)
// totalHddmem = (totalHddmem / 10**9).toFixed(2)
// usedHddmem = (usedHddmem / 10**9).toFixed(2)
// freeHddmem = (freeHddmem / 10**9).toFixed(2)

// send.push(totalHddmem,usedHddmem,freeHddmem,usedPercent)

// console.log('totalHddmem: ' + totalHddmem ,'GB')
// console.log('usedHddmem: ' + usedHddmem ,'GB')
// console.log('usedPercent: ' + usedPercent ,'Percent')

// console.log(send)

// if(totalHddmem * threshold <= usedHddmem ){
//     console.log('Please Change HDD')
// }
// else{console.log('still can use')}


// const temp = document.getElementById('test1')
    
//     var child = temp.lastElementChild; 
//     while (child) {
//       temp.removeChild(child);
//         child = temp.lastElementChild;
//     }

//     const temp_array = sends.map(send => {
//       const abc = document.createElement('div')
//       abc.innerText = send
//       return abc
//     })
//     console.log(temp_array)
//     temp_array.forEach(send => {
//       temp.appendChild(send)
//     })
    
// }

function re(x){
  console.log(x)
}

setInterval( function() {re('phe') }, 500 );

var timesRun = 0;
var interval = setInterval(function(){
    timesRun += 1;
    if(timesRun === 60){
        clearInterval(interval);
    }
    //do whatever here..
}, 2000); 