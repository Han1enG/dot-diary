// src/pages/index/index.tsx
import { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
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
    date: '2025年04月02日',
    weekday: '星期三',
    greeting: '傍晚好，该下班啦～',
    relationshipDays: '6年8个月2天'
  }

  navigateTo = (page: string) => {
    Taro.navigateTo({
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
              <Text className='date-number'>20</Text>
              <View className='date-info'>
                <Text className='year-month'>{date.substring(0, 8)}</Text>
                <Text className='weekday'>{weekday}</Text>
              </View>
            </View>
            <Image className='emoji' src={kissIcon} />
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