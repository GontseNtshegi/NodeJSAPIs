/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/******************************************************IMPORTS***************************************************************/
var express=require("express");//imports express.js
var fileSystem=require("fs");//imports fs.js
var bodyParser = require('body-parser');//imports body-parser.js

/******************************************************VARIABLES***************************************************************/
var app = express();//default constructor to instatiate the app variable to use express api
var port=8080;//local port to listen
var router=express.Router();//routes for the API

app.use(bodyParser.urlencoded({extended:true}));//use body-parser
app.use(bodyParser.json());//use json body-parser object
router.get('/', function(req, res)//access routes - WELCOME PAGE
{
    res.json({ message: 'hooray! welcome to our api!' });   
});
/******************************************************API#1 - Normal Array***************************************************************/
router.route('/ArrayToText').post(function(request,response)
{
    //to-do
    //take array as request and write it to a text file
    var array =request.query.array;//capture elements of the array
    console.log("Read array successfully: "+array);//log the array
    var textFile = fileSystem.createWriteStream('array.txt');//open a file on the server to write to
    
    textFile.on('error',function(err)//handle file error
    {
        console.log("STATUS CODE ERROR: "+err.statusCode);
    });
    
    array.forEach(function(each)
    {
        textFile.write(each+"\n");
    });
    textFile.end();
    console.log("Array written to file Succesffully");
    //response.send(200);
    response.send("Successfully created array.txt");
});

/******************************************************API#2***************************************************************/
router.route('/TextToArray').post(function(request,response)
{
    var fileName="array.txt";//name of the file to read
    var filedata="";
    
    fileSystem.exists(fileName,function(exists)
    {
        if(exists)
        {
            fileSystem.stat(fileName,function(error,stats)
            {
                fileSystem.open(fileName,"r",function(error,open)//open file to read
                {
                    var buffer=new Buffer(stats.size);
                    fileSystem.read(open,buffer,0,buffer.length,null,function(error,bytesRead,buffer)
                    {
                        
                        filedata=buffer.toString();
                        if(filedata!=="")
                        {
                     
                        var array=filedata.split("\n");//convert to
                        var large=findMax(array);
                        response.send("The largest number is "+large);
                        console.log("The largest number is "+large);
                        }
                        else//file is empty exception
                        {
                            console.log(fileName+" is empty"); 
                            response.send("Error:404"+'\n'+fileName+" is empty");
                        }
                         
                    });
                });
            });
            //response.send(200);
        }
        else//file does not exist exception
        {
           console.log("Could not find: "+fileName); 
           response.send("Error:404"+'\n'+"Could not find: "+fileName);
        }
    });
    
    });
app.use('/GontseApi', router);
app.listen(port);
console.log('Server Running on......' + port);


function findMax(array)//find maximum number in an array
{
  var max = 0;
 
   var counter;//counter

    var a = array.length;
    
  for (counter=0;counter<a;counter++)
  {
         if (parseInt(array[counter]) > parseInt(max))//check which is greater
      {
          max = array[counter];//finds maximum
      }
    
  }
  return max;//returns max
}
//}