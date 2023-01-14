import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';

const App = () => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api');
        const data = await res.text();
        setPlayers(JSON.parse(data));
      } catch (er) {
        console.log(er.message);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container">
      {players.length && (
        <table className="table mt-5">
          <caption>Игроки в онлайне</caption>
          <thead>
            <tr>
              <th>Ник</th>
              <th>Емейл</th>
              <th>Зарегистрирован</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {players.map(({
              nickname, email, registered, status,
            }) => (
              <tr key={nickname}>
                <td>{nickname}</td>
                <td>{email}</td>
                <td>{dayjs(registered).format('DD.MM.YYYY HH:mm')}</td>
                <td>{status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default App;
