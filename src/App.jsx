import { RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";

import Product from "./pages/Product.jsx";
import Pricing from "./pages/Pricing";
import Homepage from "./pages/Homepage";
import PageNotFound from "./pages/PageNotFound.jsx";
import AppLayout from "./pages/AppLayout.jsx";
import Login from "./pages/Login.jsx";
import CityList from "./components/sidebar/Cities/CityList.jsx";
import CountriesList from "./components/sidebar/Countries/CountriesList.jsx";
import City from "./components/sidebar/Cities/City.jsx";
import Form from "./components/UI/Form.jsx";
import { CitiesProvider } from "./contexts/CitiesContext.jsx";

const router = createBrowserRouter(
  [
    {
      element: <Homepage></Homepage>,
      path: "/",
    },
    {
      element: <Product></Product>,
      path: "/product",
    },
    {
      element: <Pricing></Pricing>,
      path: "/pricing",
    },
    {
      element: <Login></Login>,
      path: "/login",
    },
    {
      element: <AppLayout></AppLayout>,
      path: "/app",
      errorElement: <PageNotFound></PageNotFound>,

      children: [
        {
          element: <CityList></CityList>,
          index: true,
        },
        {
          element: <CityList></CityList>,
          path: "cities",
        },
        {
          element: <City></City>,
          path: "cities/:id",
        },
        {
          element: <CountriesList></CountriesList>,
          path: "countries",
        },
        {
          element: <Form></Form>,
          path: "form",
        },
        {
          element: <PageNotFound></PageNotFound>,
          path: "*",
        },
      ],
    },
  ],
  { basename: import.meta.env.DEV ? "/" : "/WorldWide-React-Pratice/" }
);

function App() {
  return (
    <CitiesProvider>
      <RouterProvider router={router} />
    </CitiesProvider>
  );
}

export default App;
