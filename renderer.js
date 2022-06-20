const si = require('systeminformation');
const electron = require('electron');
const { ipcRenderer } = electron
var a = []
var interval

async function findHdd(){
  const data = await si.diskLayout()
  console.log(data)
}

async function Hddmem(thresolddata) {

  let threshold = thresolddata
  let data = await si.fsSize()
  let totalHddmem = 0
  let usedHddmem = 0
  let freeHddmem = 0
  let usedPercent = 0
  const sends = []

  threshold = threshold/100
  // console.log(data)
  for (let i = 0; i < data.length; i++) {
    // console.log(data[i].fs)
    if (data[i].mount.includes('/media') == true) {
      totalHddmem += parseFloat((data[i].size))
      usedHddmem += parseFloat((data[i].used))
      sends.push(data[i].fs, data[i].size, data[i].used)
    }
  }
  freeHddmem = totalHddmem - usedHddmem
  usedPercent = (usedHddmem * 100 / totalHddmem).toFixed(2)
  totalHddmem = (totalHddmem / 10 ** 9).toFixed(2)
  usedHddmem = (usedHddmem / 10 ** 9).toFixed(2)
  freeHddmem = (freeHddmem / 10 ** 9).toFixed(2)

  sends.push(totalHddmem, usedHddmem, freeHddmem, usedPercent)
  
  // console.log('totalHddmem: ' + totalHddmem ,'GB')
  // console.log('usedHddmem: ' + usedHddmem ,'GB')
  // console.log('usedPercent: ' + usedPercent ,'Percent')

  // console.log(sends)
  // console.log('threshold is:',threshold)
  if (totalHddmem * threshold <= usedHddmem) {
     console.log('Please Change HDD , current capacity is : ',usedPercent ,' threshold is : ',threshold)
     document.getElementById('result').innerHTML = '!!! Change Hard Disk Drive !!!'
     document.getElementById("result").style.color = "red";
  }
  else { console.log('Under threshold')
  document.getElementById('result').innerHTML = '' }

// เเสดงผลทั้งหมดที่หน้า App

  // const temp = document.getElementById('test1')
  // var child = temp.lastElementChild;
  // while (child) {
  //   temp.removeChild(child);
  //   child = temp.lastElementChild;
  // }

  // const temp_array = sends.map(send => {
  //   const abc = document.createElement('div')
  //   abc.innerText = send
  //   return abc
  // })
  // // console.log(temp_array)
  // temp_array.forEach(send => {
  //   temp.appendChild(send)
  // })

  document.getElementById('totalHddmem').innerText = "  total Hdd-space : "+totalHddmem+"GB"
  document.getElementById('usedHddmem').innerText = " used Hdd-space : "+usedHddmem+"GB"
  document.getElementById('freeHddmem').innerText = " free Hdd-space : "+freeHddmem+"GB"
  document.getElementById('usedPercent').innerText = "  used(%) Hdd-space : "+usedPercent+"%"
  
}

function Submit(e) {
  clearInterval(interval)
  const number = document.getElementById('threshold').value
  var inputValue = document.getElementById('threshold').value
  var text = ''
  ipcRenderer.send('submitted', number)
  // console.log('tpcalue:',inputValue)
  if (inputValue>100 || inputValue == 0 || inputValue =='' ){
    document.getElementById('threshold').value = ''
    document.getElementById('testtext').innerText = 'Error enter in range [0.0-100.0] Percent'
    e.preventDefault()
  }
  else{
    text = 'Max HDD threshold : '+ parseFloat(inputValue)+'%'
    // console.log(text)
    document.getElementById('testtext').innerText = text
    inputValue = document.getElementById('threshold').value
    interval = setInterval( function() {Hddmem(inputValue) }, 2000 );
  }
}

function writeOnInput(evt) {
  var charCode = (evt.which) ? evt.which : event.keyCode
  var inputValue = document.getElementById('threshold').value
  var strInput = inputValue.toString()
  var count = 0
  for(let i = 0; i < strInput.length; i++) {
    if(strInput[i]=='.'){
      count++
    }
  }
  // console.log('ipval',inputValue)
  // console.log('ipvallen',strInput.length)
  // console.log('charCode: ' + charCode)
  // console.log('count: ' + count)

  
  if (charCode == 46){
    if(count<1){
        if (strInput.indexOf('.') < 1){
            //console.log('true')
        }else{
        evt.preventDefault()}
    }else{
      evt.preventDefault()
    }
  }
  if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)){
      evt.preventDefault()
  } else{
    // console.log('true')
  }

}
submitbutton.addEventListener('click', Submit)
threshold.addEventListener('keypress', writeOnInput)

findHdd()

