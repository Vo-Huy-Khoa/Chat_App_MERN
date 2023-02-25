import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Fragment } from "react";
import { publicRoutes } from "./routes";
import DefaultLayout from "./layouts/DefaultLayout";
import { VisibilityProvider } from "./providers";
function App() {
  return (
    <VisibilityProvider>
      <Router>
        <div className="App">
          <Routes>
            {publicRoutes.map((routes, index) => {
              const Page = routes.component;
              let Layout = DefaultLayout;
              if (routes.layout) {
                Layout = routes.layout;
              } else if (routes.layout === null) {
                Layout = Fragment;
              }

              return (
                <Route
                  key={index}
                  path={routes.path}
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  }
                />
              );
            })}
          </Routes>
        </div>
      </Router>
    </VisibilityProvider>
  );
}

export default App;
