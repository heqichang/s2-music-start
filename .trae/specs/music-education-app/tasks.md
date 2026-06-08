# 音乐启蒙教育软件 - 实施计划

## [x] Task 1: 项目初始化与基础框架搭建
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 使用 Vite + React + TypeScript 初始化项目
  - 配置 ESLint、Prettier 等代码规范工具
  - 配置路由（React Router）
  - 设置基础样式体系（CSS Modules 或 styled-components）
  - 建立目录结构：components、pages、hooks、utils、assets 等
- **Acceptance Criteria Addressed**: [AC-6, AC-7]
- **Test Requirements**:
  - `programmatic` TR-1.1: 项目可正常启动，dev server 运行正常
  - `programmatic` TR-1.2: TypeScript 编译无错误
  - `human-judgement` TR-1.3: 目录结构清晰，模块划分合理
- **Notes**: 使用 pnpm 作为包管理器

## [x] Task 2: 音频引擎核心模块开发
- **Priority**: P0
- **Depends On**: [Task 1]
- **Description**: 
  - 基于 Web Audio API 封装音频引擎核心类
  - 实现音符播放功能（支持不同音高、不同时长）
  - 实现多种乐器音色合成（钢琴、小提琴、吉他、笛子、小号等）
  - 实现鼓组音色（底鼓、军鼓、踩镲等）
  - 实现音量/力度控制
  - 提供统一的音频播放 API
- **Acceptance Criteria Addressed**: [AC-1, AC-2, AC-3, AC-4, AC-5, AC-8]
- **Test Requirements**:
  - `programmatic` TR-2.1: 音频引擎可正常初始化，无报错
  - `programmatic` TR-2.2: 可播放不同音高的音符，音高准确
  - `programmatic` TR-2.3: 可切换不同乐器音色，音色有明显区分
  - `programmatic` TR-2.4: 音量控制正常，力度变化可感知
  - `human-judgement` TR-2.5: 音色自然，无明显杂音或爆音
- **Notes**: 优先使用 Web Audio API 合成音色，避免加载外部音频文件

## [x] Task 3: 应用首页与导航框架
- **Priority**: P0
- **Depends On**: [Task 1]
- **Description**: 
  - 设计并实现首页布局，展示 5 个功能模块入口
  - 设计卡通风格的模块图标
  - 实现页面路由跳转和返回导航
  - 实现全局导航栏/返回按钮
  - 配置基础主题配色（明亮活泼的儿童风格）
  - 实现页面切换过渡动画
- **Acceptance Criteria Addressed**: [AC-6, AC-7]
- **Test Requirements**:
  - `programmatic` TR-3.1: 首页正常渲染，5 个模块入口可点击跳转
  - `programmatic` TR-3.2: 路由跳转正常，每个页面可正常返回首页
  - `human-judgement` TR-3.3: 首页视觉效果符合儿童审美，色彩明亮活泼
  - `human-judgement` TR-3.4: 导航操作直观简单，无需说明即可上手
- **Notes**: 图标可使用 SVG 或 emoji，保持风格统一

## [x] Task 4: 高低音辨别游戏开发
- **Priority**: P0
- **Depends On**: [Task 2, Task 3]
- **Description**: 
  - 实现游戏主界面：播放按钮、答案选项、得分显示
  - 实现题目生成逻辑：随机生成两个或多个音高对比题
  - 实现多种难度模式：简单（2 音对比）、中等（3 音排序）、困难（音程识别）
  - 实现答题判定逻辑：判断用户选择是否正确
  - 实现即时反馈动画：答对绿色鼓励，答错显示正确答案
  - 实现计分系统和结束结算界面
  - 实现重玩功能
- **Acceptance Criteria Addressed**: [AC-1]
- **Test Requirements**:
  - `programmatic` TR-4.1: 游戏可正常开始，音频播放正常
  - `programmatic` TR-4.2: 答案判断逻辑正确，得分计算准确
  - `programmatic` TR-4.3: 10 道题后正确显示结算界面
  - `programmatic` TR-4.4: 可重新开始游戏
  - `human-judgement` TR-4.5: 反馈动画流畅有趣，符合儿童审美
- **Notes**: 音高差异在初级模式要明显，高级模式可缩小差距

## [x] Task 5: 节奏模仿游戏开发
- **Priority**: P0
- **Depends On**: [Task 2, Task 3]
- **Description**: 
  - 实现节奏播放功能：按预设节奏型播放鼓点
  - 实现视觉节拍提示：节拍下落动画或闪烁提示
  - 实现用户输入检测：监听点击/敲击/按键
  - 实现节奏准确度判定算法：计算时间差，分级评价（完美/不错/太早/太晚）
  - 实现即时反馈：每次敲击显示评价
  - 实现多种节奏型：从简单到复杂 3-5 种
  - 实现总分计算和星级评价
  - 实现难度选择界面
- **Acceptance Criteria Addressed**: [AC-2, AC-8]
- **Test Requirements**:
  - `programmatic` TR-5.1: 节奏播放准确，节拍稳定
  - `programmatic` TR-5.2: 点击检测响应及时（延迟 < 100ms）
  - `programmatic` TR-5.3: 准确度判定逻辑正确，分级合理
  - `programmatic` TR-5.4: 最终得分计算正确
  - `human-judgement` TR-5.5: 视觉节拍提示清晰，节奏感强
- **Notes**: 判定容差：完美 ±50ms，不错 ±100ms

## [x] Task 6: 乐器音色识别游戏开发
- **Priority**: P1
- **Depends On**: [Task 2, Task 3]
- **Description**: 
  - 实现 6 种乐器音色（钢琴、小提琴、吉他、鼓、笛子、小号）
  - 实现乐器图标展示和选择交互
  - 实现题目生成：随机选择乐器，从 4 个选项中选择正确答案
  - 实现答题判定和反馈
  - 实现计分系统和结算界面
  - 实现乐器图鉴功能：可单独试听每种乐器
  - 实现重玩功能
- **Acceptance Criteria Addressed**: [AC-3]
- **Test Requirements**:
  - `programmatic` TR-6.1: 6 种乐器音色均可正常播放
  - `programmatic` TR-6.2: 答案判断正确，计分准确
  - `programmatic` TR-6.3: 乐器图鉴可正常浏览和试听
  - `human-judgement` TR-6.4: 乐器音色区分度明显，易于辨认
  - `human-judgement` TR-6.5: 乐器图标清晰可识别
- **Notes**: 鼓组可播放一段简单节奏作为辨识依据

## [x] Task 7: 力度强弱可视化探索开发
- **Priority**: P1
- **Depends On**: [Task 2, Task 3]
- **Description**: 
  - 实现三种力度等级：强(f)、中(mf)、弱(p)
  - 实现波形可视化：使用 Canvas 绘制实时波形，振幅随力度变化
  - 实现粒子效果：力度越强粒子越多、飞得越高
  - 实现力度切换交互：按钮或滑块切换
  - 实现对应力度的音符播放
  - 实现 f/mf/p 力度标记说明
- **Acceptance Criteria Addressed**: [AC-4]
- **Test Requirements**:
  - `programmatic` TR-7.1: 三种力度等级音频音量差异明显
  - `programmatic` TR-7.2: 波形振幅随力度变化正确
  - `programmatic` TR-7.3: 粒子效果数量和高度随力度变化
  - `human-judgement` TR-7.4: 视觉效果直观体现力度差异
  - `human-judgement` TR-7.5: 视听结合效果好，有助于理解力度概念
- **Notes**: 可加入动态背景效果增强沉浸感

## [x] Task 8: 虚拟钢琴开发
- **Priority**: P1
- **Depends On**: [Task 2, Task 3]
- **Description**: 
  - 实现两个八度的钢琴键盘界面（白键 + 黑键）
  - 实现鼠标点击演奏
  - 实现电脑键盘演奏（对应键位映射）
  - 支持多键同时按下（和弦）
  - 实现按键视觉反馈（按下高亮）
  - 实现钢琴音色
  - 响应式适配不同屏幕尺寸
- **Acceptance Criteria Addressed**: [AC-5, AC-7]
- **Test Requirements**:
  - `programmatic` TR-8.1: 所有琴键可正常发声，音高准确
  - `programmatic` TR-8.2: 鼠标点击响应及时，延迟 < 100ms
  - `programmatic` TR-8.3: 键盘按键映射正确，支持多键同时按下
  - `programmatic` TR-8.4: 按键视觉反馈正常
  - `human-judgement` TR-8.5: 钢琴界面美观，黑白键比例正确
- **Notes**: 可显示/隐藏键盘按键提示

## [x] Task 9: 虚拟鼓垫开发
- **Priority**: P1
- **Depends On**: [Task 2, Task 3]
- **Description**: 
  - 实现 6 个鼓垫界面（底鼓、军鼓、踩镲、嗵鼓、叮叮镲、牛铃）
  - 实现鼠标点击/触屏敲击演奏
  - 实现电脑键盘演奏
  - 实现敲击视觉反馈（缩放/变色动画）
  - 实现各鼓组音色
  - 响应式布局适配
- **Acceptance Criteria Addressed**: [AC-5, AC-7]
- **Test Requirements**:
  - `programmatic` TR-9.1: 所有鼓垫可正常发声
  - `programmatic` TR-9.2: 点击响应及时，延迟 < 100ms
  - `programmatic` TR-9.3: 支持多个鼓垫同时触发
  - `programmatic` TR-9.4: 敲击视觉反馈正常
  - `human-judgement` TR-9.5: 鼓垫界面直观，布局合理
- **Notes**: 鼓垫可设计成彩色圆形，增加趣味性

## [x] Task 10: 整体优化与测试
- **Priority**: P1
- **Depends On**: [Task 4, Task 5, Task 6, Task 7, Task 8, Task 9]
- **Description**: 
  - 整体 UI 风格统一和细节优化
  - 性能优化：减少不必要的重渲染，优化动画性能
  - 响应式适配测试：桌面端、平板端
  - 浏览器兼容性测试：Chrome、Firefox、Safari、Edge
  - 增加操作指引/帮助说明
  - 增加音效反馈（按钮点击、得分等）
  - 修复已知 bug
  - 构建生产版本验证
- **Acceptance Criteria Addressed**: [AC-6, AC-7, AC-8]
- **Test Requirements**:
  - `programmatic` TR-10.1: 生产构建无错误
  - `programmatic` TR-10.2: 首屏加载时间 < 3s
  - `programmatic` TR-10.3: 主要功能在 Chrome/Firefox/Safari/Edge 均正常
  - `human-judgement` TR-10.4: 整体界面风格统一，视觉效果良好
  - `human-judgement` TR-10.5: 操作流畅，无明显卡顿或延迟
- **Notes**: 可使用 Lighthouse 进行性能评估
