chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  var replying_msg = request.replying_msg || false;
  var transcript_msg = request.transcript_msg || false;  
  var urlLogin_msg = request.urlLogin_msg || false;  
  if (replying_msg) speechStatus(replying_msg);
  if (transcript_msg) getTranscript(transcript_msg);
  if (urlLogin_msg) getUrlLogin_msg(urlLogin_msg);
});

function getUrlLogin_msg(urlLogin_msg){
	console.log('urlLogin_msg:'+urlLogin_msg);
}

function getTranscript(transcript_msg){
	var res = transcript_msg.split(' ');
  document.getElementById('transcript').value = capitalize(res[0]);
}

function speechStatus(replying_msg){
  var $mic = document.getElementById('mic');  

  if (replying_msg == "mic on"){
    $mic.src = "img/mic-on.gif";
    document.getElementById('transcript').value = '';
  }
  else if (replying_msg == "mic off"){
    $mic.src = "img/mic.png";
  }
  else{
    $mic.src = "img/mic.png";
    var from = sender.tab ? "contentscript:" + sender.tab.url : "extension";
    console.log(from +" says:"+replying_msg);
  }
}

function startListening() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {petition_msg: "initiateSpeechRecognition"}, function(response) {	
    });
  });
}

function startLogin(user,pass) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	  console.log('user: '+user);		
		console.log('pass:'+pass);
    chrome.tabs.sendMessage(tabs[0].id, {petition_msg: "Login", user: user, pass: pass}, function(response) {	
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("mic").addEventListener("click", function(){
      startListening();
  });
  document.getElementById("login_button").addEventListener("click", function(){
	var username = document.getElementById('un').value; 
	var password = document.getElementById('pw').value;
	startLogin(username,password);
  });
});


	
  ///**************
  /*
  $jq('#login_button').click(function(event)
  {
     try{ 
		var username = document.getElementById('un'); 
		var password = document.getElementById('pw');
		sforce.connection.serverUrl = 'https://login.salesforce.com/services/Soap/u/22.0';		
		var loginResult = sforce.connection.login(username.value, password.value);		
		url_login = loginResult.metadataServerUrl.substring(0, loginResult.metadataServerUrl.indexOf('22.0')+4).replace('Soap/m/22.0','Soap/u/22.0');	
		//url_login = url_login.replace('Soap/m/22.0','Soap/u/22.0');
		//var records1 = records.getArray('records'); 
		//console.log('records: '+records);
	  }catch(error) { 
		alert('Login Error:'+error.message);
		  /*if (error.faultcode.indexOf("INVALID_LOGIN") != -1) { 
		  alert('check your username and password, invalid login'); 
		  } 
		  else { 
		  alert('Error:'+error); 
		  } 
	  }   
  });  
    

  */
    function capitalize(s) {
      return s.replace(s.substr(0,1), function(m) { return m.toUpperCase(); });
    }

	/*
  if ('webkitSpeechRecognition' in window) {
      var recognition = new webkitSpeechRecognition();
    
      recognition.continuous = false;
      recognition.interimResults = true;
    
      recognition.onstart = function() {
        recognizing = true;
		document.getElementById('start_button').src = 'speak2.gif';
      };
    
      recognition.onerror = function(event) {
        console.log(event.error);
      };
    
      recognition.onend = function() {
		 var res = text_result.split(' ');
		document.getElementById('transcript').value = capitalize(res[0]);
		document.getElementById('start_button').src = 'speak.png';
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
		//queryClient(capitalize(res[0]));
        recognizing = false;
      };
    
      recognition.onresult = function(event) {        
		text_result = event.results[0][0].transcript;
      };
    }
  
  
});
*/