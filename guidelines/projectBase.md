I want to create a games app.
It's a react node firebase app that has a node server that provides websockets connectivity. The node server also makes use of firebase on the backend as it's database.

A. **App Setup**

1. The app will have several games. Which I will be adding overtime. Both the FE, BE and firebase setup should take this into consideration. So when you are setting up the node server and the react app, do this knowing well that it will house several different games with different logic.
2. Basically, for both FE and BE and firebase, let each game that we add have it's own folder. And you can also create a folder for shared resources and functions or hooks.

B. **Infrastructure setup**

1. React for frontend
2. React and react-use-websockets (for interacting with the websockets)
3. Backend In Node with websockets and some https requests (in controllers)
4. Firebase for database.
5. Backend code will be inside server folder
6. Frontend code will be inside client folder.

C. **Frontend Infrastructure Setup**

1. Render just an App inside main.tsx
2. Inside App.tsx, create the different routes using Routes and Route component.
   For example
   // in app.tsx
   import { Route, Routes, useLocation } from "react-router-dom";
   import EntryMenu from "./pages/EntryMenu";
   import routePaths from "./utils/routePaths";

   const app = ()=>{
   //blah blah
   return (
   <Routes location={location} key={location.pathname}>
   <Route path={"/"} element={<EntryMenu />} />

   // new games and routes will come here as the app grows
   </Routes>
   )
   }

In the example above, the game BuzzInGame is imported from pages(where it's index.tsx is). Also imported the routePaths. An object that contains ALL the routePaths for the different games. This will grow as more games come along.

3. Create a Pages folder. Then each page will now house its own stuff. A page is always one of the many games. For example, we might have a buzz-in game. Everything for this game should be inside it's own folder (/src/pages/buzzIn). Then for the url route of the game, it'll be (baseurl/buzz-in).
4. Create a components folder for generic components like Inputs, cards, button. These are components that might be used across several different games.
5. Create the env file that I will put the node server base url inside.

**EntryMenu Details**

- The EntryMenu is simply a page that just simply renders 2 cards for Room Games or Solo games. when a card is clicked, direct user to the next page (see screen list below).
- EntryMenu also has a toggle for dark mode and light mode. THis is the only place in the entire app where a user can change from light to dark mode. Please use icons for the light and dark(svg).

D. **Backend Infrastructure Setup**

1. Create a controller for each of the games. ALtho in this first one, we are doing just one game. But we will definitely have other games later.
   2.The Node ts server talks to firebase for db and uses wesockets from ws for websocket connectivity.
2. For the firebase credentials, simply create a firebase config file and env file also. I'll add the configs to the env file.

E.**Global Styling CSS Rules**

1. Enable dark mode and light mode.
2. Use tailwind.
3. Tables should also have subtle curves and background shadows. Something to make it look sleek. Samething for cards but not buttons.
4. Everything should be centered on screen. Desktop/mobile max width of 480px. This is for all pages. the app is mobile centric hence make sure that all screens on mobile are well styled.
5. The color scheme for the app is as follows
   Primary COlour:- #7f56d9
   use this as the base and then build around this.

F. **NOTE**

- I don't know how to use node with firebase storage. I haven't done that before.
  However, the things I have done and I can use very well,
  a. React and Frontend (my bread and butter)
  b. Node for http requests (70%)
  c. Node for websockets (just started this, learning level is like 15%)
  d. React and socket.io (just started this, learning level is like 15%)

i'm mentioning this so that when you're building the apps out, you do some explanations where necessary.

G. **USER flOW for Screens**
screen 1:- entry menu ("/")
This is where the user chooses if he wants to play games that require a game room or just solo games or if he wants to join a game room.
If he chooses the previous(game room), he is directed to the create game room screen.
if he chooses the solo games, he is redirected to the solo game room options screen.
if he chooses that he wants to join a game room, he is moved to the join game scren.
On this page, he sees 3 simple cards.

screen 2:- create game room ("/create-room")
On this screen, user enters the name of his room. and then creates the room(opens a websocket connection). when he does this, user is then moved to the games master screen.

screen 3:- Solo Games menu ("/solo-games")
this is where you see a list of the available solo games and select the game you want to play. These are obvioulsy where we would have the solo games. We're not doing anything here for now. Jsut render "solo games list" as a text.

screen 4:- join game ("/join?game-code=0987464)
this is a generic join game screen. users will most likely get to this page by clicking a link or by scanning a qr code.
This is where the players can join a game room that was created on the create room page. On this screen, players add their username and click join button. I guess on this page, the FE also has to make an API call using the gameCode to get detais of the game room that was created. Or maybe its controlled using web sockets. I don't know.
Also, if this page loads, and there is no code in the url, then the user should see an input field that asks him to input the game room code as well as the input field for username.
Once he has successfully joined the game room, he's moved to the waiting room screen.

screen 5:- games master screen ("/master)
This is the screen where the owner of a game room can
a. select the game he wants to play in his room. So basically, he has to see a list of games that we would create.(SelectRoomGame)
b. see the list of people (usernames) that have connected to the game room... He can see this on a simple table. (ConnectedPlayers). On this list, he can see a button that he can use to remove that player from the game room. Basically terminating the websocket connection for that player.
c. he can also see the name of his game room. As well as a button he can use to close the room.(terminate the websoket conneection). (GameRoomManagement)
d. it is also important that he can see where to copy game room code, game room link and a button that he can click that will show a qrCode modal. And on that qrCode modal is a qr code that if scanned would take the person that scanned it to the join room page. (GameRoomManagement)
e. the (GameRoomManagement) is at the top of this page. then the list of Connected players and finally the SelectRoomGame.

screen 6:- waiting room("/waiting")
THis is the screen that people that have joined a game room successfull would see. the screen shows a loading icon that lets the user know that the games master has not started any game yet, It also shows the name of the game room they joined and the username they chose. They can also see a button that they can use to leave the game room(terminate their own connection). In future ioterations, there will also be a chat feature on this page. Where they can send message to each other.

Other screens would come in much later for the other games. But these are the base screens for now.
If you're getting the flow, you would notice that I am only asking for the base screens. THe screens and flows for different games would come after this first base screens are done.

This prompt is just for you to create the base infra. I will send another prompt for you to create the different games. But for now, just create the vite project for react and node express server.
And create the screens and server stuff needed to handle such connections and etc.
The thing I want now before we start doing different games is to see the styling, the setup of client and server, envs, the 6 screens and how they connect to each outher, navigation on between those pages, scanning of qr code to join a  and those stuff on these generic screens like leaving a room, gettng connected, the loading screen, etc.

Read this and digest it and let me know if you understand the flow.
Afterwards, you can start working on the 6 screens and the server stuff needed to handle such connections and etc.