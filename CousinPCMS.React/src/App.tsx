import { Outlet, useLocation, useNavigate } from 'react-router';
import Header from './components/shared/Header';
import { useEffect, useState } from 'react';
import { empLogin } from './services/DataService';
import { useNotification } from './hook/useNotification';
import { useUser } from './hook/useUser';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const notify = useNotification();
  const { validUser, setValidUser } = useUser();

  const [loading, setLoading] = useState(false);
  const [attemptedLogin, setAttemptedLogin] = useState(false);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const tokenParam = query.get('token');

    if (tokenParam) {
      setLoading(true);
      setAttemptedLogin(true);

      // const decodedToken = decodeURIComponent(tokenParam).replace(/ /g, '+');
      const EmpLoginRequestModel = { token: tokenParam };

      empLogin(EmpLoginRequestModel)
        .then((response) => {
          if (response.isSuccess && response.value) {
            response.value.decimalLength = '2';
            setValidUser(response.value);
            sessionStorage.setItem('valid-user', JSON.stringify(response.value));
            navigate('/home');
          } else {
            notify.error('Token expired or invalid user');
          }
        })
        .catch(() => {
          notify.error('Something went wrong during login');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [location.search, navigate, notify, setValidUser]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-gray-500">Redirecting to dashboard...</div>;
  }

  if (attemptedLogin && !validUser) {
    return <div className="flex items-center justify-center h-screen text-red-500 text-xl font-semibold">Your token is invalid or expired. Contact the admin if the issue persists.</div>;
  }

  return (
    <>
      {validUser && <Header />}
      <div className="overflow-y-auto overflow-x-hidden w-full absolute top-10 h-[calc(100vh-56px)]">
        <Outlet />
      </div>
    </>
  );
};

export default App;
