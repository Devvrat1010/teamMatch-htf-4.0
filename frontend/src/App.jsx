import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatRoom from "./pages/chatroom";
import Landing from "./pages/Landing";
import Peoples from "./pages/Peoples";
import ProfilePage from "./pages/ProfilePage";
import Signup from "./pages/signup";
import Login from "./pages/login";

function App() {
    return (
        <div>
            <Router>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/chats" element={<ChatRoom />} />
                    <Route path="/peoples" element={<Peoples />} />
                    <Route path="/profilePage" element={<ProfilePage />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />

                </Routes>
            </Router>
        </div>
    );
}

export default App;
