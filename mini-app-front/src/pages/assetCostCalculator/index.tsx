import { View, Text, Image, Picker } from '@tarojs/components';
import React, { useState } from 'react';
import './index.scss';

import dogIcon from '../../assets/icons/dog.png'
import bowlIcon from '../../assets/icons/bowl-logo.png'

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
}

const EditModal: React.FC<EditModalProps> = ({ item, isVisible, isNew, onClose, onSave }) => {
  const [editedItem, setEditedItem] = useState<AssetItem>(
    item || {
      id: String(Date.now()),
      name: '',
      icon: 'default-icon',
      price: 0,
      daysUsed: 0,
      dailyCost: 0,
      purchaseDate: new Date().toISOString().split('T')[0]
    }
  );

  if (!isVisible) return null;

  const handleChange = (field: keyof AssetItem, value: any) => {
    const updatedItem = { ...editedItem, [field]: value };
    
    // Recalculate daily cost if price changes
    if (field === 'price' && updatedItem.daysUsed > 0) {
      updatedItem.dailyCost = Number(value) / updatedItem.daysUsed;
    }
    
    setEditedItem(updatedItem);
  };

  const handleSubmit = () => {
    onSave(editedItem);
  };

  const handleDateChange = (e) => {
    const { value } = e.detail;
    handleChange('purchaseDate', value);
  }

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
            />
          </View>
          
          <View className='form-group'>
            <Text className='form-label'>图标</Text>
            <View className='icon-selector'>
              {['yuan-circle', 'laptop', 'air-conditioner', 'smartphone', 'home', 'car', 'desktop', 'electric-scooter', 'washing-machine'].map(iconName => (
                <View 
                  key={iconName}
                  className={`icon-option ${iconName} ${editedItem.icon === iconName ? 'selected' : ''}`} 
                  onClick={() => handleChange('icon', iconName)}
                />
              ))}
            </View>
          </View>
          
          <View className='form-group'>
            <Text className='form-label'>价格 (¥)</Text>
            <input
              className='form-input'
              type='number'
              value={editedItem.price}
              onChange={(e) => handleChange('price', Number(e.target.value))}
            />
          </View>
          
          <View className='form-group'>
            <Text className='form-label'>购买日期</Text>
            <Picker mode='date' value={editedItem.purchaseDate} onChange={handleDateChange}>
              <View className='picker-value'>{editedItem.purchaseDate}</View>
            </Picker>
          </View>
          
          <View className='form-group'>
            <label className='checkbox-label'>
              <input
                type='checkbox'
                checked={editedItem.isRetired || false}
                onChange={(e) => handleChange('isRetired', e.target.checked)}
              />
              <Text>已退役</Text>
            </label>
          </View>
        </View>
        
        <View className='modal-footer'>
          <button className='btn-cancel' onClick={onClose}>取消</button>
          <button className='btn-save' onClick={handleSubmit}>保存</button>
        </View>
      </View>
    </View>
  );
};

const AssetCostCalculator: React.FC = () => {
  const [totalAssets, setTotalAssets] = useState(167292.00);
  const [dailyAverage, setDailyAverage] = useState(383.13);
  
  const [assetItems, setAssetItems] = useState<AssetItem[]>([
    {
      id: '1',
      name: '车险',
      icon: 'yuan-circle',
      price: 2800.00,
      daysUsed: 86,
      dailyCost: 32.56,
      purchaseDate: '2024-12-25'
    },
    {
      id: '2',
      name: '笔记本电脑',
      icon: 'laptop',
      price: 5499.00,
      daysUsed: 154,
      dailyCost: 35.71,
      purchaseDate: '2024-10-18'
    },
    {
      id: '3',
      name: '小米空调',
      icon: 'air-conditioner',
      price: 1608.00,
      daysUsed: 218,
      dailyCost: 7.38,
      purchaseDate: '2024-08-15'
    },
    {
      id: '4',
      name: '手机',
      icon: 'smartphone',
      price: 2599.00,
      daysUsed: 375,
      dailyCost: 6.93,
      purchaseDate: '2024-03-11'
    },
    {
      id: '5',
      name: '房租每年',
      icon: 'home',
      price: 12000.00,
      daysUsed: 0,
      dailyCost: 32.88,
      purchaseDate: '2024-01-01',
      isRetired: true
    },
    {
      id: '6',
      name: '汽车',
      icon: 'car',
      price: 131500.00,
      daysUsed: 453,
      dailyCost: 290.29,
      purchaseDate: '2023-12-24'
    },
    {
      id: '7',
      name: '台式电脑',
      icon: 'desktop',
      price: 6499.00,
      daysUsed: 1046,
      dailyCost: 6.21,
      purchaseDate: '2022-05-10'
    },
    {
      id: '8',
      name: '电动车',
      icon: 'electric-scooter',
      price: 3899.00,
      daysUsed: 1175,
      dailyCost: 3.32,
      purchaseDate: '2022-01-01'
    },
    {
      id: '9',
      name: '洗衣机',
      icon: 'washing-machine',
      price: 888.00,
      daysUsed: 1207,
      dailyCost: 0.74,
      purchaseDate: '2021-11-30'
    },
  ]);
  
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState<AssetItem | null>(null);
  const [isNewItem, setIsNewItem] = useState(false);
  
  const recalculateTotals = (items: AssetItem[]) => {
    const total = items.reduce((sum, item) => sum + item.price, 0);
    const daily = items.reduce((sum, item) => sum + item.dailyCost, 0);
    
    setTotalAssets(total);
    setDailyAverage(daily);
  };
  
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

  return (
    <View className='asset-calculator-container'>
      <View className='header'>
        <View className='logo-container'>
          <Image className='logo' src={bowlIcon} />
          <Text className='app-title'>享受美味的午餐时光 ~</Text>
        </View>
        <View className='header-buttons'>
          <Text className='nav-text'>Cold</Text>
          <Image className='animal-icon' src={dogIcon} />
          <View className='add-button' onClick={handleAddClick}>
            <Text className='add-icon'>+</Text>
            <Text className='add-text'>添加</Text>
          </View>
        </View>
      </View>
      
      <View className='summary-card'>
        <View className='asset-summary'>
          <Text className='summary-label'>我的资产</Text>
          <View className='summary-amount-container'>
            <Text className='summary-amount'>{totalAssets.toFixed(2)}</Text>
            <Text className='summary-currency'>总资产(¥)</Text>
          </View>
        </View>
        <View className='daily-summary'>
          <Text className='summary-label'>总日均</Text>
          <View className='summary-amount-container'>
            <Text className='summary-amount'>{dailyAverage.toFixed(2)}</Text>
            <Text className='summary-currency'>总日均(¥)</Text>
          </View>
        </View>
      </View>
      
      <View className='assets-grid'>
        {assetItems.map(item => (
          <View key={item.id} className='asset-item' onClick={() => handleItemClick(item)}>
            <View className='asset-icon-container'>
              <View className={`asset-icon ${item.icon}`}></View>
            </View>
            <Text className='asset-name'>{item.name}</Text>
            <Text className='asset-price'>¥ {item.price.toFixed(2)}</Text>
            <View className='asset-daily-container'>
              <Text className='asset-daily-cost'>¥{item.dailyCost.toFixed(2)}/天</Text>
              <Text className='separator'>|</Text>
              {item.isRetired ? (
                <Text className='asset-days'>服役1年0天</Text>
              ) : (
                <Text className='asset-days'>{item.daysUsed}天</Text>
              )}
            </View>
            <View className='asset-purchase-info'>
              <Text className='asset-purchase-label'>购:</Text>
              <Text className='asset-purchase-date'>{item.purchaseDate}</Text>
              {item.isRetired && <Text className='asset-retired'>已退役</Text>}
            </View>
          </View>
        ))}
      </View>
      
      <View className='footer'>
        <Text className='no-more-text'>没有更多了</Text>
      </View>
      
      <EditModal
        item={currentItem}
        isVisible={editModalVisible}
        isNew={isNewItem}
        onClose={handleCloseModal}
        onSave={handleSaveItem}
      />
    </View>
  );
};

export default AssetCostCalculator;