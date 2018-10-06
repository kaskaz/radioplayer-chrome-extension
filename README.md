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
    * import - playlist from a JSON file __[not implemented yet]__
    * export - playlist to a JSON file __[not implemented yet]__
    * station - add, edit, remove

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

