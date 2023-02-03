import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import { NavLayout, OnlyContentLayout } from "./layouts"
import ScrollToTop from "./components/ScrollToTop";
import MyPosts from "./pages/MyPosts";
import Home from "./pages/Home";
import MyFavorites from "./pages/MyFavorites";
import NotFound from "./pages/NotFound";
import NotificationToast from "./components/toasts/NotificationToast";
import RemoveToasts from "./components/toasts/RemoveToasts";
import Post from "./pages/Post";
import Conversations from "./pages/Conversations";
import Chat from "./pages/Chat";
import PostForm from "./pages/PostForm";
import Categories from "./pages/Categories";
import AuthLanding from "./pages/AuthLanding";
import PreloadImages from "./components/PreloadImages";
function App() {


  return (
    <div className="flex flex-col min-h-screen max-w-full bg-[#EDEDED] m-0 p-0">
      <ScrollToTop />
      <RemoveToasts />
      <PreloadImages />
      <Routes>
        <Route element={<NavLayout />}>
          <Route path="/" element={<Navigate to={"/posts"} replace />} />

          <Route path="/categories">
            <Route index element={<Categories />} />
            <Route path=":categoryId/:categoryName" element={<Home />} />
          </Route>

          <Route path="/posts"  >
            <Route index element={<Home />} />
            <Route path=":id/:title" element={<Post />} />
            <Route path="create" element={<PrivateRoute><PostForm /></PrivateRoute>} />
          </Route>

          <Route path="/my-account">
            <Route path="posts">
              <Route index element={<PrivateRoute><MyPosts /> </PrivateRoute>} />
              <Route path=":id/:title/edit" element={<PrivateRoute><PostForm /></PrivateRoute>} />
            </Route>
            <Route path="favorites" element={<PrivateRoute><MyFavorites /> </PrivateRoute>} />
            <Route path="conversations">
              <Route index element={<PrivateRoute><Conversations /></PrivateRoute>} />
              <Route path=":conversationId" element={<PrivateRoute><Chat /></PrivateRoute>}></Route>
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>

        <Route element={<OnlyContentLayout />}>
          <Route path="/login" element={<AuthLanding />} />
        </Route>
      </Routes>
      <NotificationToast />
      {/* <ReactQueryDevtoolsPanel /> */}
    </div >
  );

}

export default App;
