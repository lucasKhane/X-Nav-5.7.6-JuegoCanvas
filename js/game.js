// Creamos el canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Imagen de background
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";
//bgImage.src = "images_pingui/background.png";

// Imagen del héroe
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";
//heroImage.src = "images_pingui/rugbier.png";

// Imagen de la princesa
var princessReady = false;
var princessImage = new Image();
princessImage.onload = function () {
	princessReady = true;
};
//princessImage.src = "images/princess.png";
princessImage.src = "images_pingui/balon.png";

// Imagen de la piedra
var stoneReady = false;
var stoneImage = new Image();
stoneImage.onload = function () {
  stoneReady = true;
};
stoneImage.src = "images/stone.png";

// Imagen del monstruo
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function()
  {monsterReady = true;
};
//monsterImage.src = "images/monster.png";
monsterImage.src = "images_pingui/rugbier.png";

// Objetos del juego
var hero = {
	speed: 256 // movimiento en pixeles por segundo
};
var princess = {};
var stone = {};
var monster = {
  speed: 50
};

var princessesCaught = localStorage.getItem("stoPrincessesCaught");
if (princessesCaught == null) {
  princessesCaught = 0;
}

var gameover = false;

var level = localStorage.getItem("stoLevel");
if (level == null) {
  level = 0;
}

// Manejar los controles del teclado
var keysDown = {};

addEventListener("keydown", function(e) {keysDown [e.keyCode] = true;}, false);

addEventListener("keyup", function(e) {delete keysDown [e.keyCode];}, false);

// Reseteamos el juego cuando el jugador captura una princesa
var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	// Ponemos a la princesa en algún lugar de la pantalla aleatoriamente
	princess.x = 52 + (Math.random() * (canvas.width - 104));
	princess.y = 52 + (Math.random() * (canvas.height - 104));

	// Ponemos la piedra piedra en algún lugar de la pantalla aleatoriamente
	stone.x = 52 + (Math.random() * (canvas.width - 104));
	stone.y = 52 + (Math.random() * (canvas.height - 104));

	// Ponemos el monstruo en algún lugar de la pantalla aleatoriamente
	monster.x = 52 + (Math.random() * (canvas.width - 104));
	monster.y = 52 + (Math.random() * (canvas.height - 104));

	// Alejamos al monstruo del heroe si aparece muy cerca
	//Heroe izquierda
	if (((hero.x - monster.x) < 0) && ((hero.x - monster.x) > -100)) {
	  monster.x += 100;
	}
	//Heroe derecha
	if (((hero.x - monster.x) > 0) && ((hero.x - monster.x) < 100)) {
	  monster.x -= 100;
	}
	//Heroe arriba
	if (((hero.y - monster.y) < 0) && ((hero.y - monster.y) > -100)) {
	  monster.y += 100;
	}
	//Heroe abajo
	if (((hero.y - monster.y) > 0) && ((hero.y - monster.y) < 100)) {
	  monster.y -= 100;
	}
};

// Actualizamos los objetos del juego
var update = function (modifier) {
	if (38 in keysDown) { // Jugador presionando arriba
	  // Heroe no se sale del mapa por arriba
	  if (hero.y >= 28) {
	    if (
        hero.x <= (stone.x + 16)
        && stone.x <= (hero.x + 16)
        && hero.y <= (stone.y + 16)
	      && stone.y <= (hero.y + 32)) {
	      hero.y = hero.y + 8;
	    }
	    else {
		    hero.y -= hero.speed * modifier;
		  }
		}
		else {
		  hero.y = hero.y + 8;
		}
	}
	if (40 in keysDown) { // Jugador presionando abajo
	   // Heroe no se sale del mapa por abajo
	  if (hero.y <= 416) {
	    if (
        hero.x <= (stone.x + 16)
        && stone.x <= (hero.x + 16)
        && hero.y <= (stone.y + 16)
	      && stone.y <= (hero.y + 32)) {
	      hero.y = hero.y - 8;
	    }
	    else {
		    hero.y += hero.speed * modifier;
		  }
	  }
	  else {
		  hero.y = hero.y - 8;
		}
	}
	if (37 in keysDown) { // Jugador presionando izquierda
	   // Heroe no se sale del mapa por la izquierda
	  if (hero.x >= 28) {
	    if (
        hero.x <= (stone.x + 16)
        && stone.x <= (hero.x + 16)
        && hero.y <= (stone.y + 16)
	      && stone.y <= (hero.y + 32)) {
	      hero.x = hero.x + 8;
	    }
	    else {
		    hero.x -= hero.speed * modifier;
		  }
		}
		else {
		  hero.x = hero.x + 8;
		}
	}
	if (39 in keysDown) { // Jugador presionando derecha
	   // Heroe no se sale del mapa por la derecha
	  if (hero.x <= 452) {
	    if (
        hero.x <= (stone.x + 16)
        && stone.x <= (hero.x + 16)
        && hero.y <= (stone.y + 16)
	      && stone.y <= (hero.y + 32)) {
	      hero.x = hero.x - 8;
	    }
	    else {
		    hero.x += hero.speed * modifier;
		  }
		}
		else {
		  hero.x = hero.x - 8;
		}
	}

	// El héroe captura una princesa
	if (
		hero.x <= (princess.x + 16)
		&& princess.x <= (hero.x + 16)
		&& hero.y <= (princess.y + 16)
		&& princess.y <= (hero.y + 32)
	) {
		++princessesCaught;
		++level;
		localStorage.setItem("stoPrincessesCaught",princessesCaught);
		localStorage.setItem("stoLevel", level);
		reset();
	}

	// El heroe toca un monstruo
	if (
		hero.x <= (monster.x + 16)
		&& monster.x <= (hero.x + 16)
		&& hero.y <= (monster.y + 16)
		&& monster.y <= (hero.y + 32)
	) {
		princessesCaught = 0;
		localStorage.setItem("stoPrincessesCaught", 0);
		localStorage.setItem("stoLevel", 0);
		gameover = true;
	}

	// El monstruo avanza
	if (hero.x <= monster.x) {
	  monster.x -= monster.speed * modifier
	  + monster.speed*level/10 * modifier;
	}
	if (monster.x <= hero.x) {
	  monster.x += monster.speed * modifier
	  + monster.speed*level/10 * modifier;
	}
	if (hero.y <= monster.y) {
	  monster.y -= monster.speed * modifier
	  + monster.speed*level/10 * modifier;
	}
	if (monster.y <= hero.y) {
	  monster.y += monster.speed * modifier
	  + monster.speed*level/10 * modifier;
	}
};

// Dibujamos todo
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (princessReady) {
		ctx.drawImage(princessImage, princess.x, princess.y);
	}

	if (stoneReady) {
		ctx.drawImage(stoneImage, stone.x, stone.y);
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

	// Puntuacion
	if (gameover == false) {
	  ctx.fillStyle = "rgb(250, 250, 250)";
	  ctx.font = "24px Helvetica";
	  ctx.textAlign = "left";
  	ctx.textBaseline = "top";
	  ctx.fillText("Pelotas atrapadas: " + princessesCaught, 32, 32);
	}

	if (gameover == true) {
	  ctx.fillStyle = "rgb(0, 0, 0)";
	  ctx.font = "60px Helvetica";
	  ctx.textAlign = "left";
	  ctx.textBaseline = "top";
	  ctx.fillText("GAME OVER", 70, 150);
	}
};

// Bucle principal del juego
var main = function () {
	var now = Date.now();
	var delta = now - then;
  if (gameover == false) {
	  update(delta / 1000);
	}
	render();

	then = now;
};

// Vamos a jugar!
reset();
var then = Date.now();
//The setInterval() method will wait a specified number of milliseconds, and then execute a specified function, and it will continue to execute the function, once at every given time-interval.
//Syntax: setInterval("javascript function",milliseconds);
setInterval(main, 1); // Ejecutamos tan rápido como sea posible
