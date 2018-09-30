# radioplayer-chrome-extension
A radio player as a chrome extension

## My motivation on this project 
* Play my favorite radios while working
* Learn the Javascript language

## Features
* Player
    * play/pause 
    * mute/unmute
    * previous & next
    * options

* Options
    * import - playlist from a JSON file
    * export - playlist to a JSON file
    * station - add, edit, remove, set as default

## Playlist file
This is an example of a JSON file.


    {
        name : "CV Music",
        list : [
            {name:"RCV", url:"http://radios.vpn.sapo.pt/CV/radio7.mp3"},
            {name:"Praia FM", url:"http://radios.vpn.sapo.pt/CV/radio4.mp3"},
            {name:"Morabeza", url:"http://radios.vpn.sapo.pt/CV/radio3.mp3"},
            {name:"Crioula FM", url:"http://radios.vpn.sapo.pt/CV/radio5.mp3"}
        ]
    }

## Instalation
1. Download this project and unzip it
2. Open Chrome browser
3. Open Extensions option from menu ('More tools')
4. Select the option 'Load unpacked' and select the project folder

## Architecture

### Controllers
* __Player__ - module that implements the chrome pop-up window where user can select the radio and control audio output.

* __Options__ - module that implements the chrome options window where user can control the playlist.

* __Playlist__ - module that implements a list of radio stations. It has the following features: current playing station; moves to next/previous station; gives a list of station; save or remove a station;

### Models
* __Station__ - name (string), URL (string)

* __StationInt__ - name (string), URL (string), id (number), default (boolean) 
