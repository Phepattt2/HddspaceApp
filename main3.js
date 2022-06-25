const {
    app,
    BrowserWindow,
    ipcMain,
  } = require("electron");
  const ipc = ipcMain
  var thresholdArg = ''
  var commandArray = []
  app.whenReady().then(() => {
    if(process.platform != 'linux'){
      app.quit()
    }
    else{
      const mainWindow = new BrowserWindow({
        width: 800,
        height: 800,
        resizable : false,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
          enableRemoteModule: true,
        },
      })
      mainWindow.setBackgroundColor('#f5f5f5')
      mainWindow.loadFile('index3.html').then(() => {
        if(thresholdArg==''){}
        else{
        mainWindow.webContents.send('th',thresholdArg)}
      })
    }
  }
  )
function getArgThreshold(){
  console.log(process.argv)
  let charcode
  let result 
  let count = 0
  for (let i = 0 ; i <process.argv.length ; i++ ){
      commandArray.push((process.argv[i]).replace(/\s/g, ''))
  }      
  for (let i = 0 ; i < commandArray.length ; i++ ){
      if (commandArray[i].includes('threshold')){
          temp = commandArray[i].indexOf('=')
          for (let j = temp+1 ; j < commandArray[i].length ; j++){
            charcode = commandArray[i].charCodeAt(j)
            charcode = charcode.toString()
            if (commandArray[i][j].includes('.')){
              count++
            }
            if (charcode.includes('46')||charcode.includes('48')||charcode.includes('49')
            ||charcode.includes('50')||charcode.includes('51')||charcode.includes('52')
            ||charcode.includes('53')||charcode.includes('54')||charcode.includes('55')
            ||charcode.includes('56')||charcode.includes('57')){}
            else{
              result = false
              break
            }
            thresholdArg += commandArray[i][j]
          }
          break
      }
      console.log(thresholdArg)
  }
  if (count< 2 && result==true)
  return thresholdArg
}
ipcMain.on('fromCommandLineQuitApp',() =>{app.quit()})
ipcMain.on('hdstat',(evt,stat) =>{
  console.log('-- more info of every HDD attach --\n')
  console.log(stat)})


getArgThreshold()