import React, { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Input, Button, Image, Picker } from '@tarojs/components';
import LunarCalendar from 'lunar-calendar';
import './index.scss';
import { anniversaryHandler, getUserId } from '@/utils/cloud';
import { useDataLoader } from '@/hooks/useDataLoader';
import { getRandomColor, getIconByTitle, getDisplayTitle } from '@/utils/memorialDay';

// 导入图标
import addIcon from '../../assets/icons/add.png';
import closeIcon from '../../assets/icons/close.png';
import editIcon from '../../assets/icons/edit.png';
import confirmIcon from '../../assets/icons/confirm.png';
import heartIcon from '../../assets/icons/heart.png';

const Index: React.FC = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingDate, setEditingDate] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [lunarDate, setLunarDate] = useState('');

  // 使用自定义Hook管理数据加载
  const {
    data: anniversaries = [],
    isLoading,
    syncData,
    setData: setAnniversaries
  } = useDataLoader<MiniProgram.AnniversaryItem[]>({
    fetchHandler: async (userId) => {
      const response = await anniversaryHandler.fetch(userId);
      return {
        success: response.success,
        data: response.data || [],
        error: response.error
      };
    },
    showLoading: true,
    autoLoad: true,
    onSuccess: (data) => console.log('纪念日数据加载成功:', data)
  });

  // 初始化日期信息
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    setCurrentDate(`${year}年${month}月${day}日`);

    const lunar = LunarCalendar.solarToLunar(year, month, day);
    setLunarDate(`农历${lunar.lunarYear}年${lunar.lunarMonth}月${lunar.lunarDay}`);
  }, []);

  // 下拉刷新
  Taro.usePullDownRefresh(async () => {
    await syncData();
    Taro.stopPullDownRefresh();
  });

  const handleEditClick = (id: string) => {
    const item = anniversaries.find(item => item.id === id);
    if (item) {
      setEditingId(id);
      setEditingTitle(item.title);
      setEditingDate(item.date);
    }
  };

  const handleAddConfirm = async () => {
    if (!newTitle || !newDate) {
      Taro.showModal({
        title: '提示',
        content: '标题和日期不能为空',
        showCancel: false,
        confirmText: '我知道了'
      });
      return;
    }

    try {
      const newItem: MiniProgram.AnniversaryItem = {
        id: Date.now().toString(),
        title: newTitle,
        date: newDate,
        color: getRandomColor(),
        icon: getIconByTitle(newTitle)
      };

      const updatedAnniversaries = [...anniversaries, newItem];

      // 乐观更新
      setAnniversaries(updatedAnniversaries);

      const saveResponse = await anniversaryHandler.save(await getUserId(), updatedAnniversaries);

      if (saveResponse.success) {
        setIsAdding(false);
        setNewTitle('');
        setNewDate('');
      } else {
        // 回滚
        setAnniversaries(anniversaries);
        Taro.showToast({
          title: saveResponse.error?.message || '保存失败',
          icon: 'error',
          duration: 2000
        });
      }
    } catch (error) {
      setAnniversaries(anniversaries);
      Taro.showToast({
        title: '添加纪念日失败',
        icon: 'error',
        duration: 2000
      });
      console.error(error);
    }
  };

  const handleEditConfirm = async () => {
    if (!editingId || !editingTitle || !editingDate) {
      Taro.showModal({
        title: '提示',
        content: '标题和日期不能为空',
        showCancel: false,
        confirmText: '我知道了'
      });
      return;
    }

    try {
      const updatedAnniversaries = anniversaries.map(item =>
        item.id === editingId
          ? {
            ...item,
            title: editingTitle,
            date: editingDate,
            icon: getIconByTitle(editingTitle)
          }
          : item
      );

      // 乐观更新
      setAnniversaries(updatedAnniversaries);

      const saveResponse = await anniversaryHandler.save(await getUserId(), updatedAnniversaries);

      if (!saveResponse.success) {
        // 回滚
        setAnniversaries(anniversaries);
        Taro.showToast({
          title: saveResponse.error?.message || '保存失败',
          icon: 'error',
          duration: 2000
        });
      } else {
        setEditingId(null);
      }
    } catch (error) {
      setAnniversaries(anniversaries);
      Taro.showToast({
        title: '更新纪念日失败',
        icon: 'error',
        duration: 2000
      });
      console.error(error);
    }
  };

  const getDateInfo = (targetDateStr: string) => {
    const targetDate = new Date(targetDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);

    const timeDiff = targetDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    const isPast = daysDiff < 0;
    const displayDays = Math.abs(daysDiff);

    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const weekday = weekdays[targetDate.getDay()];

    return { displayDays, isPast, weekday };
  };



  const renderCardContent = (item: MiniProgram.AnniversaryItem) => {
    const { displayDays, isPast, weekday } = getDateInfo(item.date);
    const displayTitle = getDisplayTitle(item.title, isPast);

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
          <Text className="card-title">{displayTitle}</Text>
          <Image
            className="edit-icon"
            src={editIcon}
            onClick={() => handleEditClick(item.id)}
          />
        </View>
        <View className="card-content">
          <Text className="days-number">{displayDays}</Text>
          <Text className="days-unit">天</Text>
        </View>
        <View className="card-footer">
          <Text className="date-text">{item.date}</Text>
          <Text className="weekday-text">{weekday}</Text>
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
      <Image className="background-image" src={"https://image.coldcoding.top/file/AgACAgQAAyEGAASUgNIDAAOqaAeqiyqHQg1izPovVgUlEaZvMw0AAkXEMRuA-UBQ1Sc0IjeFn-ABAAMCAAN5AAM2BA.jpg"} mode="aspectFill" />
      <View className="header">
        <Text className="header-title">期期•念念</Text>
        <View className="add-button" onClick={() => setIsAdding(true)}>
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

      {isLoading && (
        <View className="loading-overlay">
          <View className="loading-spinner" />
          <Text>加载中...</Text>
        </View>
      )}

      {anniversaries.length === 0 && !isAdding && !isLoading && (
        <View className="empty-state">
          <Image className="empty-icon" src={heartIcon} />
          <Text className="empty-text">暂无纪念日，点击右上角添加</Text>
        </View>
      )}
    </View>
  );
};

export default Index;