import './Home.css';

import UserForm from '../../component/UserForm';
import UserList from '../../component/UserList';

function Home() {

  return (
    <div className="App">
      <h1>RxDB React App</h1>
      <UserForm />
      <UserList/>
    </div>
  );
}

export default Home;
