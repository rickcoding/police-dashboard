# 部署指南 - 警务数据看板

将警务数据看板部署到网络上，让其他人可以通过网页访问。

## 🚀 方案一：Vercel部署（推荐 - 最简单）

### 步骤1：登录Vercel
```bash
npx vercel login
```
用您的GitHub/Google/Email账号登录

### 步骤2：部署项目
```bash
npx vercel --prod
```

### 优势：
- ✅ 完全免费
- ✅ 自动HTTPS
- ✅ 全球CDN加速
- ✅ 自动部署
- ✅ 自定义域名支持

---

## 🌐 方案二：Netlify部署

### 步骤1：注册Netlify账号
前往 [netlify.com](https://netlify.com) 注册

### 步骤2：拖拽部署
1. 构建项目：`npm run build`
2. 将 `build` 文件夹直接拖拽到Netlify
3. 获得部署链接

### 优势：
- ✅ 免费额度充足
- ✅ 简单易用
- ✅ 表单处理功能

---

## 📱 方案三：GitHub Pages

### 步骤1：推送到GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/你的用户名/police-dashboard.git
git push -u origin main
```

### 步骤2：配置GitHub Pages
1. 进入GitHub仓库设置
2. 找到Pages设置
3. 选择GitHub Actions
4. 创建自动部署工作流

### 步骤3：创建部署工作流
在 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install
      
    - name: Build
      run: npm run build
      
    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./build
```

---

## 🖥️ 方案四：服务器部署

### 使用Nginx（适合有服务器的用户）

1. **构建项目**
```bash
npm run build
```

2. **上传到服务器**
```bash
scp -r build/* user@your-server:/var/www/police-dashboard/
```

3. **配置Nginx**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/police-dashboard;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 📋 部署前检查清单

- [ ] 项目构建成功（`npm run build`）
- [ ] 所有页面功能正常
- [ ] 移动端适配良好
- [ ] 数据加载正常
- [ ] 路由跳转正常

---

## 🎯 推荐部署方案

**新手用户**：选择 Vercel 或 Netlify 拖拽部署
**有GitHub经验**：选择 GitHub Pages
**有服务器**：选择 Nginx 部署

---

## 📞 获取帮助

如需帮助，请检查：
1. 构建日志是否有错误
2. 网络连接是否正常
3. 账号权限是否充足

部署成功后，您会获得一个类似 `https://your-app.vercel.app` 的网址，任何人都可以通过这个网址访问您的警务数据看板！ 