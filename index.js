const express = require("express")
const bodyParser = require("body-parser")
randomIdGenerator = require("random-id-generator")
port = 8080
fs = require("fs")
app = express()

function server(res,req){
  if(res.method == "GET"){
    fs.readFile("./stuff.txt","utf-8",function(err,data){
      if(err){
        req.write("error")
        req.end()
        return
      }
      function getURL(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(data);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
    url = getURL(res.url)
    if(url == ""){
      fs.createReadStream("./notfound.html").pipe(req)
      return
    }
    req.redirect(url)
    })
  }else{
    if(res.body.website == ""){
      req.write("error")
      req.end()
      return
    }
    console.log(res.body)
      id = randomIdGenerator(5)
      message = `/${id}=${res.body.website};`
      fs.appendFile("./stuff.txt",message,function(err){
        if(err){
          req.write("error")
          req.end()
          return
        }
        req.write(id)
        req.end()
      })
  }
}
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(server)
app.listen(port,function(err){
  if(err){
    console.log("Error")
    return
  }
  console.log(`Listening on ${port}`)
})