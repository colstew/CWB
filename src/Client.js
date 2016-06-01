var eurecaClientSetup = function() {
	//create an instance of eureca.io client
	var eurecaClient = new Eureca.Client();
	
	eurecaClient.ready(function (proxy) {		
		eurecaServer = proxy;
	});
	
	
	//methods defined under "exports" namespace become available in the server side
	
	eurecaClient.exports.setId = function(id) 
	{
		myId = id;
		eurecaServer.handshake();
		ready = true;
		create();
	}	
	
	eurecaClient.exports.kill = function(id)
	{	
		if (playersList[id]) {
			playersList[id].kill();
			console.log('killing ', id, playersList[id]);
			delete playersList[id];
		}
	}	
	
	eurecaClient.exports.spawnEnemy = function(i, x, y)
	{
		
		if (i == myId) return; //this is me
		
		console.log('SPAWN');
		var tnk = new Luca(i, game, char);
		playersList[i] = tnk;
	}
	
	eurecaClient.exports.updateState = function(id, state)
	{
		if (playersList[id])  {

			playersList[id].cursor = state;
			playersList[id].char.x = state.x;
			playersList[id].char.y = state.y;
			// don't know if needed  
			playersList[id].update();
		}
	}

}