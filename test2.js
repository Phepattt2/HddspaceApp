
let charcode = 0
let a = 'kuysus132123.asd'
let result = true
for (let i = 0; i < a.length; i++) {
    charcode = a.charCodeAt(i)
    charcode = charcode.toString()
    console.log(a[i],charcode)

    if (charcode.includes('46')||charcode.includes('48')||charcode.includes('49')
    ||charcode.includes('50')||charcode.includes('51')||charcode.includes('52')
    ||charcode.includes('53')||charcode.includes('54')||charcode.includes('55')
    ||charcode.includes('56')||charcode.includes('57'))
    {
        console.log('valid character')
    }
    else{
        console.log('Invalid character')
    }
}
console.log(result)
