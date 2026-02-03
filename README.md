# V2EX 主题正文 Contenteditable 脚本

一个 Tampermonkey 用户脚本，用于在 v2ex 站点启用主题正文内容的 `contenteditable` 属性，方便用户调整文本排版。

## ✨ 功能特性

- 🎯 **悬停显示编辑按钮**：鼠标悬停在正文区域时，右上角显示"编辑"按钮
- ✏️ **一键启用编辑**：点击按钮后启用 `contenteditable` 属性，可直接编辑文本
- 🎨 **优雅的交互**：按钮淡入淡出动画，编辑状态视觉反馈
- 🌓 **主题适配**：自动检测 v2ex 的亮色/暗色主题并适配按钮样式
- 🛡️ **错误处理**：完善的错误处理和边界情况检查
- 📱 **无依赖**：纯原生 JavaScript 实现，无需任何外部库

## 📦 安装方法

### 1. 安装 Tampermonkey

首先需要安装 Tampermonkey 浏览器扩展：

- **Chrome/Edge**: [Chrome Web Store](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
- **Firefox**: [Firefox Add-ons](https://addons.mozilla.org/firefox/addon/tampermonkey/)
- **Safari**: [App Store](https://apps.apple.com/app/tampermonkey/id1482490089)

### 2. 安装脚本

#### 方法一：从 GreasyFork 安装（推荐）

1. **访问 GreasyFork**
   - 打开 [GreasyFork 官网](https://greasyfork.org/zh-CN)
   - 在搜索框中输入：`V2EX 主题正文 Contenteditable 脚本`
   - 或直接搜索：`V2EX 正文排版调整`

2. **安装脚本**
   - 找到对应的脚本页面
   - 点击页面上的"安装此脚本"按钮
   - Tampermonkey 会自动弹出安装确认对话框
   - 点击"安装"完成安装

3. **优势**
   - 自动更新：脚本更新后会自动提示更新
   - 版本管理：可以查看脚本的更新历史
   - 社区支持：可以查看其他用户的评论和反馈

#### 方法二：手动安装

1. **打开 Tampermonkey 控制面板**
   - 点击浏览器工具栏中的 Tampermonkey 图标
   - 选择"管理面板"或"Dashboard"

2. **创建新脚本**
   - 点击"添加新脚本"或"+"按钮
   - 会打开一个新的脚本编辑页面

3. **复制脚本内容**
   - 打开项目中的 `v2ex-content-editable.user.js` 文件
   - 全选并复制所有内容（Ctrl+A 然后 Ctrl+C / Cmd+A 然后 Cmd+C）

4. **粘贴到编辑器**
   - 在 Tampermonkey 编辑器中，删除默认的示例代码
   - 粘贴刚才复制的脚本内容（Ctrl+V / Cmd+V）

5. **保存脚本**
   - 点击编辑器上方的"文件" → "保存"
   - 或使用快捷键：Ctrl+S（Windows/Linux）或 Cmd+S（Mac）
   - 保存后会自动关闭编辑器

#### 方法三：从文件安装

1. 打开 Tampermonkey 控制面板
2. 点击"实用工具"标签页
3. 在"从文件安装"部分，点击"选择文件"
4. 选择项目中的 `v2ex-content-editable.user.js` 文件
5. 脚本会自动安装并打开编辑器，确认后保存即可

## 🚀 使用方法

1. 访问任意 v2ex 主题页面（URL 格式：`https://www.v2ex.com/t/xxxxx`）
2. 将鼠标悬停在主题正文区域
3. 右上角会出现"编辑"按钮
4. 点击"编辑"按钮启用编辑模式
5. 编辑完成后，点击"完成"按钮或点击页面其他区域退出编辑

## 📋 注意事项

1. **编辑内容不会保存**：此脚本仅用于临时调整文本排版，编辑内容不会保存到服务器
2. **刷新页面会丢失**：刷新页面后，编辑内容会恢复为原始内容
3. **仅限正文区域**：脚本仅对主题正文内容生效，不包括标题和回复
4. **仅限查看模式**：脚本只在查看帖子时生效，不会影响编辑帖子页面

## 🔧 技术实现

### 核心功能

- **元素定位**：使用多个选择器按优先级查找正文容器
  - `.topic_content`
  - `#Main .box .inner`
  - `.box .inner`
  - `.topic_content .inner`

- **按钮创建**：动态创建编辑按钮并定位到容器右上角

- **事件处理**：监听鼠标悬停、点击事件，管理编辑状态

- **样式管理**：动态注入 CSS 样式，支持亮色/暗色主题适配

- **主题检测**：通过检测 `#Wrapper` 元素是否有 `Night` 类来判断暗色模式

### 选择器配置

如果页面结构发生变化，可以修改脚本中的 `CONFIG.contentSelectors` 配置：

```javascript
const CONFIG = {
    contentSelectors: [
        '.topic_content',
        '#Main .box .inner',
        '.box .inner',
        '.topic_content .inner'
    ],
    buttonClass: 'v2ex-edit-btn',
    editingClass: 'v2ex-editing'
};
```

## 📁 项目结构

```
v2post-content-editable/
├── v2ex-content-editable.user.js    # 主脚本文件
├── README.md                         # 项目说明文档
└── .gitignore                        # Git 忽略文件
```

## 🛠️ 开发说明

### 自定义配置

可以在脚本的 `CONFIG` 对象中修改以下配置：

- `contentSelectors`: 正文容器选择器列表
- `buttonClass`: 编辑按钮的 CSS 类名
- `editingClass`: 编辑状态的 CSS 类名

### 调试

如果脚本无法正常工作，可以：

1. 打开浏览器开发者工具（F12）
2. 查看控制台（Console）中的错误信息
3. 检查脚本是否已启用（Tampermonkey 控制面板）
4. 确认页面 URL 匹配脚本的 `@match` 规则

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 🔗 相关链接

- [Tampermonkey 官方文档](https://www.tampermonkey.net/documentation.php)
- [V2EX 官网](https://www.v2ex.com)
- [contenteditable API 文档](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes/contenteditable)
