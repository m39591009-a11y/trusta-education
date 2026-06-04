import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../api';
import Sidebar from '../components/Sidebar';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const weekData = [
  { name: '18 май', daromad: 30000, xarojot: 18000 },
  { name: '19 май', daromad: 40000, xarojot: 22000 },
  { name: '20 май', daromad: 35000, xarojot: 20000 },
  { name: '21 май', daromad: 45000, xarojot: 25000 },
  { name: '22 май', daromad: 42000, xarojot: 24000 },
  { name: '23 май', daromad: 38000, xarojot: 22000 },
  { name: '24 май', daromad: 48000, xarojot: 28000 },
];

const expenseData = [
  { name: 'Иҷора', value: 32.2, color: '#6366f1' },
  { name: 'Маош', value: 40.3, color: '#f59e0b' },
  { name: 'Реклама', value: 10.5, color: '#10b981' },
  { name: 'Интернет', value: 6.1, color: '#06b6d4' },
  { name: 'Дигар', value: 10.9, color: '#94a3b8' },
];

function Finance() {
  const [payments, setPayments] = useState([]);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get(`${API}/payments/`, { headers }).then(res => setPayments(res.data));
  }, []);

  const totalIncome = payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
  const totalExpense = 78430;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar active="finance" role="owner" userName="Роҳбар" />

      <div className="flex-1 flex flex-col overflow-hidden mt-14 lg:mt-0">
        <div className="bg-white border-b px-4 lg:px-6 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-800">Молия</h1>
          <div className="text-sm text-gray-500">📅 {new Date().toLocaleDateString()}</div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 lg:p-4">
          {/* Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mb-4">
            <div className="bg-white rounded-xl p-4 border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-xl">📈</div>
                <div>
                  <div className="text-xs text-gray-400">Даромад</div>
                  <div className="text-xl font-bold text-blue-600">{totalIncome.toLocaleString()} с.</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-xl">📉</div>
                <div>
                  <div className="text-xs text-gray-400">Харочот</div>
                  <div className="text-xl font-bold text-red-500">{totalExpense.toLocaleString()} с.</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-xl">💰</div>
                <div>
                  <div className="text-xs text-gray-400">Фоидаи соф</div>
                  <div className="text-xl font-bold text-green-600">{(totalIncome - totalExpense).toLocaleString()} с.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white rounded-xl border shadow-sm p-4 mb-4">
            <div className="text-sm font-semibold text-gray-800 mb-3">Даромад ва харочот</div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={weekData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 9 }} />
                <Tooltip />
                <Line type="monotone" dataKey="daromad" stroke="#3b82f6" strokeWidth={2} dot={{ r: 2 }} />
                <Line type="monotone" dataKey="xarojot" stroke="#ef4444" strokeWidth={2} dot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Summary + Pie */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div className="bg-white rounded-xl border shadow-sm p-4">
              <div className="text-sm font-semibold text-gray-800 mb-3">Хулоса</div>
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-600">Даромади умумӣ</span>
                  <span className="text-sm font-semibold text-blue-600">{totalIncome.toLocaleString()} с.</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-600">Харочоти умумӣ</span>
                  <span className="text-sm font-semibold text-red-500">{totalExpense.toLocaleString()} с.</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-600">Фоидаи соф</span>
                  <span className="text-sm font-semibold text-green-600">{(totalIncome - totalExpense).toLocaleString()} с.</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-600">Маржа</span>
                  <span className="text-sm font-semibold text-purple-600">
                    {totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome * 100).toFixed(1) : 0}%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border shadow-sm p-4">
              <div className="text-sm font-semibold text-gray-800 mb-3">Тақсимоти харочот</div>
              <div className="flex items-center gap-4">
                <PieChart width={130} height={130}>
                  <Pie data={expenseData} cx={60} cy={60} outerRadius={55} dataKey="value">
                    {expenseData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
                <div className="space-y-1.5">
                  {expenseData.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 rounded-full" style={{ background: item.color }}></div>
                      <span className="text-gray-600">{item.name}</span>
                      <span className="font-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Finance;