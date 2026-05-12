import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { auth } from '../firebase';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { ArrowLeft, User, Compass, History, Shield, Save, CheckCircle, AlertCircle } from 'lucide-react';
import { lessons } from '../data/lessons';

export default function Profile() {
  const navigate = useNavigate();
  const { currentUser, userData, updateUserData, changePassword, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Form states
  const [name, setName] = useState(userData?.userName || '');
  const [newCareer, setNewCareer] = useState(userData?.selectedCareer || 'General');
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const careers = ['Software Dev', 'Data Science', 'UX Design', 'Marketing', 'Finance', 'Healthcare', 'AI & ML', 'Cybersecurity'];

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      await updateUserData({ userName: name, selectedCareer: newCareer });
      showMessage('success', 'Profile updated successfully!');
    } catch (err) {
      showMessage('error', 'Failed to update profile');
    }
    setLoading(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      showMessage('error', 'New passwords do not match');
      return;
    }
    if (newPass.length < 6) {
      showMessage('error', 'Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await changePassword(currentPass, newPass);
      setCurrentPass(''); setNewPass(''); setConfirmPass('');
      showMessage('success', 'Password changed successfully!');
    } catch (err) {
      if (err.code === 'auth/wrong-password') {
        showMessage('error', 'Current password is incorrect');
      } else {
        showMessage('error', 'Failed to change password. Please re-login and try again.');
      }
    }
    setLoading(false);
  };

  const userLessons = userData?.lessons || {};
  const completedLessons = Object.keys(userLessons).filter(id => userLessons[id] === 100);

  const tabs = [
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'career', icon: Compass, label: 'Career Path' },
    { id: 'history', icon: History, label: 'Learning History' },
    { id: 'security', icon: Shield, label: 'Security' }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-5 h-5" /> Back to Dashboard
          </button>
          <h1 className="text-xl font-bold text-slate-800">Settings</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Message Toast */}
        {message.text && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} 
            className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {message.text}
          </motion.div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}>
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Profile Information</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Display Name</label>
                  <input value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                  <input value={userData?.email || ''} disabled className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 cursor-not-allowed" />
                  <p className="text-xs text-slate-500 mt-1">Email cannot be changed for security reasons.</p>
                </div>
                <button onClick={handleSaveProfile} disabled={loading} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors">
                  <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'career' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Switch Career Path</h2>
              <p className="text-slate-600 mb-6">Changing your path will reset your lesson progress. Your streak & achievements will be kept.</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {careers.map(career => (
                  <button key={career} onClick={() => setNewCareer(career)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      newCareer === career ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold' : 'border-slate-200 hover:border-indigo-300'
                    }`}>
                    {career}
                  </button>
                ))}
              </div>
              <button onClick={handleSaveProfile} disabled={loading} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors">
                <Compass className="w-4 h-4" /> {loading ? 'Updating...' : 'Switch Path'}
              </button>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Learning History</h2>
              {completedLessons.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <History className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No lessons completed yet. Start learning to see your progress!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {completedLessons.map(id => {
                    const lesson = lessons.find(l => l.id === parseInt(id));
                    return (
                      <div key={id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div>
                          <h3 className="font-semibold text-slate-800">{lesson?.title || `Lesson ${id}`}</h3>
                          <p className="text-sm text-slate-500">{lesson?.estimatedTime || 'N/A'} • Completed</p>
                        </div>
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Change Password</h2>
              <p className="text-slate-600 mb-6">For security, you'll need to verify your current password before setting a new one.</p>
              <form onSubmit={handleChangePassword} className="space-y-5 max-w-md">
                <input type="password" value={currentPass} onChange={e => setCurrentPass(e.target.value)} placeholder="Current Password" required className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none" />
                <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="New Password" required className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none" />
                <input type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} placeholder="Confirm New Password" required className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none" />
                <button type="submit" disabled={loading} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors">
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
              <div className="mt-8 pt-6 border-t border-slate-200">
                <button onClick={logout} className="text-red-600 font-medium hover:text-red-700 flex items-center gap-2">
                  Log out of all devices
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}