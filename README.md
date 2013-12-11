Synth
=====

"The most awesome generative music environment ever in the world." (tm)

## MAIN SCREEN ##

The main screen is a series of nodes which act as audio sources and destinations. 
Connections, or signal paths, are represented as lines between nodes. 

Double-Clicking the background creates a new node. Within the node's glasspane you can set the type, 
though it will default to source node on creation.

### Node Arrangement ###
There are three types of nodes -  
#### Source nodes:  ####
* Larger in size   
* Color corresponds to type of node (evenually a drop down key display for reference)    
* Click selects, dbl click and rt click enters associated world   
* Can be a generator (ie a synth oscillator), or can trigger audio (ie a sampler)  
* Outputs a stereo audio signal. Does not (at this point anyway) accept an input signal  

#### Processor nodes:     ####
* Smaller in size  
* Can do different kinds of audio processing (ie filter, reverb, delay)  
* Accepts either a stereo or a mono input signal, outputs either a stereo or mono signal

#### The output node:    ####
* In center of screen, immobile  
* Sums all audio inputs and passes them to the physical audio output as a stereo signal. Acts as the master section of an audio mixer.

### Node Behaviors  ###

All nodes emit a visual pulse according to their audio output. This could either be:   
* A visualizer, maybe tied to radius or the radius of a semi opaque background circle which is larger than the node itself, or  
* A pulse output tied to bpm ('beats per minute', which is a global session setting), ie on when on/off when off

Connections between nodes can be established by either:  
* Proximity to other nodes or  
* Contact with other nodes  

Disconnection from connected nodes happens when:  
* A node is dragged far enough from its connected nodes or
* Contact with the connected nodes  

## WORLD SCREEN  ##

Each world (or source) screen is reached by double-clicking a source node (currently zooms into that world, an overlay view while still in the master 
view could be a later option.)

The first worlds will be - 

### Bouncing:   ###
* Bouncing balls are added by clicking and holding the background. 
* Larger fall faster? could be cool to create different rhythms.
* Each impact with the bottom of the screen should send a note event to a primary function, along with its x location. The width of the screen will relate to pitch values.
* The sound (for now) will be generated tones from a synth oscillator.

### Waveform:   ###
* A playback head moves along a block waveform that is adjustable by the user. Size of the waveform affects some audio parameters.
* Either the playback head or the waveform will be set to stationary, with the other set to scroll.

### Force Directed Graph:   ###
* A force directed graph of musical madness a la the initial main page.

## GLASS PANE SCREEN  ##
The glass pane will float right or left (maybe node settings float left and global settings/routings float right?). The node 
settings pane will report parameters/status of the selected node. There should be the ability to show/hide.


---

possible names:

ecmasynth  
super power awesome ultimate modular (spaum)





C: red 
C#: violet or purple
D: yellow
D#: flesh, steel blue
E: sky blue
F: deep red
F#: bright blue or violet
G: orange
G#: violet or lilac
A: green
A#: rose or steel
B: blue or pearly blue
