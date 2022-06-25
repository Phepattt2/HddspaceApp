const si = require('systeminformation');
const electron = require('electron');
const { ipcRenderer, app } = require('electron');
const ipc = ipcRenderer
let fromCommandLine = false
let globThreshold 

async function ArgHddmem(thresolddata){
  fromCommandLine = true
  globThreshold = thresolddata
  Hddmem(thresolddata)
  }

async function Hddmem(thresolddata) {
  let threshold = thresolddata
  let data = await si.fsSize()
  let totalHddmem = 0
  let avaHddmem = 0
  let usedHddmem = 0
  let usedPercent = 0
  let stat = []
  let mountstat = {}
  threshold = threshold/100
  console.log(data)
  for (let i = 0; i < data.length; i++) {
    // console.log(data[i].fs)
    if (data[i].mount.includes('/media') == true) {
      totalHddmem += parseFloat((data[i].size))
      avaHddmem += parseFloat((data[i].available))
      stat.push({ 'mount': data[i].mount , 'size': data[i].size , 'used': data[i].used , 'available': data[i].available , 'use':data[i].use})
    }
    
  }
  console.log(stat)
  ipcRenderer.send('hdstat',stat)
  usedPercent = (100 - (avaHddmem / totalHddmem *100) )
  usedHddmem = totalHddmem - avaHddmem

  if (totalHddmem != 0){
    // usedHddmem MORE THAT THE GAIN 
    if ((totalHddmem * threshold) <= usedHddmem) {
      
      let text = 'เกณฑ์ปัจจุบันในการเเจ้งเตือน (current threshold) คือ '+threshold*100 +' %'
      document.getElementById('info').style.marginTop = '25px'
      document.getElementById('result').innerHTML = 'HDD กำลังจะเต็ม '+"<br>"+'- โปรดเปลี่ยน HDD ตัวใหม่ -'
      document.getElementById('result').style.color = 'white'
      document.getElementById('result').style.backgroundColor = 'tomato';

      document.getElementById('info').classList.add('errorCenter')
      document.getElementById('info').style.top = '75px'

      document.getElementById('am').innerText = " "+(avaHddmem/10**9).toFixed(2)+" GB" +" ( "+((100-usedPercent)).toFixed(2)+'% of HDD )'
      document.getElementById('tm').innerText = " "+(totalHddmem/10**9).toFixed(2)+" GB"



      document.getElementById('avaHddmem').innerText = "เหลือพื้นที่ใช้งานในอีก "
      document.getElementById('totalHddmem').innerText = "จากพื้นที่ทั้งหมด  "
      
      document.getElementById('thresholdtext').innerText = text

      document.getElementById('hr1').style.display = 'block'

      document.getElementById('hr3').style.display = 'block'


      document.getElementById('allinfo').classList.remove('area-div2') 
      document.getElementById('allinfo').classList.add('area-div') 
      
      // alert('เปลี่ยน HDD')
      
    } 
    // usedHddmem LESS THAT THE GAIN 
    else { 
      document.getElementById('hr1').style.display = 'none'
      document.getElementById('hr3').style.display = 'none'

      if(fromCommandLine == true){

        ipc.send('fromCommandLineQuitApp')
      }
      else{
      console.log('Under threshold')
      document.getElementById('info').classList.add('center')
      document.getElementById('result').innerHTML = 'พิ้นที่การใช้งานของ HDD <br>อยู่ในขอบเขตที่กำหนด'
      document.getElementById('result').style.backgroundColor = 'green'
      
    }
    }
  }
  // no HDD available
  else{
    document.getElementById('info').style.marginTop = '300px'

    document.getElementById('avaHddmem').innerText = ''
    document.getElementById('am').innerText = ''
    document.getElementById('totalHddmem').innerText = ''
    document.getElementById('tm').innerText = ''

    document.getElementById('info').classList.add('relative')
    document.getElementById('thresholdtext').innerHTML = ''
    document.getElementById('result').innerHTML = 'ไม่พบ HDD ในเครื่อง'
    document.getElementById('result').style.color = "white";
    document.getElementById('result').style.backgroundColor = 'LightCoral';

    document.getElementById('allinfo').classList.remove('area-div')
    
    document.getElementById('hr1').style.display = 'none'
    document.getElementById('hr3').style.display = 'none'

    document.getElementById('info').classList.remove('errorCenter')
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
  document.getElementById('submitbutton').style.backgroundColor = '#688569' 
   setTimeout(() => {
   document.getElementById('submitbutton').style.backgroundColor = '#90b891'
   }, 300);
   document.getElementById('info').style.marginTop = '300px'

   document.getElementById('avaHddmem').innerText = ''
   document.getElementById('am').innerText = ''
   document.getElementById('totalHddmem').innerText = ''
   document.getElementById('tm').innerText = ''

   document.getElementById('info').classList.add('relative')
   document.getElementById('thresholdtext').innerHTML = ''
   document.getElementById('result').innerHTML = 'เปลี่ยน HDD เเล้ว'
   document.getElementById('result').style.color = "white";
   document.getElementById('result').style.backgroundColor = 'LightCoral';

   document.getElementById('allinfo').classList.remove('area-div')
   
   document.getElementById('hr1').style.display = 'none'
   document.getElementById('hr3').style.display = 'none'

   document.getElementById('info').classList.remove('errorCenter')
   setTimeout(() => {
    Hddmem(globThreshold)
    }, 1000);

  }
 


function Onhover(evt){
  document.getElementById('submitbutton').classList.add('hover')
  document.getElementById('submitbutton').style.backgroundColor = '#90b891'

}

function Quithover(evt){
  document.getElementById('submitbutton').classList.remove('hover')
  document.getElementById('submitbutton').classList.remove('butClick')
  document.getElementById('submitbutton').style.backgroundColor = '#a1c9a2'
  

}

submitbutton.addEventListener('click', Submit)
submitbutton.addEventListener('mouseleave',Quithover)
submitbutton.addEventListener('mouseover',Onhover)

ipc.on('th', (evt, message) =>{
 ArgHddmem(message); // Returns: {'SAVED': 'File Saved'}
});

