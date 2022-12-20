/* eslint-disable no-undef */
import { Client } from "blookit";
import * as dotenv from "dotenv";
dotenv.config();

const credentials = {
	username: process.env.USERNAME || process.env.EMAIL,
	password: process.env.PASSWORD,
	bsid: process.env.GLOBAL_BSID
};

const client = new Client(credentials.username, credentials.password, null);

async function start() {
	await client.login(); // OR await client.login(credentials.bsid);
	console.log(`Logged in as ${client.username}`);

	const blooks = await client.getBlooks();
	const userBlooks = await client.getBlooks("Bot");

	console.log(blooks);
	console.log(userBlooks);

	const myStats = await client.getStats();
	const userStats = await client.getStats("Bot");

	console.log(myStats);
	console.log(userStats);

	const myTokens = await client.getTokens();
	
	console.log(myTokens);

	const market = await client.getMarket();

	console.log(market);

	
}

start();