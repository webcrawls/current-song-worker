# current-song-worker

A [CloudFlare worker](https://workers.cloudflare.com/) that reads a user's latest scrobble from [last.fm](#), and exposes it as a JSON endpoint.
Perfect for use as a "listening to" widget on your website, as seen [here](https://webcrawls.neocities.org).

This repository contains the worker source code, and an HTML/JS snippet to implement this on your website

> Why use a worker? CloudFlare offers free access for up to 100k req/day, which is plenty for smaller websites like
> mine :)

**Table of Contents**

- [Setup](#details)
- [Installing Dependencies](#installing-dependencies)
- [CloudFlare Setup](#cloudflare-setup)
    - [Login](#login)
    - [Test](#test-locally)
    - [Deploy](#deploy-to-the-cloud)
- [Making A Widget for Your Website](#creating-a-widget-for-our-website)

## Setup

Before setting up this project, ensure you have grabbed yourself:

- a [last.fm account](https://www.last.fm/join) and [API key](https://www.last.fm/api)
- a [CloudFlare](https://www.cloudflare.com/) account
- a modern [node.js](https://nodejs.org/en) version `# TODO Be specific`

### Installing Dependencies

To deploy our CloudFlare worker, we will use the [wrangler](https://developers.cloudflare.com/workers/wrangler/) CLI
tool.
If you have [npx](https://docs.npmjs.com/cli/v7/commands/npx), you can skip installation, but for those who don't, run:

- `npm i -g wrangler` (omit the -g for local project installation)

### `wrangler` Setup

The CLI can do a lot of worker-related functions, but we will only be using the
[login](https://developers.cloudflare.com/workers/wrangler/commands/#login)
and [deploy](https://developers.cloudflare.com/workers/wrangler/commands/#deploy) commands (and
maybe [dev](https://developers.cloudflare.com/workers/wrangler/commands/#dev)).

#### Login...

Run (with `npx`, maybe) `wrangler login` to connect the tool to your CloudFlare account. It should open up a browser
window.

#### Test locally...

Running `wrangler dev` within this project's root will spin up a local instance of your worker.
The command should output a URL that, once visited, executes our worker and returns the result to our browser.

If you visit this URL, you should expect to see a JSON object containing your current last.fm statistics, like:

![image](/docs/example_json.png)
*The JSON result of the worker, rendered in Firefox*

> Encountering an error? Make sure you update the `LASTFM.KEY` variable inside `wrangler.toml` with your last.fm API
> key.

Once you've made sure things work locally, it's time to get this baby online!

#### Deploy to the cloud!

`wrangler deploy` will deploy your worker to CloudFlare's servers, and return a public URL that can be accessed
by anyone.

Now, every time you visit this URL, you will be greeted with a JSON object containing your current music status. Pretty
sweet!

This could be used for many live-display type projects, but here is a little information about using this for a website:

## Creating a Widget for our Website

This part requires more creativity than anything else. Now that we have a publicly-accessible URL containing our live
last.fm stats, we just need to pull it into the browser when our webpage loads.

The basic idea is to run some JS on page load that:

- requests the CloudFlare worker we just made,
- reads the song data from the JSON our worker cooks up, and
- update our page HTML with the new data.

I've implemented this on my [website](https://webcrawls.neocities.org/), so feel free to inspect the source and copy my
JS.
However, I've also written up a bare-bones [gist](https://gist.github.com/webcrawls/a726915109bf4e1e7fd86e90c3356cdf),
which may be easier to grok.

