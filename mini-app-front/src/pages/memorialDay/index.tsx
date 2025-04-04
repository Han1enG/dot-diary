import React, { useState, useEffect } from 'react';
import { View, Text, Input, Button, Image, Picker } from '@tarojs/components';
import LunarCalendar from 'lunar-calendar';
import './index.scss';

// 导入图标
import addIcon from '../../assets/icons/add.png';
import closeIcon from '../../assets/icons/close.png';
import editIcon from '../../assets/icons/edit.png';
import confirmIcon from '../../assets/icons/confirm.png';
import salaryIcon from '../../assets/icons/salary.png';
import weekendIcon from '../../assets/icons/weekend.png';
import birthdayIcon from '../../assets/icons/birthday.png';
import fireworksIcon from '../../assets/icons/fireworks.png';
import heartIcon from '../../assets/icons/heart.png';

interface AnniversaryItem {
  id: string;
  title: string;
  date: string;
  days: number;
  weekday: string;
  color: string;
  isCompleted?: boolean;
  icon?: string;
}

const Index: React.FC = () => {
  const [anniversaries, setAnniversaries] = useState<AnniversaryItem[]>([
    {
      id: '1',
      title: '发工资',
      date: '2024-1-25',
      days: 2,
      weekday: '星期四',
      color: '#FF9A8B',
      icon: salaryIcon
    },
    {
      id: '2',
      title: '周末',
      date: '2024-1-27',
      days: 4,
      weekday: '星期六',
      color: '#4CC9F0',
      icon: weekendIcon
    },
    {
      id: '3',
      title: '生日',
      date: '2024-2-8',
      days: 16,
      weekday: '星期四',
      color: '#F72585',
      icon: birthdayIcon
    },
    {
      id: '4',
      title: '新年',
      date: '2025-1-1',
      days: 341,
      weekday: '星期三',
      color: '#7209B7',
      icon: fireworksIcon
    },
    {
      id: '5',
      title: '25岁',
      date: '2023-12-25',
      days: 24,
      weekday: '星期六',
      color: '#FFBE0B',
      icon: heartIcon
    },
    {
      id: '6',
      title: '在一起',
      date: '2023-1-23',
      days: 365,
      weekday: '星期一',
      color: '#3A86FF',
      icon: heartIcon
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
    today.setHours(0, 0, 0, 0);
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    setCurrentDate(`${year}年${month}月${day}日`);
    const lunar = LunarCalendar.solarToLunar(year, month, day
    );
    setLunarDate(`农历${lunar.lunarYear}年${lunar.lunarMonth}月${lunar.lunarDay}`);

    setAnniversaries(prev => prev.map(item => {
      const targetDate = new Date(item.date);
      targetDate.setHours(0, 0, 0, 0);
      const timeDiff = targetDate.getTime() - today.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

      const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      const weekday = weekdays[targetDate.getDay()];

      // 根据日期是否过去来决定标题和天数
      const isPast = daysDiff < 0;
      const displayDays = Math.abs(daysDiff);
      const displayTitle = isPast ? `${item.title}已经` : `距离${item.title}还有`;

      return {
        ...item,
        title: displayTitle,
        days: displayDays,
        weekday,
        isCompleted: isPast
      };
    }));
  }, []);

  const handleAddClick = () => {
    setIsAdding(true);
  };

  const handleEditClick = (id: string) => {
    const item = anniversaries.find(item => item.id === id);
    if (item) {
      // 提取原始标题（去掉"已经"或"距离...还有"）
      let originalTitle = item.title;
      if (item.title.startsWith('距离')) {
        originalTitle = item.title.replace('距离', '').replace('还有', '');
      } else if (item.title.endsWith('已经')) {
        originalTitle = item.title.replace('已经', '');
      }
      
      setEditingId(id);
      setEditingTitle(originalTitle);
      setEditingDate(item.date);
    }
  }

  const handleAddConfirm = () => {
    if (newTitle && newDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const targetDate = new Date(newDate);
      targetDate.setHours(0, 0, 0, 0);
      const timeDiff = targetDate.getTime() - today.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      const isPast = daysDiff < 0;
      
      const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      const weekday = weekdays[targetDate.getDay()];
      
      const displayTitle = isPast ? `${newTitle}已经` : `距离${newTitle}还有`;

      const newItem: AnniversaryItem = {
        id: Date.now().toString(),
        title: displayTitle,
        date: newDate,
        days: Math.abs(daysDiff),
        weekday: weekday,
        color: getRandomColor(),
        icon: getIconByTitle(newTitle),
        isCompleted: isPast
      };
      
      setAnniversaries([...anniversaries, newItem]);
      setIsAdding(false);
      setNewTitle('');
      setNewDate('');
    }
  };

  const handleEditConfirm = () => {
    if (editingId && editingTitle && editingDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const targetDate = new Date(editingDate);
      targetDate.setHours(0, 0, 0, 0);
      const timeDiff = targetDate.getTime() - today.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      const isPast = daysDiff < 0;
      
      const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      const weekday = weekdays[targetDate.getDay()];
      
      const displayTitle = isPast ? `${editingTitle}已经` : `距离${editingTitle}还有`;

      setAnniversaries(anniversaries.map(item =>
        item.id === editingId
          ? {
            ...item,
            title: displayTitle,
            date: editingDate,
            days: Math.abs(daysDiff),
            weekday,
            isCompleted: isPast,
            icon: getIconByTitle(editingTitle)
          }
          : item
      ));
      setEditingId(null);
    }
  };

  const getRandomColor = () => {
    const colors = ['#FF9A8B', '#4CC9F0', '#F72585', '#7209B7', '#FFBE0B', '#3A86FF'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const getIconByTitle = (title: string) => {
    if (title.includes('工资')) return salaryIcon;
    if (title.includes('周末')) return weekendIcon;
    if (title.includes('生日')) return birthdayIcon;
    if (title.includes('新年')) return fireworksIcon;
    if (title.includes('一起') || title.includes('纪念')) return heartIcon;
    return heartIcon;
  };

  const renderCardContent = (item: AnniversaryItem) => {
    if (editingId === item.id) {
      return (
        <View className="edit-container">
          <View className="edit-header">
            <Text className="edit-title">编辑纪念日</Text>
            <Image
              className="close-icon"
              src={closeIcon}
              onClick={() => setEditingId(null)}
            />
          </View>

          <View className="form-group">
            <Text className="form-label">标题</Text>
            <Input
              className="form-input"
              value={editingTitle}
              onInput={e => setEditingTitle(e.detail.value)}
              placeholder="输入标题"
            />
          </View>

          <View className="form-group">
            <Text className="form-label">日期</Text>
            <Picker mode='date' value={editingDate} onChange={e => setEditingDate(e.detail.value)}>
              <View className='picker-value'>{editingDate}</View>
            </Picker>
          </View>

          <View className="button-container">
            <Button className="confirm-button" onClick={handleEditConfirm}>
              <Image className="button-icon" src={confirmIcon} />
              <Text>保存</Text>
            </Button>
          </View>
        </View>
      );
    }

    return (
      <>
        <View className="card-header">
          {item.icon && <Image className="card-icon" src={item.icon} />}
          <Text className="card-title">{item.title}</Text>
          <Image
            className="edit-icon"
            src={editIcon}
            onClick={() => handleEditClick(item.id)}
          />
        </View>
        <View className="card-content">
          <Text className="days-number">{item.days}</Text>
          <Text className="days-unit">天</Text>
        </View>
        <View className="card-footer">
          <Text className="date-text">{item.date}</Text>
          <Text className="weekday-text">{item.weekday}</Text>
        </View>
      </>
    );
  };

  const renderCardPairs = () => {
    return anniversaries.reduce((rows, item, index) => {
      if (index % 2 === 0) {
        rows.push(
          <View className="card-row" key={`row-${index}`}>
            <View
              className={`card ${editingId === item.id ? 'editing' : ''}`}
              style={{ backgroundColor: item.color }}
            >
              {renderCardContent(item)}
            </View>
            {index + 1 < anniversaries.length ? (
              <View
                className={`card ${editingId === anniversaries[index + 1].id ? 'editing' : ''}`}
                style={{ backgroundColor: anniversaries[index + 1].color }}
              >
                {renderCardContent(anniversaries[index + 1])}
              </View>
            ) : (
              <View className="card empty"></View>
            )}
          </View>
        );
      }
      return rows;
    }, [] as JSX.Element[]);
  };

  return (
    <View className="container">
      <View className="header">
        <Text className="header-title">期期•念念</Text>
        <View className="add-button" onClick={handleAddClick}>
          <Image className="add-icon" src={addIcon} />
          <Text className="add-text">添加</Text>
        </View>
      </View>

      <View className="content">
        {renderCardPairs()}
      </View>

      {isAdding && (
        <View className="modal">
          <View className="modal-content">
            <View className="modal-header">
              <Text className="modal-title">添加纪念日</Text>
              <Image
                className="close-icon"
                src={closeIcon}
                onClick={() => setIsAdding(false)}
              />
            </View>

            <View className="form-group">
              <Text className="form-label">标题</Text>
              <Input
                className="form-input"
                value={newTitle}
                onInput={e => setNewTitle(e.detail.value)}
                placeholder="例如：结婚纪念日"
              />
            </View>

            <View className="form-group">
              <Text className="form-label">日期</Text>
              <Picker mode='date' value={newDate} onChange={e => setNewDate(e.detail.value)}>
                <View className='picker-value'>{newDate}</View>
              </Picker>
            </View>

            <View className="button-container">
              <Button className="confirm-button" onClick={handleAddConfirm}>
                <Image className="button-icon" src={confirmIcon} />
                <Text>添加</Text>
              </Button>
            </View>
          </View>
        </View>
      )}

      <View className="calendar-card">
        <Text className="date-today">{currentDate}</Text>
        <Text className="lunar-date">{lunarDate}</Text>
      </View>
    </View>
  );
};

export default Index;