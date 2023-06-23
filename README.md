# current-song-worker

A [CloudFlare worker](#) that reads a user's latest scrobble from [last.fm](#), and exposes it as a JSON endpoint.
Perfect for use as a "listening to" widget on your website, as seen [here](https://webcrawls.neocities.org).

- [Details](#details)

## Details

This worker uses the [last.fm API](#). To gain access, you must apply for an API key. This process happens instantly, in
my experience.

