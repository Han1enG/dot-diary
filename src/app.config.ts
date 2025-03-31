export default {
  pages: [
    'pages/home/index',
    // 'pages/anniversary/index',
    // 'pages/finance/index',
    // 'pages/savings/index',
    // 'pages/notes/index',
    'pages/moment/index',
    'pages/profile/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '点滴',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#999',
    selectedColor: '#6190E8',
    backgroundColor: '#fff',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页',
        iconPath: 'assets/icons/home.png',
        selectedIconPath: 'assets/icons/home-active.png'
      },
      {
        pagePath: 'pages/moment/index',
        text: '动态',
        iconPath: 'assets/icons/moment.png',
        selectedIconPath: 'assets/icons/moment-active.png'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的',
        iconPath: 'assets/icons/profile.png',
        selectedIconPath: 'assets/icons/profile-active.png'
      }
    ]
  }
}