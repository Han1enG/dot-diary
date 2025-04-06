import type { PropsWithChildren } from 'react'
import { useLaunch } from '@tarojs/taro'
import './app.scss'

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    console.log('App launched.')

    // 初始化云开发
    if (process.env.TARO_ENV === 'weapp') {
      wx.cloud.init({
        env: 'cloud1-2gp4qa2icb69887f', // 替换为你的云环境ID
        traceUser: true // 记录用户访问
      })
      console.log('云开发初始化完成')
    }
  })

  // children 是将要会渲染的页面
  return children
}

export default App
