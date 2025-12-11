import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="section-padding">
      <div className="container-max">
        <h1 className="text-4xl font-bold mb-8">🛠️ Администраторская панель</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Предметы</h3>
            <p className="text-3xl font-bold">450+</p>
          </div>
          <div className="card">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Локации</h3>
            <p className="text-3xl font-bold">25</p>
          </div>
          <div className="card">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Гайды</h3>
            <p className="text-3xl font-bold">120+</p>
          </div>
          <div className="card">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Персонажи</h3>
            <p className="text-3xl font-bold">50+</p>
          </div>
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Добавить предмет</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Название</label>
              <input type="text" placeholder="Item name" className="w-full" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Тип</label>
                <select className="w-full">
                  <option>Оружие</option>
                  <option>Армор</option>
                  <option>Потребляемые</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Редкость</label>
                <select className="w-full">
                  <option>Обычная</option>
                  <option>Редкая</option>
                  <option>Эпик</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Описание</label>
              <textarea placeholder="Description" rows={4} className="w-full"></textarea>
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-medium">
              Опубликовать
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;