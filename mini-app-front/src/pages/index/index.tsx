// src/pages/index/index.tsx
import { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

// Import icons (you'll need to add these to your assets folder)
import cupIcon from '../../assets/icons/cup.png'
import calendarIcon from '../../assets/icons/calendar.png'
import moneyBagIcon from '../../assets/icons/money-bag.png'
import piggyBankIcon from '../../assets/icons/piggy-bank.png'
import calculatorIcon from '../../assets/icons/calculator.png'
import robotIcon from '../../assets/icons/robot.png'
import notepadIcon from '../../assets/icons/notepad.png'
import homeIcon from '../../assets/icons/home.png'
import momentIcon from '../../assets/icons/moment.png'
import myIcon from '../../assets/icons/my.png'
import dogIcon from '../../assets/icons/dog.png'
import catIcon from '../../assets/icons/cat.png'
import kissIcon from '../../assets/icons/kiss.png'

export default class Index extends Component {
  state = {
    date: '2025年04月02日',
    weekday: '星期三',
    greeting: '傍晚好，该下班啦～',
    relationshipDays: '已经6年8月2天'
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
            <Text>{greeting}</Text>
          </View>
          
          <View className='date-display'>
            <Text className='date-number'>20</Text>
            <View className='date-info'>
              <Text className='year-month'>{date.substring(0, 8)}</Text>
              <Text className='weekday'>{weekday}</Text>
            </View>
            <Image className='emoji' src={kissIcon} />
          </View>
        </View>

        {/* Relationship Timeline */}
        <View className='relationship-card'>
          <View className='relationship-info'>
            <Image className='avatar' src={dogIcon} />
            <Text className='nickname'>Cold</Text>
          </View>
          <View className='relationship-timeline'>
            <Text className='timeline-text'>第一次见面 ✨ {relationshipDays}</Text>
          </View>
          <View className='relationship-info'>
            <Image className='avatar' src={catIcon} />
            <Text className='nickname'>Tania</Text>
          </View>
        </View>

        {/* Function Grid */}
        <View className='function-grid'>
          {/* First Row */}
          <View className='function-item' onClick={() => this.navigateTo('calendar')}>
            <Image className='function-icon' src={calendarIcon} />
            <Text className='function-name'>纪念日</Text>
          </View>
          <View className='function-item' onClick={() => this.navigateTo('expenses')}>
            <Image className='function-icon' src={moneyBagIcon} />
            <Text className='function-name'>Cold的窝囊费</Text>
          </View>
          <View className='function-item' onClick={() => this.navigateTo('savings')}>
            <Image className='function-icon' src={piggyBankIcon} />
            <Text className='function-name'>存钱罐</Text>
          </View>

          {/* Second Row */}
          <View className='function-item' onClick={() => this.navigateTo('calculator')}>
            <Image className='function-icon' src={calculatorIcon} />
            <Text className='function-name'>算成本</Text>
          </View>
          <View className='function-item' onClick={() => this.navigateTo('assistant')}>
            <Image className='function-icon' src={robotIcon} />
            <Text className='function-name'>小精灵</Text>
          </View>
          <View className='function-item' onClick={() => this.navigateTo('notes')}>
            <Image className='function-icon' src={notepadIcon} />
            <Text className='function-name'>记事本</Text>
          </View>
        </View>

        {/* Tab Bar */}
        <View className='tab-bar'>
          <View className='tab-item active'>
            <Image className='tab-icon' src={homeIcon} />
            <Text className='tab-text'>Home</Text>
          </View>
          <View className='tab-item'>
            <Image className='tab-icon' src={momentIcon} />
            <Text className='tab-text'>Moment</Text>
          </View>
          <View className='tab-item'>
            <Image className='tab-icon' src={myIcon} />
            <Text className='tab-text'>My</Text>
          </View>
        </View>
      </View>
    )
  }
}