# Motion Lab

## Overview

This is a stele-lite based application for the recording and playback of highspeed camera imagery for the Motion Lab at the Science Museum of Minnesota. It uses NodeJS, Electron, and the Vieworks SDK to capture images from the highspeed camera, save them locally as JPGs, and share them over the local network via an HTML5/Javascript application.

## Features

_<span style="text-decoration:underline;">Highspeed Imagery Capture</span>_: This application uses a custom C++ addon for NodeJS and Electron, which communicates with a Vieworks highspeed camera over a network interface. It performs these tasks asynchronously, and (theoretically) allows for a live preview of the images at the same time.

_<span style="text-decoration:underline;">Serial GPIO control</span>_: This application also contains code to control a variety of lights, and receive input from sensors which help to control the flow of visitors through the exhibit.

_<span style="text-decoration:underline;">Webclient</span>_: This application also concurrently serves images to client machines using an Express webserver on port 80.

## Setup

The machine which runs this application should be running Ubuntu Server 18.04, and have at least 2 network interfaces available.

Setup for this application follows the standard installation procedures for a stele-lite application, with a few additional flags for configuration:

```
bash <(curl -sL bit.ly/stele-net) -r MotionLabRewrite -c CAM_INTERFACE -n LOCAL_INTERFACE
```

For this application, you must specify which network interface is used for what purpose: CAM_INTERFACE is the linux network adapter name of the port that is connected to the camera,
while LOCAL_INTERFACE is the port which is connected to the switch shared by the playback stations. To find these interface names, type the following command into the terminal prompt of the machine which is being configured:

```
sudo lshw -C network
```

This should return a list of network adapters available on the local machine. They should be in the format of either 'eth*' or 'enp*s*'.

## Application Config Options

In the config folder of this repo, there are a few key configuration options. These are set within the repository, and shouldn't need to be changed, but documentation is included here for sake of completeness.

```
cam: {
  frameRate: 200,     //number of frames per second
  imageGain: 24,      //image brightness mutliplier
},
record: {
  time: 3,            //time, in seconds, to record.
  setsToStore: 16,    //number of sets of visitor videos to keep at one time.
},
brightsign: {
  practiceVideoLength: 25000,     // length, in milliseconds, of the practice video
  goVideoLength: 17000,           // length, in milliseconds, of the "it's your turn" video
},
io: {
  manufacturer: 'FTDI',           // identifying information for the connected serial adapter
},
```
