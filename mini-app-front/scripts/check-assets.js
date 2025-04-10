const fs = require('fs')
const path = require('path')

// 阈值配置（KB）
const THRESHOLDS = {
  WARNING: 100,
  ERROR: 200
}

// 文件类型统计
const stats = {
  total: 0,
  oversized: 0,
  byType: {}
}

function checkAssets(dir) {
  const files = fs.readdirSync(dir)
  
  files.forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    
    if (stat.isDirectory()) {
      checkAssets(filePath) // 递归检查子目录
      return
    }

    if (stat.isFile()) {
      const sizeKB = stat.size / 1024
      const ext = path.extname(file).toLowerCase()
      const type = ext.substring(1) || 'other'
      
      // 更新统计
      stats.total++
      stats.byType[type] = (stats.byType[type] || 0) + 1
      
      if (sizeKB > THRESHOLDS.WARNING) {
        stats.oversized++
        
        const message = `${filePath} (${sizeKB.toFixed(2)}KB)`
        if (sizeKB > THRESHOLDS.ERROR) {
          console.log(`🚨 超大文件: ${message}`)
        } else {
          console.log(`⚠️  大文件: ${message}`)
        }
      }
    }
  })
}

// 运行检查
console.log('🔍 开始检查资源文件...')

// 检查目录
const assetDirs = [
  path.resolve(__dirname, '../src/assets/images'),
  path.resolve(__dirname, '../src/assets/icons'),
  path.resolve(__dirname, '../src/assets/tabbar')
]

assetDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    checkAssets(dir)
  }
})

// 输出报告
console.log('\n📊 检查结果:')
console.log(`扫描文件总数: ${stats.total}`)
console.log(`超过${THRESHOLDS.WARNING}KB的文件: ${stats.oversized}`)

console.log('\n📁 按类型统计:')
Object.entries(stats.byType).forEach(([type, count]) => {
  console.log(`.${type}: ${count}个`)
})

console.log('\n✅ 检查完成\n')
