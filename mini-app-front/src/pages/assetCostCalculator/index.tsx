import { View, Text, Image, Picker } from '@tarojs/components';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './index.scss';
import { AssetItem } from '@/models/asset';
import { formatServiceTime, formatCurrency, enrichAssetItem } from '@/utils/assetCalculations';
import { fetchAssetCost, saveAssetCost, getUserId } from '@/utils/cloud';
import Taro from '@tarojs/taro';

// 常量定义
const ICON_OPTIONS = [
  'yuan-circle', 'laptop', 'air-conditioner', 'smartphone', 'home',
  'car', 'desktop', 'electric-scooter', 'washing-machine', 'camera',
  'headphones', 'watch', 'bicycle', 'fridge', 'microwave'
];

// 接口定义
interface EditModalProps {
  item: AssetItem | null;
  isVisible: boolean;
  isNew: boolean;
  onClose: () => void;
  onSave: (item: AssetItem) => void;
  onDelete?: (id: string) => void;
}

interface SummaryCardProps {
  label: string;
  amount: number;
  description: string;
}

interface AssetItemCardProps {
  item: AssetItem;
  onClick: (item: AssetItem) => void;
}

// 拆分成小组件
const SummaryCard: React.FC<SummaryCardProps> = ({ label, amount, description }) => (
  <View className='summary-card'>
    <Text className='summary-label'>{label}</Text>
    <Text className='summary-amount'>{formatCurrency(amount)}</Text>
    <Text className='summary-description'>{description}</Text>
  </View>
);

const AssetItemCard: React.FC<AssetItemCardProps> = ({ item, onClick }) => {
  const handleClick = useCallback(() => onClick(item), [item, onClick]);

  return (
    <View
      className={`asset-item ${item.isRetired ? 'retired' : ''}`}
      onClick={handleClick}
    >
      <View className='asset-icon-container'>
        <Image className='asset-icon' src={require(`@/assets/icons/${item.icon}.png`)} />
        {item.isRetired && <View className='retired-badge'>已退役</View>}
      </View>
      <Text className='asset-name'>{item.name}</Text>
      <Text className='asset-price'>{formatCurrency(item.price)}</Text>
      <View className='asset-daily-container'>
        <Text className='asset-daily-cost'>{formatCurrency(item.dailyCost)}/天</Text>
        <Text className='separator'>·</Text>
        <Text className='asset-days'>{formatServiceTime(item.daysUsed)}</Text>
      </View>
      <View className='asset-purchase-info'>
        <Text className='asset-purchase-date'>购于 {item.purchaseDate}</Text>
      </View>
    </View>
  );
};

const IconSelector: React.FC<{
  selectedIcon: string;
  onChange: (icon: string) => void;
}> = ({ selectedIcon, onChange }) => (
  <View className='icon-selector'>
    {ICON_OPTIONS.map(iconName => (
      <View
        key={iconName}
        className={`icon-option ${selectedIcon === iconName ? 'selected' : ''}`}
        onClick={() => onChange(iconName)}
      >
        <Image className='icon-image' src={require(`@/assets/icons/${iconName}.png`)} />
      </View>
    ))}
  </View>
);

const EmptyState: React.FC<{ onAddClick: () => void }> = ({ onAddClick }) => (
  <View className='empty-state'>
    <Text className='empty-text'>暂无资产记录</Text>
    <button className='btn-add-first' onClick={onAddClick}>添加第一个资产</button>
  </View>
);

const EditModal: React.FC<EditModalProps> = ({
  item,
  isVisible,
  isNew,
  onClose,
  onSave,
  onDelete
}) => {
  const createDefaultAssetItem: AssetItem = {
    id: String(Date.now()),
    name: '',
    icon: 'yuan-circle',
    price: 0,
    purchaseDate: new Date().toISOString().split('T')[0],
    isRetired: false,
    daysUsed: 0,
    dailyCost: 0
  }

  const [editedItem, setEditedItem] = useState<AssetItem>(
    item || createDefaultAssetItem
  );

  useEffect(() => {
    if (item) {
      setEditedItem({ ...item });
    } else {
      setEditedItem(createDefaultAssetItem);
    }
  }, [item, isVisible]);

  if (!isVisible) return null;

  const handleChange = (field: keyof AssetItem, value: any) => {
    setEditedItem(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSave(enrichAssetItem(editedItem));
  };

  const handleDelete = () => {
    if (item && onDelete) {
      onDelete(item.id);
    }
  };

  const handleDateChange = (e: any) => {
    const { value } = e.detail;
    handleChange('purchaseDate', value);
  };

  return (
    <View className='modal-overlay'>
      <View className='modal-content'>
        <View className='modal-header'>
          <Text className='modal-title'>{isNew ? '添加新资产' : '编辑资产'}</Text>
          <Text className='modal-close' onClick={onClose}>×</Text>
        </View>

        <View className='modal-body'>
          <View className='form-group'>
            <Text className='form-label'>名称</Text>
            <input
              className='form-input'
              type='text'
              value={editedItem.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder='输入资产名称'
            />
          </View>

          <View className='form-group'>
            <Text className='form-label'>图标</Text>
            <IconSelector
              selectedIcon={editedItem.icon}
              onChange={(icon) => handleChange('icon', icon)}
            />
          </View>

          <View className='form-group'>
            <Text className='form-label'>价格 (¥)</Text>
            <input
              className='form-input'
              type='number'
              value={editedItem.price || ''}
              onChange={(e) => handleChange('price', Number(e.target.value) || 0)}
              placeholder='0.00'
            />
          </View>

          <View className='form-group'>
            <Text className='form-label'>购买日期</Text>
            <Picker mode='date' value={editedItem.purchaseDate} onChange={handleDateChange}>
              <View className='picker-value'>{editedItem.purchaseDate}</View>
            </Picker>
          </View>

          <View className='form-group checkbox-group'>
            <label className='checkbox-label'>
              <input
                type='checkbox'
                checked={editedItem.isRetired || false}
                onChange={(e) => handleChange('isRetired', e.target.checked)}
              />
              <Text className='checkbox-text'>已退役</Text>
            </label>
          </View>
        </View>

        <View className='modal-footer'>
          {!isNew && (
            <button
              className='btn btn-delete'
              onClick={handleDelete}
            >
              删除
            </button>
          )}
          <button className='btn btn-cancel' onClick={onClose}>取消</button>
          <button className='btn btn-save' onClick={handleSubmit}>保存</button>
        </View>
      </View>
    </View>
  );
};

const AssetCostCalculator: React.FC = () => {
  const [assetItems, setAssetItems] = useState<AssetItem[]>([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState<AssetItem | null>(null);
  const [isNewItem, setIsNewItem] = useState(false);
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // 初始化数据
  useEffect(() => {
    const init = async () => {
      try {
        const wxUserId = await getUserId();
        setUserId(wxUserId);
        await loadData(wxUserId);
      } catch (err) {
        Taro.showToast({
          title: '初始化失败',
          icon: 'error',
          duration: 2000
        });
        console.error(err);
      }
    }
    init();
  }, []);

  // 下拉刷新
  Taro.usePullDownRefresh(async () => {
    await syncData();
    Taro.stopPullDownRefresh();
  });

  // 加载数据
  const loadData = async (userId: string) => {
    try {
      setIsLoading(true);
      if (!userId) {
        throw new Error('用户ID未获取到');
      }
      const response = await fetchAssetCost(userId);
      if (response.success && response.data) {
        setAssetItems(response.data);
      } else {
        throw new Error(response.error?.message || '加载数据失败');
      }
    } catch (err) {
      Taro.showToast({
        title: err.message,
        icon: 'error',
        duration: 2000
      });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  // 同步数据
  const syncData = async () => {
    if (!userId) return;

    Taro.showLoading({ title: '同步中...' });
    try {
      const response = await fetchAssetCost(userId);
      if (response.success && response.data) {
        setAssetItems(response.data);
        Taro.showToast({ title: '同步成功', icon: 'success' });
      } else {
        throw new Error(response.error?.message || '同步失败');
      }
    } catch (error) {
      Taro.showToast({ title: error.message, icon: 'error' });
      console.error('同步失败:', error);
    } finally {
      Taro.hideLoading();
    }
  };

  // 使用 useMemo 计算总值和均值，避免重复计算
  const { totalAssets, dailyAverage, activeItemsCount } = useMemo(() => {
    const activeItems = assetItems.filter(item => !item.isRetired);
    return {
      totalAssets: activeItems.reduce((sum, item) => sum + item.price, 0),
      dailyAverage: activeItems.reduce((sum, item) => sum + item.dailyCost, 0),
      activeItemsCount: activeItems.length
    };
  }, [assetItems]);

  // 使用 useCallback 优化事件处理函数
  const handleAddClick = useCallback(() => {
    setCurrentItem(null);
    setIsNewItem(true);
    setEditModalVisible(true);
  }, []);

  const handleItemClick = useCallback((item: AssetItem) => {
    setCurrentItem(item);
    setIsNewItem(false);
    setEditModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setEditModalVisible(false);
  }, []);

  const handleSaveItem = useCallback(async (item: AssetItem) => {
    if (!item.name) {
      Taro.showToast({
        title: '名称不能为空',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    try {
      setIsLoading(true);
      const updatedAssetItems = [...assetItems.filter(i => i.id !== item.id), item];
      const saveResponse = await saveAssetCost(userId, updatedAssetItems);

      if (saveResponse.success) {
        setAssetItems(updatedAssetItems);
      } else {
        Taro.showToast({
          title: saveResponse.error?.message || '保存失败',
          icon: 'error',
          duration: 2000
        });
      }
    } catch (error) {
      Taro.showToast({
        title: '添加纪念日失败',
        icon: 'error',
        duration: 2000
      });
      console.error(error);
    } finally {
      setIsLoading(false);
      setEditModalVisible(false);

    }
  }, [isNewItem]);

  const handleDeleteItem = useCallback((id: string) => {
    setAssetItems(prev => prev.filter(item => item.id !== id));
    setEditModalVisible(false);
  }, []);

  return (
    <View className='asset-calculator-container'>
      <View className='header'>
        <View className='logo-container'>
          <Image className='logo' src={require('@/assets/icons/bowl-logo.png')} />
          <Text className='app-title'>资产成本计算器</Text>
        </View>
        <View className='header-buttons'>
          <View className='add-button' onClick={handleAddClick}>
            <Text className='add-icon'>+</Text>
            <Text className='add-text'>添加资产</Text>
          </View>
        </View>
      </View>

      <View className='summary-cards'>
        <SummaryCard
          label="总资产"
          amount={totalAssets}
          description="当前资产总值"
        />
        <SummaryCard
          label="日均成本"
          amount={dailyAverage}
          description="每天资产折旧成本"
        />
      </View>

      {assetItems.length === 0 ? (
        <EmptyState onAddClick={handleAddClick} />
      ) : (
        <>
          <View className='assets-grid'>
            {assetItems.map(item => (
              <AssetItemCard
                key={item.id}
                item={item}
                onClick={handleItemClick}
              />
            ))}
          </View>

          <View className='footer'>
            <Text className='footer-text'>共 {assetItems.length} 项资产，其中活跃 {activeItemsCount} 项</Text>
          </View>
        </>
      )}

      {isLoading && (
        <View className="loading-overlay">
          <View className="loading-spinner" />
          <Text>加载中...</Text>
        </View>
      )}

      <EditModal
        item={currentItem}
        isVisible={editModalVisible}
        isNew={isNewItem}
        onClose={handleCloseModal}
        onSave={handleSaveItem}
        onDelete={handleDeleteItem}
      />
    </View>
  );
};

export default AssetCostCalculator;