import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../api';
import Sidebar from '../components/Sidebar';

function AdminPanel() {
  const [students, setStudents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [payments, setPayments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');
  const [activeTab, setActiveTab] = useState('students');
  const [editItem, setEditItem] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [studentPayments, setStudentPayments] = useState([]);
  const [studentAttendance, setStudentAttendance] = useState([]);
  const [teacherGroups, setTeacherGroups] = useState([]);
  const [teacherSalaries, setTeacherSalaries] = useState([]);
  const [profileTab, setProfileTab] = useState('info');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState({});
  const [lateMinutes, setLateMinutes] = useState({});
  const [attNotes, setAttNotes] = useState({});
  const [groupStudents, setGroupStudents] = useState([]);

  const [studentForm, setStudentForm] = useState({
    first_name: '', last_name: '', phone: '', parent_phone: '', group: '', note: ''
  });
  const [paymentForm, setPaymentForm] = useState({
    student: '', amount: '', method: 'cash', note: ''
  });
  const [groupForm, setGroupForm] = useState({
    name: '', subject: '', teacher: '', schedule: '', room: '', price: '', is_active: true
  });
  const [teacherForm, setTeacherForm] = useState({
    username: '', first_name: '', last_name: '', phone: '', password: '', role: 'teacher'
  });
  const [salaryForm, setSalaryForm] = useState({
    amount: '', date: new Date().toISOString().split('T')[0], note: ''
  });

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchAll = () => {
    axios.get(`${API}/students/`, { headers }).then(res => setStudents(res.data));
    axios.get(`${API}/groups/`, { headers }).then(res => setGroups(res.data));
    axios.get(`${API}/payments/`, { headers }).then(res => setPayments(res.data));
    axios.get(`${API}/users/`, { headers }).then(res => setTeachers(res.data.filter(u => u.role === 'teacher')));
  };

  useEffect(() => { fetchAll(); }, []);

  useEffect(() => {
    if (selectedGroup) {
      axios.get(`${API}/students/`, { headers }).then(res => {
        setGroupStudents(res.data.filter(s => s.group == selectedGroup));
      });
    }
  }, [selectedGroup]);

  const openStudentProfile = (student) => {
    setSelectedStudent(student);
    setSelectedTeacher(null);
    setProfileTab('info');
    axios.get(`${API}/payments/?student=${student.id}`, { headers }).then(res => setStudentPayments(res.data));
    axios.get(`${API}/attendance/?student=${student.id}`, { headers }).then(res => setStudentAttendance(res.data));
  };

  const openTeacherProfile = (teacher) => {
    setSelectedTeacher(teacher);
    setSelectedStudent(null);
    setProfileTab('info');
    axios.get(`${API}/groups/`, { headers }).then(res => setTeacherGroups(res.data.filter(g => g.teacher === teacher.id)));
    axios.get(`${API}/salaries/?teacher=${teacher.id}`, { headers }).then(res => setTeacherSalaries(res.data));
  };

  const showSaved = (msg) => {
    setSavedMsg(msg); setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDeleteStudent = async (id) => {
    if (!window.confirm('Ҳазф кунем?')) return;
    await axios.delete(`${API}/students/${id}/`, { headers });
    fetchAll(); setSelectedStudent(null);
    showSaved('Хонанда ҳазф шуд!');
  };

  const handleDeleteGroup = async (id) => {
    if (!window.confirm('Ҳазф кунем?')) return;
    await axios.delete(`${API}/groups/${id}/`, { headers });
    fetchAll(); showSaved('Гурӯҳ ҳазф шуд!');
  };

  const handleDeletePayment = async (id) => {
    if (!window.confirm('Ҳазф кунем?')) return;
    await axios.delete(`${API}/payments/${id}/`, { headers });
    fetchAll(); showSaved('Пардохт ҳазф шуд!');
  };

  const handleDeleteTeacher = async (id) => {
    if (!window.confirm('Ҳазф кунем?')) return;
    await axios.delete(`${API}/users/${id}/`, { headers });
    fetchAll(); setSelectedTeacher(null);
    showSaved('Муаллим ҳазф шуд!');
  };

  const handleDeleteSalary = async (id) => {
    if (!window.confirm('Ҳазф кунем?')) return;
    await axios.delete(`${API}/salaries/${id}/`, { headers });
    if (selectedTeacher) {
      axios.get(`${API}/salaries/?teacher=${selectedTeacher.id}`, { headers }).then(res => setTeacherSalaries(res.data));
    }
    showSaved('Маош ҳазф шуд!');
  };

  const handleAddStudent = async () => {
    try {
      if (editItem) {
        await axios.patch(`${API}/students/${editItem.id}/`, studentForm, { headers });
        showSaved('Таҳрир шуд!');
      } else {
        await axios.post(`${API}/students/`, studentForm, { headers });
        showSaved('Илова шуд!');
      }
      fetchAll(); setShowStudentModal(false); setEditItem(null);
      setStudentForm({ first_name: '', last_name: '', phone: '', parent_phone: '', group: '', note: '' });
    } catch (e) { alert('Хато!'); }
  };

  const handleAddPayment = async () => {
    try {
      await axios.post(`${API}/payments/`, paymentForm, { headers });
      showSaved('Пардохт илова шуд!');
      fetchAll(); setShowPaymentModal(false);
      setPaymentForm({ student: '', amount: '', method: 'cash', note: '' });
    } catch (e) { alert('Хато!'); }
  };

  const handleAddGroup = async () => {
    try {
      if (editItem) {
        await axios.patch(`${API}/groups/${editItem.id}/`, groupForm, { headers });
        showSaved('Таҳрир шуд!');
      } else {
        await axios.post(`${API}/groups/`, groupForm, { headers });
        showSaved('Илова шуд!');
      }
      fetchAll(); setShowGroupModal(false); setEditItem(null);
      setGroupForm({ name: '', subject: '', teacher: '', schedule: '', room: '', price: '', is_active: true });
    } catch (e) { alert('Хато!'); }
  };

  const handleAddTeacher = async () => {
    try {
      if (editItem) {
        await axios.patch(`${API}/users/${editItem.id}/`, teacherForm, { headers });
        showSaved('Таҳрир шуд!');
      } else {
        await axios.post(`${API}/users/`, teacherForm, { headers });
        showSaved('Илова шуд!');
      }
      fetchAll(); setShowTeacherModal(false); setEditItem(null);
      setTeacherForm({ username: '', first_name: '', last_name: '', phone: '', password: '', role: 'teacher' });
    } catch (e) { alert('Хато!'); }
  };

  const handleAddSalary = async () => {
    try {
      await axios.post(`${API}/salaries/`, { ...salaryForm, teacher: selectedTeacher.id }, { headers });
      showSaved('Маош илова шуд!');
      axios.get(`${API}/salaries/?teacher=${selectedTeacher.id}`, { headers }).then(res => setTeacherSalaries(res.data));
      setShowSalaryModal(false);
      setSalaryForm({ amount: '', date: new Date().toISOString().split('T')[0], note: '' });
    } catch (e) { alert('Хато!'); }
  };

  const handleSaveAttendance = async () => {
    try {
      for (const student of groupStudents) {
        const status = attendance[student.id] || 'present';
        await axios.post(`${API}/attendance/`, {
          student: student.id, group: selectedGroup, date: selectedDate,
          status, late_minutes: lateMinutes[student.id] || 0, note: attNotes[student.id] || '',
        }, { headers });
      }
      showSaved('Давомот сабт шуд!');
    } catch (e) { alert('Хато! Давомот аллакай сабт шудааст.'); }
  };

  const handleLogout = () => { localStorage.clear(); window.location.href = '/login'; };

  const debtors = students.filter(s => parseFloat(s.balance) < 0);
  const presentCount = groupStudents.filter(s => !attendance[s.id] || attendance[s.id] === 'present').length;
  const absentCount = groupStudents.filter(s => attendance[s.id] === 'absent').length;
  const lateCount = groupStudents.filter(s => attendance[s.id] === 'late').length;
  const getGroupName = (id) => { const g = groups.find(g => g.id === id); return g ? g.name : '-'; };
  const getStatusInfo = (status) => {
    if (status === 'present') return { text: 'Омад', color: 'bg-green-100 text-green-700' };
    if (status === 'absent') return { text: 'Наомад', color: 'bg-red-100 text-red-700' };
    if (status === 'late') return { text: 'Дер кард', color: 'bg-orange-100 text-orange-700' };
    return { text: status, color: 'bg-gray-100 text-gray-600' };
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        active={activeTab}
        role="admin"
        userName="Админ"
        onTabChange={(key) => { setActiveTab(key); setSelectedStudent(null); setSelectedTeacher(null); }}
      />

      <div className="flex-1 flex overflow-hidden mt-14 lg:mt-0">
        {/* Main Content */}
        <div className={`flex flex-col overflow-hidden transition-all duration-300 ${selectedStudent || selectedTeacher ? 'hidden lg:flex lg:w-3/5' : 'flex-1'}`}>
          <div className="bg-white border-b px-4 lg:px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-base lg:text-lg font-semibold text-gray-800">
                {activeTab === 'students' && 'Хонандагон'}
                {activeTab === 'attendance' && 'Давомот'}
                {activeTab === 'payments' && 'Пардохтҳо'}
                {activeTab === 'debtors' && 'Қарздорон'}
                {activeTab === 'groups' && 'Гурӯҳҳо'}
                {activeTab === 'teachers' && 'Муаллимон'}
              </h1>
            </div>
            <div className="flex gap-2">
              {activeTab === 'students' && (
                <button onClick={() => { setEditItem(null); setStudentForm({ first_name: '', last_name: '', phone: '', parent_phone: '', group: '', note: '' }); setShowStudentModal(true); }}
                  className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium">+ Илова</button>
              )}
              {activeTab === 'payments' && (
                <button onClick={() => setShowPaymentModal(true)}
                  className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium">+ Пардохт</button>
              )}
              {activeTab === 'groups' && (
                <button onClick={() => { setEditItem(null); setGroupForm({ name: '', subject: '', teacher: '', schedule: '', room: '', price: '', is_active: true }); setShowGroupModal(true); }}
                  className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium">+ Илова</button>
              )}
              {activeTab === 'teachers' && (
                <button onClick={() => { setEditItem(null); setTeacherForm({ username: '', first_name: '', last_name: '', phone: '', password: '', role: 'teacher' }); setShowTeacherModal(true); }}
                  className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium">+ Илова</button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 lg:p-4">
            {/* Stats */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              <div className="bg-white rounded-xl p-3 border shadow-sm text-center">
                <div className="text-xs text-gray-400">Хонандагон</div>
                <div className="text-xl font-bold text-gray-800">{students.length}</div>
              </div>
              <div className="bg-white rounded-xl p-3 border shadow-sm text-center">
                <div className="text-xs text-gray-400">Гурӯҳҳо</div>
                <div className="text-xl font-bold text-gray-800">{groups.length}</div>
              </div>
              <div className="bg-white rounded-xl p-3 border shadow-sm text-center">
                <div className="text-xs text-gray-400">Пардохт</div>
                <div className="text-xl font-bold text-green-600">{payments.length}</div>
              </div>
              <div className="bg-white rounded-xl p-3 border shadow-sm text-center">
                <div className="text-xs text-gray-400">Қарздор</div>
                <div className="text-xl font-bold text-red-500">{debtors.length}</div>
              </div>
            </div>

            {/* Students */}
            {activeTab === 'students' && (
              <div className="space-y-2">
                {students.length === 0 ? (
                  <div className="bg-white rounded-xl border shadow-sm p-6 text-center text-gray-400">Хонанда нест</div>
                ) : students.map((s) => (
                  <div key={s.id}
                    className={`bg-white rounded-xl border shadow-sm p-3 cursor-pointer transition-all ${selectedStudent?.id === s.id ? 'border-blue-400 bg-blue-50' : ''}`}
                    onClick={() => openStudentProfile(s)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">{s.first_name[0]}</div>
                        <div>
                          <div className="text-sm font-medium text-gray-800">{s.first_name} {s.last_name}</div>
                          <div className="text-xs text-gray-400">{s.phone} • {getGroupName(s.group)}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-bold ${parseFloat(s.balance) < 0 ? 'text-red-500' : 'text-green-600'}`}>{s.balance} с.</div>
                        <div className="flex gap-1 mt-1" onClick={e => e.stopPropagation()}>
                          <button onClick={() => { setEditItem(s); setStudentForm({ first_name: s.first_name, last_name: s.last_name, phone: s.phone, parent_phone: s.parent_phone, group: s.group, note: s.note }); setShowStudentModal(true); }}
                            className="text-blue-500 text-xs border border-blue-200 px-1.5 py-0.5 rounded">✏️</button>
                          <button onClick={() => handleDeleteStudent(s.id)}
                            className="text-red-500 text-xs border border-red-200 px-1.5 py-0.5 rounded">🗑️</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Attendance */}
            {activeTab === 'attendance' && (
              <div>
                <div className="bg-white rounded-xl border shadow-sm p-3 mb-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Гурӯҳ *</label>
                      <select value={selectedGroup} onChange={e => { setSelectedGroup(e.target.value); setAttendance({}); }}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400">
                        <option value="">Интихоб кунед</option>
                        {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Сана *</label>
                      <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
                    </div>
                    {selectedGroup && groupStudents.length > 0 && (
                      <div className="flex gap-2">
                        <div className="flex-1 bg-green-50 rounded-lg p-2 text-center">
                          <div className="text-lg font-bold text-green-600">{presentCount}</div>
                          <div className="text-xs text-green-600">Омад</div>
                        </div>
                        <div className="flex-1 bg-red-50 rounded-lg p-2 text-center">
                          <div className="text-lg font-bold text-red-500">{absentCount}</div>
                          <div className="text-xs text-red-500">Наомад</div>
                        </div>
                        <div className="flex-1 bg-orange-50 rounded-lg p-2 text-center">
                          <div className="text-lg font-bold text-orange-500">{lateCount}</div>
                          <div className="text-xs text-orange-500">Дер</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {selectedGroup && groupStudents.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {groupStudents.map((s) => (
                      <div key={s.id} className={`bg-white rounded-xl border shadow-sm p-3 ${attendance[s.id] === 'absent' ? 'border-red-200 bg-red-50' : attendance[s.id] === 'late' ? 'border-orange-200 bg-orange-50' : ''}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold">{s.first_name[0]}</div>
                          <div className="text-sm font-medium">{s.first_name} {s.last_name}</div>
                        </div>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-1 cursor-pointer">
                            <input type="radio" name={`a-${s.id}`} checked={attendance[s.id] === 'present' || !attendance[s.id]} onChange={() => setAttendance(p => ({...p, [s.id]: 'present'}))} className="accent-green-500" />
                            <span className="text-xs text-green-600">Омад</span>
                          </label>
                          <label className="flex items-center gap-1 cursor-pointer">
                            <input type="radio" name={`a-${s.id}`} checked={attendance[s.id] === 'absent'} onChange={() => setAttendance(p => ({...p, [s.id]: 'absent'}))} className="accent-red-500" />
                            <span className="text-xs text-red-500">Наомад</span>
                          </label>
                          <label className="flex items-center gap-1 cursor-pointer">
                            <input type="radio" name={`a-${s.id}`} checked={attendance[s.id] === 'late'} onChange={() => setAttendance(p => ({...p, [s.id]: 'late'}))} className="accent-orange-400" />
                            <span className="text-xs text-orange-500">Дер</span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {!selectedGroup && (
                  <div className="bg-white rounded-xl border shadow-sm p-8 text-center">
                    <div className="text-4xl mb-3">📚</div>
                    <div className="text-gray-500">Аввал гурӯҳро интихоб кунед</div>
                  </div>
                )}
                {selectedGroup && groupStudents.length > 0 && (
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setAttendance({})} className="border text-gray-600 px-4 py-2 rounded-lg text-sm">Бекор</button>
                    <button onClick={handleSaveAttendance} className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium">💾 Сабт</button>
                  </div>
                )}
              </div>
            )}

            {/* Payments */}
            {activeTab === 'payments' && (
              <div className="space-y-2">
                {payments.length === 0 ? (
                  <div className="bg-white rounded-xl border shadow-sm p-6 text-center text-gray-400">Пардохт нест</div>
                ) : payments.map((p) => (
                  <div key={p.id} className="bg-white rounded-xl border shadow-sm p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-gray-800">{students.find(s => s.id === p.student)?.first_name || '#' + p.student}</div>
                        <div className="text-xs text-gray-400">{new Date(p.date).toLocaleDateString()}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-bold text-green-600">{p.amount} с.</div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${p.method === 'cash' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                          {p.method === 'cash' ? 'Накд' : 'Перевод'}
                        </span>
                        <button onClick={() => handleDeletePayment(p.id)} className="text-red-400 text-xs">🗑️</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Debtors */}
            {activeTab === 'debtors' && (
              <div className="space-y-2">
                {debtors.length === 0 ? (
                  <div className="bg-white rounded-xl border shadow-sm p-6 text-center text-gray-400">Қарздор нест ✅</div>
                ) : debtors.map((s) => (
                  <div key={s.id} className="bg-white rounded-xl border border-red-100 shadow-sm p-3 cursor-pointer"
                    onClick={() => openStudentProfile(s)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold">{s.first_name[0]}</div>
                        <div>
                          <div className="text-sm font-medium text-gray-800">{s.first_name} {s.last_name}</div>
                          <div className="text-xs text-gray-400">{s.phone}</div>
                        </div>
                      </div>
                      <div className="text-sm font-bold text-red-500">{Math.abs(parseFloat(s.balance))} с.</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Groups */}
            {activeTab === 'groups' && (
              <div className="space-y-2">
                {groups.length === 0 ? (
                  <div className="bg-white rounded-xl border shadow-sm p-6 text-center text-gray-400">Гурӯҳ нест</div>
                ) : groups.map((g) => (
                  <div key={g.id} className="bg-white rounded-xl border shadow-sm p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                          {g.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-blue-600">{g.name}</div>
                          <div className="text-xs text-gray-400">{g.subject} • {g.schedule || '-'}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${g.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {g.is_active ? 'Фаъол' : 'Тавақкуф'}
                        </span>
                        <button onClick={() => { setEditItem(g); setGroupForm({ name: g.name, subject: g.subject, teacher: g.teacher, schedule: g.schedule, room: g.room, price: g.price, is_active: g.is_active }); setShowGroupModal(true); }}
                          className="text-blue-500 text-xs border border-blue-200 px-1.5 py-0.5 rounded">✏️</button>
                        <button onClick={() => handleDeleteGroup(g.id)} className="text-red-500 text-xs border border-red-200 px-1.5 py-0.5 rounded">🗑️</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Teachers */}
            {activeTab === 'teachers' && (
              <div className="space-y-2">
                {teachers.length === 0 ? (
                  <div className="bg-white rounded-xl border shadow-sm p-6 text-center text-gray-400">Муаллим нест</div>
                ) : teachers.map((t) => (
                  <div key={t.id}
                    className={`bg-white rounded-xl border shadow-sm p-3 cursor-pointer ${selectedTeacher?.id === t.id ? 'border-blue-400 bg-blue-50' : ''}`}
                    onClick={() => openTeacherProfile(t)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">
                          {t.first_name ? t.first_name[0] : t.username[0]}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-800">{t.first_name} {t.last_name}</div>
                          <div className="text-xs text-gray-400">{t.username} • {groups.filter(g => g.teacher === t.id).length} гурӯҳ</div>
                        </div>
                      </div>
                      <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                        <button onClick={() => { setEditItem(t); setTeacherForm({ username: t.username, first_name: t.first_name, last_name: t.last_name, phone: t.phone, password: '', role: 'teacher' }); setShowTeacherModal(true); }}
                          className="text-blue-500 text-xs border border-blue-200 px-1.5 py-0.5 rounded">✏️</button>
                        <button onClick={() => handleDeleteTeacher(t.id)} className="text-red-500 text-xs border border-red-200 px-1.5 py-0.5 rounded">🗑️</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Side Panel — Student */}
        {selectedStudent && (
          <div className="fixed inset-0 lg:static lg:w-2/5 bg-white lg:border-l border-gray-200 flex flex-col overflow-hidden z-30">
            <div className="p-4 border-b flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {selectedStudent.first_name[0]}
                </div>
                <div>
                  <div className="font-semibold text-gray-800">{selectedStudent.first_name} {selectedStudent.last_name}</div>
                  <div className="text-xs text-gray-400">{selectedStudent.phone} • {getGroupName(selectedStudent.group)}</div>
                </div>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="text-gray-400 text-xl">✕</button>
            </div>
            <div className="flex border-b">
              {['info', 'payments', 'attendance'].map(tab => (
                <button key={tab} onClick={() => setProfileTab(tab)}
                  className={`flex-1 py-2.5 text-xs font-medium ${profileTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>
                  {tab === 'info' ? 'Маълумот' : tab === 'payments' ? 'Пардохтҳо' : 'Давомот'}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {profileTab === 'info' && (
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Санаи қайд</div>
                    <div className="text-sm font-medium">{selectedStudent.start_date || '-'}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Телефони волидон</div>
                    <div className="text-sm font-medium">{selectedStudent.parent_phone || '-'}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Баланс</div>
                    <div className={`text-xl font-bold ${parseFloat(selectedStudent.balance) < 0 ? 'text-red-500' : 'text-green-600'}`}>
                      {selectedStudent.balance} с.
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Умумии пардохт</div>
                    <div className="text-sm font-bold text-blue-600">
                      {studentPayments.reduce((s, p) => s + parseFloat(p.amount || 0), 0).toLocaleString()} с.
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditItem(selectedStudent); setStudentForm({ first_name: selectedStudent.first_name, last_name: selectedStudent.last_name, phone: selectedStudent.phone, parent_phone: selectedStudent.parent_phone, group: selectedStudent.group, note: selectedStudent.note }); setShowStudentModal(true); }}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm">✏️ Таҳрир</button>
                    <button onClick={() => handleDeleteStudent(selectedStudent.id)}
                      className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg text-sm border border-red-200">🗑️ Ҳазф</button>
                  </div>
                </div>
              )}
              {profileTab === 'payments' && (
                <div>
                  <div className="flex justify-between mb-3">
                    <div className="text-sm font-semibold">Пардохтҳо</div>
                    <div className="text-xs text-green-600">{studentPayments.reduce((s, p) => s + parseFloat(p.amount || 0), 0).toLocaleString()} с.</div>
                  </div>
                  {studentPayments.length === 0 ? (
                    <div className="text-center py-6 text-gray-400 text-sm">Пардохт нест</div>
                  ) : studentPayments.map(p => (
                    <div key={p.id} className="flex justify-between py-2.5 border-b border-gray-50 last:border-0">
                      <div>
                        <div className="text-sm font-medium">{parseFloat(p.amount).toLocaleString()} с.</div>
                        <div className="text-xs text-gray-400">{new Date(p.date).toLocaleDateString()}</div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full h-fit ${p.method === 'cash' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {p.method === 'cash' ? 'Накд' : 'Перевод'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {profileTab === 'attendance' && (
                <div>
                  <div className="flex justify-between mb-3">
                    <div className="text-sm font-semibold">Давомот</div>
                    <div className="text-xs text-blue-600">{studentAttendance.length} дарс</div>
                  </div>
                  {studentAttendance.length === 0 ? (
                    <div className="text-center py-6 text-gray-400 text-sm">Давомот нест</div>
                  ) : studentAttendance.map(a => {
                    const s = getStatusInfo(a.status);
                    return (
                      <div key={a.id} className="flex justify-between py-2.5 border-b border-gray-50 last:border-0">
                        <div className="text-sm text-gray-700">📅 {a.date}</div>
                        <span className={`text-xs px-2 py-1 rounded-full ${s.color}`}>{s.text}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Side Panel — Teacher */}
        {selectedTeacher && (
          <div className="fixed inset-0 lg:static lg:w-2/5 bg-white lg:border-l border-gray-200 flex flex-col overflow-hidden z-30">
            <div className="p-4 border-b flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {selectedTeacher.first_name ? selectedTeacher.first_name[0] : selectedTeacher.username[0]}
                </div>
                <div>
                  <div className="font-semibold text-gray-800">{selectedTeacher.first_name} {selectedTeacher.last_name}</div>
                  <div className="text-xs text-gray-400">{selectedTeacher.phone || selectedTeacher.username}</div>
                </div>
              </div>
              <button onClick={() => setSelectedTeacher(null)} className="text-gray-400 text-xl">✕</button>
            </div>
            <div className="flex border-b">
              {['info', 'groups', 'salary'].map(tab => (
                <button key={tab} onClick={() => setProfileTab(tab)}
                  className={`flex-1 py-2.5 text-xs font-medium ${profileTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>
                  {tab === 'info' ? 'Маълумот' : tab === 'groups' ? 'Гурӯҳҳо' : 'Маош'}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {profileTab === 'info' && (
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Санаи қайд</div>
                    <div className="text-sm font-medium">{selectedTeacher.date_joined ? new Date(selectedTeacher.date_joined).toLocaleDateString() : '-'}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Логин</div>
                    <div className="text-sm font-medium">{selectedTeacher.username}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Гурӯҳҳо</div>
                    <div className="text-xl font-bold text-blue-600">{teacherGroups.length}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Умумии маош</div>
                    <div className="text-xl font-bold text-green-600">
                      {teacherSalaries.reduce((s, sal) => s + parseFloat(sal.amount || 0), 0).toLocaleString()} с.
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditItem(selectedTeacher); setTeacherForm({ username: selectedTeacher.username, first_name: selectedTeacher.first_name, last_name: selectedTeacher.last_name, phone: selectedTeacher.phone, password: '', role: 'teacher' }); setShowTeacherModal(true); }}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm">✏️ Таҳрир</button>
                    <button onClick={() => handleDeleteTeacher(selectedTeacher.id)}
                      className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg text-sm border border-red-200">🗑️ Ҳазф</button>
                  </div>
                </div>
              )}
              {profileTab === 'groups' && (
                <div>
                  <div className="text-sm font-semibold mb-3">Гурӯҳҳо ({teacherGroups.length})</div>
                  {teacherGroups.length === 0 ? (
                    <div className="text-center py-6 text-gray-400 text-sm">Гурӯҳ нест</div>
                  ) : teacherGroups.map(g => (
                    <div key={g.id} className="flex justify-between py-2.5 border-b border-gray-50 last:border-0">
                      <div>
                        <div className="text-sm font-medium">{g.name}</div>
                        <div className="text-xs text-gray-400">{g.subject} • {g.schedule}</div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full h-fit ${g.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {g.is_active ? 'Фаъол' : 'Тавақкуф'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {profileTab === 'salary' && (
                <div>
                  <div className="flex justify-between mb-3">
                    <div className="text-sm font-semibold">Маош</div>
                    <button onClick={() => setShowSalaryModal(true)}
                      className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs">+ Илова</button>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 mb-3">
                    <div className="text-xs text-gray-400">Умумӣ</div>
                    <div className="text-xl font-bold text-green-600">
                      {teacherSalaries.reduce((s, sal) => s + parseFloat(sal.amount || 0), 0).toLocaleString()} с.
                    </div>
                  </div>
                  {teacherSalaries.length === 0 ? (
                    <div className="text-center py-6 text-gray-400 text-sm">Маош нест</div>
                  ) : teacherSalaries.map(sal => (
                    <div key={sal.id} className="flex justify-between py-2.5 border-b border-gray-50 last:border-0">
                      <div>
                        <div className="text-sm font-medium">{parseFloat(sal.amount).toLocaleString()} с.</div>
                        <div className="text-xs text-gray-400">📅 {sal.date}</div>
                        {sal.note && <div className="text-xs text-gray-400">💬 {sal.note}</div>}
                      </div>
                      <button onClick={() => handleDeleteSalary(sal.id)} className="text-red-400 text-xs">🗑️</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Student Modal */}
      {showStudentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-md shadow-2xl">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold">{editItem ? 'Таҳрир' : 'Иловаи хонанда'}</h2>
              <button onClick={() => setShowStudentModal(false)} className="text-gray-400">✕</button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Ном *</label>
                  <input className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" value={studentForm.first_name} onChange={e => setStudentForm({...studentForm, first_name: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Насаб *</label>
                  <input className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" value={studentForm.last_name} onChange={e => setStudentForm({...studentForm, last_name: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Телефон *</label>
                <input className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" value={studentForm.phone} onChange={e => setStudentForm({...studentForm, phone: e.target.value})} />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Телефони волидон</label>
                <input className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" value={studentForm.parent_phone} onChange={e => setStudentForm({...studentForm, parent_phone: e.target.value})} />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Гурӯҳ</label>
                <select className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" value={studentForm.group} onChange={e => setStudentForm({...studentForm, group: e.target.value})}>
                  <option value="">Интихоб кунед</option>
                  {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowStudentModal(false)} className="flex-1 border text-gray-600 py-2 rounded-lg text-sm">Бекор</button>
              <button onClick={handleAddStudent} className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm">{editItem ? 'Сақлаед' : 'Илова'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-md shadow-2xl">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold">Пардохт илова</h2>
              <button onClick={() => setShowPaymentModal(false)} className="text-gray-400">✕</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Хонанда *</label>
                <select className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" value={paymentForm.student} onChange={e => setPaymentForm({...paymentForm, student: e.target.value})}>
                  <option value="">Интихоб кунед</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Маблағ *</label>
                <input type="number" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" value={paymentForm.amount} onChange={e => setPaymentForm({...paymentForm, amount: e.target.value})} />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Тарз</label>
                <select className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" value={paymentForm.method} onChange={e => setPaymentForm({...paymentForm, method: e.target.value})}>
                  <option value="cash">💵 Накд</option>
                  <option value="transfer">🏦 Перевод</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowPaymentModal(false)} className="flex-1 border text-gray-600 py-2 rounded-lg text-sm">Бекор</button>
              <button onClick={handleAddPayment} className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm">Пардохт</button>
            </div>
          </div>
        </div>
      )}

      {/* Group Modal */}
      {showGroupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-md shadow-2xl">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold">{editItem ? 'Таҳрир' : 'Иловаи гурӯҳ'}</h2>
              <button onClick={() => setShowGroupModal(false)} className="text-gray-400">✕</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Номи гурӯҳ *</label>
                <input className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" value={groupForm.name} onChange={e => setGroupForm({...groupForm, name: e.target.value})} />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Фан *</label>
                <input className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" value={groupForm.subject} onChange={e => setGroupForm({...groupForm, subject: e.target.value})} />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Муаллим</label>
                <select className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" value={groupForm.teacher} onChange={e => setGroupForm({...groupForm, teacher: e.target.value})}>
                  <option value="">Интихоб кунед</option>
                  {teachers.map(t => <option key={t.id} value={t.id}>{t.first_name} {t.last_name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Вақт</label>
                <input className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" placeholder="Дш, Ср, Ҷм 17:00" value={groupForm.schedule} onChange={e => setGroupForm({...groupForm, schedule: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Кабинет</label>
                  <input className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" value={groupForm.room} onChange={e => setGroupForm({...groupForm, room: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Нарх (с.)</label>
                  <input type="number" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" value={groupForm.price} onChange={e => setGroupForm({...groupForm, price: e.target.value})} />
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowGroupModal(false)} className="flex-1 border text-gray-600 py-2 rounded-lg text-sm">Бекор</button>
              <button onClick={handleAddGroup} className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm">{editItem ? 'Сақлаед' : 'Илова'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Teacher Modal */}
      {showTeacherModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-md shadow-2xl">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold">{editItem ? 'Таҳрир' : 'Иловаи муаллим'}</h2>
              <button onClick={() => setShowTeacherModal(false)} className="text-gray-400">✕</button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Ном *</label>
                  <input className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" value={teacherForm.first_name} onChange={e => setTeacherForm({...teacherForm, first_name: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Насаб *</label>
                  <input className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" value={teacherForm.last_name} onChange={e => setTeacherForm({...teacherForm, last_name: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Логин *</label>
                <input className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" value={teacherForm.username} onChange={e => setTeacherForm({...teacherForm, username: e.target.value})} />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Телефон</label>
                <input className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" value={teacherForm.phone} onChange={e => setTeacherForm({...teacherForm, phone: e.target.value})} />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">{editItem ? 'Парол нав' : 'Парол *'}</label>
                <input type="password" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" value={teacherForm.password} onChange={e => setTeacherForm({...teacherForm, password: e.target.value})} />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowTeacherModal(false)} className="flex-1 border text-gray-600 py-2 rounded-lg text-sm">Бекор</button>
              <button onClick={handleAddTeacher} className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm">{editItem ? 'Сақлаед' : 'Илова'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Salary Modal */}
      {showSalaryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-md shadow-2xl">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold">Маош илова</h2>
              <button onClick={() => setShowSalaryModal(false)} className="text-gray-400">✕</button>
            </div>
            <div className="space-y-3">
              <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-700">
                👨‍🏫 {selectedTeacher?.first_name} {selectedTeacher?.last_name}
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Маблағ *</label>
                <input type="number" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" value={salaryForm.amount} onChange={e => setSalaryForm({...salaryForm, amount: e.target.value})} />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Сана *</label>
                <input type="date" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" value={salaryForm.date} onChange={e => setSalaryForm({...salaryForm, date: e.target.value})} />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Эзоҳ</label>
                <textarea className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" rows={2} value={salaryForm.note} onChange={e => setSalaryForm({...salaryForm, note: e.target.value})} />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowSalaryModal(false)} className="flex-1 border text-gray-600 py-2 rounded-lg text-sm">Бекор</button>
              <button onClick={handleAddSalary} className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm">💰 Маош</button>
            </div>
          </div>
        </div>
      )}

      {saved && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg text-sm font-medium z-50">
          ✅ {savedMsg}
        </div>
      )}
    </div>
  );
}

export default AdminPanel;