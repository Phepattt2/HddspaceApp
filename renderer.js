const si = require('systeminformation');
const electron = require('electron');
const { ipcRenderer } = electron
var a = []
var interval

async function Hddmem(thresolddata) {

  let threshold = thresolddata
  let data = await si.fsSize()
  let totalHddmem = 0
  let avaHddmem = 0
  let usedHddmem = 0
  let freeHddmem = 0
  let usedPercent = 0
  const sends = []

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
    // น้อยกว่าเท่ากับ threshold
    if ((totalHddmem * threshold) <= usedHddmem) {
      console.log((totalHddmem * threshold).toFixed(3) , usedHddmem.toFixed(3))
      console.log('Please Change HDD , current capacity is : ',usedPercent ,' threshold is : ',threshold)
      document.getElementById('result').innerHTML = 'Please Change Hard Disk Drive'
      document.getElementById('result').style.backgroundColor = 'tomato';
    document.getElementById('caution').innerText = "!!!"

    } 
    // มากกว่า threshold
    else { 
      console.log('Under threshold')
      document.getElementById('info').classList.add('center')
      document.getElementById('result').innerHTML = 'Under threshold'
      document.getElementById('result').style.backgroundColor = 'green'
    }
    document.getElementById('info').classList.add('errorCenter')

    document.getElementById('totalHddmem').innerText = "  total Hdd-space : "+(totalHddmem/10**9).toFixed(2)+"GB"
    document.getElementById('avaHddmem').innerText = " avalible Hdd-space : "+(avaHddmem/10**9).toFixed(2)+"GB"
    document.getElementById('usedHddmem').innerText = " used Hdd-space : "+(usedHddmem/10**9).toFixed(2)+"GB"
    document.getElementById('usedPercent').innerText = "  used(%) Hdd-space : "+usedPercent.toFixed(4)+"%"

  }else{
    document.getElementById('errortext').innerHTML = ''
    document.getElementById('result').innerHTML = ' Hard Disk Drive not found'
    document.getElementById('result').style.color = "white";
    document.getElementById('result').style.backgroundColor = 'LightCoral';
    document.getElementById('result').innerHTML = ' Hard Disk Drive not found'
  }
}

async function findHdd(){
  const data = await si.diskLayout()
  console.log(data)
}

function Submit(e) {
  // clearInterval(interval)
  console.log('Submited')
    document.getElementById('submitbutton').classList.remove('disabled')
    const number = document.getElementById('threshold').value
    var inputValue = document.getElementById('threshold').value
    var text = ''
    document.getElementById('totalHddmem').innerText = ""
    document.getElementById('avaHddmem').innerText = ""
    document.getElementById('usedHddmem').innerText = ""
    document.getElementById('usedPercent').innerText = ""
    document.getElementById('result').innerHTML  = ""
    document.getElementById('caution').innerText = ""
    document.getElementById('errortext').style.backgroundColor = 'white'
    document.getElementById('result').style.backgroundColor = 'white'
    document.getElementById('result').style.color = "black";
    document.getElementById('info').classList.remove('center')
    document.getElementById('info').classList.remove('errorCenter')



  // console.log('tpcalue:',inputValue)
  if (inputValue>100 || inputValue == 0 || inputValue ==''|| inputValue == 'Enter threshold'){
    document.getElementById('threshold').value = ''
    document.getElementById('errortext').innerText = 'Please enter threshold in range [0.0-100.0]'
    document.getElementById('errortext').style.backgroundColor = 'tomato'
    document.getElementById('threshold').value = 'Enter threshold'
  }
  else{
    text = 'Maximum HDD threshold : '+ parseFloat(inputValue)+'%'
    // console.log(text)
    document.getElementById('errortext').innerText = text
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

}

function setOnInput(evt){
  if (document.getElementById('threshold').value == '' || document.getElementById('threshold').value=='Enter threshold'){
   document.getElementById('threshold').value = ''}
  else{}
}

function Onhover(evt){
  let inputValue = document.getElementById('threshold').value
  if (inputValue == ''|| inputValue=='Enter threshold'){
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

findHdd()

