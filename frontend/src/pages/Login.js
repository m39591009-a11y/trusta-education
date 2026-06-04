import React, { useState } from 'react';
import axios from 'axios';
import { API, TOKEN_URL } from '../api';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(TOKEN_URL, { username, password });
      localStorage.setItem('token', response.data.access);
      localStorage.setItem('refresh', response.data.refresh);

      const userRes = await axios.get(`${API}/users/`, {
        headers: { Authorization: `Bearer ${response.data.access}` }
      });
      const currentUser = userRes.data.find(u => u.username === username);
      const role = currentUser ? currentUser.role : 'teacher';

      localStorage.setItem('role', role);
      localStorage.setItem('user_id', currentUser.id);
      localStorage.setItem('username', currentUser.username);

      if (role === 'owner') {
        window.location.href = '/dashboard';
      } else if (role === 'admin') {
        window.location.href = '/admin-panel';
      } else if (role === 'teacher') {
        window.location.href = '/teacher';
      } else {
        window.location.href = '/dashboard';
      }
    } catch (err) {
      setError('Логин ё парол хато аст!');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block bg-indigo-600 text-white text-2xl font-bold px-4 py-2 rounded-xl mb-2">TRUSTA</div>
          <div className="text-indigo-400 text-sm font-medium">.tj</div>
          <p className="text-gray-500 mt-2">Системаи идоракунии марказ</p>
        </div>
        {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">Логин</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500"
              placeholder="Логинатонро ворид кунед" />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">Парол</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500"
              placeholder="Паролатонро ворид кунед" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition duration-200">
            {loading ? 'Дохил мешавед...' : 'Дохил шавед'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;