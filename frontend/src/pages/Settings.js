import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

function Settings() {
  const [centerName, setCenterName] = useState('');
  const [centerPhone, setCenterPhone] = useState('');
  const [centerAddress, setCenterAddress] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar active="settings" role="owner" userName="Роҳбар" />

      <div className="flex-1 flex flex-col overflow-hidden mt-14 lg:mt-0">
        <div className="bg-white border-b px-4 lg:px-6 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-800">Танзимот</h1>
          <div className="text-sm text-gray-500">📅 {new Date().toLocaleDateString()}</div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 lg:p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Маълумоти марказ */}
            <div className="bg-white rounded-xl border shadow-sm p-5">
              <div className="text-sm font-semibold text-gray-800 mb-4">🏢 Маълумоти марказ</div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Номи марказ</label>
                  <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                    placeholder="Масалан: English Academy"
                    value={centerName} onChange={e => setCenterName(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Телефон</label>
                  <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                    placeholder="+992 900 000 000"
                    value={centerPhone} onChange={e => setCenterPhone(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Суроға</label>
                  <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                    placeholder="Суроғаи марказ"
                    value={centerAddress} onChange={e => setCenterAddress(e.target.value)} />
                </div>
                <button onClick={handleSave}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium">
                  Сақлаед
                </button>
              </div>
            </div>

            {/* Танзимоти система */}
            <div className="bg-white rounded-xl border shadow-sm p-5">
              <div className="text-sm font-semibold text-gray-800 mb-4">⚙️ Танзимоти система</div>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                  <div>
                    <div className="text-sm text-gray-700">Забони система</div>
                    <div className="text-xs text-gray-400">Тоҷикӣ / Русӣ</div>
                  </div>
                  <select className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm">
                    <option>Тоҷикӣ</option>
                    <option>Русӣ</option>
                  </select>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                  <div>
                    <div className="text-sm text-gray-700">Пули асосӣ</div>
                    <div className="text-xs text-gray-400">Сомонӣ</div>
                  </div>
                  <select className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm">
                    <option>Сомонӣ (с.)</option>
                    <option>Доллар ($)</option>
                  </select>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="text-sm text-gray-700">Версия</div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">v1.0.0</span>
                </div>
              </div>
            </div>

            {/* Профили роҳбар */}
            <div className="bg-white rounded-xl border shadow-sm p-5">
              <div className="text-sm font-semibold text-gray-800 mb-4">👤 Профили роҳбар</div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Логин</label>
                  <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50"
                    value="owner" readOnly />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Парол нав</label>
                  <input type="password" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                    placeholder="Парол навро ворид кунед" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Тасдиқ</label>
                  <input type="password" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                    placeholder="Паролро такрор кунед" />
                </div>
                <button className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium">
                  Паролро иваз кунед
                </button>
              </div>
            </div>

            {/* Дар бораи */}
            <div className="bg-white rounded-xl border shadow-sm p-5">
              <div className="text-sm font-semibold text-gray-800 mb-4">ℹ️ Дар бораи система</div>
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-600">Система</span>
                  <span className="text-sm font-medium">TRUSTA Education</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-600">Версия</span>
                  <span className="text-sm font-medium">1.0.0</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-600">Сайт</span>
                  <span className="text-sm font-medium text-blue-600">trusta.tj</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-600">Таъминкунанда</span>
                  <span className="text-sm font-medium">TRUSTA.tj</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {saved && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg text-sm font-medium">
          ✅ Маълумот сақл шуд!
        </div>
      )}
    </div>
  );
}

export default Settings;