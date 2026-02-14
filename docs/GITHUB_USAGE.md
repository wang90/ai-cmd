# GitHub 使用文档

本文档说明如何在 GitHub 上协作维护 `ai-cmd` 项目，覆盖 Fork、分支、提交、Pull Request、Issue 和 Release 的推荐流程。

## 1. 仓库获取方式

### 方式 A：有写权限成员（推荐）

```bash
git clone <你的仓库地址>
cd fanyi-cli
git checkout main
git pull origin main
```

### 方式 B：外部贡献者（Fork 工作流）

1. 在 GitHub 页面点击 **Fork**
2. 克隆你自己的 Fork
3. 添加上游仓库（可选但推荐）

```bash
git clone <你的-fork-地址>
cd fanyi-cli
git remote add upstream <原始仓库地址>
git fetch upstream
git checkout main
git rebase upstream/main
```

## 2. 分支规范

从 `main` 拉新分支，避免直接在 `main` 开发。

推荐命名：

- `feat/<功能名>`
- `fix/<问题名>`
- `docs/<文档主题>`
- `refactor/<重构主题>`

示例：

```bash
git checkout -b docs/update-readme-and-github-guide
```

## 3. 提交规范

### 提交前建议

- 本地跑通项目（至少启动一次）
- 检查文档命令是否可执行
- 避免提交敏感信息（token、密钥、`.env`）

### 推荐提交信息格式

```text
<type>: <简述>
```

常用 `type`：

- `feat` 新功能
- `fix` 缺陷修复
- `docs` 文档更新
- `refactor` 重构
- `chore` 构建/依赖/杂项

示例：

```bash
git add README.md docs/GITHUB_USAGE.md
git commit -m "docs: 更新项目说明并新增 GitHub 协作文档"
```

## 4. 推送与创建 Pull Request

```bash
git push -u origin <你的分支名>
```

然后在 GitHub 页面发起 PR，建议内容包含：

- **变更目的**：为什么需要这次改动
- **主要改动**：改了哪些点
- **验证方式**：如何验证（命令、页面、截图）
- **影响范围**：是否影响 CLI / Web / API / 文档

PR 标题建议：

- `docs: update README and add GitHub usage guide`
- `fix: handle xxx fallback when mongodb unavailable`

## 5. Code Review 建议清单

评审者可以重点关注：

- 代码是否引入行为回归
- API/CLI 参数是否与文档一致
- 错误处理是否清晰（网络、额度、配置缺失）
- 是否包含必要测试或手工验证步骤
- 文档是否同步更新

## 6. Issue 使用建议

创建 Issue 时建议提供：

- 问题描述（发生了什么）
- 复现步骤（命令、输入、页面路径）
- 期望行为
- 实际行为与报错信息
- 运行环境（OS、Node 版本、是否启用 MongoDB）

Issue 标签建议：

- `bug`
- `enhancement`
- `documentation`
- `question`

## 7. Release 流程（建议）

1. 合并关键 PR 到 `main`
2. 更新版本号与变更日志（如有）
3. 打标签并推送：

```bash
git checkout main
git pull origin main
git tag v1.0.1
git push origin v1.0.1
```

4. 在 GitHub Releases 页面填写发行说明：
   - 新增功能
   - 修复问题
   - 升级/兼容说明

## 8. 安全与敏感信息

- 不要提交 `~/.ai-config.json` 内容到仓库
- 不要在 Issue/PR 里贴出完整 token
- 如需演示日志，建议打码（仅保留前后少量字符）

## 9. 文档联动要求

当以下内容变更时，请同步更新 `README.md`：

- CLI 命令参数
- Web 页面能力
- provider 支持范围
- 启动方式和端口

---

如果你是第一次参与该仓库，建议先从 `docs` 或小型 `fix` 开始，先熟悉 CLI + Web + API 的协作链路，再处理大功能改动。
