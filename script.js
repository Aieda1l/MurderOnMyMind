// SOUNDS
var music1 = new Audio("audio/music.mp3");
music1.volume = 0.2;
music1.loop = true;

var myGunshot = new Audio("audio/gunshots/rifle.mp3");
myGunshot.volume = 0.8

var enemyFallingPath = "audio/bodyfalling/";
enemyFallingFiles = ["fall1.mp3", "fall2.mp3", "fall3.mp3"];

var impactPath = "audio/impacts/other/";
impactFiles = ["dirt1.mp3", "dirt2.mp3", "dirt3.mp3", "dirt4.mp3", "dirt5.mp3"];

var enemyGunshot = new Audio("audio/laser_sound2.mp3");
enemyGunshot.volume = 0.6;

var select = new Audio("audio/select.mp3");
select.volume = 0.6;

var fleshImpactPath = "audio/impacts/flesh/";
fleshImpactFiles = ["flesh1.mp3", "flesh2.mp3", "flesh3.mp3", "flesh4.mp3"];

var injuredPath = "audio/hit/";
injuredFiles = ["injured1.mp3", "injured2.mp3", "injured3.mp3", "injured4.mp3"];

var playerDeath = new Audio("audio/death.mp3");
playerDeath.volume = 0.8;

var chopperNoise = new Audio("audio/chopper.mp3");
chopperNoise.volume = .7;
chopperNoise.loop = true;

var flatTire = new Audio("audio/flatTire.mp3");
flatTire.volume = .3;

var crash = new Audio("audio/explosion.mp3");
crash.volume = .7;

var hitmarker = new Audio("audio/hit.mp3");
hitmarker.volume = 1

var cooldown = 250;

var damage = 15;

var oncool = false;

var firemode = 1;

var sound

// SOME ESSENTIAL VARIABLES
const gameFrame = document.querySelector("#gameFrame");

var myLifePoints = 100;
var enemyShotDamage = 10;
var enemyShotsTimeout;

function livingEnemies() {
	return document.querySelectorAll(".level.current .enemy:not(.dead)");
}

//RANDOM WARNING OVERLAY AT BEGINNING
function off() {
  document.getElementById("overlay").style.animation = "fadeOutAnimation ease 1s";
  setTimeout(function() {
    document.getElementById("overlay").style.display = "none";
  }, 1000)
}

//CLEANING DUPLICATED SOUNDS
function clean(mediaElement) {
  setTimeout(function() {
    mediaElement.srcObject = null;
    mediaElement = null;
  }, 2000);
}

//FIREMODE SWITCHING
modeDiv = $("#fireMode")
modeText = $("#fireText")
$(modeDiv).click(function(){
  const selClone = select.cloneNode();
  selClone.play();
  clean(selClone)
  firemode += 1;
  if (firemode == 1) {
    myGunshot = new Audio("audio/gunshots/rifle.mp3");
    damage = 15;
    cooldown = 250;
    modeText.text("Firemode: rifle");
  }
  else if (firemode == 2) {
    myGunshot = new Audio("audio/gunshots/sniper.mp3");
    damage = 30;
    cooldown = 1200;
    modeText.text("Firemode: sniper");
  }
  else if (firemode == 3) {
    myGunshot = new Audio("audio/gunshots/lmg.mp3");
    damage = 5;
    cooldown = 100;
    modeText.text("Firemode: LMG");
  }
  else {
    myGunshot = new Audio("audio/gunshots/rifle.mp3");
    damage = 15;
    cooldown = 250;
    firemode = 1;
    modeText.text("Firemode: rifle");
  }
});

// ENEMY SHOOTS ME
function enemyShootsMe(enemy) {
	if(enemy) {
		enemy.classList.add("showing");
		setTimeout(function() {
			if(!enemy.classList.contains("dead")) {
				const clonedenemyGunshot = enemyGunshot.cloneNode()
	      clonedenemyGunshot.play();
				enemy.classList.add("shooting");
				gameFrame.classList.add("enemyShooting");
				updateLifePoints(myLifePoints - enemyShotDamage);
        setTimeout(function() {
          document.getElementById("hurtOverlay").style.display = "block";
          if (document.getElementById("sfx").checked) {
            i = Math.floor(Math.random()*fleshImpactFiles.length);
            var url = (fleshImpactPath+fleshImpactFiles[i])
            var fleshHit = new Audio(url);
            fleshHit.volume = 0.3
            fleshHit.play();
          }
          i = Math.floor(Math.random()*injuredFiles.length);
          var url = (injuredPath+injuredFiles[i])
          var injuredSound = new Audio(url);
          injuredSound.volume = 0.6
          injuredSound.play();
        }, 150);
        setTimeout(function() {
          document.getElementById("hurtOverlay").style.display = "none";
        }, 250)
				setTimeout(function() {
					enemy.classList.remove("shooting");
					gameFrame.classList.remove("enemyShooting");
					setTimeout(function() {
						enemy.classList.remove("showing");
					}, 150);
				}, 500);
			}
		}, 1000);
	}
}

// ELEMENT OF SURPRISE
function randomEnemyShots() {

	if(myLifePoints > 0) {

		if(livingEnemies()) {
			var randomEnemy = Math.floor(Math.random() * livingEnemies().length);
			var randomDelay = Math.floor(Math.random() * 2000) + 500;

			enemyShotsTimeout = setTimeout(function() {
				if(myLifePoints > 0) {
					enemyShootsMe(livingEnemies()[randomEnemy]);
					randomEnemyShots();					
				}
			}, randomDelay);
		}

	}

}


// DAMAGE AND DEATH
function updateLifePoints(amount) {
	myLifePoints = amount;
	if(myLifePoints < 1) {
		myLifePoints = 0;
		setTimeout(function() {
			if(livingEnemies().length) {
        flatTire.pause();
        chopperNoise.pause();
				music1.volume = 0.7;
        playerDeath.play();
				gameFrame.classList.add("playerDead");
        narrator()
			}
		}, 750);
	}
	if(myLifePoints > 100) myLifePoints = 100;
	document.getElementById("healthBar").style.width = myLifePoints+"%";
}

function getNextLevel() {
	return document.querySelector(".level:not(.current):not(.past)");	
}


// I SHOOT THE ENEMIES
function iShoot(enemy) {
  if (document.getElementById("sfx").checked) {
    i = Math.floor(Math.random()*fleshImpactFiles.length);
    var url = (fleshImpactPath+fleshImpactFiles[i])
    var fleshHit = new Audio(url);
    fleshHit.volume = 0.3
    setTimeout(function() {
      fleshHit.play();
    }, 150)
  }
  else {
    setTimeout(function() {
      const clonedHitmarker = hitmarker.cloneNode()
		  clonedHitmarker.play();		
      clean(clonedHitmarker)
	  }, 150);
  }

  var enemyHPLeft = parseInt(enemy.getAttribute("name")) - damage
  
  if (enemyHPLeft <= 0) {
    enemy.setAttribute("name", "0");
    /* Consequences on the enemies */
    enemy.classList.remove("shooting");
    enemy.classList.remove("showing");
    enemy.classList.add("dead");

    i = Math.floor(Math.random()*enemyFallingFiles.length);
    var url = (enemyFallingPath+enemyFallingFiles[i])
    var enemyFalling = new Audio(url);
    enemyFalling.volume = 0.3;
    enemyFalling.play();

    assessVictory();
  }
  else {
    enemy.classList.remove("shooting")
    enemy.setAttribute("name", enemyHPLeft);
  }
}

// VISUAL AND SOUND EFFECTS WHEN I SHOOT
async function myShootingEffects() {
  if (oncool == false) {
    const clonedGunshot = myGunshot.cloneNode()
    clonedGunshot.play();
    clean(clonedGunshot)
    gameFrame.classList.add("playerShooting");
    setTimeout(function() {
      gameFrame.classList.remove("playerShooting");
    }, 150);
    oncool = true
    setTimeout(function() {
      oncool = false
    }, cooldown);
  }
}

// DID I WIN?
function assessVictory() {
	/* Victory! */
	if(!livingEnemies().length) {
		setTimeout(function() {

			// Is there a further level
			if(getNextLevel()) {
				var currentLevel = document.querySelector(".level.current");
				currentLevel.classList.add("past");
				currentLevel.classList.remove("current");
				getNextLevel().classList.add("current");
				updateLifePoints(myLifePoints+40);

        narrator();

				// Level 3 intervals
				if(document.querySelector(".level.current").id == "level3") {
					setTimeout(function() {
						document.querySelector("#garageDoor").classList.add("open");
					}, 1000);
					setTimeout(function() {
						level3intervals();
					}, 2000);
				}

				// Level 4 functions
				if(document.querySelector(".level.current").id == "level4") {
					level4intervals();
					clearLevel3intervals();
				}

				// Reseting random attacks
				clearTimeout(enemyShotsTimeout);
				setTimeout(function() {
					randomEnemyShots()
				}, 4500);
			}
			else {
				music1.volume = 0.7;
        flatTire.pause();
        chopperNoise.pause();
        document.querySelectorAll(".level")[0].classList.add("current");
				setTimeout(function() {
					gameFrame.classList.add("playerWon");
          narrator()
				}, 1000);
			}

		}, 300);
	}	
}

function narrator() {
  music1.pause();
  setTimeout(function(){
     music1.play();
  }, 3000);
  if(gameFrame.classList.contains("playerWon")) {
    sound = new Audio("audio/narrator/you win.mp3");
    sound.play();
  } else if(gameFrame.classList.contains("playerDead")) {
    sound = new Audio("audio/narrator/game over.mp3");
    sound.play();
    music1.currentTime = 0;
  } else if(document.querySelector(".level.current").id == "level1") {
    sound = new Audio("audio/narrator/round 1.mp3");
    sound.play();
  } else if(document.querySelector(".level.current").id == "level2") {
    sound = new Audio("audio/narrator/round 2.mp3");
    sound.play();
  } else if(document.querySelector(".level.current").id == "level3") {
    sound = new Audio("audio/narrator/round 3.mp3");
    sound.play();
  } else if(document.querySelector(".level.current").id == "level4") {
    sound = new Audio("audio/narrator/last round.mp3");
    sound.play();
  }
}

// GETTING THE GAME READY
function newGame() {
  music1.volume = 0.3;
  music1.play();

	clearTimeout(enemyShotsTimeout);

	document.querySelectorAll(".enemy").forEach(enemy => {
		enemy.classList = ["enemy"];
    enemy.setAttribute("name", "20");
	});
	document.querySelectorAll(".truck").forEach(truck => {
		truck.classList = ["truck"];			
	});
	document.querySelectorAll(".bulletImpact").forEach(bulletImpact => {
		bulletImpact.remove();			
	});

	if(document.querySelector(".level.current").id == "level4") {
		level4intervals();
	}


	// Reset levels
	document.querySelectorAll(".level").forEach(level => {
 	  level.classList = ["level"];
	});
	document.querySelectorAll(".level")[0].classList.add("current");

	updateLifePoints(100);
	gameFrame.classList = [];

  narrator();

	music1.currentTime = 0;

	setTimeout(function() {
		randomEnemyShots();
	}, 4000);

}

document.querySelectorAll(".enemy").forEach(enemy => {
  enemy.addEventListener("click", function() {
    if (oncool == false) {
      iShoot(enemy);
    }
  });
});

document.querySelectorAll(".panel, .wall").forEach(wall => {

	wall.addEventListener("click", function(e) {
    if (oncool == false) {
      if(!wall.classList.contains("helice")) {
        wall.innerHTML += "<div class="bulletImpact" style="top: "+e.offsetY+"px; left: "+e.offsetX+"px;"></div>";
      }
      i = Math.floor(Math.random()*impactFiles.length);
      var url = (impactPath+impactFiles[i])
      var bulletPang = new Audio(url);
      bulletPang.volume = 0.3
      setTimeout(function() {
        bulletPang.play();
      }, 75);
    }
	});
});


// LEVEL 3

function level3intervals() {
	roadMovingInterval = setInterval(function() {
		innerRoad = document.querySelector(".current .obstacle.road .inner");
		innerRoad.style.backgroundPositionY = (parseInt(innerRoad.style.backgroundPositionY) - 20) + "%";
	}, 1000);
	truck = document.querySelector(".truck");
	carSwervingInterval = setInterval(function() {
		document.querySelector(".truck:not(.wheelShot)").style.left = (Math.random() * 60) + "%"; 
	}, 1500);
	carScaleInterval = setInterval(function() {
		document.querySelector(".truck:not(.wheelShot)").style.transform = "scale("+(Math.random() * .4 + .5)+")"; 
	}, 3000);	
}
// level3intervals();

function level4intervals() {

	document.querySelector("#chopper").classList = [];
	chopperHealth = 100;
	enemyShotDamage = 5;

	setTimeout(function() {
		chopperNoise.play();		
	}, 1000);
	heliceFlapInterval = setInterval(function() {
	    document.querySelectorAll(".helice").forEach(helice => {
	    	helice.classList.toggle("alter");
	    });
	}, 200);
	chopperSwervingInterval = setInterval(function() {
		document.querySelector("#chopper").style.left = (Math.random() * 60) + "%"; 
		document.querySelector("#chopper").style.top = (Math.random() * 80 - 15) + "%"; 
	}, 2500);
	chopperScaleInterval = setInterval(function() {
		var heliScale = (Math.random() * .4 + .1);
		chopperNoise.volume = heliScale;
		document.querySelector("#chopper").style.transform = "scale("+heliScale+") rotate("+(Math.random() * 40 - Math.random() * 40)+"deg)"; 
	}, 3000);	
}
// level4intervals();



function clearLevel3intervals() {
	if(roadMovingInterval) clearInterval(roadMovingInterval);
	if(carSwervingInterval) clearInterval(carSwervingInterval);
	if(carScaleInterval) clearInterval(carScaleInterval);
	if(carShakeInterval) clearInterval(carShakeInterval);
}


function clearLevel4intervals() {
	if(heliceFlapInterval) clearInterval(heliceFlapInterval);
	if(chopperSwervingInterval) clearInterval(chopperSwervingInterval);
	if(chopperScaleInterval) clearInterval(chopperScaleInterval);
	if(enemyShotsTimeout) clearTimeout(enemyShotsTimeout);
}


function shootWheel(wheel) {

	clearInterval(carScaleInterval);

	carShakeInterval = setInterval(function() {
		if(document.querySelector(".truck.wheelShot")) {
			flatTire.play();
			document.querySelector(".truck.wheelShot").classList.toggle("up"); 
		}
	}, 200);	
	
	if(truck.classList.contains("wheelShot")) {
		crash.play();
		flatTire.pause();
		setTimeout(function() {
			truck.classList.remove("wheelShot");
			truck.classList.add("broken");
			document.querySelectorAll(".truck .enemy").forEach(enemy => {
				enemy.classList.add("dead");
				assessVictory();
			});
		}, 1000);
	} else {
		truck.classList.add("wheelShot", wheel);
	}

}

// LEVEL 4
var chopperHealth = 100;
function shootChopper(score) {
	chopperHealth -= score;

	if(chopperHealth < 1) {
		clearLevel4intervals();
		setTimeout(function() {
			document.querySelector("#chopper").style = [];
			document.querySelector("#chopper").classList.add("crashing");

			document.querySelectorAll("#chopper .enemy").forEach(enemy => {
				enemy.classList.add("dead");
			});

			setTimeout(function() {
				crash.play();
				document.querySelector("#level4").classList.add("explosion");
				setTimeout(function() {
					document.querySelector("#level4").classList.remove("explosion");
					setTimeout(function() {
						assessVictory();
					}, 100);
				}, 800);		
			}, 1000);
		}, 1000);
	}

}


// LEVEL 5

function level5intervals() {
	roadMovingInterval5 = setInterval(function() {
		innerRoad = document.querySelector("#level5 .obstacle.road .inner");
		var roadPosition = (parseInt(innerRoad.style.backgroundPositionX) - 1000);
		innerRoad.style.backgroundPositionX = roadPosition + "px";
	}, 1000);
}
// level5intervals();

