import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../api';
import Sidebar from '../components/Sidebar';

function Payments() {
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    student: '', amount: '', method: 'cash', note: ''
  });

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get(`${API}/payments/`, { headers }).then(res => setPayments(res.data));
    axios.get(`${API}/students/`, { headers }).then(res => setStudents(res.data));
    axios.get(`${API}/groups/`, { headers }).then(res => setGroups(res.data));
  }, []);

  const handleAdd = async () => {
    try {
      await axios.post(`${API}/payments/`, form, { headers });
      const res = await axios.get(`${API}/payments/`, { headers });
      setPayments(res.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      setForm({ student: '', amount: '', method: 'cash', note: '' });
    } catch (e) {
      alert('Хато рӯй дод!');
    }
  };

  const totalAmount = payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
  const cashAmount = payments.filter(p => p.method === 'cash').reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
  const transferAmount = payments.filter(p => p.method === 'transfer').reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

  const getStudentName = (id) => {
    const s = students.find(s => s.id === id);
    return s ? `${s.first_name} ${s.last_name}` : '-';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar active="payments" role="owner" userName="Роҳбар" />

      <div className="flex-1 flex flex-col overflow-hidden mt-14 lg:mt-0">
        <div className="bg-white border-b px-4 lg:px-6 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-800">Пардохтҳо</h1>
          <div className="text-sm text-gray-500">📅 {new Date().toLocaleDateString()}</div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 lg:p-4">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
            <div className="bg-white rounded-xl p-3 border shadow-sm">
              <div className="text-xs text-gray-400">Умумӣ</div>
              <div className="text-xl font-bold text-green-600">{totalAmount.toLocaleString()} с.</div>
              <div className="text-xl mt-1">💰</div>
            </div>
            <div className="bg-white rounded-xl p-3 border shadow-sm">
              <div className="text-xs text-gray-400">Пардохтҳо</div>
              <div className="text-2xl font-bold text-gray-800">{payments.length}</div>
              <div className="text-xl mt-1">📅</div>
            </div>
            <div className="bg-white rounded-xl p-3 border shadow-sm">
              <div className="text-xs text-gray-400">Накд</div>
              <div className="text-xl font-bold text-gray-800">{cashAmount.toLocaleString()} с.</div>
              <div className="text-xl mt-1">💵</div>
            </div>
            <div className="bg-white rounded-xl p-3 border shadow-sm">
              <div className="text-xs text-gray-400">Перевод</div>
              <div className="text-xl font-bold text-gray-800">{transferAmount.toLocaleString()} с.</div>
              <div className="text-xl mt-1">🏦</div>
            </div>
          </div>

          {/* Add Payment */}
          <div className="bg-white rounded-xl border shadow-sm p-4 mb-4">
            <div className="text-sm font-semibold text-gray-800 mb-3">Пардохт илова кардан</div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Хонанда *</label>
                <select value={form.student} onChange={e => setForm({...form, student: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400">
                  <option value="">Интихоб кунед</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Маблағ *</label>
                <input type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})}
                  placeholder="Маблағ" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Тарз *</label>
                <select value={form.method} onChange={e => setForm({...form, method: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400">
                  <option value="cash">💵 Накд</option>
                  <option value="transfer">🏦 Перевод</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setForm({ student: '', amount: '', method: 'cash', note: '' })}
                className="border text-gray-600 px-4 py-2 rounded-lg text-sm">Тоза</button>
              <button onClick={handleAdd}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">💳 Илова</button>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block bg-white rounded-xl border shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">№</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Сана</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Хонанда</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Маблағ</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Тарз</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-8 text-gray-400">Пардохт нест</td></tr>
                ) : payments.map((p, i) => (
                  <tr key={p.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-500">{i + 1}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{new Date(p.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{getStudentName(p.student)}</td>
                    <td className="px-4 py-3 text-sm font-medium text-green-600">{parseFloat(p.amount).toLocaleString()} с.</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${p.method === 'cash' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {p.method === 'cash' ? '💵 Накд' : '🏦 Перевод'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-2">
            {payments.length === 0 ? (
              <div className="bg-white rounded-xl border shadow-sm p-6 text-center text-gray-400">Пардохт нест</div>
            ) : payments.map((p, i) => (
              <div key={p.id} className="bg-white rounded-xl border shadow-sm p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-800">{getStudentName(p.student)}</div>
                    <div className="text-xs text-gray-400">{new Date(p.date).toLocaleDateString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-green-600">{parseFloat(p.amount).toLocaleString()} с.</div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${p.method === 'cash' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                      {p.method === 'cash' ? 'Накд' : 'Перевод'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {saved && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg text-sm font-medium">
          ✅ Пардохт сабт шуд!
        </div>
      )}
    </div>
  );
}

export default Payments;