import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect, Suspense } from 'react';
import Spinner from './Components/Loading/Spinner';
import routes from './routes/routes';
import PrivateRoute from './contextHook/PrivateRoute';
import Login from './Pages/Login/login';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Spinner />
  ) : (
    <Router>
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/" element={<Login />} />
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={
                route.allowedRoles ? (
                  <PrivateRoute allowedRoles={route.allowedRoles}>
                    {route.element}
                  </PrivateRoute>
                ) : (
                  route.element
                )
              }
            />
          ))}
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
