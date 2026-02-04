# Guitar Tuner Prototype

To whom ever reads this, I want to preface this with stating I'm not entirely against AI built/AI assisted projects. I also don't want to set myself as leaning on either side of the AI-dooming rhetoric that's floating around these days. I still many of these technologies are still somewhat in their infancy, or better yet, their teething era, but far from ready to let loose.

This project started because a guitar tuner that I liked using had lost its hosting license and that meant I'd have to move on to something else. I'm currently wrapped up in a couple of other builds and thought maybe this would be an interesting project to thought dump into Claude Code (on the free tier because I'm cheap and don't use it that much) and see how quickly this would spin something out. I'm sure better prompts and languages and other factors could've helped this come along a lot faster, but I think many folks using this either don't have that level of context or are in the same boat as I am and just curious to see what would happen.

To keep this short (although I've already written this out like it's a blog or something), I'll probably add more detailed notes of what all I've done to get this working. If you see a Github Pages link below, then it's up and running and if not, I'm still beating the notes out of this thing.

A quick run up on how the start of this went though:
Prompted Claude to build out two different layouts: a full stack project with a Vue FE and Python BE because, why not, and then just a VueJS only FE.

This project is the VueJS FE only version. Grabbed the files that Claude was generating and started wiring them together and at first it looked like it was just going to need some FE tweaking and maybe updates to the sound files, but below, I'm going to add and strikeout the task that need to be concluded before I deem this a success. Maybe, I'll even gut this README and just add it to a separate about page as a lesson of sorts.

## Shout Out

I just want to leave a link to the MIDI.js library that's hosting all of these sound bites. Check out Gleiztz's docs at [MIDI.js Soundfonts](https://gleitz.github.io/midi-js-soundfonts/) or their [GitHub](https://github.com/gleitz).


### TODOS

- ~~Fix/import better sound bytes (current tones are awful)~~
- ~~Fix the looping features~~
- ~~Adjust the layout so the string order feels more intuitive~~
- Update text language all over the site
- Update how the saving works for custom layouts
- Maybe use some of the dead space on the side for quick links to other tunings
