/**
 * Welcome to Cloudflare Workers! 
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { AccessTokenBuilder } from "./AccessTokenBuilder.js"

const DefaultExpirationTimeInSeconds = 3600

const DefaultResponseInit = {
	headers: {
		"Content-Type": "text/plain; charset=utf-8",
	}
}


async function fetch(request, env, ctx) {
	let enterpriseId = ""
	let token = ""
	let userId = ""
	let expirationTimeInSeconds = DefaultExpirationTimeInSeconds

	// console.log("request", request)

	// parse query param from request
	let url = new URL(request.url)
	let searchParams = url.searchParams
	enterpriseId = searchParams.get("enterpriseId")
	token = searchParams.get("token")
	userId = searchParams.get("userId")
	expirationTimeInSeconds = searchParams.get("expire") || DefaultExpirationTimeInSeconds

	if (enterpriseId == null || enterpriseId == "") {
		return new Response("enterpriseId is required", DefaultResponseInit)
	}

	if (token == null || token == "") {
		return new Response("token is required", DefaultResponseInit)
	}

	if (userId == null || userId == "") {
		return new Response("userId is required", DefaultResponseInit)
	}

	if (expirationTimeInSeconds == null || expirationTimeInSeconds == "" || isNaN(expirationTimeInSeconds) || expirationTimeInSeconds <= 0) {
		expirationTimeInSeconds = DefaultExpirationTimeInSeconds
	}

	expirationTimeInSeconds = parseInt(`${expirationTimeInSeconds}`)

	console.info("=======================================")
	console.info(`enterpriseId: ${enterpriseId}`)
	console.info(`token: ${token}`)
	console.info(`userId: ${userId}`)
	console.info(`expires: ${expirationTimeInSeconds}`)
	console.info("=======================================")

	let accessToken = ""
	try {
		accessToken = AccessTokenBuilder.buildAccessTokenWithExpires(`${enterpriseId}`, `${token}`, `${userId}`, expirationTimeInSeconds)
	} catch (error) {
		console.error(error)
		return new Response("Failed to generate access token", DefaultResponseInit)
	}

	console.info("=======================================")
	console.info(`accessToken: ${accessToken}`)
	console.info("=======================================")

	return new Response(`${accessToken}\n${encodeURIComponent(accessToken)}`, DefaultResponseInit)
}


export default { fetch }
