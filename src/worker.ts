interface Env {
    LASTFM: {
        URL: string
        USER: string
        KEY: string
    }
}

export default {
    /**
     * Fetches resources from the last.fm API, compiles it into JSON, and returns a response.
     *
     * @param request the incoming request
     * @param env the environment (contains our last.fm information)
     */
    async fetch(request: Request, env: Env) {
        // get user  & track info (accessing worker environment for user & key)
        const user = await getUserInfo(env.LASTFM.USER, env.LASTFM.KEY)
        const track = await getCurrentTrack(env.LASTFM.USER, env.LASTFM.KEY)

        // return the response in the form of a JSON object. cloudflare will make this available on the URL they give us.
        return Response.json({user, track}, {headers: new Headers({"Access-Control-Allow-Origin": "*"})})
    },
};

/**
 * Fetches a resource from the last.fm API.
 *
 * @param method the last.fm API method
 * @param user the target user
 * @param key the last.fm API key
 */
const fetchLastFm = async (method: string, user: string, key: string) =>
    fetch(`http://ws.audioscrobbler.com/2.0/?method=${method}&user=${user}&api_key=${key}&format=json`,
        {
            method: "get",
            cf: {
                // cache for a max of 10 seconds
                cacheTtl: 10,
                // todo find out what this really does
                cacheEverything: true,
            }
        })
        .then(async (r) => await r.json())

/**
 * Fetches the current (latest) track from last.fm.
 *
 * @param user the last.fm user
 * @param key the last.fm API key
 */
const getCurrentTrack = async (user: string, key: string) => {
    // fetch recent track JSON and get latest track
    const json = await fetchLastFm("user.getrecenttracks", user, key)
    const latest = json["recenttracks"]["track"][0]

    // return an object containing that track's information
    return {
        artist: latest["artist"]["#text"],
        imagePath: latest["image"][1]["#text"],
        name: latest["name"],
        url: latest["url"]
    }
}

/**
 * Fetches information related to the target user.
 *
 * @param user the last.fm user
 * @param key the last.fm API key
 */
const getUserInfo = async (user: string, key: string) => {
    // fetch user info JSON
    const json = await fetchLastFm('user.getinfo', user, key)

    return {
        // return playcount (theoretically, we could do more here, but i haven't found a need yet)
        plays: json["user"]["playcount"]
    }
}