import { View, Text, Image, Picker } from '@tarojs/components';
import React, { useState, useEffect } from 'react';
import './index.scss';

import dogIcon from '../../assets/icons/dog.png';
import bowlIcon from '../../assets/icons/bowl-logo.png';

interface AssetItem {
  id: string;
  name: string;
  icon: string;
  price: number;
  daysUsed: number;
  dailyCost: number;
  purchaseDate: string;
  isRetired?: boolean;
}

interface EditModalProps {
  item: AssetItem | null;
  isVisible: boolean;
  isNew: boolean;
  onClose: () => void;
  onSave: (item: AssetItem) => void;
  onDelete?: (id: string) => void;
}

// 计算工具函数
const calculateDaysUsed = (purchaseDate: string) => {
  const purchase = new Date(purchaseDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - purchase.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const calculateDailyCost = (price: number, daysUsed: number) => {
  return daysUsed > 0 ? price / daysUsed : 0;
};

const formatServiceTime = (days: number) => {
  const years = Math.floor(days / 365);
  const remainingDays = days % 365;
  if (years > 0) {
    return `${years}年${remainingDays}天`;
  }
  return `${days}天`;
};

const EditModal: React.FC<EditModalProps> = ({ item, isVisible, isNew, onClose, onSave, onDelete }) => {
  const [editedItem, setEditedItem] = useState<AssetItem>(
    item || {
      id: String(Date.now()),
      name: '',
      icon: 'yuan-circle',
      price: 0,
      daysUsed: 0,
      dailyCost: 0,
      purchaseDate: new Date().toISOString().split('T')[0]
    }
  );

  useEffect(() => {
    if (item) {
      const daysUsed = calculateDaysUsed(item.purchaseDate);
      const dailyCost = calculateDailyCost(item.price, daysUsed);
      setEditedItem({
        ...item,
        daysUsed,
        dailyCost
      });
    }
  }, [item]);

  if (!isVisible) return null;

  const handleChange = (field: keyof AssetItem, value: any) => {
    const updatedItem = { ...editedItem, [field]: value };

    // 如果修改了价格或购买日期，重新计算
    if (field === 'price' || field === 'purchaseDate') {
      const daysUsed = field === 'purchaseDate'
        ? calculateDaysUsed(value)
        : updatedItem.daysUsed;
      updatedItem.daysUsed = daysUsed;
      updatedItem.dailyCost = calculateDailyCost(
        field === 'price' ? value : updatedItem.price,
        daysUsed
      );
    }

    setEditedItem(updatedItem);
  };

  const handleSubmit = () => {
    // 确保保存前数据是最新的
    const daysUsed = calculateDaysUsed(editedItem.purchaseDate);
    const dailyCost = calculateDailyCost(editedItem.price, daysUsed);
    const finalItem = {
      ...editedItem,
      daysUsed,
      dailyCost
    };
    onSave(finalItem);
  };

  const handleDelete = () => {
    if (item && onDelete) {
      onDelete(item.id);
    }
  };

  const handleDateChange = (e) => {
    const { value } = e.detail;
    handleChange('purchaseDate', value);
  };

  const iconOptions = [
    'yuan-circle', 'laptop', 'air-conditioner', 'smartphone', 'home',
    'car', 'desktop', 'electric-scooter', 'washing-machine', 'camera',
    'headphones', 'watch', 'bicycle', 'fridge', 'microwave'
  ];

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
            <View className='icon-selector'>
              {iconOptions.map(iconName => (
                <View
                  key={iconName}
                  className={`icon-option ${editedItem.icon === iconName ? 'selected' : ''}`}
                  onClick={() => handleChange('icon', iconName)}
                >
                  <Image
                    className='icon-image'
                    src={`/assets/icons/${iconName}.png`}
                    mode='aspectFit'
                  />
                </View>
              ))}
            </View>
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

          <View className='form-group'>
            <Text className='form-label'>已使用天数</Text>
            <Text className='form-value'>{editedItem.daysUsed}天</Text>
          </View>

          <View className='form-group'>
            <Text className='form-label'>日均成本</Text>
            <Text className='form-value'>¥{editedItem.dailyCost.toFixed(2)}/天</Text>
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
  const [totalAssets, setTotalAssets] = useState(0);
  const [dailyAverage, setDailyAverage] = useState(0);

  const [assetItems, setAssetItems] = useState<AssetItem[]>([]);

  // 初始化数据
  useEffect(() => {
    const initialItems = [
      {
        id: '1',
        name: '车险',
        icon: 'yuan-circle',
        price: 2800.00,
        purchaseDate: '2024-12-25',
        isRetired: false
      },
      {
        id: '2',
        name: '笔记本电脑',
        icon: 'laptop',
        price: 5499.00,
        purchaseDate: '2024-10-18',
        isRetired: false
      },
      {
        id: '3',
        name: '小米空调',
        icon: 'air-conditioner',
        price: 1608.00,
        purchaseDate: '2024-08-15',
        isRetired: false
      },
      {
        id: '4',
        name: '手机',
        icon: 'smartphone',
        price: 2599.00,
        purchaseDate: '2024-03-11',
        isRetired: false
      },
      {
        id: '5',
        name: '房租每年',
        icon: 'home',
        price: 12000.00,
        purchaseDate: '2024-01-01',
        isRetired: true
      },
      {
        id: '6',
        name: '汽车',
        icon: 'car',
        price: 131500.00,
        purchaseDate: '2023-12-24',
        isRetired: false
      },
      {
        id: '7',
        name: '台式电脑',
        icon: 'desktop',
        price: 6499.00,
        purchaseDate: '2022-05-10',
        isRetired: false
      },
      {
        id: '8',
        name: '电动车',
        icon: 'electric-scooter',
        price: 3899.00,
        purchaseDate: '2022-01-01',
        isRetired: false
      },
      {
        id: '9',
        name: '洗衣机',
        icon: 'washing-machine',
        price: 888.00,
        purchaseDate: '2021-11-30',
        isRetired: false
      },
    ].map(item => {
      const daysUsed = calculateDaysUsed(item.purchaseDate);
      const dailyCost = calculateDailyCost(item.price, daysUsed);
      return {
        ...item,
        daysUsed,
        dailyCost
      };
    });

    setAssetItems(initialItems);
    recalculateTotals(initialItems);
  }, []);

  const recalculateTotals = (items: AssetItem[]) => {
    const activeItems = items.filter(item => !item.isRetired);
    const total = activeItems.reduce((sum, item) => sum + item.price, 0);
    const daily = activeItems.reduce((sum, item) => sum + item.dailyCost, 0);

    setTotalAssets(total);
    setDailyAverage(daily);
  };

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState<AssetItem | null>(null);
  const [isNewItem, setIsNewItem] = useState(false);

  const handleAddClick = () => {
    setCurrentItem(null);
    setIsNewItem(true);
    setEditModalVisible(true);
  };

  const handleItemClick = (item: AssetItem) => {
    setCurrentItem(item);
    setIsNewItem(false);
    setEditModalVisible(true);
  };

  const handleCloseModal = () => {
    setEditModalVisible(false);
  };

  const handleSaveItem = (item: AssetItem) => {
    let updatedItems: AssetItem[];

    if (isNewItem) {
      updatedItems = [...assetItems, item];
    } else {
      updatedItems = assetItems.map(existingItem =>
        existingItem.id === item.id ? item : existingItem
      );
    }

    setAssetItems(updatedItems);
    recalculateTotals(updatedItems);
    setEditModalVisible(false);
  };

  const handleDeleteItem = (id: string) => {
    const updatedItems = assetItems.filter(item => item.id !== id);
    setAssetItems(updatedItems);
    recalculateTotals(updatedItems);
    setEditModalVisible(false);
  };

  return (
    <View className='asset-calculator-container'>
      <View className='header'>
        <View className='logo-container'>
          <Image className='logo' src={bowlIcon} />
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
        <View className='summary-card'>
          <Text className='summary-label'>总资产</Text>
          <Text className='summary-amount'>¥{totalAssets.toFixed(2)}</Text>
          <Text className='summary-description'>当前资产总值</Text>
        </View>
        <View className='summary-card'>
          <Text className='summary-label'>日均成本</Text>
          <Text className='summary-amount'>¥{dailyAverage.toFixed(2)}</Text>
          <Text className='summary-description'>每天资产折旧成本</Text>
        </View>
      </View>

      <View className='assets-grid'>
        {assetItems.map(item => (
          <View
            key={item.id}
            className={`asset-item ${item.isRetired ? 'retired' : ''}`}
            onClick={() => handleItemClick(item)}
          >
            <View className='asset-icon-container'>
              <Image className='asset-icon' src={`../../assets/icons/${item.icon}.png`} />
              {item.isRetired && <View className='retired-badge'>已退役</View>}
            </View>
            <Text className='asset-name'>{item.name}</Text>
            <Text className='asset-price'>¥{item.price.toFixed(2)}</Text>
            <View className='asset-daily-container'>
              <Text className='asset-daily-cost'>¥{item.dailyCost.toFixed(2)}/天</Text>
              <Text className='separator'>·</Text>
              <Text className='asset-days'>{formatServiceTime(item.daysUsed)}</Text>
            </View>
            <View className='asset-purchase-info'>
              <Text className='asset-purchase-date'>购于 {item.purchaseDate}</Text>
            </View>
          </View>
        ))}
      </View>

      {assetItems.length === 0 && (
        <View className='empty-state'>
          <Text className='empty-text'>暂无资产记录</Text>
          <button className='btn-add-first' onClick={handleAddClick}>添加第一个资产</button>
        </View>
      )}

      {assetItems.length > 0 && (
        <View className='footer'>
          <Text className='footer-text'>共 {assetItems.length} 项资产</Text>
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