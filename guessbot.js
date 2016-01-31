var fs = require('fs');
var path = require('path');
var fs = require('fs');
var bals = JSON.parse(fs.readFileSync("../sample/lib/data.json"));
var profit = 0;
var oldprofit = 0;
var cashout = true;

var GuessBot = function(client) {
  this.client  = client;
  this.admins  = ['ryder'];
  this.balance = 0;


  // normal commands
  this.commands = {
    '!help'         : this.printHelp,
	'!commands'     : this.printCmds,
	'!bal'			: this.bal,
	'!cashout'		: this.cashout,
	'!credits'		: this.credits,
	'!bet'			: this.bet
  };

  // admin commands
  this.adminCommands = {
    '!shutdown': this.shutdown,
	'!faketip' 	: this.faketip,
	'!testjson'		: this.teststring,
	'!setplayerbal' : this.faketipplayer,
	'!save'			: this.savestuff,
	'!botprofit'	: this.botprofit,
	'!togglecashout': this.togglecashout
  };

  this.helpText = "Welcome to the Coinchat Gaming Channel. http://pastebin.com/zqWxRXMJ for details.";
  this.allCmds = "List of commands for #GuessBot. !help for help. !commands for this list. !bal for your balance. !cashout to cashout. Check out http://pastebin.com/zqWxRXMJ for details.";
};

/**
 * Prints out the help when !help is messaged
 */
GuessBot.prototype.printHelp = function(msg) {
  this.client.pushMessage(msg.room, msg.user+": "+this.helpText);
  return false;
};

/**
 * Prints out the command list when !commands is received 
 */
GuessBot.prototype.printCmds = function(msg) {
  this.client.pushMessage(msg.room, msg.user+": "+this.allCmds);
  return false;
};

/**
 * Handles all incoming messages
 */

GuessBot.prototype.handleMessage = function(msg) {
  // First lets check if we're an admin
  var admin = (this.admins.indexOf(msg.user.toLowerCase()) != -1);

  // Lets see if the message is a tip
  if (msg.isTip) {
    // ok, we don't need to actually do more here.
    this.balance = msg.tipAmount;
    this.client.pushMessage(msg.room, msg.user+': Thank you for your tip. Your balance has been updated');
	if(bals[msg.user] == null || bals[msg.user] == 0 || bals[msg.user] == undefined) {
		bals[msg.user] = Number(msg.tipAmount); }
	else {
		bals[msg.user] = Number(bals[msg.user]) + Number(msg.tipAmount); }
	this.savestuff(msg);
    return false;
  }

  // msg params 0 contains the first word in lowercase
  // so we check with that if a command is given.
  if (typeof this.commands[msg.params[0]] == 'function') {
    return this.commands[msg.params[0]].call(this, msg);
  }

  // Then finally we check if it was an admin command
  if (admin && typeof this.adminCommands[msg.params[0]] == 'function') {
    return this.adminCommands[msg.params[0]].call(this, msg);
  }
};
GuessBot.prototype.teststring = function(msg) {
	var jsonstring = JSON.stringify(bals, null, 4);
	this.client.pushMessage(msg.room, jsonstring);
}

GuessBot.prototype.savestuff = function(msg) {
  var outputFilename = path.join(__dirname, 'data.json');
  console.log(outputFilename);
  fs.writeFile(outputFilename, JSON.stringify(bals, null, 4), function(err) {
	if(err) {
		console.log(err);
	}else{
		console.log("JSON Saved");
	}
});
}
GuessBot.prototype.togglecashout = function(msg) {
	if(cashout == true) {
		cashout = false;
		this.client.pushMessage(msg.room, "Cashout has been disabled");
	}else if(cashout == false) {
		cashout = true;
		this.client.pushMessage(msg.room, "Cashout has been enabled");
		
	}
}
GuessBot.prototype.bet = function(msg) {
	var realmsg = msg.message.split(" ");
	var betamount = realmsg[1];
	var betnumber = realmsg[2];
	if(bals[msg.user] >= Number(betamount)) {
	if(betamount >= 0.25 && betamount <= 0.5) {
	if(betnumber >= 1 && betnumber <= 100 && betnumber != "") {
		bals[msg.user] = Number(bals[msg.user]) - Number(betamount);
		var randomnum = Math.floor(Math.random()*100+1);
		if(betnumber == randomnum) {
			var winamount = betamount*2.5;
			bals[msg.user] = Number(bals[msg.user]) + Number(winamount);
			this.client.pushMessage(msg.room, msg.user + ": Number Generated : " + randomnum + " \\ Your Guess : " + betnumber + " \\ You hit the bullseye. Balance updated.");
			console.log(msg.user + " Hit the bullseye. He won " + winamount);
			profit = Number(oldprofit)-winamount;
			oldprofit = Number(profit);
			this.savestuff(msg);
		}else if((betnumber < randomnum + 5) && (betnumber > randomnum - 5)) {
			var winamount = betamount*2;
			bals[msg.user] = Number(bals[msg.user]) + Number(winamount);
			this.client.pushMessage(msg.room, msg.user + ": Number Generated : " + randomnum + " \\ Your Guess : " + betnumber + " \\ You were very close. Balance updated.");
			console.log(msg.user + " was very close. He won " + winamount);
			profit = Number(oldprofit)-winamount;
			oldprofit = Number(profit);
			this.savestuff(msg);
		}else if((betnumber < randomnum + 10) && (betnumber > randomnum - 10)) {
			var winamount = betamount*1.5;
			bals[msg.user] = Number(bals[msg.user]) + Number(winamount);
			this.client.pushMessage(msg.room, msg.user + ": Number Generated : " + randomnum + " \\ Your Guess : " + betnumber + " \\ You were close. Balance updated.");
			console.log(msg.user + " was close. He won " + winamount);
			profit = Number(oldprofit)-winamount;
			oldprofit = Number(profit);
			this.savestuff(msg);
		}else if((betnumber < randomnum + 16) && (betnumber > randomnum - 16)) {
			var winamount = betamount*1.2;
			bals[msg.user] = Number(bals[msg.user]) + Number(winamount);
			this.client.pushMessage(msg.room, msg.user + ": Number Generated : " + randomnum + " \\ Your Guess : " + betnumber + " \\ You were somewhat near. Balance updated.");
			console.log(msg.user + " was somewhat near. He won " + winamount);
			profit = Number(oldprofit)-winamount;
			oldprofit = Number(profit);
			this.savestuff(msg);
		}else{
			this.client.pushMessage(msg.room, msg.user + ": Number Generated : " + randomnum + " \\ Your Guess : " + betnumber + " \\ Sorry but you didn't win anything this time.");
			console.log(msg.user + " lost " + winamount);
			profit = Number(oldprofit)+betamount;
			oldprofit = Number(profit);
			this.savestuff(msg);
		}
	}else{
		this.client.pushMessage(msg.room, msg.user + ": Please enter a number between 1-100 only");
	}
	}else{
		this.client.pushMessage(msg.room, msg.user + ": Please bet between 0.25 mBTC and 0.50 mBTC");
	}
	}else{
		this.client.pushMessage(msg.room, msg.user + ": You do not have enough balance. Tip the bot some.");
	}
}
GuessBot.prototype.botprofit = function(msg) {
	this.client.pushMessage(msg.room, msg.user + ": Bot Profit is " + Number(profit));
}
GuessBot.prototype.faketip = function(msg) {
	var realmsg = msg.message.split(" ");
	var faketipamount = realmsg[1];
	if(bals[msg.user] == null) {
		bals[msg.user] = Number(faketipamount); }
	else {
		bals[msg.user] = Number(bals[msg.user]) + Number(faketipamount); }
	this.savestuff(msg);
}

GuessBot.prototype.faketipplayer = function(msg) {
	var realmsg = msg.message.split(" ");
	var faketipuser = realmsg[1];
	var faketipamount = realmsg[2];
	bals[faketipuser] = Number(faketipamount);
	console.log(msg.message);
	console.log(faketipuser);
	console.log(faketipamount);
	console.log(bals[faketipuser]);
	this.savestuff(msg);
}

GuessBot.prototype.credits = function(msg) {
	this.client.pushMessage(msg.room, "Credits go to \\ Ryder - Coding \\ SargoDarya - coinchat-client \\ dale3rulz5577 - Bot idea \\ Joseph, 13abyknight and admin - Beta Testing / Bug Fixing");
	
}

GuessBot.prototype.cashout = function(msg) {
	if(cashout == true) {
		if(bals[msg.user] < 0.25) {
			this.client.pushMessage(msg.room, msg.user + ": You need atleast 0.25 mBTC to cashout");
		}else{
			var roundbal = bals[msg.user].toFixed(2);
			console.log(msg.user + " is cashing out" + roundbal);
			this.client.pushTip(msg.room, msg.user, roundbal, "Cashout!");
			bals[msg.user] = 0;
			this.savestuff(msg);
		}
	}else{
		this.client.pushMessage(msg.room, msg.user + ": Sorry but cashout is currently disabled");
	}
}
GuessBot.prototype.bal = function(msg){
		var roundbal = bals[msg.user].toFixed(2);
		this.client.pushMessage(msg.room, msg.user + ": Your balance is " + roundbal + " mBTC. You can use !cashout to cashout.");
}

GuessBot.prototype.shutdown = function(msg) {
  this.client.pushMessage(msg.room, "Bot is shutting down. Kindly do not tip. Balance will NOT be updated");	
  this.savestuff(msg);
  console.log('shutting down..');
  setInterval(function(){ process.exit(0) }, 2000);
  return false;
};

module.exports = GuessBot;
