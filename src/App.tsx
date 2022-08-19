import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { UserContextProvider } from 'store/users-list';
import Spinner from './components/UI/Spinner';
import Navigation from './components/Navigation/Navigation';
import Toast from './components/Toast/Toast';

const UsersTable = lazy(() => import('./components/Table/UsersTable'));
const UserForm = lazy(() => import('./components/Form/UserForm'));

const App = () => (
  <>
    <Toast />
    <Navigation />
    <UserContextProvider>
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/" element={<UsersTable />} />
          <Route path="new-user" element={<UserForm />} />
          <Route path="user/:userId" element={<UserForm />} />
        </Routes>
      </Suspense>
    </UserContextProvider>
  </>
);

export default App;
