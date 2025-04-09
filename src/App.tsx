
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import CreateContent from "./pages/CreateContent";
import ViewContent from "./pages/ViewContent";
import EditContent from "./pages/EditContent";


const App = () => (
  <Provider store={store}>
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<CreateContent />} />
            <Route path="/view/:id" element={<ViewContent />} />
            <Route path="/edit/:id" element={<EditContent />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  </Provider>
);

export default App;
