Luca = function (index, game, player) {
	this.cursor = {
		left:false,
		right:false,
		jump:false,
		fire:false		
	}

	this.input = {
		left:false,
		right:false,
		jump:false,
		fire:false
	}

    var x = 0;
    var y = 0;

    this.game = game;

    this.health = 30;
    this.healRate = 3; //seconds until next heal
    //this.timer = Phaser.TimerEvent.add(1000*this.healRate, heal, this); // add event to timer
    this.timer = game.time.events.repeat(1000*this.healRate, true, heal, this);

    this.player = player;

    this.bullets = game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(20, 'bullet', 0, false);
    this.bullets.setAll('outOfBoundsKill', true);
    this.bullets.setAll('checkWorldBounds', true);	
	
    this.fireRate = 500;
    this.nextFire = 0;
    this.alive = true;

    this.id = index;
    this.char = game.add.sprite(32, game.world.height - 150, 'luca');
    this.char.id = index;
    
    this.game.physics.arcade.enable(this.char);

    this.char.body.bounce.y = 0.2;
    this.char.body.gravity.y = 500;
    this.char.body.collideWorldBounds = true;

    this.char.animations.add('left', [0,1,2,3,4,5,6,7,8], 10, true);
    this.char.animations.add('right', [13,14,15,16,17,18,19,20,21], 10, true);
    this.char.animations.add('shootLeft', [39,40,41,42,43,44,45,46,47,48,49,50,51], 10, true);
    this.char.animations.add('shootRight', [52,53,54,55,56,57,58,59,60,61,62,63,64], 10, true);
    this.char.animations.add('die', [27,28,29,30,31,32], 10, true);

};

Luca.prototype.update = function() {
	
	var inputChanged = (
		this.cursor.left != this.input.left ||
		this.cursor.right != this.input.right ||
		this.cursor.jump != this.input.jump ||
		this.cursor.fire != this.input.fire
	);
	
	if (inputChanged)
	{
		//Handle input change here
		//send new values to the server		
		if (this.id == myId)
		{     
			// send latest valid state to the server
			this.input.x = this.char.x;
			this.input.y = this.char.y;
     
			//this.input.angle = this.char.angle;
			//this.input.rot = this.turret.rotation;
			
			eurecaServer.handleKeys(this.input);
			
		}
	}

	//cursor value is now updated by eurecaClient.exports.updateState method
	
	
    if (this.cursor.left)
    {
        //  Move to the left
        this.char.body.velocity.x = -150;

        this.char.animations.play('left');
    }
    else if (this.cursor.right)
    {
        //  Move to the right
        this.char.body.velocity.x = 150;

        this.char.animations.play('right');
    }
    else
    {
        //  Stand still
        this.char.body.velocity.x = 0;

        this.char.animations.stop();

        this.char.frame = 26;
    }
    
    //  Allow the player to jump if they are touching the ground.
    if (this.cursor.jump && this.char.body.touching.down)
    {
        this.char.body.velocity.y = -450;
    }

    if (this.cursor.fire)
    {    
        this.fire({x:this.cursor.tx, y:this.cursor.ty});
    }
	
}


Luca.prototype.fire = function(target) {

		if (!this.alive) return;

        if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0)
        {
            this.nextFire = this.game.time.now + this.fireRate;
            var bullet = this.bullets.getFirstDead();
            bullet.reset(this.char.x, this.char.y);

			bullet.rotation = this.game.physics.arcade.moveToObject(bullet, target, 500);
        }
}

Luca.prototype.damage = function() {

    this.health -= 1;

    if (this.health <= 0)
    {
        this.alive = false;
        this.char.kill();
        return true;
    }

    return false;
}

Luca.prototype.kill = function() {

	this.alive = false;
	this.char.kill();
}

function heal() {

    if(this.health < 30) this.health++;
}