# Result Publication

只在用户明确要求把已完成的 review 写入或发布到 Scriverse LLM Racing 时读取本文件。

## 写入前提

写入前必须满足：

- 每个测试用例都已判定为 `pass` 或 `fail`，不存在 `unverified`。
- 候选 worktree、分支、HEAD 与评审时一致，工作区干净。
- 精确的远端候选分支存在，并指向已评审提交；不得替用户自动推送候选分支。
- 已知正整数 `modelId`、带时区的 ISO 8601 `testedAt`、`durationSeconds`、`tokenUsage` 和用量单位。没有单独测试时间时使用候选 HEAD 的 commit 时间。
- 模型公共元数据和当前需求的参赛信息已由用户提供或能从同一模型的权威现有记录中无歧义取得。任何字段不确定时停止写入并询问。

credit 用量保留原数字并写入 `tokenUsageUnit: "credit"`；普通 token 省略该字段或写为 `"token"`。禁止把 credit 换算或标成 token。

## 需求级写入

只修改 `web/source/requirements/<requirement-id>.json` 中与本次模型直接相关的数据：

- `models[]`：写入 `modelId`、`testedAt`、`durationSeconds`、`tokenUsage`、可选 `tokenUsageUnit`、准确的 `resultBranchUrl` 和 `failures`。
- `failures`：键只能是当前需求已存在的测试用例 ID，值为简洁、可复现且不泄露本地路径或凭证的中文原因。通过项不写入。
- `participants[]`：仅维护当前需求中该模型的参赛状态和当前需求需要展示的元数据。
- `screenshots`：只关联本需求、本模型实际验收得到的图片，保持原始操作顺序。

不得复制其他需求的结果、截图、失败原因、时间或用量；不得为方便而删除或改写 `web/source/models.json` 中已有模型。只有确实新增模型且用户授权时，才追加新的公共 `modelId`，并同步前后端 rating catalog 及其版本。

修改需求静态数据后，按当前仓库结构更新 `web/source/index.json` 中对应 `dataUrl` 的缓存参数，以及存在的 manifest/data 版本。不要改变无关需求的缓存版本。

新增截图前检查敏感信息和文件大小。图片超过 100KB 时使用仓库的 `data/compress_webp_15pct.sh`；不得提交真实密钥、Cookie、Token、个人数据、绝对本地路径、原始数据库日志或临时文件。

## 验证

至少执行：

```bash
for file in web/source/index.json web/source/models.json web/source/requirements/*.json; do jq empty "$file"; done
node --check web/app.js
node --check server/server.mjs
git diff --check
(cd web && npm run build)
```

随后用内置浏览器打开当前需求的排行榜和模型详情页，核对：

- 分数、失败数和通过数由平台依据 `scoring` 与 `failures` 计算正确。
- 每个失败标记打开后展示对应原因。
- 测试时间、耗时、token/credit 单位、分支链接和截图归属正确。
- 没有横向溢出、控制台错误或失败的数据请求。

检查结果 JSON 不含 `score`、`deduction`、`totalDeduction`、`rank`、`deductionExemptFailures` 或其他人工覆盖字段。

## 提交与上传

- 提交前重新获取远端目标分支状态，保留所有并发新增结果。远端前进时 fetch/rebase、解决冲突并重新验证；数据维护禁止 force push。
- 只暂存本次需求、对应截图和必要缓存/catalog 文件，使用单一 Angular commit；不得混入其他模型或需求的改动。
- review 本身不授权 commit 或 push。用户明确要求“上传”“发布”或“推送结果”时，按照仓库当前协作约定完成指定远端分支的提交和推送，并验证远端文件内容与本地一致。
- 推送后用远端 ref 读取目标需求 JSON，确认模型记录、失败集合、participant、截图和缓存版本均存在且没有其他数据丢失。
- 未经用户明确指定，不设置或修改 `finalAdoptedModelId` 与 `finalAdoptedPrUrl`。
