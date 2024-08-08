import './Component.css';
import { useEffect, useState } from 'react';
import { getDatabase } from '../database/rxdbConfig';

interface User {
  id: string;
  firstName: string;
  lastName: string;
}

const UserList = () => {

  const [users, setUsers] = useState<User[]>([]);
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const fetchUsers = async () => {
      const db = await getDatabase();
      const usersCollection = db.heroes;
      // get all users
      await usersCollection.find()
      .$ // the $ returns an observable that emits each time the result set of the query changes
      .subscribe((usersData: User[])  => setUsers(usersData));

      usersCollection.count()
      .$
      .subscribe((count:number)=>setCount(count))
    };

    fetchUsers();
  }, []);

  return (
    <div className='userListContainer'>
      <h3>Users List</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <label>{user.firstName}  </label>
            <label>{user.lastName}  </label>
          </li>
        ))}
      </ul>
      <h3>Count: {count}</h3>

    </div>
  );
};

export default UserList;
