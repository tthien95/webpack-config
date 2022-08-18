import { Routes, Route } from 'react-router-dom';
import { UserContextProvider } from 'store/users-list';
import Navigation from './components/Navigation/Navigation';
import UsersTable from './components/Table/UsersTable';
import UserForm from './components/Form/UserForm';
import Toast from './components/Toast/Toast';

const App = () => (
  <>
    <Toast />
    <Navigation />
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<UsersTable />} />
        <Route path="new-user" element={<UserForm />} />
        <Route path="user/:userId" element={<UserForm />} />
      </Routes>
    </UserContextProvider>
  </>
);

export default App;
