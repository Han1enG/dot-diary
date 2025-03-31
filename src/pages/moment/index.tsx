import Taro, { useState, useEffect } from '@tarojs/taro'
import { View, Text, Button, Input } from '@tarojs/components'
import './index.scss'

const AnniversaryPage = () => {
  const [anniversaries, setAnniversaries] = useState<any[]>([])
  const [newTitle, setNewTitle] = useState('')
  const [newDate, setNewDate] = useState('')

  useEffect(() => {
    // 模拟加载数据
    const mockData = [
      { id: 1, title: '第一次见面', date: '2020-01-01' },
      { id: 2, title: '结婚纪念日', date: '2021-05-20' }
    ]
    setAnniversaries(mockData)
  }, [])

  const addAnniversary = () => {
    if (!newTitle || !newDate) {
      Taro.showToast({ title: '请填写完整信息', icon: 'none' })
      return
    }

    const newItem = {
      id: Date.now(),
      title: newTitle,
      date: newDate
    }
    setAnniversaries([...anniversaries, newItem])
    setNewTitle('')
    setNewDate('')
    Taro.showToast({ title: '添加成功', icon: 'success' })
  }

  const deleteAnniversary = (id: number) => {
    setAnniversaries(anniversaries.filter(item => item.id !== id))
  }

  const calculateDays = (dateStr: string) => {
    const now = new Date()
    const date = new Date(dateStr)
    const diffTime = now.getTime() - date.getTime()
    return Math.floor(diffTime / (1000 * 60 * 60 * 24))
  }

  return (
    <View className='anniversary-page'>
      <View className='add-form'>
        <Input
          placeholder='纪念日名称'
          value={newTitle}
          onInput={e => setNewTitle(e.detail.value)}
        />
        <Input
          type='date'
          placeholder='选择日期'
          value={newDate}
          onInput={e => setNewDate(e.detail.value)}
        />
        <Button onClick={addAnniversary}>添加</Button>
      </View>

      <View className='list'>
        {anniversaries.map(item => (
          <View key={item.id} className='item'>
            <View className='info'>
              <Text className='title'>{item.title}</Text>
              <Text className='date'>{item.date}</Text>
              <Text className='days'>已{calculateDays(item.date)}天</Text>
            </View>
            <Button size='mini' onClick={() => deleteAnniversary(item.id)}>删除</Button>
          </View>
        ))}
      </View>
    </View>
  )
}

export default AnniversaryPage