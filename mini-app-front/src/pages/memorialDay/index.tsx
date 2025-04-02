import React, { useState, useEffect } from 'react';
import { View, Text, Input, Button } from '@tarojs/components';
import './index.scss';

interface AnniversaryItem {
  id: string;
  title: string;
  date: string;
  days: number;
  weekday: string;
  color: string;
  isCompleted?: boolean;
}

const Index: React.FC = () => {
  const [anniversaries, setAnniversaries] = useState<AnniversaryItem[]>([
    {
      id: '1',
      title: '发工资还有',
      date: '2024-1-25',
      days: 2,
      weekday: '星期四',
      color: '#1e88e5'
    },
    {
      id: '2',
      title: '星期六还有',
      date: '2024-1-27',
      days: 4,
      weekday: '星期六',
      color: '#1e88e5'
    },
    {
      id: '3',
      title: '生日还有',
      date: '2024-2-8',
      days: 16,
      weekday: '星期四',
      color: '#1e88e5'
    },
    {
      id: '4',
      title: 'New Year 还有',
      date: '2025-1-1',
      days: 341,
      weekday: '星期三',
      color: '#1e88e5'
    },
    {
      id: '5',
      title: '25岁已经',
      date: '2023-12-25',
      days: 24,
      weekday: '星期六',
      color: '#ff9800',
      isCompleted: true
    },
    {
      id: '6',
      title: '在一起已经',
      date: '2023-1-23',
      days: 365,
      weekday: '星期一',
      color: '#ff9800',
      isCompleted: true
    },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingDate, setEditingDate] = useState('');

  const [currentDate, setCurrentDate] = useState('');
  const [lunarDate, setLunarDate] = useState('');

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    setCurrentDate(`${month}月${day}日`);
    setLunarDate('农历腊月十二');
  }, []);

  const handleAddClick = () => {
    setIsAdding(true);
  };

  const handleAddConfirm = () => {
    if (newTitle && newDate) {
      const newItem: AnniversaryItem = {
        id: Date.now().toString(),
        title: newTitle,
        date: newDate,
        days: 0, // Calculate based on date
        weekday: '星期一', // Calculate based on date
        color: '#1e88e5'
      };
      setAnniversaries([...anniversaries, newItem]);
      setIsAdding(false);
      setNewTitle('');
      setNewDate('');
    }
  };

  const handleAddCancel = () => {
    setIsAdding(false);
    setNewTitle('');
    setNewDate('');
  };

  const handleEditClick = (id: string) => {
    const item = anniversaries.find(a => a.id === id);
    if (item) {
      setEditingId(id);
      setEditingTitle(item.title);
      setEditingDate(item.date);
    }
  };

  const handleEditConfirm = () => {
    if (editingId && editingTitle && editingDate) {
      setAnniversaries(anniversaries.map(item => 
        item.id === editingId 
          ? {...item, title: editingTitle, date: editingDate}
          : item
      ));
      setEditingId(null);
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
  };

  const handleDeleteClick = (id: string) => {
    setAnniversaries(anniversaries.filter(item => item.id !== id));
  };

  // Generate pairs of cards
  const renderCardPairs = () => {
    const rows = [];
    for (let i = 0; i < anniversaries.length; i += 2) {
      rows.push(
        <View className="card-row" key={`row-${i}`}>
          {renderCard(anniversaries[i])}
          {i + 1 < anniversaries.length ? renderCard(anniversaries[i + 1]) : <View className="card empty"></View>}
        </View>
      );
    }
    return rows;
  };

  // Render individual card
  const renderCard = (item: AnniversaryItem) => {
    if (editingId === item.id) {
      return (
        <View className="card editing" style={{ backgroundColor: item.color }}>
          <View className="edit-form">
            <Text className="edit-label">标题:</Text>
            <Input className="edit-input" value={editingTitle} onInput={e => setEditingTitle(e.detail.value)} />
            <Text className="edit-label">日期:</Text>
            <Input className="edit-input" value={editingDate} onInput={e => setEditingDate(e.detail.value)} />
            <View className="button-group">
              <Button className="confirm-btn" onClick={handleEditConfirm}>确定</Button>
              <Button className="cancel-btn" onClick={handleEditCancel}>取消</Button>
            </View>
          </View>
        </View>
      );
    }

    return (
      <View className="card" style={{ backgroundColor: item.color }} key={item.id}>
        <View className="card-header">
          <Text className="card-title">{item.title}</Text>
        </View>
        <View className="card-content">
          <Text className="days-number">{item.days}</Text>
        </View>
        <View className="card-footer">
          <Text className="date-text">目标日: {item.date} {item.weekday}</Text>
        </View>
      </View>
    );
  };

  return (
    <View className="container">
      <View className="header">
        <View className="title">Days Matter · 全部</View>
        <View className="add-btn" onClick={handleAddClick}>
          <Text className="icon">+</Text>
          <Text className="add-text">添加</Text>
        </View>
      </View>

      {isAdding && (
        <View className="modal">
          <View className="modal-content">
            <View className="modal-header">
              <Text className="modal-title">添加纪念日</Text>
            </View>
            <View className="modal-form">
              <Text className="form-label">标题:</Text>
              <Input className="form-input" value={newTitle} onInput={e => setNewTitle(e.detail.value)} />
              <Text className="form-label">日期:</Text>
              <Input className="form-input" value={newDate} onInput={e => setNewDate(e.detail.value)} />
            </View>
            <View className="button-group">
              <Button className="confirm-btn" onClick={handleAddConfirm}>确定</Button>
              <Button className="cancel-btn" onClick={handleAddCancel}>取消</Button>
            </View>
          </View>
        </View>
      )}

      <View className="content">
        {renderCardPairs()}
      </View>

      <View className="calendar-card">
        <Text className="date-today">历史上的今天: {currentDate}</Text>
        <Text className="lunar-date">{lunarDate}</Text>
      </View>

      <View className="footer">
        <Text className="no-more-text">没有更多了</Text>
      </View>
    </View>
  );
};

export default Index;