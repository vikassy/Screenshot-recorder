# Screenshot Recorder

This is a repository for taking recording screenshots of VisualEditor 
UserGuide.

## Installation

Install all gems:

    $ bundle

## Usage

To run the server: 

    $ bundle exec ruby server.rb

You can use your browser(Firefox prefered) to open `http://127.0.0.1:4567/wiki/References?veaction=edit`

## Known Issues

1. Currently it works only for Reference page, as it is a simple proof of concept.
2. Some clicks do not get recorded.
3. The elements captured for screenshot might loose the highlighted color.
4. You have to go to Normal mode(If you are in screenshot mode) before you save.
5. This only works for single client for now.(File Synchronization Issue)
