/// <reference types="@tarojs/taro" />

declare module '*.png'
declare module '*.gif'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.svg'
declare module '*.css'
declare module '*.less'
declare module '*.scss'
declare module '*.sass'
declare module '*.styl'

declare namespace NodeJS {
  interface ProcessEnv {
    /** NODE 内置环境变量, 会影响到最终构建生成产物 */
    NODE_ENV: 'development' | 'production'
    /** 当前构建的平台 */
    TARO_ENV: 'weapp' | 'swan' | 'alipay' | 'h5' | 'rn' | 'tt' | 'quickapp' | 'qq' | 'jd'
    /**
     * 当前构建的小程序 appid
     * @description 若不同环境有不同的小程序，可通过在 env 文件中配置环境变量`TARO_APP_ID`来方便快速切换 appid， 而不必手动去修改 dist/project.config.json 文件
     * @see https://taro-docs.jd.com/docs/next/env-mode-config#特殊环境变量-taro_app_id
     */
    TARO_APP_ID: string
  }
}

// 云相关
declare namespace Cloud {
  interface DataOperationResult<T> {
    success: boolean
    data?: T
    error?: any
  }

  interface SaveOperationResult {
    success: boolean
    error?: any
  }
}


// 基本类型
declare namespace MiniProgram {
  interface AnniversaryItem {
    id: string;
    title: string;  // 标题
    date: string;   // 保存目标日期（格式：YYYY-MM-DD）
    color: string;  // 卡片颜色
    icon: string;   // 图标路径
  }

  interface AssetItem {
    id: string;
    name: string;
    icon: string;
    price: number;
    daysUsed: number;
    dailyCost: number;
    purchaseDate: string;
    isRetired?: boolean;
  }

  interface EditModalProps {
    item: AssetItem | null;
    isVisible: boolean;
    isNew: boolean;
    onClose: () => void;
    onSave: (item: AssetItem) => void;
    onDelete?: (id: string) => void;
  }

  interface SummaryCardProps {
    label: string;
    amount: number;
    description: string;
  }

  interface AssetItemCardProps {
    item: AssetItem;
    onClick: (item: AssetItem) => void;
  }

  interface DataLoaderOptions<T> {
    fetchHandler: (userId: string) => Promise<Cloud.DataOperationResult<T>>
    onSuccess?: (data: T) => void
    onError?: (error: any) => void
    autoLoad?: boolean
    showLoading?: boolean
  }
}