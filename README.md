crowdgo
=======

Note: the current release build of this program is currently hosted at:

https://salty-crag-7633.herokuapp.com

Lets the crowd play Go online with HTML and JavaScript. Somewhat based on the code developed over in go player.


Note to self: probable bug with the way the turn alternates inside the drawCircle() function. Consider moving changeTurn() call outside of drawCircle() to avoid problems with flipping turns when drawing the current state of the board on initial connect (during the handshake)

what i'm doing right now: trying to add the function to draw the board state on initial connect. the problem i'm encountering is when to make the turn flip. i feel like the local turn counter should never increment by itself locally--could cause synch errors. So the server should track the current turn and send that data down with the emitted draw call.

also having a slight problem because changed some arguments from saying "turn" or "team" to saying "color" instead--but cant these all be condensed down? team = 0 is same as team = BLACK and same with 1/WHITE so why have "color" "team" and "turn"?? Simplify and unify argument names


also the--lost train of thought

BUG RIGHT NOW: current turn isn't being updated, i broke the emit there by changing variable names.

DO THIS TOMORROW: Go through each function. Step through it in your head when you're rested, figure out the flow of data. Fix/unify variable names to solve whatever problems having right now, and maybe make a universal update() function that would handle each turn's draw calls, and later be able to support game logic like when pieces get removed. Might need some substantial refactoring but the end result will be more elegant
