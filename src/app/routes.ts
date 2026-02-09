import { createBrowserRouter } from "react-router";
import Root from "./pages/Root";
import Home from "./pages/Home";
import Conversation from "./pages/Conversation";
import ConversationHistory from "./pages/ConversationHistory";
import NotFound from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "conversation/:id", Component: Conversation },
      { path: "history", Component: ConversationHistory },
      { path: "*", Component: NotFound },
    ],
  },
]);
