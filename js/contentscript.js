function getValueFromCookie(b) {
    var a, c, d, e = document.cookie.split(";");
	console.log('cookie: ', document.cookie);
    for (a = 0; a < e.length; a++)
        if (c = e[a].substr(0, e[a].indexOf("=")), d = e[a].substr(e[a].indexOf("=") + 1), c = c.replace(/^\s+|\s+$/g, ""), c == b) return unescape(d)
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{	
	if (request.petition_msg == "initiateSpeechRecognition"){      
		initiateSpeechRecognition(sendResponse);
	} 
	else if (request.petition_msg == "Login"){	
		setLogin(request.user,request.pass);
	} 
	
});

var url_login='';
function setLogin(user, pass) {
   try{ 
		sforce.connection.serverUrl = 'https://login.salesforce.com/services/Soap/u/22.0';
		var loginResult = sforce.connection.login(user, pass);		
		console.log('sessionId: '+loginResult.sessionId);
		url_login = loginResult.metadataServerUrl.substring(0, loginResult.metadataServerUrl.indexOf('22.0')+4).replace('Soap/m/22.0','Soap/u/22.0');
	  }catch(error) {
		console.log('Error_Login');
		url_login = 'ERROR';
	/*
		  if (error.faultcode.indexOf("INVALID_LOGIN") != -1) { 
		  alert('check your username and password, invalid login'); 
		  } 
		  else { 
		  alert('Error:'+error); 
		  } */
	  }
	  console.log('url_login22222:'+url_login);
	  sendURLLogin(url_login);
}  
var texto;
function initiateSpeechRecognition(sendResponse) {  
	console.log('cookie: ', document.cookie);
    
  window.goodListener = new webkitSpeechRecognition();
  var voice = window.goodListener;
  voice.continuous = false;
  voice.interimResults = false;
  voice.lang = "en-US";
  window.goodListener.start();

  voice.onstart = function() {
    msgSender("mic on");
    console.log("mic turned on...");
  };
  
  voice.onresult = function(event){
    voice.stop();
	texto = event.results[0][0].transcript;
	console.log('texto1: '+texto);
    sendTranscrip(event.results[0][0].transcript);
  };

  voice.onend = function() {
    msgSender("mic off");
	console.log('texto2: '+texto);
	var res = texto.split(' ');
	sforce.connection.serverUrl = url_login;
		var records  = sforce.connection.query('select Id, Command__c, Command_Action_URL__c From Comman__c where Command__c = \''+capitalize(res[0])+'\' limit 1', {
			onSuccess : success,
			onFailure : failure
		  });

		function success(result) {
			console.log('Success_Query');
			var records = result.getArray("records");
			var record = records[0];
			console.log(record.Command_Action_URL__c);
			window.open(record.Command_Action_URL__c, '_blank');
		  
		}

		function failure(error) {
		  console.log("An error has occurred " + error);
		}
  };

  voice.onerror = function(event){
    var event_error = event.error
    if(event_error == "no-speech")
      msgSender("no-speech");
    console.log('error: ' + event_error);
  };

  //sendResponse({replying_msg: "started"});      

}

 function capitalize(s) {
      return s.replace(s.substr(0,1), function(m) { return m.toUpperCase(); });
    }

function msgSender(msg){
  chrome.runtime.sendMessage({replying_msg: msg});
}

function sendTranscrip(msg){
  chrome.runtime.sendMessage({transcript_msg: msg});
}

function sendURLLogin(msg){
  chrome.runtime.sendMessage({urlLogin_msg: msg});
}
  