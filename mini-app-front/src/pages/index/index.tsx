// src/pages/index/index.tsx
import { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { navigateTo } from '@tarojs/taro'
import './index.scss'

// Import icons
import cupIcon from '../../assets/icons/cup.png'
import calendarIcon from '../../assets/icons/calendar.png'
import calculatorIcon from '../../assets/icons/calculator.png'
import homeIcon from '../../assets/icons/home.png'
import myIcon from '../../assets/icons/my.png'
import dogIcon from '../../assets/icons/dog.png'
import catIcon from '../../assets/icons/cat.png'
import kissIcon from '../../assets/icons/kiss.png'

export default class Index extends Component {
  state = {
    date: '',
    weekday: '',
    greeting: '',
    relationshipDays: ''
  }

   // 定时器变量
   updateInterval: NodeJS.Timeout | null = null

   componentDidMount() {
     // 立即更新一次
     this.updateData()
     // 设置每分钟更新一次的定时器
     this.updateInterval = setInterval(this.updateData, 60000)
   }

   componentWillUnmount() {
    // 组件卸载时清除定时器
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
    }
  }

  updateData = () => {
    this.updateDateTime()
    this.setGreeting()
    this.calculateRelationshipDays()
  }

  updateDateTime = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    const day = now.getDate()
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    
    this.setState({
      date: `${year}年${month}月${day}日`,
      weekday: weekdays[now.getDay()]
    })
  }

  setGreeting = () => {
    const hour = new Date().getHours()
    let greeting = ''
    
    if (hour >= 5 && hour < 11) {
      greeting = '早上好，今天也要加油哦～'
    } else if (hour >= 11 && hour < 13) {
      greeting = '中午好，记得吃午饭～'
    } else if (hour >= 13 && hour < 18) {
      greeting = '下午好，工作辛苦了～'
    } else if (hour >= 18 && hour < 23) {
      greeting = '傍晚好，该下班啦～'
    } else {
      greeting = '夜深了，早点休息吧～'
    }
    
    this.setState({ greeting })
  }

  calculateRelationshipDays = () => {
    const startDate = new Date(2018, 7, 30) // 修改为你的实际恋爱开始日期
    const now = new Date()
    
    let years = now.getFullYear() - startDate.getFullYear()
    let months = now.getMonth() - startDate.getMonth()
    let days = now.getDate() - startDate.getDate()
    
    if (days < 0) {
      months--
      const lastDayOfLastMonth = new Date(
        now.getFullYear(),
        now.getMonth(),
        0
      ).getDate()
      days += lastDayOfLastMonth
    }
    
    if (months < 0) {
      years--
      months += 12
    }
    
    this.setState({
      relationshipDays: `${years}年${months}个月${days}天`
    })
  }

  navigateTo = (page: string) => {
    navigateTo({
      url: `/pages/${page}/index`
    })
  }

  render() {
    const { date, weekday, greeting, relationshipDays } = this.state
    
    return (
      <View className='index-page'>
        {/* Header Section */}
        <View className='header'>
          <View className='greeting'>
            <Image className='cup-icon' src={cupIcon} />
            <Text className='greeting-text'>{greeting}</Text>
          </View>
          
          <View className='date-display'>
            <View className='date-left'>
              <Text className='date-number'>{date.match(/\d+/g)?.map(Number)[2]}</Text>
              <View className='date-info'>
                <Text className='year-month'>{date.match(/\d+/g)?.map(Number)[0]}年{date.match(/\d+/g)?.map(Number)[1]}月</Text>
                <Text className='weekday'>{weekday}</Text>
              </View>
            </View>
            <Image className='emoji' src="https://image.coldcoding.top/file/AgACAgQAAyEGAASUgNIDAAOraAewznHY_7t1510dj_nGJh4dZQQAAlDEMRuA-UBQBlVO2P2bmI4BAAMCAANtAAM2BA.jpg" />
          </View>
        </View>

        {/* Relationship Timeline */}
        <View className='relationship-card'>
          <View className='couple-display'>
            <View className='person'>
              <Image className='avatar' src={dogIcon} />
              <Text className='nickname'>Cold</Text>
            </View>
            <Text className='heart'>❤</Text>
            <View className='person'>
              <Image className='avatar' src={catIcon} />
              <Text className='nickname'>Tania</Text>
            </View>
          </View>
          
          <View className='relationship-timeline'>
            <Text className='timeline-text'>相伴 {relationshipDays}</Text>
            <View className='timeline-bar'></View>
          </View>
        </View>

        {/* Function Grid */}
        <View className='function-grid'>
          <View className='function-item' onClick={() => this.navigateTo('memorialDay')}>
            <View className='icon-container'>
              <Image className='function-icon' src={calendarIcon} />
            </View>
            <Text className='function-name'>纪念日</Text>
          </View>

          <View className='function-item' onClick={() => this.navigateTo('assetCostCalculator')}>
            <View className='icon-container'>
              <Image className='function-icon' src={calculatorIcon} />
            </View>
            <Text className='function-name'>算成本</Text>
          </View>
        </View>

        {/* Tab Bar */}
        <View className='tab-bar'>
          <View className='tab-item active'>
            <Image className='tab-icon' src={homeIcon} />
            <Text className='tab-text'>首页</Text>
          </View>
          <View className='tab-item'>
            <Image className='tab-icon' src={myIcon} />
            <Text className='tab-text'>我的</Text>
          </View>
        </View>
      </View>
    )
  }
}   