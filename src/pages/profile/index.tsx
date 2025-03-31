import Taro, { useState, useEffect } from '@tarojs/taro'
import { View, Text, Input, Button } from '@tarojs/components'
import './index.scss'

const FinancePage = () => {
  const [expenses, setExpenses] = useState<any[]>([])
  const [newAmount, setNewAmount] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [total, setTotal] = useState(0)

  useEffect(() => {
    // 模拟加载数据
    const mockData = [
      { id: 1, amount: 15.5, category: '餐饮', description: '午餐', date: '2023-05-01' },
      { id: 2, amount: 200, category: '交通', description: '地铁卡充值', date: '2023-05-02' }
    ]
    setExpenses(mockData)
    updateTotal(mockData)
  }, [])

  const updateTotal = (data: any[]) => {
    const sum = data.reduce((acc, item) => acc + Number(item.amount), 0)
    setTotal(sum)
  }

  const addExpense = () => {
    if (!newAmount || !newCategory) {
      Taro.showToast({ title: '请填写金额和类别', icon: 'none' })
      return
    }

    const now = new Date()
    const dateStr = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`

    const newItem = {
      id: Date.now(),
      amount: newAmount,
      category: newCategory,
      description: newDescription,
      date: dateStr
    }

    const newExpenses = [...expenses, newItem]
    setExpenses(newExpenses)
    updateTotal(newExpenses)
    setNewAmount('')
    setNewCategory('')
    setNewDescription('')
    Taro.showToast({ title: '添加成功', icon: 'success' })
  }

  const deleteExpense = (id: number) => {
    const newExpenses = expenses.filter(item => item.id !== id)
    setExpenses(newExpenses)
    updateTotal(newExpenses)
  }

  return (
    <View className='finance-page'>
      <View className='summary'>
        <Text>本月总支出: ¥{total.toFixed(2)}</Text>
      </View>

      <View className='add-form'>
        <Input
          type='number'
          placeholder='金额'
          value={newAmount}
          onInput={e => setNewAmount(e.detail.value)}
        />
        <Input
          placeholder='类别'
          value={newCategory}
          onInput={e => setNewCategory(e.detail.value)}
        />
        <Input
          placeholder='描述(可选)'
          value={newDescription}
          onInput={e => setNewDescription(e.detail.value)}
        />
        <Button onClick={addExpense}>记录支出</Button>
      </View>

      <View className='list'>
        {expenses.map(item => (
          <View key={item.id} className='item'>
            <View className='info'>
              <Text className='amount'>¥{item.amount}</Text>
              <Text className='category'>{item.category}</Text>
              {item.description && <Text className='description'>{item.description}</Text>}
              <Text className='date'>{item.date}</Text>
            </View>
            <Button size='mini' onClick={() => deleteExpense(item.id)}>删除</Button>
          </View>
        ))}
      </View>
    </View>
  )
}

export default FinancePage