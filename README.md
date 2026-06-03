# 🎨 CAPlayground · 中文版

> **二改声明**：本仓库基于 [CAPlayground/CAPlayground](https://github.com/CAPlayground/CAPlayground) 进行中文汉化与本地化适配。
>
> 原项目是一个开源的 Web 端 Core Animation 壁纸编辑器，用于为 iOS/iPadOS 创建动态壁纸。
> 本版本在原版基础上进行了完整的界面汉化。

---

## 与原版的差异

- **完整汉化**：全局 UI 文本、编辑器界面、Inspector 面板、对话框等所有用户面向内容均翻译为简体中文
- **功能一致**：核心功能与原版保持同步，无功能删减

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 15 (App Router) |
| UI | React 19, shadcn/ui (Radix UI) |
| 样式 | Tailwind CSS 4 |
| 语言 | TypeScript (strict) |
| 渲染 | OGL (WebGL), Pixi.js, Canvas 2D |
| 存储 | IndexedDB + OPFS (本地), Google Drive (云端) |
| 认证 | Supabase (SSR) |
| 包管理 | npm |

## 快速开始

### 环境要求

- Node.js 20+
- Bun

### 安装

```bash
# 进入项目目录
cd apps/web

# 安装依赖
bun install

# 启动开发服务器
bun run dev
```

打开 http://localhost:3000 即可访问。

### 生产构建

```bash
bun run build && bun run start
```

### 环境变量（可选，用于认证）

认证由 Supabase 提供。即使不配置，网站仍可运行，只是账户相关功能会禁用。

创建 `.env.local`：

```
NEXT_PUBLIC_SUPABASE_URL=你的_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_supabase_anon_key
```

## 功能概览

| 模块 | 说明 |
|------|------|
| **9 种图层** | 基础、文本、图片、视频、渐变、发射器、复制器、变换(3D/陀螺仪)、液态玻璃 |
| **画布编辑** | 拖拽、缩放、旋转、吸附对齐、层级管理 |
| **属性面板** | 几何、合成、内容、滤镜、混合模式 |
| **动画系统** | 关键帧动画、时间轴、时序函数、循环控制 |
| **状态过渡** | Locked/Unlock/Sleep 状态自动过渡 |
| **陀螺仪** | 响应设备倾斜的视差效果 |
| **导出** | .tendies / .ca 格式 |
| **云端同步** | Google Drive 项目同步 |

## 项目结构

```
apps/web/
├── app/              # Next.js 页面和 API 路由
├── components/       # React 组件
│   ├── editor/       # 编辑器核心
│   ├── ui/           # shadcn/ui 组件
│   └── home/         # 首页组件
├── hooks/            # 自定义 React Hooks
├── lib/              # 工具库
│   ├── ca/           # CoreAnimation 引擎
│   ├── i18n/         # 中文国际化（翻译文件）
│   └── ...
├── messages/         # 翻译 JSON
└── public/           # 静态资源
```

## 许可

本项目基于 [Creative Commons License](LICENSE) 发布，继承自原项目。

原项目地址：https://github.com/CAPlayground/CAPlayground  
原项目在线版：https://caplayground.vercel.app/
