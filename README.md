# Memer

A client-side meme generator. [Demo](http://andycochran.github.io/memer/)

## Requirements

  * Ruby 1.9+
  * [Node.js](http://nodejs.org)
  * [compass](http://compass-style.org/): `gem install compass`

## Quickstart

When editing your SCSS, run the following command to process your CSS:

```bash
bundle exec compass watch
```

## Notes

Memer uses [Permanent Marker](https://www.google.com/fonts/specimen/Permanent+Marker) via [Google Fonts](https://www.google.com/fonts). You can change this in the `fabric.iText` settings in `memer.js`. 

Memer uses an hacked version of [fabric.js](http://fabricjs.com/) (which prevents the page from scrolling Memer out of view when hidden inputs are focused).
