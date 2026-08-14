import User from "./components/User";
import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import AddUser from "./Adduser/AddUser";
import UpdateUser from "./updateuser/UpdateUser";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <User />,
    },
    {
      path:"/add",
      element: <AddUser />,
    },
    {
      path: "/update/:id",
      element: <UpdateUser />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;