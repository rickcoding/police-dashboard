#!/bin/bash

echo "🚀 警务数据看板部署脚本"
echo "========================"

# 检查Node.js环境
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装Node.js"
    exit 1
fi

echo "✅ Node.js 版本: $(node --version)"

# 安装依赖
echo "📦 安装依赖..."
npm install

# 构建项目
echo "🔨 构建项目..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ 构建成功！"
    echo ""
    echo "📋 部署选项："
    echo "1. Vercel部署: npx vercel --prod"
    echo "2. Netlify部署: 将build文件夹拖拽到netlify.com"
    echo "3. GitHub Pages: 推送到GitHub并启用Pages"
    echo ""
    echo "🌐 构建文件位于: ./build/"
    echo "📖 详细部署指南: 查看 DEPLOYMENT.md"
else
    echo "❌ 构建失败，请检查错误信息"
    exit 1
fi 