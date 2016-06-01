
BasicGame.Game = function (game) {

    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;      //  a reference to the currently running game (Phaser.Game)
    this.add;       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
    this.camera;    //  a reference to the game camera (Phaser.Camera)
    this.cache;     //  the game cache (Phaser.Cache)
    this.input;     //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
    this.load;      //  for preloading assets (Phaser.Loader)
    this.math;      //  lots of useful common math operations (Phaser.Math)
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
    this.stage;     //  the game stage (Phaser.Stage)
    this.time;      //  the clock (Phaser.Time)
    this.tweens;    //  the tween manager (Phaser.TweenManager)
    this.state;     //  the state manager (Phaser.StateManager)
    this.world;     //  the game world (Phaser.World)
    this.particles; //  the particle manager (Phaser.Particles)
    this.physics;   //  the physics manager (Phaser.Physics)
    this.rnd;       //  the repeatable random number generator (Phaser.RandomDataGenerator)

    //  You can use any of these from any function within this State.
    //  But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.
};

BasicGame.Game.prototype = {

    /*create: function () {

        


    },

    update: function () {

        

        }
    },

    
     */


    //this function will handle client communication with the server

    create: function () { eurecaClientSetup(); },

    update: function () {
        //do not update if client not ready
        if (!ready) return;

        // update player healthText
        healthText.setText('health: ' + playersList[myId].health);

        player.input.left = cursors.left.isDown;
        player.input.right = cursors.right.isDown;
        player.input.jump = cursors.jump.isDown;
        player.input.fire = this.input.activePointer.isDown;
        player.input.tx = this.input.x+ this.camera.x;
        player.input.ty = this.input.y+ this.camera.y;

        for (var i in playersList){

            if (!playersList[i]) continue;
            var curBullets = playersList[i].bullets;
            var curplayer = playersList[i].char;

             //  Collide the player with the platforms
            this.physics.arcade.collide(curplayer, platforms);

            for (var j in playersList)
            {
                if (!playersList[j]) continue;
                if (j!=i) {
                
                    var targetplayer = playersList[j].char;
                    
                    this.physics.arcade.overlap(curBullets, targetplayer, bulletHitPlayer, null, this);
                
                }
                if (playersList[j].alive)
                {
                    playersList[j].update();
                }           
            }
        }

    },

    quitGame: function (pointer) {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.
        //this.music.stop();

        //  Then let's go back to the main menu.
        this.state.start('MainMenu');

    }

     //render: function () {}



};



function create () {

        // play music
        //this.music = this.add.audio('music');
        //this.music.play();

        // start physics and add background
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.add.sprite(0, 0, 'sky');

        // add platforms group
        platforms = game.add.group();
        platforms.enableBody = true;

        // add ground
        var ground = platforms.create(0, game.world.height - 64, 'ground');
        ground.scale.setTo(2, 2);
        ground.body.immovable = true;

        // add ledges
        var ledge = platforms.create(400, 400, 'ground');
        ledge.body.immovable = true;
        ledge = platforms.create(-150, 250, 'ground');
        ledge.body.immovable = true;
       
        // add 
        playersList = {};
        player = new Luca(myId, game, char);
        playersList[myId] = player;
        char = player.char;
        char.x=0;
        char.y=0;
        bullets = player.bullets; 

        //add health
        healthText = game.add.text(700, 16, '', { fontSize: '16px', fill: '#000' });

        cursors = game.input.keyboard.addKeys({'left': Phaser.Keyboard.A, 'right': Phaser.Keyboard.D, 'jump': Phaser.Keyboard.SPACEBAR});
        cursors.fire = game.input.activePointer.isDown;
      
};

function bulletHitPlayer (player, bullet) {
        bullet.kill();
        playersList[player.id].damage();
 }
