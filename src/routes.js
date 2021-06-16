const { json } = require('body-parser')
const routes = require('express').Router()
const csv = require('./makeCSV')
const msg = "oii"
const serialport = require('serialport')
const fs = require('fs')
const Test = require('./database/models')

var obj = []
//"24","24","24","24","24","24","24","24","24","24","24","24","25"
// const port = new serialport(
//     'COM9',
//     {baudRate: 9600}
// )

// const parser = new serialport.parsers.Readline()

// port.pipe(parser)

// parser.on('data', (data)=> {
//     console.log(data)
//     if(data  != '\r'){
//         // let formatData = data.split('\x01\00')
//         // let splitData = formatData[1].split("|")
//         // let lastData = splitData[splitData.length-1].split('\r')
//         // splitData.pop()
//         // splitData.push(lastData[0])
        
//         //     console.log(splitData)
//     }
// })

routes.post('/colection',(req, res) =>{
    
    let  dado = req.query
    console.log(dado)
    dado.data = Date.now()
      
    obj.push(dado)
    
    //console.log(obj)
    return res.send("0k")   
})

routes.get('/realtime', (req, res)=>{
    
    res.json(obj[obj.length-1])
    console.log(JSON.stringify(obj[obj.length-1]))

    console.log('ok') 
})

routes.get('/download', async(req, res) =>{

    //Gerar arquivos dinamicamente

    function createFile(_path) {
        let base = ''
        let header =["Gasolina","RPM","Velocidade","Pressao de Freio","Temp CVT","Temp Motor","Acelerometro\n"]
        header = header.toString()
        
        fs.writeFile(_path, header, function (err){
            if (err) {
                console.log(err);
            }
        })
    
        const result = new Array(Math.ceil(obj.length / 7))
            .fill()
            .map(() => obj.splice(0, 7))
    
        result.forEach(element => {
            base = base + element.toString() + "\n"
        })
    
        fs.appendFile(_path, base, function (err){
            if (err) {
                console.log(err);
            } else {
                console.log("File saved");
            }
        })
        
    }

    function addStr(pathString){
    
        let updated = 1
        let position = pathString.indexOf(".", pathString.indexOf(".") + 1);
        let number = pathString[position-1]
        let count = 1
        if (!(isNaN(number))){
            do {
                let updated = (parseInt(number) + count).toString()
    
                pathString = pathString.toString().replace([pathString[position-1]], updated)

                if(fs.existsSync(pathString)){
                    count += 1 

                } else{
                    return pathString  
                }    

            } while (count < 10)

        } else{
            return pathString.substring(0, position) + updated + pathString.substring(position, pathString.length);
        }
    }

    function checkstr(pathString){
        
        let position = pathString.indexOf(".", pathString.indexOf(".") + 1);
        let rightPath = pathString.substring(0, position) + '1' + pathString.substring(position, pathString.length)
    
        if(fs.existsSync(rightPath)){
            return rightPath
            
        } else{
            return pathString
        }
    }

    var name = 'Test'
    
    var path = './' + name + '.txt'

    // A função writeFile, dentro da função createFile, sobrescreve totalmente um arquivo caso possua o mesmo nome,
    //sendo assim é interessante adicionar algum filtro para evitar esse problema.

    fs.access(path, fs.F_OK, (err) => {
        if (err) {
            createFile(path)

            res.send('Success!')    
            res.download('Test.txt', (err)=>{ console.log(err);})

        } else{
            
            let check = checkstr(path)
            let newPath = addStr(check)

            createFile(newPath)

            return res.send(`There is a file with the path ${path}, another file was created with the new path ${newPath}.`)
        }
    })
})

routes.post('/teste', async (req, res)=>{
    const {name}  = req.body
    
    try{
        if(await Test.findOne({name})){
            res.status(400).send({error : "Test name already taken"})
        }
        const test = await Test.create(req.body)
        return res.send({test})

    } catch(err){
        res.status(400).send({error : "Process failed"})
    }
    
    //Teste de conexão 
    res.send('ok')
})

module.exports = routes