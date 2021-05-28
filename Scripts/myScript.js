// Start
function gameStart() {
	$("#logText").html("<hr><br>Hostiles approaching! Prepare yourself<br><br><hr>");
}
function turnStart() {
	var text = $("#logText");
	if (player.HP <= 0) {
		lose();
	} else if (targetNum <= 0) {
		win();
	} else {
		player.AP = maxAP;
		refreshShield();
		setCharDis();
		setTargDis(); // Double to counter cycling target display
		setTargDis();
		disTargDtl(targetNumAry);
		disTargNum(targetNum);
		text.append("<br><b>Turn "+turnCounter+"</b><br><hr>");
	}
}

// Win
function win() {
	$("#logText").append("<br>All enemies defeated!<br>You win!!<br><br><hr>");
}
// Lose
function lose() {
	$("#logText").append("GAME OVER<hr>");
}

// Send Num of Targets to Log
function disTargNum(numOfTarg) {
	var text = "";
	text += "<br>There are "+numOfTarg+" targets!<br><br><hr>";
	$("#logText").append(text);//
}

// Send Target Info to Log
function disTargDtl(trgAry) {
	for (i = 0; i < trgAry.length; i++) {
		var text = $("#logText");

		if (trgAry[i].HP > 0) {
			text.append("<br>Target "+(i+1)+"<br>Name: "+trgAry[i].name+"<br>Class: "+trgAry[i].class+"<br>HP: "+trgAry[i].HP+"<br><br><hr>");
		} else {
			//
		}
	}
}

// Set Character Display Panel Info
function setCharDis() {
	$("#charHP").text(player.HP);
	$("#charAP").text(player.AP);
	$("#charATK").text(player.ATK);
	$("#charARM").text(player.ARM);
	$("#charSHD").text(player.SHD);
	$("#charMOV").text(player.MOV);
}

// Set Target Display Panel Info
function setTargDis() {

	$("#targetNum").text(targetNum);
	
	if (disTrg > 1 || disTrg < 0) {
		disTrg = 0;
	 } else {
		  //
	 }

	switch(disTrg){
		case 0:
			if (target1.HP > 0) {
				$("#targetName").html(target1.name);
				$("#targetClass").html(target1.class);
				$("#targetHP").html(target1.HP);
				$("#targetSHD").html(target1.SHD);
				$("#targetRng").html(target1.range);
				curTrg = target1;
				disTrg++;
			} else {
				disTrg++;
			}
			break;
		case 1:
			if (target2.HP > 0) {
				$("#targetName").html(target2.name);
				$("#targetClass").html(target2.class);
				$("#targetHP").html(target2.HP);
				$("#targetSHD").html(target2.SHD);
				$("#targetRng").html(target2.range);
				curTrg = target2;
				disTrg++;
			} else {
				disTrg++;
			}
			break;
		default:
			break;
	}
}




// Check if attack hits
function toHit(attacker, target) {
	var randInt = Math.floor(Math.random() * 11);

	$("#logText").append("<br>"+attacker.name+" Fires!<br><br>");

	if (randInt <= 9) {
		$("#logText").append("<br>It hits!<br><br>");
		return true;
	} else {
		$("#logText").append("<br>It misses!<br><br><hr><br>#<br><br><hr>");
		return false;
	}
		
}

// Check if damage reaches HP through shield and armour
function damageCheck(attacker, target) {
	console.log("checking damage");
	var atka = attacker;
	var targ = target;
	var dmg = 0;

	if (targ.SHD <= 0) {
		console.log("hitting armour");
		dmg += atka.ATK;
		tookDamage = dmgCVArmour(dmg, targ);
	} else {
		console.log("hitting shield");
		dmg = dmgCVShield(atka, targ);
		if (dmg > 0) {
			console.log("hitting armour after shield");
			tookDamage = dmgCVArmour(dmg, targ);
		} else {
			console.log("safe!");
			$("logText").append("<br>"+target.name+"'s armour deflected the remaining damage!<br><br><hr>");
		}
	}

	if (target.HP <=0 && target.name == player.name) {
		lose();
	} else if (target.HP <=0 && target.name != player.name) {
		targetNum--;
		$("#logText").append("<br>"+target.name+" has been defeated!<br><br><hr>");
		setTargDis();
	} else {
		//
	}

	if (targetNum <=0) {
		win();
	} else {
		//
	}
	$("#logText").append("<br>#<br><br><hr>");
}

// Check if damage breaks the shield
function dmgCVShield(attacker, target) {
	
	var dmg = attacker.ATK - target.SHD;
	$("#logText").append("<br>"+target.name+"'s shield takes a beating!<br><br>");

	if (dmg > 0) {
		$("#logText").append("<br>"+target.name+"'s shield is broken!<br><br>");
		target.SHD = 0;
		
		if (target == player) {
		$("#charSHD").html(target.SHD);
		} else {
			$("#targetSHD").html(target.SHD);
		}
		
		return dmg;
	} else {
		$("#logText").append("<br>"+target.name+"'s shield is still in effect!<br><br><hr>");
		target.SHD = target.SHD - attacker.ATK;

		if (target == player) {
			$("#charSHD").html(target.SHD);
		} else {
			$("#targetSHD").html(target.SHD);
		}

	}
}

function dmgCVArmour(damage, target) {
	var dmg = damage;
	var arm = target.ARM;

	if (dmg > arm) {
		$("#logText").append("<br>The attack pierces "+target.name+"'s armour!<br><br>");
		dmg -= arm;
		$("#logText").append("<br>"+target.name+" loses "+dmg+" HP!<br><br><hr>");
		target.HP -= dmg;
		
		if (target == player) {
			$("#charHP").html(target.HP);
		} else {
			$("#targetHP").html(target.HP);

		}
		return true;
	} else {
		$("#logText").append("<br>"+target.name+"'s armour was too strong!<br><br><hr>");
	}
}

// Checks actor action points vs ranged attack cost and returns bool	- chage renAtkCost to action.cost for reusablility
function hasAPFR(actor, action) {
	if (rngAtkCost <= actor.AP) {
		return true;
	} else {
		return false;
	}
}

function npcAtk() {
	
	for (i = 0; i < targetNumAry.length; i++) {
		if (targetNumAry[i].HP > 0) {
			var doesHit = toHit(targetNumAry[i], player);
			if (doesHit) {
				damageCheck(targetNumAry[i], player);
			} else {
				//
			}
		} else {
			//
		}
	}
}

function refreshShield() {

	
	player.SHD += shieldRegen;
	if (player.SHD > plrShdMax) {
		player.SHD = plrShdMax;
	} else {
		//
	}

	$("#charSHD").text(player.SHD);

	for (i = 0; i < targetNumAry.length; i++) {

		if (targetNumAry[i].HP > 0) {

			console.log(targetNumAry[i]);
			targetNumAry[i].SHD += shieldRegen;

			if (targetNumAry[i].SHD > trgShdMax) {
				targetNumAry[i].SHD = trgShdMax;
			} else {
				//
			}
		} else {
			//
		}
	}
	if (turnCounter > 1) {
		$("#logText").append("<br>Shields recharged by "+shieldRegen+"<br><br><hr>#<br><br><hr>");
	} else {
		//
	}
};


// on click, invoke toHit
$("#atkRange").click(
	function () {
		var hasAP = hasAPFR(player);
		if (hasAP) {
			player.AP -= rngAtkCost;
			$("#charAP").html(player.AP);
			var hitCheck = toHit(player, curTrg);
			if (!hitCheck) {
				console.log("miss");
			} else {
				console.log("hit! sending to damage");
				damageCheck(player, curTrg);
			}
		} else {
			$("#logText").append("<br>You don't have enough AP<br><br><hr>");
		}
	}
);

// on click, invoke setTargDis
$("#cycleTarget").click(function () {
	setTargDis();
});


// Change Player Name
$("#nameSub").click(function () {
	var nameForm = $("#name").val();
	$("#charName").text(nameForm);
	player.name = nameForm;
});

$("#endTurn").click(
	function() {
		npcAtk();
		npcAtk();
		turnCounter++;
		turnStart();
	}
);

var maxAP = 6;
var plrShdMax = 30;
var shieldRegen = 5;

// Player Stat Block
var player = {
	name: "MechaDave",
	AP: maxAP,
	HP: 100,
	ATK: 15,
	ARM: 8,
	SHD: plrShdMax,
	MOV: 15
};

var trgShdMax = 20;

// Targets Stat Blocks
var target1 = {
	name: "Jerry",
	class: "Light",
	HP: 30,
	AP: 4,
	ATK: 15,
	ARM: 5,
	SHD: 20,
	distance: 50
};
var target2 = {
	name: "Guntha",
	class: "Light",
	HP: 30,
	AP: 4,
	ATK: 15,
	ARM: 5,
	SHD: 20,
	distance: 50
}

var rngAtkCost = 2;




var turnCounter = 1;

var curTrg = "";
var disTrg = 0;


var targetNumAry = [target1, target2];
var targetNum = targetNumAry.length;

// Reset name change form field to blank on page load
$("#name").val("");

// 1st time setup
setCharDis();
setTargDis();
gameStart();
turnStart();


/*

On Cycle Target
Count num of targets with HP > 0
Add to array
Display i

*/



/*
Turn start: display number of targets
Player has first turn for simplicity (for now)
Actions cost 1 AP, MOV costs AP + MOV

*/