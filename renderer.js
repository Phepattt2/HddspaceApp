const si = require('systeminformation');
const electron = require('electron');
const { text } = require('stream/consumers');
const { ipcRenderer, app } = require('electron');
const ipc = ipcRenderer
let fromCommandLine = false


async function ArgHddmem(thresolddata){
  fromCommandLine = true
  Hddmem(thresolddata)
  }

async function Hddmem(thresolddata) {
  let threshold = thresolddata
  let data = await si.fsSize()
  let totalHddmem = 0
  let avaHddmem = 0
  let usedHddmem = 0
  let usedPercent = 0
  document.getElementById('threshold').value = threshold

  threshold = threshold/100
  console.log(data)
  for (let i = 0; i < data.length; i++) {
    // console.log(data[i].fs)
    if (data[i].mount.includes('/media') == true) {
      totalHddmem += parseFloat((data[i].size))
      avaHddmem += parseFloat((data[i].available))
      // sends.push(data[i].fs, data[i].size, data[i].available)
    }
  }
  usedPercent = (100 - (avaHddmem / totalHddmem *100) )
  usedHddmem = totalHddmem - avaHddmem

  if (totalHddmem != 0){
    // usedHddmem MORE THAT THE GAIN 
    if ((totalHddmem * threshold) <= usedHddmem) {
      
      let text = 'ขอบเขตเปอร์เซ็นของพื้นที่ใช้ได้สูงสุดของ HDD '+ parseFloat(document.getElementById('threshold').value)+'%'
      // console.log(text)
      document.getElementById('thresholdtext').innerText = text

      document.getElementById('result').innerHTML = 'HDD กำลังจะเต็ม '+"<br>"+'- โปรดเปลี่ยน HDD ตัวใหม่ -'
      document.getElementById('result').style.backgroundColor = 'tomato';

      document.getElementById('info').classList.add('errorCenter')
      document.getElementById('info').style.top = '75px'

      document.getElementById('totalHddmem').innerText = "-  พื้นที่ทั้งหมดใน HDD : "+(totalHddmem/10**9).toFixed(2)+" GB"
      document.getElementById('avaHddmem').innerText = "-  พื้นที่ที่ใช้ได้ใน HDD : "+(avaHddmem/10**9).toFixed(2)+" GB"
      document.getElementById('usedHddmem').innerText = "-  พื้นที่ที่ถูกใช้ใน HDD: "+(usedHddmem/10**9).toFixed(2)+" GB"
      document.getElementById('usedPercent').innerText = "-  เปอร์เซ็นที่ของพื้นที่ที่ถูกใช้ใน HDD : "+usedPercent.toFixed(4)+" %"
      
      document.getElementById('allinfo').classList.remove('area-div2') 
      document.getElementById('allinfo').classList.add('area-div') 
      
      alert('เปลี่ยน HDD')
      
    } 
    // usedHddmem LESS THAT THE GAIN 
    else { 
      if(fromCommandLine == true){
        ipc.send('fromCommandLineQuitApp')
      }
      else{
      console.log('Under threshold')
      document.getElementById('info').classList.add('center')
      document.getElementById('result').innerHTML = 'พิ้นที่การใช้งานของ HDD <br>อยู่ในขอบเขตที่กำหนด'
      document.getElementById('result').style.backgroundColor = 'green'}
    }
  }
  // no HDD available
  else{
   
    document.getElementById('thresholdtext').innerHTML = ''
    document.getElementById('result').innerHTML = 'ไม่พบ HDD ในเครื่อง'
    document.getElementById('result').style.color = "white";
    document.getElementById('result').style.backgroundColor = 'LightCoral';
  }
}

async function findHdd(){
  const data = await si.diskLayout()
  let result = false
  for (let i = 0; i < data.length; i++) {
      if(data[i].type == 'HD'|| data[i].type == 'HDD'){
          result = true
          break
    }
  }
  return result
}

function Submit(e) {
  // clearInterval(interval)
  console.log('Submited')
    document.getElementById('submitbutton').classList.remove('disabled')
    const number = document.getElementById('threshold').value
    var inputValue = document.getElementById('threshold').value
    var text = ''
    fromCommandLine = false
    document.getElementById('thresholdtext').innerText = ""
    document.getElementById('totalHddmem').innerText = ""
    document.getElementById('avaHddmem').innerText = ""
    document.getElementById('usedHddmem').innerText = ""
    document.getElementById('usedPercent').innerText = ""
    document.getElementById('result').innerHTML  = ""
    document.getElementById('thresholdtext').style.backgroundColor = 'transparent'
    document.getElementById('result').style.backgroundColor = 'white'
    document.getElementById('result').style.color = "black";
    document.getElementById('info').classList.remove('center')
    document.getElementById('info').classList.remove('errorCenter')
    document.getElementById('info').style.top = '150px'
    document.getElementById('allinfo').classList.add('area-div2') 
    document.getElementById('allinfo').classList.remove('area-div') 
    document.getElementById('threshold').style.borderColor = 'transparent'
    document.getElementById('caution').innerText = ''
    document.getElementById('caution').style.backgroundColor = 'transparent'
    document.getElementById('info').style.top = '85px'

  // console.log('tpcalue:',inputValue)
  if (inputValue>100 || inputValue == 0 || inputValue ==''|| inputValue == 'กรอกขอบเขต'){
    document.getElementById('threshold').value = ''
    document.getElementById('threshold').value = 'กรอกขอบเขต'
    document.getElementById('threshold').style.borderColor = 'tomato'
    document.getElementById('caution').innerText = 'กรอกขอบเขตในช่วงที่มากกว่า 0 ถึง 100'
    document.getElementById('caution').style.backgroundColor = 'tomato'
  }
  else{
    
    inputValue = document.getElementById('threshold').value
    // interval = setInterval( function() {Hddmem(inputValue) }, 2000 );
    Hddmem(inputValue)
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

  if (inputValue == ''|| inputValue=='กรอกขอบเขต'){
    console.log(inputValue)
    document.getElementById('submitbutton').classList.add('disabled') 
    submitbutton.removeEventListener('click', Submit)
  }else{
    console.log(inputValue)
  submitbutton.addEventListener('click', Submit)
  document.getElementById('submitbutton').classList.add('hover')
  document.getElementById('submitbutton').classList.remove('disabled')
  }


}

function setOnInput(evt){
  if (document.getElementById('threshold').value == '' || document.getElementById('threshold').value=='กรอกขอบเขตในช่วงที่มากกว่า 0 ถึง 100' ||document.getElementById('threshold').value == 'กรอกขอบเขต'){
   document.getElementById('threshold').value = ''}
  else{}
}

function Onhover(evt){
  let inputValue = document.getElementById('threshold').value
  if (inputValue == ''|| inputValue=='กรอกขอบเขต'){
    console.log(inputValue)
    document.getElementById('submitbutton').classList.add('disabled') 
    submitbutton.removeEventListener('click', Submit)
  }else{
  submitbutton.addEventListener('click', Submit)
  document.getElementById('submitbutton').classList.add('hover')
  document.getElementById('submitbutton').classList.remove('disabled')
  }
}

function Quithover(evt){
  document.getElementById('submitbutton').classList.remove('hover')
}

submitbutton.addEventListener('click', Submit)
threshold.addEventListener('keypress', writeOnInput)
threshold.addEventListener('click',setOnInput)
submitbutton.addEventListener('mouseover',Onhover)
submitbutton.addEventListener('mouseleave',Quithover)

ipc.on('th', (evt, message) =>{
 ArgHddmem(message); // Returns: {'SAVED': 'File Saved'}
});

