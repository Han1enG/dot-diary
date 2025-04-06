import cloud from 'wx-server-sdk'
cloud.init()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  return {
    openid: wxContext.OPENID,
    unionid: wxContext.UNIONID
  }
} 