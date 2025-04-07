const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()

exports.main = async (event, context) => {
  const { collection, userId, data } = event

  try {
    // 先尝试更新
    const updateRes = await db.collection(collection)
      .doc(userId)
      .update({
        data: {
          items: data,
          updatedAt: db.serverDate()
        }
      })
    
    // 检查是否实际更新了文档
    if (updateRes.stats.updated > 0) {
      return { success: true, result: updateRes }
    }
    
    // 如果没有更新任何文档，尝试设置文档
    const setRes = await db.collection(collection)
      .doc(userId)
      .set({
        data: {
          items: data,
          createdAt: db.serverDate(),
          updatedAt: db.serverDate()
        }
      })
    
    return { success: true, result: setRes }
    
  } catch (error) {
    console.error('操作失败:', error)
    return { success: false, error }
  }
}