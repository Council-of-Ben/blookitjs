import { Client } from "blooket";
import fs from "fs";

const accounts = fs.readFileSync("./src/accounts.csv", "utf8").split("\n").map(line=>line.split(",")).map(x=>({username:x[0],password:x[1]}));
const clients = {};
const results = {};
accounts.forEach(account=>{
	clients[account.username]=new Client(account.username,account.password);
});

async function start() {
	accounts.forEach(async x => {
		const client = clients[x.username];
		await client.login();
		console.log(`Logged in as ${client.username}`);
		await client.addRewards({
			tokens: 500,
			xp: 300
		});
		const ress = await client.openPacks([{
			name:"Blizzard",
			amount:~~(await client.getTokens())/25
		}]);
		Object.assign(results, ress);
		delete clients[x.username];
	});
	console.log(results);
}

start();