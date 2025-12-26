**Frontend Infrastructure Setup**

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
