var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var text,phnumber,string;
const msg91sms = require('msg91-lib').msg91SMS;

const msg91SMS = new msg91sms('288851AhRWBlmppKU5d4db5a5', 'incand', 4, 91); // auth key , senderID, promtional/transactionalcode, Countrycode



mongoose.connect("mongodb://localhost:27017/call_app",{useNewUrlParser: true});


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

var callSchema =new mongoose.Schema({
	number: String
	
});

var Call =mongoose.model("Call", callSchema);

// Call.create({ number : "9867211334"}) //creating database

app.get("/",function(req,res){
	res.render("front");
});

app.get("/form",function(req,res){ // it contains the text message that is needed to be sent 
	res.render("form1");
});

app.post("/go",function(req,res){
	text = req.body.text;
	Call.find({},function(err,calls){ //finds out the phone numbers from database to which text messages are to be sent
			if(err)
				{
					console.log(err);
				}
			else{
				calls.forEach(function(call){  
					string=call.number;
					phnumber = string;
							smsobj = [{
							  "message": text,
							  "to": [phnumber] // it can be comma separated list of numbers also each number can be either string or integer/number
							}]
							args = {  // it can be either javascript object or JSON object
							  sender:'incand',
							  sms:smsobj
							}

							msg91SMS.send(args) // no need to pass contactNumbers and message parameter as we are passing sms key
							.then((response) => {
								console.log(response);
							}).catch((error) => {
								console.log(error);
								if (error.data) {

									console.log(error.data);
									// object containing api error code
								} else {

									console.log(error.message); 
									// error message due to any other failure
								}
							});
							res.render("success");
					
					


				});
			}
		});


	
})


app.listen(9000,function(){
	console.log("server started");
});