
const { totalmem } = require('os');
const si = require('systeminformation');

async function Hddmem(thresolddata) {
    let threshold = thresolddata
    let data = await si.fsSize()
    let totalHddmem = 0
    let avaHddmem = 0
    let usedHddmem = 0
    let usedPercent = 0
  
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
    usedPercent = avaHddmem / totalHddmem *100
    console.log(totalmem/(10**9))
    console.log(usedPercent)
    console.log(100-usedPercent)

}
Hddmem(2.423)