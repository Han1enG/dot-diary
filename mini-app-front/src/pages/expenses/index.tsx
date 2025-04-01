// src/pages/expenses/index.tsx
import { Component } from 'react'
import { View, Text, Input, Button, Picker } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

interface Expense {
  id: number;
  date: string;
  amount: number;
  category: string;
  description: string;
}

export default class Expenses extends Component {
  state = {
    expenses: [] as Expense[],
    newExpense: {
      date: this.formatDate(new Date()),
      amount: '',
      category: '日常开销',
      description: ''
    },
    categories: ['日常开销', '餐饮', '购物', '交通', '娱乐', '其他']
  }

  componentDidMount() {
    // Load expenses from storage when component mounts
    const expenses = Taro.getStorageSync('expenses') || []
    this.setState({ expenses })
  }

  formatDate(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  handleInputChange = (field: string, value: any) => {
    this.setState({
      newExpense: {
        ...this.state.newExpense,
        [field]: value
      }
    })
  }

  handleCategoryChange = (e) => {
    const { value } = e.detail
    this.handleInputChange('category', this.state.categories[value])
  }

  handleDateChange = (e) => {
    const { value } = e.detail
    this.handleInputChange('date', value)
  }

  addExpense = () => {
    const { newExpense, expenses } = this.state
    
    // Validate inputs
    if (!newExpense.amount || !newExpense.description) {
      Taro.showToast({
        title: '请填写金额和描述',
        icon: 'none'
      })
      return
    }
    
    // Create new expense object
    const expense: Expense = {
      id: Date.now(),
      date: newExpense.date,
      amount: parseFloat(newExpense.amount as string),
      category: newExpense.category,
      description: newExpense.description
    }
    
    // Add to expenses array
    const updatedExpenses = [...expenses, expense]
    
    // Update state and storage
    this.setState({
      expenses: updatedExpenses,
      newExpense: {
        date: this.formatDate(new Date()),
        amount: '',
        category: '日常开销',
        description: ''
      }
    })
    
    Taro.setStorageSync('expenses', updatedExpenses)
    
    Taro.showToast({
      title: '添加成功',
      icon: 'success'
    })
  }

  calculateTotal(): number {
    return this.state.expenses.reduce((sum, expense) => sum + expense.amount, 0)
  }

  render() {
    const { expenses, newExpense, categories } = this.state
    
    return (
      <View className='expenses-page'>
        <View className='header'>
          <Text className='title'>Cold的窝囊费</Text>
          <Text className='subtitle'>总支出: ¥{this.calculateTotal().toFixed(2)}</Text>
        </View>
        
        <View className='expense-form'>
          <View className='form-group'>
            <Text className='label'>日期</Text>
            <Picker mode='date' value={newExpense.date} onChange={this.handleDateChange}>
              <View className='picker-value'>{newExpense.date}</View>
            </Picker>
          </View>
          
          <View className='form-group'>
            <Text className='label'>金额</Text>
            <Input
              className='input'
              type='digit'
              placeholder='请输入金额'
              value={newExpense.amount as string}
              onInput={(e) => this.handleInputChange('amount', e.detail.value)}
            />
          </View>
          
          <View className='form-group'>
            <Text className='label'>类别</Text>
            <Picker mode='selector' range={categories} onChange={this.handleCategoryChange}>
              <View className='picker-value'>{newExpense.category}</View>
            </Picker>
          </View>
          
          <View className='form-group'>
            <Text className='label'>描述</Text>
            <Input
              className='input'
              placeholder='请输入描述'
              value={newExpense.description}
              onInput={(e) => this.handleInputChange('description', e.detail.value)}
            />
          </View>
          
          <Button className='submit-btn' onClick={this.addExpense}>添加支出</Button>
        </View>
        
        <View className='expense-list'>
          <Text className='list-title'>支出记录</Text>
          {expenses.length === 0 ? (
            <View className='empty-state'>
              <Text>暂无支出记录</Text>
            </View>
          ) : (
            expenses.map(expense => (
              <View className='expense-item' key={expense.id}>
                <View className='expense-details'>
                  <Text className='expense-description'>{expense.description}</Text>
                  <Text className='expense-category'>{expense.category}</Text>
                  <Text className='expense-date'>{expense.date}</Text>
                </View>
                <Text className='expense-amount'>¥{expense.amount.toFixed(2)}</Text>
              </View>
            ))
          )}
        </View>
      </View>
    )
  }
}