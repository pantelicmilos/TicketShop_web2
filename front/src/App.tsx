import Layout from "./components/Layout";
import Message from "./components/Message";
import AddArticle from "./components/Article/AddArticle";
import AllOrders from "./components/Order/AllOrders";
import Login from "./components/Authenticate/Login";
import PreviousOrders from "./components/Order/PreviousOrders";
import NewOrder from "./components/Order/NewOrder";
import NewOrders from "./components/Order/NewOrders";
import Profile from "./components/User/Profile";
import Registration from "./components/Authenticate/Registration";
import Verification from "./components/User/Verification";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Registration />} />
            <Route path="login" element={<Login />} />
            <Route path="addArticle" element={<AddArticle />} />
            <Route path="allOrders" element={<AllOrders />} />
            <Route path="newOrder" element={<NewOrder />} />
            <Route path="newOrders" element={<NewOrders />} />
            <Route path="previousOrders" element={<PreviousOrders />} />
            <Route path="profile" element={<Profile />} />
            <Route path="verification" element={<Verification />} />
            <Route path="*" element={<Message />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
