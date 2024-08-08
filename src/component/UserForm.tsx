import React, { useState } from 'react';

import { getDatabase } from '../database/rxdbConfig';

const UserForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const db = await getDatabase();
    const usersCollection = db.heroes;

    await usersCollection.insert({
      id: `${firstName}-${lastName}-${Date.now()}`,
      firstName,
      lastName
    });

    await usersCollection.find().exec();

    setFirstName('');
    setLastName('');
  };

  return (
    <div>
      <h2>Add User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default UserForm;
