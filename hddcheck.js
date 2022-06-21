let commandArray = [] 
let threshold = ''
let temp = 0
let result = true
let interval 
const si = require('systeminformation');
const os = require('os')


console.log(os.platform())
if (os.platform == 'linux') {
  for (let i = 2 ; i <process.argv.length ; i++ ){
      commandArray.push((process.argv[i]).replace(/\s/g, ''))
  }

  for (let i = 0 ; i < commandArray.length ; i++ ){
      if (commandArray[i].includes('--threshold')){
          temp = commandArray[i].indexOf('=')
          for (let j = temp+1 ; j < commandArray[i].length ; j++){
              threshold += commandArray[i][j]
          }
          break
      }
  }

  for (let i = 0; i < threshold.length; i++) {
    charcode = threshold.charCodeAt(i)
    charcode = charcode.toString()

    if (charcode.includes('46')||charcode.includes('48')||charcode.includes('49')
    ||charcode.includes('50')||charcode.includes('51')||charcode.includes('52')
    ||charcode.includes('53')||charcode.includes('54')||charcode.includes('55')
    ||charcode.includes('56')||charcode.includes('57'))
    {  }
    else{
        result = false
    }
  }

  threshold = parseFloat(threshold)

  if((threshold > 0 && threshold<= 100) && result == true){
    console.log('threshold:',threshold)
    // interval = setInterval(function(){Hddmem(threshold)},1000)
    Hddmem(threshold)
    }
    else if((threshold< 0 || threshold> 100 )&& result == true  ){
        console.log('Please input threshold in range : [0.0-100.0] %')
    }
    else{
      console.log('Enter correct threshold')
  }

  async function Hddmem(thresolddata) {
      let data = await si.fsSize()
      let threshold = thresolddata
      let totalHddmem = 0
      let usedHddmem = 0
      let freeHddmem = 0
      let usedPercent = 0
      const sends = []
      threshold = threshold/100
      for (let i = 0; i < data.length; i++) {
        
        if (data[i].mount.includes('/media') == true) {
          console.log(data[i].mount  , 'use :',(data[i].use).toString() , '% from :',parseFloat((data[i].size)/10**9).toFixed(2),'GB')
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

    if ( usedPercent != 'NaN'){
        if (totalHddmem * threshold <= usedHddmem) {
          console.log('\x1b[41m%s\x1b[0m','Please Change HDD : ')
          console.log('current capacity is : ',usedPercent ,'% threshold is : ',(threshold*100).toString())
        }
        else { console.log('\x1b[42m%s\x1b[0m','Under threshold : ')
        console.log('current capacity is : ',usedPercent ,'% threshold is : ',(threshold*100).toString())
        }
    }else{
      // clearInterval(interval)
      console.log('\x1b[45m%s\x1b[0m','- HDD not found -')
    }
  }  
}else{  
  console.log('\x1b[41m%s\x1b[0m','only work in Linux os')
}