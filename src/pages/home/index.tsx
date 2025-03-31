import Taro, { useState, useEffect } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import './index.scss'

const HomePage = () => {
  const [currentDate, setCurrentDate] = useState('')
  const [greeting, setGreeting] = useState('')
  const [daysSinceFirstMeet, setDaysSinceFirstMeet] = useState('')

  useEffect(() => {
    // 设置当前日期
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    const day = now.getDate()
    const week = ['日', '一', '二', '三', '四', '五', '六'][now.getDay()]
    setCurrentDate(`${year}年${month}月${day}日 星期${week}`)

    // 设置问候语
    const hour = now.getHours()
    if (hour < 6) {
      setGreeting('凌晨好，注意休息~')
    } else if (hour < 9) {
      setGreeting('早上好，今天也要加油哦~')
    } else if (hour < 12) {
      setGreeting('上午好，工作顺利吗？')
    } else if (hour < 14) {
      setGreeting('中午好，记得吃午饭~')
    } else if (hour < 18) {
      setGreeting('下午好，保持专注~')
    } else if (hour < 22) {
      setGreeting('晚上好，该放松一下啦~')
    } else {
      setGreeting('夜深了，早点休息吧~')
    }

    // 计算第一次见面天数
    const firstMeetDate = new Date('2020-01-01') // 示例日期
    const diffTime = now.getTime() - firstMeetDate.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const years = Math.floor(diffDays / 365)
    const months = Math.floor((diffDays % 365) / 30)
    const days = diffDays % 30
    setDaysSinceFirstMeet(`已${years}年${months}月${days}天`)
  }, [])

  const navigateTo = (page: string) => {
    Taro.navigateTo({ url: `/pages/${page}/index` })
  }

  return (
    <View className='home-page'>
      <View className='header'>
        <Text className='date'>{currentDate}</Text>
        <Text className='greeting'>{greeting}</Text>
      </View>

      <View className='anniversary-card'>
        <Text className='title'>第一次见面</Text>
        <Text className='days'>{daysSinceFirstMeet}</Text>
      </View>

      <View className='features'>
        <View className='feature-item' onClick={() => navigateTo('anniversary')}>
          <Image className='icon' src={require('../../assets/icons/anniversary.png')} />
          <Text>纪念日</Text>
        </View>
        <View className='feature-item' onClick={() => navigateTo('finance')}>
          <Image className='icon' src={require('../../assets/icons/finance.png')} />
          <Text>窝囊费</Text>
        </View>
        <View className='feature-item' onClick={() => navigateTo('savings')}>
          <Image className='icon' src={require('../../assets/icons/savings.png')} />
          <Text>存钱罐</Text>
        </View>
        <View className='feature-item' onClick={() => navigateTo('notes')}>
          <Image className='icon' src={require('../../assets/icons/notes.png')} />
          <Text>记事本</Text>
        </View>
      </View>
    </View>
  )
}

export default HomePage