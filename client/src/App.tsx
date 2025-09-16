import { ThemeProvider } from "@/components/ui/theme/theme-provider"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/MainLayout";
import Credentials from "./pages/Credentials";
import Dashboard from "./pages/Dashboard";
import NoPage from "./pages/NoPage";
import Videos from "./pages/Videos";
import Tweets from "./pages/Tweets";
import SharedPage from "./pages/SharedPage";
import Profile from "./pages/Profile";
import { RecoilRoot } from "recoil";
import Documents from "./pages/Documents";

const App = () => {
  return (
    <BrowserRouter>
      <RecoilRoot>
        <ThemeProvider>
          <Routes>
            <Route path="/user" element={<Layout />}>
              <Route index element={<Dashboard />}/>
              <Route path="videos" element={<Videos />}/>
              <Route path="tweets" element={<Tweets />}/>
              <Route path="documents" element={<Documents />}/>
              <Route path="profile" element={<Profile />}/>
            </Route>
            <Route path="/" element={<Credentials />}/>
            <Route path="/signup" element={<Credentials />}/>
            <Route path="/share/:id" element={<SharedPage />}/>
            <Route path="/share/:id/:type" element={<SharedPage />}/>
            <Route path="*" element={<NoPage />}/>
          </Routes>
        </ThemeProvider>
      </RecoilRoot>
    </BrowserRouter>
  )
}

export default App