export default defineAppConfig({
  cloud: true, // 启用云开发
  entryPagePath: 'pages/index/index',
  pages: [
    'pages/index/index',
    'pages/blank/index',
    'pages/home/index',
    'pages/profile/index',
    'pages/expenses/index',
    'pages/assetCostCalculator/index',
    'pages/memorialDay/index',
  ],
  tabBar: {
    color: '#999',
    selectedColor: '#6190E8',
    backgroundColor: '#fff',
    list: [
      {
        pagePath: 'pages/home/index',
        iconPath: 'assets/tabbar/home.png',
        selectedIconPath: 'assets/tabbar/home-selected.png',
        text: '首页',
      },
      {
        pagePath: 'pages/profile/index',
        iconPath: 'assets/tabbar/profile.png',
        selectedIconPath: 'assets/tabbar/profile-selected.png',
        text: '我的',
      },
    ],
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '点滴',
    navigationBarTextStyle: 'black'
  },
  lazyCodeLoading: 'requiredComponents', // 按需引入，降低小程序的启动时间和运行时内存
})
