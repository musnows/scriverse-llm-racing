const assetRoot = "/source/assets/";
const apiBase = String(window.__RATING_API_BASE__ || "").trim().replace(/\/+$/, "");
const configuredLeaderboardTopN = Number.parseInt(String(window.__LEADERBOARD_TOP_N__ ?? ""), 10);
const leaderboardTopN = Number.isFinite(configuredLeaderboardTopN) ? Math.max(3, configuredLeaderboardTopN) : 4;

function apiUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${apiBase}${normalizedPath}`;
}

const models = [
  {
    id: 1,
    name: "Doubao-Seed-2.1-Turbo",
    tool: "TRAE SOLO",
    testedAt: "2026-08-02T16:31:21+08:00",
    images: [
      ["image-20260801230707-wdg04ed.webp", "模型与模式选择", ["process"]],
      ["image-20260802095037-ltvoeks.webp", "系统设置中的 S3 备份入口", ["settings"]],
      ["image-20260802095115-7ud4y54.webp", "S3 备份设置主面板", ["overview"]],
      ["image-20260802095314-i6apboj.webp", "新增 S3 目标配置", ["target"]],
      ["image-20260802095340-b7df0q9.webp", "已保存的目标与全局配置", ["target", "status"]],
      ["image-20260802095352-pyixxux.webp", "立即备份失败与运行记录", ["manual", "status"]],
      ["image-20260802095447-ruc5et2.webp", "Cron 预览与定时设置", ["schedule"]],
      ["image-20260802095640-hay3wgb.webp", "定时任务触发后的失败记录", ["schedule", "status"]],
      ["image-20260802100706-j9v0lm6.webp", "服务重启提示", ["session"]],
      ["image-20260802100721-q2kvp0v.webp", "重启后设置弹窗仍未关闭", ["session"]],
      ["image-20260802095746-56o6hjq.webp", "AICR 问题命中表", ["review"]],
      ["image-20260802101849-4tjjb4z.webp", "最终评分与主要结论", ["review"]],
    ],
  },
  {
    id: 2,
    name: "Qwen3.8-Max-Preview",
    tool: "QoderCN IDE Quest",
    testedAt: "2026-08-02T16:31:21+08:00",
    images: [
      ["image-20260801230701-fvwhgxb.webp", "1M 上下文与模型模式选择", ["process"]],
      ["image-20260802102318-b3vam73.webp", "系统设置中的数据备份入口", ["settings"]],
      ["image-20260802102327-gu9mwx1.webp", "数据备份主页面空状态", ["overview"]],
      ["image-20260802102336-ejm0dgy.webp", "新建备份目标空表单", ["target"]],
      ["image-20260802102819-9u0ug4f.webp", "填写完整的目标配置", ["target"]],
      ["image-20260802102825-qn4kldo.webp", "已保存的目标配置", ["target", "status"]],
      ["image-20260802102848-n8rmn9c.webp", "立即备份执行中", ["manual"]],
      ["image-20260802102846-dq1qowi.webp", "备份成功提示", ["manual", "status"]],
      ["image-20260802102902-5s75tlk.webp", "云端 scriverse 目录结构", ["remote"]],
      ["image-20260802102937-c6sgjia.webp", "带时间戳的数据库快照", ["remote", "schedule"]],
      ["image-20260802101348-14c3h12.webp", "AICR 问题命中表", ["review"]],
      ["image-20260802101945-orrtnq5.webp", "最终评分与主要结论", ["review"]],
    ],
  },
  {
    id: 3,
    name: "LongCat-2.0",
    tool: "CatPaw",
    testedAt: "2026-08-02T16:31:21+08:00",
    images: [
      ["image-20260801230716-nekt5zt.webp", "模型选择界面", ["process"]],
      ["image-20260801235849-ejyt7r1.webp", "任务完成与后续确认", ["process"]],
      ["image-20260802101228-1jv5yz0.webp", "主仓库出现未跟踪改动", ["process"]],
      ["image-20260802101234-whvtc9k.webp", "代码写入了错误目录", ["process"]],
      ["image-20260802101206-26lb7v6.webp", "重新执行后的交付总结", ["process"]],
      ["image-20260802105941-ditpgyh.webp", "系统设置中的 S3 备份入口", ["settings"]],
      ["image-20260802105943-0u6kpek.webp", "S3 备份管理空状态", ["overview"]],
      ["image-20260802110845-9qxodgo.webp", "新增目标空表单", ["target"]],
      ["image-20260802111003-5bh7bhw.webp", "填写完整的目标配置", ["target"]],
      ["image-20260802111010-i775fw8.webp", "已保存目标与启用状态", ["target", "status"]],
      ["image-20260802111031-w4li04j.webp", "立即备份失败提示", ["manual", "status"]],
      ["image-20260802111235-i9pab3s.webp", "测试连接失败提示", ["manual", "status"]],
      ["image-longcat-aicr-supplement.webp", "AICR 审查完成与评分补充", ["review"]],
    ],
  },
  {
    id: 4,
    name: "Hy3",
    tool: "WorkBuddy",
    testedAt: "2026-08-02T16:31:21+08:00",
    images: [
      ["image-20260801230712-zy199ri.webp", "Max 模式与模型选择", ["process"]],
      ["image-20260802000001-749b4nc.webp", "任务完成耗时", ["process"]],
      ["image-20260802105342-05j8kzb.webp", "系统设置中的 S3 备份入口", ["settings"]],
      ["image-20260802105344-4m737cu.webp", "S3 备份设置主面板", ["overview"]],
      ["image-20260802105527-4aabvqp.webp", "新增备份目标基础字段", ["target"]],
      ["image-20260802110135-gj8rzs2.webp", "填写完整的目标配置", ["target"]],
      ["image-20260802110141-bq3mewy.webp", "目标配置与备份选项", ["target", "schedule"]],
      ["image-20260802110149-r0aikm6.webp", "后端停止后的失败提示", ["manual", "status"]],
      ["image-20260802110340-okgd7vf.webp", "已保存目标与编辑状态", ["target", "status"]],
      ["image-20260802110343-p6u33ob.webp", "目标配置复核", ["target"]],
      ["image-20260802110406-kp4682t.webp", "备份执行结果与日志", ["manual", "status"]],
      ["image-20260802110422-6ofe2h3.webp", "云端 scriverse 目录结构", ["remote"]],
      ["image-20260802110447-u0g1mhb.webp", "定时备份时间选择", ["schedule"]],
      ["image-20260802110503-98zcpg6.webp", "保存定时配置后的面板", ["schedule"]],
      ["image-20260802110536-omtk6dq.webp", "备份操作与状态反馈", ["manual", "status"]],
      ["image-20260802110648-m6ql5d7.webp", "云端数据库快照列表", ["remote", "schedule"]],
      ["image-20260802110657-p6fe1ds.webp", "定时备份触发后的记录", ["schedule", "status"]],
      ["image-20260802101359-jjt35bk.webp", "AICR 问题命中表", ["review"]],
      ["image-20260802101931-0udpb3d.webp", "最终评分与主要结论", ["review"]],
    ],
  },
  {
    id: 5,
    name: "DeepSeek V4 Flash 0731",
    tool: "Claude Code",
    testedAt: "2026-08-03T00:31:37+08:00",
    images: [
      ["image-20260803081355-5es93wt.webp", "启动 Claude Code 与模型选择", ["process"]],
      ["image-20260803081439-2aum1i1.webp", "创建独立 worktree", ["process"]],
      ["image-20260803081459-gtcmnno.webp", "确认测试需求", ["process"]],
      ["image-20260803081511-e3ni4uh.webp", "代码探索与实现计划", ["process"]],
      ["image-20260802223041-j374rja.webp", "测试验收与提交修复", ["process"]],
      ["image-20260802223600-n5h727q.webp", "最终实现总结与交付", ["process"]],
      ["image-20260802234650-p5zx3h9.webp", "进入系统设置并打开数据备份", ["settings"]],
      ["image-20260802235101-ed8oy6g.webp", "数据备份主面板", ["overview"]],
      ["image-20260802235109-vv141zs.webp", "新建备份目标空表单", ["target"]],
      ["image-20260803070917-75hhq0t.webp", "填写 Flash 备份目标（已脱敏）", ["target"]],
      ["image-20260803070926-2fyx8ax.webp", "保存后的备份目标与全局设置", ["target", "status"]],
      ["image-20260803070948-py1an4c.webp", "备份目标已配置，尚未执行备份", ["overview", "status"]],
      ["image-20260803070947-761y1wr.webp", "手动备份成功", ["manual", "status"]],
      ["image-20260803071228-wh9yhmp.webp", "远端数据库与主密钥快照", ["remote", "status"]],
      ["image-20260803071329-rc3wud5.webp", "远端图片对象（按哈希命名）", ["remote"]],
      ["image-20260803071403-hfbdtwi.webp", "定时备份快捷时间选项", ["schedule"]],
      ["image-20260803071532-nilj7xl.webp", "启用定时备份并保存 Cron 配置", ["schedule", "status"]],
      ["image-20260803071808-tzzyt8x.webp", "定时备份成功后的状态", ["schedule", "status"]],
      ["image-20260803071721-lwdr6gi.webp", "远端多份数据库与主密钥快照", ["remote", "schedule"]],
      ["image-20260803071913-t4q64ji.webp", "关闭图片备份并保存配置", ["schedule", "target"]],
      ["image-20260803071609-ik4id3p.webp", "备份成功明细与新增图片统计", ["manual", "status"]],
    ],
  },
  {
    id: 6,
    name: "DeepSeek V4 Pro Preview",
    tool: "Claude Code",
    testedAt: "2026-08-03T00:31:37+08:00",
    images: [
      ["image-20260803081355-5es93wt.webp", "启动 Claude Code 与模型选择", ["process"]],
      ["image-20260803081439-2aum1i1.webp", "创建独立 worktree", ["process"]],
      ["image-20260803081459-gtcmnno.webp", "确认测试需求", ["process"]],
      ["image-20260803081511-e3ni4uh.webp", "代码探索与实现计划", ["process"]],
      ["image-20260802223041-j374rja.webp", "测试验收与提交修复", ["process"]],
      ["image-20260802223600-n5h727q.webp", "最终实现总结与交付", ["process"]],
      ["image-20260802235122-49dy4q8.webp", "设置中心中的 S3 备份入口", ["settings"]],
      ["image-20260802235114-qfj5ld8.webp", "S3 备份配置空状态", ["overview"]],
      ["image-20260802235131-6og5uog.webp", "新增备份配置表单", ["target"]],
      ["image-20260803072009-dks69ct.webp", "填写 Pro 备份配置（已脱敏）", ["target"]],
      ["image-20260803072007-2wznyvn.webp", "配置保存成功后的 S3 列表", ["target", "status"]],
      ["image-20260803072041-1s8gixq.webp", "立即备份失败：签名不匹配", ["manual", "status"]],
      ["image-20260803072548-61i6zx4.webp", "定位 SigV4 canonical URI 问题", ["review"]],
      ["image-20260803080202-7yyell7.webp", "已保存配置中的上次失败详情", ["status"]],
      ["image-20260803080224-c7e2z2a.webp", "定时备份触发后的失败状态", ["schedule", "status"]],
    ],
  },
  {
    id: 7,
    name: "GPT-5.6 Luna Max",
    tool: "Codex CLI",
    testedAt: "2026-08-03T23:03:51+08:00",
    images: [
      ["image-20260803212112-ar227ir.webp", "第三轮测试启动与工具选择", ["process"]],
      ["image-20260803214537-v2dv1gt.webp", "多模型并行工作界面", ["process"]],
      ["image-20260803220141-ums4m9f.webp", "测试完成后的系统设置与 Agent 输出", ["process"]],
      ["image-20260803220250-zshy8cs.webp", "测试总结与提交信息", ["process"]],
      ["image-20260803224435-34cpbfw.webp", "设置中心入口", ["settings"]],
      ["image-20260803224434-ibyzd28.webp", "S3 备份计划", ["overview", "schedule"]],
      ["image-20260803224432-a0a24bi.webp", "新增 S3 目标", ["target"]],
    ],
  },
  {
    id: 8,
    name: "Composer 2.5",
    tool: "Cursor IDE",
    testedAt: "2026-08-03T23:03:51+08:00",
    images: [
      ["image-20260803212112-ar227ir.webp", "第三轮测试启动与工具选择", ["process"]],
      ["image-20260803214537-v2dv1gt.webp", "多模型并行工作界面", ["process"]],
      ["image-20260803220141-ums4m9f.webp", "测试完成后的系统设置与 Agent 输出", ["process"]],
      ["image-20260803220250-zshy8cs.webp", "测试总结与提交信息", ["process"]],
      ["4d62f246d88bc7a6af187b22869bfac8-20260803224747-ay1rujv.webp", "设置中心入口", ["settings"]],
      ["68cc4f21fb98a5c4af9c4f19534b6fd1-20260803224753-liwxwvb.webp", "S3 备份设置", ["overview"]],
      ["b77be8c868ed7c908ad896a90c561742-20260803224758-hbuqtiu.webp", "备份目标配置", ["target"]],
    ],
  },
  {
    id: 9,
    name: "Grok 4.5 High",
    tool: "Cursor Agent View",
    testedAt: "2026-08-03T23:03:51+08:00",
    images: [
      ["image-20260805064410-7ic2gz2.webp", "创建独立 worktree", ["process"]],
      ["image-20260805064455-xih9x5u.webp", "确认 worktree 已切换", ["process"]],
      ["image-20260805064757-8wqhxkf.webp", "探索项目并开始实现", ["process"]],
      ["image-20260805065308-fvbm1tu.webp", "实现 S3 核心模块", ["process"]],
      ["image-20260805065852-nsdy5lg.webp", "功能概览与实现总结", ["process"]],
      ["image-20260805065853-5vrxm89.webp", "提交前的安全补充", ["process"]],
      ["image-20260805072923-97p5p1f.webp", "任务完成与耗时 10 分 28 秒", ["process"]],
      ["image-20260805070056-jab3by6.webp", "用量记录与外部模型约束", ["process"]],
      ["image-20260805071506-3nyxtct.webp", "设置中心入口", ["settings"]],
      ["image-20260805071458-4dkpp1q.webp", "数据备份页面", ["overview"]],
      ["image-20260805071500-4w2jvrq.webp", "新增备份目标", ["target"]],
    ],
  },
  {
    id: 10,
    name: "Qwen3.8-Max",
    tool: "QoderCN IDE Quest",
    testedAt: "2026-08-04T00:20:37+08:00",
    images: [
      ["image-20260804001203-ymvj4gr.webp", "设置中心入口", ["settings"]],
      ["image-20260804001141-h7wn6px.webp", "数据备份页面", ["overview"]],
      ["image-20260804001147-684u3hh.webp", "新增备份目标", ["target"]],
    ],
  },
  {
    id: 11,
    name: "GLM-5.2 Max",
    tool: "Cursor Agent View",
    testedAt: "2026-08-04T00:20:37+08:00",
    images: [
      ["image-20260804001209-s8z1js9.webp", "设置中心入口", ["settings"]],
      ["image-20260804001214-fn2utm1.webp", "备份与同步页面", ["overview", "schedule"]],
      ["image-20260804001221-f03m72n.webp", "新增 S3 目标", ["target"]],
      ["image-20260804001226-yd8ntdi.webp", "S3 目标配置选项", ["target"]],
    ],
  },
  {
    id: 12,
    name: "Kimi K3 Max",
    tool: "Kimi Code",
    testedAt: "2026-08-04T05:49:42+08:00",
    images: [
      ["image-20260803212112-ar227ir.webp", "第三轮测试启动与工具选择", ["process"]],
      ["image-20260803214537-v2dv1gt.webp", "多模型并行工作界面", ["process"]],
      ["image-20260803220141-ums4m9f.webp", "测试完成后的系统设置与 Agent 输出", ["process"]],
      ["image-20260803220250-zshy8cs.webp", "测试总结与提交信息", ["process"]],
      ["image-20260804071634-plfhucu.webp", "设置中心入口", ["settings"]],
      ["image-20260804071637-sz07shf.webp", "数据备份页面", ["overview"]],
      ["image-20260804071639-z0r8vyb.webp", "新增备份目标", ["target"]],
      ["image-20260804071640-5of1gvl.webp", "备份目标同步选项", ["target", "schedule"]],
    ],
  },
  {
    id: 13,
    name: "GPT-5.6 Sol Max",
    tool: "Codex CLI",
    testedAt: "2026-08-04T08:12:31+08:00",
    images: [
      ["image-20260804065202-ny26db1.webp", "Terra 与 Sol 模型启动", ["process"]],
      ["image-20260804065235-zeqgize.webp", "Sol 启动与记忆设置", ["process"]],
      ["image-20260804065443-waivlf9.webp", "Sol worktree 与任务执行", ["process"]],
      ["image-20260804080540-0c83ud9.webp", "设置中心入口", ["settings"]],
      ["image-20260804080545-4f1y4xc.webp", "S3 系统备份页面", ["overview"]],
      ["image-sol-s3-target-form-top.webp", "新增 S3 目标表单上半部分", ["target"]],
      ["image-sol-s3-target-form-options.webp", "新增 S3 目标表单同步选项", ["target"]],
    ],
  },
  {
    id: 14,
    name: "GPT-5.5 xhigh",
    tool: "Codex CLI",
    testedAt: "2026-08-04T10:56:21+08:00",
    images: [],
  },
  {
    id: 15,
    name: "GPT-5.6 Terra Max",
    tool: "Codex CLI",
    testedAt: "2026-08-04T10:56:21+08:00",
    images: [],
  },
  {
    id: 16,
    name: "Claude Opus 5 Max",
    tool: "Cursor Agent View",
    testedAt: "2026-08-04T19:48:42+08:00",
    images: [
      ["image-20260804234905-kja60nb.webp", "创建 worktree 并等待下一步", ["process"]],
      ["image-20260804234913-e1j6gzp.webp", "确认基于 main 创建 worktree", ["process"]],
      ["image-20260804234921-w13txcg.webp", "S3 备份实现总结", ["process"]],
      ["image-20260804234927-aaldq5x.webp", "浏览器验收问题与修复", ["process"]],
      ["image-20260804234931-4c2v6aw.webp", "实现细节与浏览器验收", ["process"]],
      ["image-20260804234935-cg76j1i.webp", "测试完成与交付", ["process"]],
      ["6df3a86cf1d5c9bbe8d967da7d6f8a0d-20260804234944-fe93c0i.webp", "S3 备份实现与验收总结", ["process"]],
      ["image-20260804234950-i31suau.webp", "设置中心入口", ["settings"]],
      ["image-20260804234952-nos4mo4.webp", "数据备份主界面", ["overview"]],
      ["image-20260804234955-fa1l6og.webp", "新增备份目标表单上半部分", ["target"]],
      ["image-20260804234957-5luzmey.webp", "新增备份目标表单下半部分", ["target"]],
    ],
  },
  {
    id: 17,
    name: "MiniMax-M3",
    tool: "WorkBuddy",
    testedAt: "2026-08-05T00:01:31+08:00",
    images: [],
  },
];

const features = [
  ["settings", "设置入口", "比较 S3 备份能力在系统设置中的入口位置与呈现方式。"],
  ["overview", "备份主界面", "比较空状态、全局备份选项和主要操作区。"],
  ["target", "目标配置", "比较新增、填写、保存和编辑 S3 目标的表单。"],
  ["status", "目标与状态", "比较已保存目标、启用状态、运行记录与结果反馈。"],
  ["manual", "手动备份", "比较立即备份、测试连接以及成功或失败反馈。"],
  ["schedule", "定时备份", "比较 Cron、触发时间、定时执行与历史快照。"],
  ["remote", "云端产物", "比较对象存储中的 scriverse 目录与数据库快照。"],
  ["process", "Agent 过程", "比较模型模式、执行过程、耗时和工作区行为。"],
  ["review", "AICR 与评分", "汇总代码审查命中项、最终评分和主要问题。"],
].map(([id, name, description]) => ({ id, name, description }));

for (const model of models) {
  model.images = model.images.map(([file, title, tags], index) => ({
    file,
    title,
    tags,
    modelId: model.id,
    modelName: model.name,
    sequence: index + 1,
  }));
  model.imagesByFeature = new Map();
  model.images.forEach((image) => {
    image.tags.forEach((tag) => {
      const items = model.imagesByFeature.get(tag) ?? [];
      items.push(image);
      model.imagesByFeature.set(tag, items);
    });
  });
}

const leaderboardDataUrl = "/source/leaderboard.json?v=69";
const earliestRecordedTestAt = Date.parse("2026-01-01T00:00:00+08:00");
let leaderboardData = null;
let leaderboardLoadError = false;
let rankingDataCache = null;
let rankingDataCacheSource = null;
let rankingDataCacheRequirementId = null;
const ratingState = {
  requirementId: null,
  loading: false,
  loaded: false,
  values: new Map(),
  allLoading: false,
  allLoaded: false,
  allError: false,
  allValues: new Map(),
  valuesByRequirement: new Map(),
  requestsByRequirement: new Map(),
};
const caseVoteState = {
  requirementId: null,
  loading: false,
  loaded: false,
  values: new Map(),
  valuesByRequirement: new Map(),
  requestsByRequirement: new Map(),
  pending: new Set(),
};

function getCurrentRequirement() {
  const requirements = leaderboardData?.requirements ?? [];
  return requirements.find((requirement) => requirement.id === state.requirementId) ?? requirements[0] ?? null;
}

function getFinalAdoptedModelId(requirement) {
  const modelId = Number(requirement?.finalAdoptedModelId);
  return Number.isSafeInteger(modelId) && modelId > 0 ? modelId : null;
}

function getFinalAdoptedPrUrl(requirement) {
  const configuredUrl = typeof requirement?.finalAdoptedPrUrl === "string"
    ? requirement.finalAdoptedPrUrl.trim()
    : "";
  if (!configuredUrl) {
    return "";
  }
  try {
    const url = new URL(configuredUrl, window.location.origin);
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : "";
  } catch {
    return "";
  }
}

function getRequirementScoring(requirement) {
  return requirement?.scoring ?? { initial: 0, deductionByPriority: {} };
}

function getRequirementTestCases(requirement) {
  return requirement?.testCases ?? [];
}

function getRequirementTestCasesForDisplay(requirement) {
  const priorityOrder = new Map(
    Object.keys(getRequirementScoring(requirement).deductionByPriority)
      .map((priority, index) => [priority, index]),
  );
  return [...getRequirementTestCases(requirement)].sort((left, right) => {
    const priorityDifference = (priorityOrder.get(left.priority) ?? Number.MAX_SAFE_INTEGER)
      - (priorityOrder.get(right.priority) ?? Number.MAX_SAFE_INTEGER);
    return priorityDifference || left.id.localeCompare(right.id, undefined, { numeric: true });
  });
}

function formatDeductionRules(deductionByPriority = {}) {
  return Object.entries(deductionByPriority)
    .map(([priority, deduction]) => `${priority} ${Number(deduction) > 0 ? `每项扣 ${deduction} 分` : "不扣分"}`)
    .join("，");
}

function getWeightedPassRate(score, maxScore) {
  const numericScore = Number(score);
  const numericMaxScore = Number(maxScore);
  if (!Number.isFinite(numericScore) || !Number.isFinite(numericMaxScore) || numericMaxScore <= 0) {
    return null;
  }
  return Math.max(0, Math.min(100, (numericScore / numericMaxScore) * 100));
}

function getDurationSortValue(durationSeconds) {
  const numericDuration = Number(durationSeconds);
  return Number.isFinite(numericDuration) && numericDuration > 0
    ? numericDuration
    : Number.MAX_SAFE_INTEGER;
}

function getRankingData() {
  if (!leaderboardData) {
    return [];
  }
  const requirement = getCurrentRequirement();
  const requirementId = requirement?.id ?? null;
  if (rankingDataCacheSource === leaderboardData && rankingDataCache && rankingDataCacheRequirementId === requirementId) {
    return rankingDataCache;
  }
  const testCases = getRequirementTestCases(requirement);
  const scoring = getRequirementScoring(requirement);
  const scoreByPriority = scoring.deductionByPriority;
  const testCaseIds = new Set(testCases.map((testCase) => testCase.id));
  const requirementEntries = getRequirementModelEntries(requirement);
  const entries = requirementEntries ?? leaderboardData.models;
  rankingDataCache = entries
    .map((entry) => {
      const failedIds = new Set(Object.keys(entry.failures ?? {}).filter((testCaseId) => testCaseIds.has(testCaseId)));
      const deductions = testCases.reduce(
        (total, testCase) => total + (failedIds.has(testCase.id) ? scoreByPriority[testCase.priority] : 0),
        0,
      );
      return {
        ...entry,
        model: models.find((model) => model.id === entry.modelId),
        agent: leaderboardData.agents.find((agent) => agent.modelId === entry.modelId) ?? entry.agent,
        score: scoring.initial - deductions,
        maxScore: scoring.initial,
        weightedPassRate: getWeightedPassRate(scoring.initial - deductions, scoring.initial),
        testCaseCount: testCases.length,
        passCount: testCases.length - failedIds.size,
        failureCount: failedIds.size,
      };
    })
    .sort((left, right) => {
      const scoreDifference = right.score - left.score;
      const durationDifference = getDurationSortValue(left.durationSeconds)
        - getDurationSortValue(right.durationSeconds);
      return scoreDifference
        || durationDifference
        || right.passCount - left.passCount
        || String(left.model?.name ?? left.modelId).localeCompare(String(right.model?.name ?? right.modelId));
    })
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
  rankingDataCacheSource = leaderboardData;
  rankingDataCacheRequirementId = requirementId;
  return rankingDataCache;
}

function formatDurationSeconds(durationSeconds) {
  const totalSeconds = Math.max(0, Math.round(Number(durationSeconds) || 0));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const parts = [];
  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }
  if (seconds > 0 || parts.length === 0) {
    parts.push(`${seconds}s`);
  }
  return parts.join("");
}

function formatTokenUsage(tokenUsage, unit = "token", display = "detailed") {
  const normalizedUnit = unit === "credit" ? "credit" : "token";
  if (tokenUsage === null || tokenUsage === undefined) {
    return "未记录";
  }
  if (typeof tokenUsage === "number" && Number.isFinite(tokenUsage)) {
    if (normalizedUnit === "credit") {
      return `${new Intl.NumberFormat("en-US").format(tokenUsage)} c`;
    }
    if (tokenUsage >= 1_000_000) {
      if (display === "compact") {
        return `${(Math.floor((tokenUsage / 1_000_000) * 100) / 100).toFixed(2)} M`;
      }
      return `${new Intl.NumberFormat("en-US").format(tokenUsage)} tk`;
    }
    if (display === "compact" && tokenUsage >= 1_000) {
      return `${(Math.floor((tokenUsage / 1_000) * 100) / 100).toFixed(2)} k`;
    }
    return `${new Intl.NumberFormat("en-US").format(tokenUsage)} tk`;
  }
  const text = String(tokenUsage).trim();
  return text || "未记录";
}

function formatBuildUpdatedAt(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "本地开发";
  }
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date).replaceAll("/", "-");
}

function formatTestedAt(value) {
  if (value === null || value === undefined || value === "" || value === 0 || value === "0") {
    return "暂未记录";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime()) || date.getTime() < earliestRecordedTestAt) {
    return "暂未记录";
  }
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date).replaceAll("/", "-");
}

function renderBuildUpdatedAt() {
  const source = window.__WEB_UPDATED_AT__ || document.lastModified;
  elements.buildUpdatedAt.textContent = `最近更新时间：${formatBuildUpdatedAt(source)}`;
}

function getOverallRatingData() {
  const ranking = models.map((model) => ({
    model,
    agent: leaderboardData?.agents.find((entry) => entry.modelId === model.id),
    overallMetrics: getOverallModelMetrics(model.id),
    testedRequirementCount: getTestedRequirementCount(model.id),
    weightedAverageDurationSeconds: getWeightedAverageDurationSeconds(model.id),
    rating: ratingState.allValues.get(model.id) ?? null,
  }));

  ranking.sort((left, right) => {
    const weightedAverageScoreDifference = (right.overallMetrics?.score ?? -Infinity)
      - (left.overallMetrics?.score ?? -Infinity);
    const durationDifference = getDurationSortValue(left.weightedAverageDurationSeconds)
      - getDurationSortValue(right.weightedAverageDurationSeconds);
    return weightedAverageScoreDifference
      || durationDifference
      || left.model.name.localeCompare(right.model.name);
  });

  let testedRank = 0;
  return ranking.map((entry) => ({
    ...entry,
    rank: entry.overallMetrics ? ++testedRank : null,
  }));
}

function getRequirementWeight(requirement) {
  const weight = Number(requirement?.weight);
  return Number.isFinite(weight) && weight > 0 ? weight : 1;
}

function formatRequirementWeight(weight) {
  const formatted = Number(weight).toFixed(2).replace(/0$/, "");
  return formatted.endsWith(".") ? `${formatted}0` : formatted;
}

function getWeightedAverageDurationSeconds(modelId) {
  if (!leaderboardData) {
    return null;
  }
  const requirements = leaderboardData.requirements ?? [];
  const hasPerRequirementResults = requirements.some(hasExplicitRequirementModelEntries);
  const durationRecords = hasPerRequirementResults
    ? requirements.flatMap((requirement) => (hasExplicitRequirementModelEntries(requirement)
      ? (getRequirementModelEntries(requirement) ?? [])
      : leaderboardData.models)
      .filter((entry) => (entry.modelId ?? entry.id) === modelId)
      .map((entry) => ({ entry, weight: getRequirementWeight(requirement) })))
    : leaderboardData.models
      .filter((entry) => entry.modelId === modelId)
      .map((entry) => ({ entry, weight: getRequirementWeight(requirements[0]) }));
  const validRecords = durationRecords
    .map(({ entry, weight }) => ({
      durationSeconds: Number(entry.durationSeconds),
      weight,
    }))
    .filter(({ durationSeconds }) => Number.isFinite(durationSeconds) && durationSeconds > 0);
  if (validRecords.length === 0) {
    return null;
  }
  const totalWeight = validRecords.reduce((total, record) => total + record.weight, 0);
  const weightedDuration = validRecords.reduce(
    (total, record) => total + record.durationSeconds * record.weight,
    0,
  );
  return totalWeight > 0 ? weightedDuration / totalWeight : null;
}

function getWeightedUsageRecords(modelId) {
  if (!leaderboardData) {
    return [];
  }
  const requirements = leaderboardData.requirements ?? [];
  const hasPerRequirementResults = requirements.some(hasExplicitRequirementModelEntries);
  return hasPerRequirementResults
    ? requirements.flatMap((requirement) => (hasExplicitRequirementModelEntries(requirement)
      ? (getRequirementModelEntries(requirement) ?? [])
      : leaderboardData.models)
      .filter((entry) => (entry.modelId ?? entry.id) === modelId)
      .map((entry) => ({ entry, weight: getRequirementWeight(requirement) })))
    : leaderboardData.models
      .filter((entry) => entry.modelId === modelId)
      .map((entry) => ({ entry, weight: getRequirementWeight(requirements[0]) }));
}

function getWeightedAverageUsage(modelId) {
  const usageRecords = getWeightedUsageRecords(modelId);
  const validRecords = usageRecords
    .map(({ entry, weight }) => ({
      tokenUsage: Number(entry.tokenUsage),
      tokenUsageUnit: entry.tokenUsageUnit ?? entry.agent?.tokenUsageUnit ?? "token",
      weight,
    }))
    .filter(({ tokenUsage }) => Number.isFinite(tokenUsage) && tokenUsage > 0);
  const units = new Set(validRecords.map((record) => record.tokenUsageUnit));
  if (units.size !== 1 || validRecords.length === 0) {
    return null;
  }
  const totalWeight = validRecords.reduce((total, record) => total + record.weight, 0);
  const weightedUsage = validRecords.reduce(
    (total, record) => total + record.tokenUsage * record.weight,
    0,
  );
  return totalWeight > 0
    ? { value: weightedUsage / totalWeight, unit: [...units][0] }
    : null;
}

function getWeightedAverageTokenUsage(modelId) {
  const usageRecords = getWeightedUsageRecords(modelId);
  const hasCreditRecord = usageRecords.some(({ entry }) => (
    (entry.tokenUsageUnit ?? entry.agent?.tokenUsageUnit ?? "token") === "credit"
  ));
  if (hasCreditRecord) {
    return null;
  }
  const averageUsage = getWeightedAverageUsage(modelId);
  return averageUsage?.unit === "token" ? averageUsage.value : null;
}

const chartSvgNamespace = "http://www.w3.org/2000/svg";
const chartPointColors = ["#e58b66", "#9bc79e", "#8ba9d9", "#dca76a", "#ba91d6", "#70c5bd"];

function createChartSvgElement(tagName, attributes = {}, textContent = "") {
  const element = document.createElementNS(chartSvgNamespace, tagName);
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, String(value)));
  if (textContent) {
    element.textContent = textContent;
  }
  return element;
}

function formatChartDuration(durationSeconds) {
  if (Number(durationSeconds) <= 0) {
    return "0 min";
  }
  const minutes = Number(durationSeconds) / 60;
  if (minutes >= 60) {
    return `${(minutes / 60).toFixed(minutes >= 100 ? 0 : 1)} h`;
  }
  return `${minutes.toFixed(minutes >= 10 ? 0 : 1)} min`;
}

function formatChartExportTimestamp(date = new Date()) {
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}

function formatChartAxisDuration(durationSeconds) {
  return `${Math.round(Number(durationSeconds) / 60)} min`;
}

function createModelOverallChartExportSvg(chartType = "duration") {
  const isTokenChart = chartType === "token";
  const svg = isTokenChart ? elements.modelTokenEfficiencyChart : elements.modelOverallChart;
  const viewBox = svg?.viewBox?.baseVal;
  if (!svg || !viewBox?.width || !viewBox?.height) {
    return null;
  }

  const headerHeight = 82;
  const exportHeight = viewBox.height + headerHeight;
  const exportSvg = createChartSvgElement("svg", {
    xmlns: chartSvgNamespace,
    "xmlns:xlink": "http://www.w3.org/1999/xlink",
    width: viewBox.width,
    height: exportHeight,
    viewBox: `0 0 ${viewBox.width} ${exportHeight}`,
  });
  exportSvg.append(
    createChartSvgElement("rect", {
      x: 0,
      y: 0,
      width: viewBox.width,
      height: exportHeight,
      fill: "#111210",
    }),
    createChartSvgElement("rect", {
      class: "model-overall-chart-export__header",
      x: 0,
      y: 0,
      width: viewBox.width,
      height: headerHeight,
    }),
    createChartSvgElement("line", {
      class: "model-overall-chart-export__header-divider",
      x1: 0,
      y1: headerHeight,
      x2: viewBox.width,
      y2: headerHeight,
    }),
    createChartSvgElement(
      "text",
      { class: "model-overall-chart-export__title", x: 32, y: 25 },
      "叙界真实需求 Agent 评测娱乐榜",
    ),
    createChartSvgElement(
      "text",
      { class: "model-overall-chart-export__subtitle", x: 32, y: 45 },
      isTokenChart ? "模型总榜｜Token 用量与加权通过率" : "模型总榜｜加权平均耗时与加权通过率",
    ),
    createChartSvgElement(
      "text",
      { class: "model-overall-chart-export__description", x: 32, y: 64 },
      isTokenChart
        ? "阅读方式：越靠左上越好；横轴为加权平均 token 用量，纵轴为加权通过率；credit usage 模型不计入。"
        : "阅读方式：越靠左上越好；横轴为加权平均耗时，纵轴为加权通过率。",
    ),
    createChartSvgElement(
      "text",
      { class: "model-overall-chart-export__domain", x: viewBox.width - 32, y: 25, "text-anchor": "end" },
      "llm-racing.scriverse.top",
    ),
    createChartSvgElement(
      "text",
      { class: "model-overall-chart-export__domain-note", x: viewBox.width - 32, y: 43, "text-anchor": "end" },
      "更多详情见站点",
    ),
  );

  const chartGroup = createChartSvgElement("g", { transform: `translate(0 ${headerHeight})` });
  [...svg.childNodes].forEach((node) => chartGroup.append(node.cloneNode(true)));
  chartGroup.querySelectorAll(".model-overall-chart__point").forEach((point) => {
    point.setAttribute("r", "3");
    point.setAttribute("stroke-width", "1.2");
  });
  exportSvg.append(
    createChartSvgElement(
      "style",
      {},
      `
        .model-overall-chart-export__header { fill: #171816; }
        .model-overall-chart-export__header-divider { stroke: #30322f; stroke-width: 1; }
        .model-overall-chart-export__title { fill: #f4f4f1; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif; font-size: 17px; font-weight: 700; }
        .model-overall-chart-export__subtitle { fill: #e0a084; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif; font-size: 11px; font-weight: 700; }
        .model-overall-chart-export__description { fill: #969791; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif; font-size: 9px; }
        .model-overall-chart-export__domain { fill: #e0a084; font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace; font-size: 9px; }
        .model-overall-chart-export__domain-note { fill: #969791; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif; font-size: 8px; }
        .model-overall-chart__grid line { stroke: #292b28; stroke-width: 1; stroke-dasharray: 3 6; }
        .model-overall-chart__axes line { stroke: #686b66; stroke-width: 1.2; }
        .model-overall-chart__labels text { fill: #858880; font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace; font-size: 11px; }
        .model-overall-chart__labels .model-overall-chart__axis-title { fill: #b8b9b4; font-size: 10px; }
        .model-overall-chart__point { stroke: #fffaf6; stroke-width: 2; }
        .model-overall-chart__point--best { stroke: #f3c76b; filter: drop-shadow(0 0 5px rgba(243, 199, 107, .8)); }
        .model-overall-chart__label-connectors--expanded { display: none; }
        .model-overall-chart__label-connector { stroke: #686b66; stroke-width: 0.75; stroke-dasharray: 2 2; opacity: 0.7; }
        .model-overall-chart__point-label { fill: #b8b9b4; font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace; font-size: 8px; }
        .model-overall-chart__best-marker { display: inline; }
        .model-overall-chart__best-marker-label { fill: #f3c76b; font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace; font-size: 7px; font-weight: 700; paint-order: stroke; stroke: #111210; stroke-linejoin: round; stroke-width: 2px; }
        .model-overall-chart__best-marker-connector { stroke: #f3c76b; stroke-width: 0.8; stroke-dasharray: 1.5 1.5; opacity: 0.85; }
      `,
    ),
    chartGroup,
  );
  return { svg: exportSvg, width: viewBox.width, height: exportHeight };
}

function downloadModelOverallChartPng(chartType = "duration") {
  const exportData = createModelOverallChartExportSvg(chartType);
  if (!exportData) {
    return;
  }

  const serializer = new XMLSerializer();
  const svgBlob = new Blob([serializer.serializeToString(exportData.svg)], {
    type: "image/svg+xml;charset=utf-8",
  });
  const svgUrl = URL.createObjectURL(svgBlob);
  const image = new Image();
  image.onload = () => {
    URL.revokeObjectURL(svgUrl);
    const scale = 2;
    const canvas = document.createElement("canvas");
    canvas.width = exportData.width * scale;
    canvas.height = exportData.height * scale;
    const context = canvas.getContext("2d");
    if (!context) {
      showToast("PNG 生成失败", "error");
      return;
    }
    context.fillStyle = "#111210";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((pngBlob) => {
      if (!pngBlob) {
        showToast("PNG 生成失败", "error");
        return;
      }
      const downloadUrl = URL.createObjectURL(pngBlob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      const filenamePrefix = chartType === "token" ? "scriverse-llm-token-efficiency" : "scriverse-llm-ranking";
      link.download = `${filenamePrefix}-${formatChartExportTimestamp()}.png`;
      link.hidden = true;
      document.body.append(link);
      link.click();
      window.setTimeout(() => {
        link.remove();
        URL.revokeObjectURL(downloadUrl);
      }, 1000);
      showToast("散点图 PNG 已下载", "success");
    }, "image/png");
  };
  image.onerror = () => {
    URL.revokeObjectURL(svgUrl);
    showToast("PNG 生成失败", "error");
  };
  image.src = svgUrl;
}

function createModelOverallChartData(ranking) {
  return ranking
    .map((entry) => {
      const weightedAverageDurationSeconds = Number(entry.weightedAverageDurationSeconds);
      const weightedPassRate = Number(entry.overallMetrics?.weightedPassRate);
      if (!Number.isFinite(weightedAverageDurationSeconds) || weightedAverageDurationSeconds <= 0 || !Number.isFinite(weightedPassRate)) {
        return null;
      }
      return {
        entry,
        weightedAverageDurationSeconds,
        weightedPassRate,
      };
    })
    .filter(Boolean)
    .sort((left, right) => right.weightedPassRate - left.weightedPassRate
      || left.weightedAverageDurationSeconds - right.weightedAverageDurationSeconds
      || left.entry.model.name.localeCompare(right.entry.model.name))
    .map((entry, index) => ({
      ...entry,
      color: chartPointColors[index % chartPointColors.length],
    }));
}

function getModelOverallChartBestItem(chartData, xPosition, yPosition, topLeft) {
  return chartData.reduce((best, item) => {
    const distance = Math.hypot(
      xPosition(item.weightedAverageDurationSeconds) - topLeft.x,
      yPosition(item.weightedPassRate) - topLeft.y,
    );
    if (!best || distance < best.distance) {
      return { item, distance };
    }
    if (distance !== best.distance) {
      return best;
    }
    if (item.weightedPassRate !== best.item.weightedPassRate) {
      return item.weightedPassRate > best.item.weightedPassRate ? { item, distance } : best;
    }
    if (item.weightedAverageDurationSeconds !== best.item.weightedAverageDurationSeconds) {
      return item.weightedAverageDurationSeconds < best.item.weightedAverageDurationSeconds ? { item, distance } : best;
    }
    return item.entry.model.name.localeCompare(best.item.entry.model.name) < 0 ? { item, distance } : best;
  }, null)?.item ?? null;
}

function chartBoxesOverlap(left, right, padding = 2) {
  return left.left < right.right + padding
    && left.right > right.left - padding
    && left.top < right.bottom + padding
    && left.bottom > right.top - padding;
}

function getChartLabelWidth(text, fontSize) {
  return Math.max(18, [...text].reduce(
    (width, character) => width + (character.codePointAt(0) > 255 ? fontSize : fontSize * 0.6),
    0,
  ));
}

function createChartLabelBox(x, y, width, anchor, fontSize) {
  const left = anchor === "middle" ? x - width / 2 : anchor === "end" ? x - width : x;
  return {
    left,
    right: left + width,
    top: y - fontSize - 1,
    bottom: y + 2,
  };
}

function createChartLabelConnector(pointX, pointY, box, minimumDistance = 18) {
  const endX = Math.min(Math.max(pointX, box.left), box.right);
  const endY = Math.min(Math.max(pointY, box.top), box.bottom);
  const deltaX = endX - pointX;
  const deltaY = endY - pointY;
  const distance = Math.hypot(deltaX, deltaY);
  if (distance <= minimumDistance) {
    return null;
  }
  const startRatio = 7 / distance;
  return {
    x1: pointX + deltaX * startRatio,
    y1: pointY + deltaY * startRatio,
    x2: endX,
    y2: endY,
  };
}

function createModelOverallChartLabelLayout(chartData, xPosition, yPosition, bounds, options = {}) {
  const fontSize = options.fontSize ?? 8;
  const pointRadius = options.pointRadius ?? 7;
  const collisionPadding = options.collisionPadding ?? 2;
  const sideDistance = options.sideDistance ?? 10;
  const sideBaselineOffset = options.sideBaselineOffset ?? 3;
  const belowDistance = options.belowDistance ?? 15;
  const aboveDistance = options.aboveDistance ?? 10;
  const extraDistances = options.extraDistances ?? [0, 12, 24, 36, 52, 68];
  const preferHorizontalLabels = options.preferHorizontalLabels ?? false;
  const connectorMinimumDistance = options.connectorMinimumDistance ?? 18;
  const occupiedBoxes = [];
  const pointBoxes = chartData.map((item) => {
    const pointX = xPosition(item.weightedAverageDurationSeconds);
    const pointY = yPosition(item.weightedPassRate);
    return {
      left: pointX - pointRadius,
      right: pointX + pointRadius,
      top: pointY - pointRadius,
      bottom: pointY + pointRadius,
    };
  });

  return chartData.map((item) => {
    const pointX = xPosition(item.weightedAverageDurationSeconds);
    const pointY = yPosition(item.weightedPassRate);
    const labelWidth = getChartLabelWidth(item.entry.model.name, fontSize);
    const candidates = [];
    extraDistances.forEach((extraDistance) => {
      const diagonalOffset = Math.round(extraDistance * 0.4);
      const horizontalCandidates = [
        { dx: sideDistance + extraDistance, dy: sideBaselineOffset, anchor: "start" },
        { dx: -sideDistance - extraDistance, dy: sideBaselineOffset, anchor: "end" },
      ];
      const verticalCandidates = [
        { dx: 0, dy: belowDistance + extraDistance, anchor: "middle" },
        { dx: 0, dy: -aboveDistance - extraDistance, anchor: "middle" },
      ];
      candidates.push(
        ...(preferHorizontalLabels ? horizontalCandidates : verticalCandidates),
        ...(preferHorizontalLabels ? verticalCandidates : horizontalCandidates),
        { dx: sideDistance + extraDistance, dy: belowDistance + diagonalOffset, anchor: "start" },
        { dx: -sideDistance - extraDistance, dy: belowDistance + diagonalOffset, anchor: "end" },
        { dx: sideDistance + extraDistance, dy: -aboveDistance - diagonalOffset, anchor: "start" },
        { dx: -sideDistance - extraDistance, dy: -aboveDistance - diagonalOffset, anchor: "end" },
      );
    });

    let selectedCandidate = null;
    candidates.forEach((candidate) => {
      const x = pointX + candidate.dx;
      const y = pointY + candidate.dy;
      const box = createChartLabelBox(x, y, labelWidth, candidate.anchor, fontSize);
      const isWithinBounds = box.left >= bounds.left
        && box.right <= bounds.right
        && box.top >= bounds.top
        && box.bottom <= bounds.bottom;
      if (!isWithinBounds) {
        return;
      }
      const pointCollisionCount = pointBoxes.filter(
        (pointBox) => chartBoxesOverlap(box, pointBox, collisionPadding),
      ).length;
      const labelCollisionCount = occupiedBoxes.filter(
        (occupiedBox) => chartBoxesOverlap(box, occupiedBox, collisionPadding),
      ).length;
      const distanceScore = preferHorizontalLabels
        ? Math.abs(candidate.dx) + Math.abs(candidate.dy) * 2
        : Math.hypot(candidate.dx, candidate.dy);
      const score = pointCollisionCount * 10000
        + labelCollisionCount * 20000
        + distanceScore;
      if (!selectedCandidate || score < selectedCandidate.score) {
        selectedCandidate = { ...candidate, x, y, box, score };
      }
    });

    if (!selectedCandidate) {
      const x = Math.min(Math.max(pointX, bounds.left + labelWidth / 2), bounds.right - labelWidth / 2);
      const y = Math.min(Math.max(pointY + 15, bounds.top + fontSize + 1), bounds.bottom - 2);
      selectedCandidate = {
        x,
        y,
        anchor: "middle",
        box: createChartLabelBox(x, y, labelWidth, "middle", fontSize),
      };
    }

    occupiedBoxes.push(selectedCandidate.box);
    return {
      item,
      x: selectedCandidate.x,
      y: selectedCandidate.y,
      anchor: selectedCandidate.anchor,
      connector: createChartLabelConnector(
        pointX,
        pointY,
        selectedCandidate.box,
        connectorMinimumDistance,
      ),
    };
  });
}

function bindModelOverallChartPoint(point, entry) {
  const openDetails = () => {
    point.blur();
    openModelOverallDetails(entry);
  };
  point.addEventListener("click", openDetails);
  point.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openDetails();
    }
  });
}

function openModelOverallChartDialog(chartType = "duration") {
  const expandButton = chartType === "token"
    ? elements.modelTokenEfficiencyChartExpand
    : elements.modelOverallChartExpand;
  if (expandButton.disabled || elements.modelOverallChartDialog.open) {
    return;
  }

  const sourceChart = chartType === "token" ? elements.modelTokenEfficiencyChart : elements.modelOverallChart;
  const expandedChart = elements.modelOverallChartExpanded;
  const isTokenChart = chartType === "token";
  elements.modelOverallChartDialogTitle.textContent = isTokenChart
    ? "Token 用量与加权通过率"
    : "加权平均耗时与加权通过率";
  elements.modelOverallChartDialogNote.textContent = isTokenChart
    ? "阅读方式：越靠左上越好；短线连接模型名称与对应散点；credit usage 模型不计入。"
    : "阅读方式：越靠左上越好；短线连接模型名称与对应散点。";
  expandedChart.replaceChildren(...[...sourceChart.childNodes].map((node) => node.cloneNode(true)));
  ["viewBox", "preserveAspectRatio"].forEach((attributeName) => {
    const attributeValue = sourceChart.getAttribute(attributeName);
    if (attributeValue) {
      expandedChart.setAttribute(attributeName, attributeValue);
    }
  });

  const expandedTitle = [...expandedChart.children].find((element) => element.tagName.toLowerCase() === "title");
  if (expandedTitle) {
    expandedTitle.id = "model-overall-chart-expanded-title";
    expandedChart.setAttribute("aria-labelledby", expandedTitle.id);
  }

  expandedChart.querySelectorAll(".model-overall-chart__point-label").forEach((label) => {
    label.setAttribute("x", label.dataset.expandedX);
    label.setAttribute("y", label.dataset.expandedY);
    label.setAttribute("text-anchor", label.dataset.expandedAnchor);
  });

  const rankingByModelId = new Map(getOverallRatingData().map((entry) => [String(entry.model.id), entry]));
  const bestPoint = sourceChart.querySelector(".model-overall-chart__point--best");
  const bestEntry = bestPoint ? rankingByModelId.get(String(bestPoint.dataset.modelId)) : null;
  elements.modelOverallChartDialogBest.hidden = !bestEntry;
  elements.modelOverallChartDialogBest.textContent = bestEntry
    ? `当前最强（距离左上角最近）：${bestEntry.model.name}`
    : "";
  expandedChart.querySelectorAll(".model-overall-chart__point").forEach((point) => {
    const entry = rankingByModelId.get(point.dataset.modelId);
    if (entry) {
      bindModelOverallChartPoint(point, entry);
    }
  });
  elements.modelOverallChartDialog.showModal();
}

function renderModelOverallChart(ranking = []) {
  elements.modelOverallChart.replaceChildren();
  elements.modelOverallChartExpand.disabled = true;
  elements.modelOverallChartDownload.disabled = true;
  elements.modelOverallChartEmpty.hidden = true;
  elements.modelOverallChartDialogBest.hidden = true;
  elements.modelOverallChartDialogBest.textContent = "";
  const chartData = createModelOverallChartData(ranking);
  if (chartData.length === 0) {
    elements.modelOverallChartNote.textContent = leaderboardData ? "暂无可绘制的加权平均耗时数据" : "正在加载数据";
    elements.modelOverallChartEmpty.hidden = false;
    elements.modelOverallChartEmpty.textContent = leaderboardData ? "目前没有同时记录加权平均耗时和加权通过率的模型。" : "正在加载散点图数据……";
    return;
  }

  const width = 900;
  const height = 420;
  const margin = { top: 24, right: 28, bottom: 44, left: 64 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const durationWithPadding = Math.max(600, ...chartData.map((item) => item.weightedAverageDurationSeconds)) * 1.12;
  const tickStepSeconds = Math.max(600, Math.ceil((durationWithPadding / 4) / 600) * 600);
  const maxDurationSeconds = tickStepSeconds * 4;
  const xPosition = (durationSeconds) => margin.left + (durationSeconds / maxDurationSeconds) * plotWidth;
  const yPosition = (weightedPassRate) => margin.top + ((100 - weightedPassRate) / 100) * plotHeight;
  const bestChartItem = getModelOverallChartBestItem(chartData, xPosition, yPosition, {
    x: margin.left,
    y: margin.top,
  });

  elements.modelOverallChart.setAttribute("viewBox", `0 0 ${width} ${height}`);
  elements.modelOverallChart.setAttribute("preserveAspectRatio", "xMidYMid meet");
  const title = createChartSvgElement("title", { id: "model-overall-chart-svg-title" }, "模型加权平均耗时与加权通过率散点图");
  elements.modelOverallChart.setAttribute("aria-labelledby", title.id);
  elements.modelOverallChart.append(title);

  const grid = createChartSvgElement("g", { class: "model-overall-chart__grid" });
  [0, 25, 50, 75, 100].forEach((value) => {
    const y = yPosition(value);
    grid.append(createChartSvgElement("line", { x1: margin.left, y1: y, x2: width - margin.right, y2: y }));
  });
  const xTickValues = [0, 0.25, 0.5, 0.75, 1].map((ratio) => ratio * maxDurationSeconds);
  xTickValues.forEach((value) => {
    const x = xPosition(value);
    grid.append(createChartSvgElement("line", { x1: x, y1: margin.top, x2: x, y2: margin.top + plotHeight }));
  });
  elements.modelOverallChart.append(grid);

  const axes = createChartSvgElement("g", { class: "model-overall-chart__axes" });
  axes.append(
    createChartSvgElement("line", { x1: margin.left, y1: margin.top + plotHeight, x2: width - margin.right, y2: margin.top + plotHeight }),
    createChartSvgElement("line", { x1: margin.left, y1: margin.top, x2: margin.left, y2: margin.top + plotHeight }),
  );
  elements.modelOverallChart.append(axes);

  const labels = createChartSvgElement("g", { class: "model-overall-chart__labels" });
  [0, 25, 50, 75, 100].forEach((value) => {
    const y = yPosition(value);
    labels.append(createChartSvgElement("text", { x: margin.left - 12, y: y + 4, "text-anchor": "end" }, `${value}%`));
  });
  xTickValues.forEach((value) => {
    const x = xPosition(value);
    labels.append(createChartSvgElement("text", { x, y: margin.top + plotHeight + 23, "text-anchor": "middle" }, formatChartAxisDuration(value)));
  });
  labels.append(
    createChartSvgElement("text", { class: "model-overall-chart__axis-title", x: margin.left + plotWidth / 2, y: height - 6, "text-anchor": "middle" }, "加权平均耗时"),
    createChartSvgElement("text", { class: "model-overall-chart__axis-title", transform: `translate(16 ${margin.top + plotHeight / 2}) rotate(-90)`, "text-anchor": "middle" }, "加权通过率"),
  );
  elements.modelOverallChart.append(labels);

  const chartBounds = {
    left: margin.left + 4,
    right: margin.left + plotWidth - 4,
    top: margin.top + 4,
    bottom: margin.top + plotHeight - 4,
  };
  const pointLabelLayout = createModelOverallChartLabelLayout(chartData, xPosition, yPosition, chartBounds);
  const expandedPointLabelLayout = createModelOverallChartLabelLayout(
    chartData,
    xPosition,
    yPosition,
    chartBounds,
    {
      fontSize: 6,
      pointRadius: 4,
      collisionPadding: 0.5,
      sideDistance: 9,
      sideBaselineOffset: 2,
      belowDistance: 12,
      aboveDistance: 8,
      extraDistances: [0, 8, 16, 26, 38, 52],
      preferHorizontalLabels: true,
      connectorMinimumDistance: 4,
    },
  );
  const labelConnectors = createChartSvgElement("g", {
    class: "model-overall-chart__label-connectors model-overall-chart__label-connectors--default",
  });
  pointLabelLayout.forEach((label) => {
    if (label.connector) {
      labelConnectors.append(createChartSvgElement("line", {
        class: "model-overall-chart__label-connector",
        ...label.connector,
      }));
    }
  });
  elements.modelOverallChart.append(labelConnectors);

  const expandedLabelConnectors = createChartSvgElement("g", {
    class: "model-overall-chart__label-connectors model-overall-chart__label-connectors--expanded",
  });
  expandedPointLabelLayout.forEach((label) => {
    if (label.connector) {
      expandedLabelConnectors.append(createChartSvgElement("line", {
        class: "model-overall-chart__label-connector",
        ...label.connector,
      }));
    }
  });
  elements.modelOverallChart.append(expandedLabelConnectors);

  const points = createChartSvgElement("g", { class: "model-overall-chart__points" });
  chartData.forEach((item) => {
    const isBest = item === bestChartItem;
    const point = createChartSvgElement("circle", {
      class: `model-overall-chart__point${isBest ? " model-overall-chart__point--best" : ""}`,
      cx: xPosition(item.weightedAverageDurationSeconds),
      cy: yPosition(item.weightedPassRate),
      r: 5,
      fill: item.color,
      tabindex: 0,
      role: "button",
      "data-model-id": item.entry.model.id,
      "aria-label": `${item.entry.model.name}，加权平均耗时 ${formatChartDuration(item.weightedAverageDurationSeconds)}，加权通过率 ${item.weightedPassRate.toFixed(0)}%${isBest ? "，当前最强（距离左上角最近）" : ""}`,
    });
    const pointTitle = createChartSvgElement("title", {}, `${item.entry.model.name}：加权平均耗时 ${formatChartDuration(item.weightedAverageDurationSeconds)}，加权通过率 ${item.weightedPassRate.toFixed(0)}%${isBest ? "，当前最强（距离左上角最近）" : ""}`);
    point.append(pointTitle);
    bindModelOverallChartPoint(point, item.entry);
    points.append(point);
  });
  elements.modelOverallChart.append(points);

  if (bestChartItem) {
    const bestMarker = createChartSvgElement("g", {
      class: "model-overall-chart__best-marker",
      transform: `translate(${xPosition(bestChartItem.weightedAverageDurationSeconds)} ${yPosition(bestChartItem.weightedPassRate)})`,
      "aria-hidden": "true",
    });
    bestMarker.append(
      createChartSvgElement("line", {
        class: "model-overall-chart__best-marker-connector",
        x1: 0,
        y1: -3.5,
        x2: 0,
        y2: -7,
      }),
      createChartSvgElement("text", { class: "model-overall-chart__best-marker-label", x: 0, y: -8, "text-anchor": "middle" }, "BEST"),
    );
    elements.modelOverallChart.append(bestMarker);
  }

  const pointLabels = createChartSvgElement("g", { class: "model-overall-chart__point-labels" });
  pointLabelLayout.forEach((label, index) => {
    const expandedLabel = expandedPointLabelLayout[index];
    pointLabels.append(createChartSvgElement(
      "text",
      {
        class: "model-overall-chart__point-label",
        x: label.x,
        y: label.y,
        "text-anchor": label.anchor,
        "data-expanded-x": expandedLabel.x,
        "data-expanded-y": expandedLabel.y,
        "data-expanded-anchor": expandedLabel.anchor,
      },
      label.item.entry.model.name,
    ));
  });
  elements.modelOverallChart.append(pointLabels);
  elements.modelOverallChartExpand.disabled = false;
  elements.modelOverallChartDownload.disabled = false;
  elements.modelOverallChartNote.textContent = `${chartData.length} 个模型有完整加权平均耗时与加权通过率数据`;
}

function formatChartTokenUsage(tokenUsage) {
  const value = Number(tokenUsage);
  if (!Number.isFinite(value) || value < 0) {
    return "0";
  }
  if (value >= 1_000_000) {
    return `${Math.round(value / 1_000_000)} M`;
  }
  if (value >= 1_000) {
    return `${Math.round(value / 1_000)} k`;
  }
  return String(Math.round(value));
}

function createModelTokenEfficiencyChartData(ranking) {
  return ranking
    .map((entry) => {
      const tokenUsage = getWeightedAverageTokenUsage(entry.model.id);
      const weightedPassRate = Number(entry.overallMetrics?.weightedPassRate);
      if (!Number.isFinite(tokenUsage) || tokenUsage <= 0 || !Number.isFinite(weightedPassRate)) {
        return null;
      }
      return {
        entry,
        tokenUsage,
        weightedAverageDurationSeconds: tokenUsage,
        weightedPassRate,
      };
    })
    .filter(Boolean)
    .sort((left, right) => left.tokenUsage - right.tokenUsage
      || right.weightedPassRate - left.weightedPassRate
      || left.entry.model.name.localeCompare(right.entry.model.name))
    .map((entry, index) => ({
      ...entry,
      color: chartPointColors[index % chartPointColors.length],
    }));
}

function renderModelTokenEfficiencyChart(ranking = []) {
  elements.modelTokenEfficiencyChart.replaceChildren();
  elements.modelTokenEfficiencyChartExpand.disabled = true;
  elements.modelTokenEfficiencyChartDownload.disabled = true;
  elements.modelTokenEfficiencyChartEmpty.hidden = true;
  const chartData = createModelTokenEfficiencyChartData(ranking);
  if (chartData.length === 0) {
    elements.modelTokenEfficiencyChartNote.textContent = leaderboardData ? "暂无可绘制的 token 模型数据" : "正在加载数据";
    elements.modelTokenEfficiencyChartEmpty.hidden = false;
    elements.modelTokenEfficiencyChartEmpty.textContent = leaderboardData
      ? "目前没有同时记录 token 用量和加权通过率的模型；credit usage 模型不计入。"
      : "正在加载散点图数据……";
    return;
  }

  const width = 900;
  const height = 420;
  const margin = { top: 24, right: 28, bottom: 44, left: 64 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const tokenWithPadding = Math.max(1_000_000, ...chartData.map((item) => item.tokenUsage)) * 1.12;
  const tickStep = Math.max(1_000_000, Math.ceil((tokenWithPadding / 4) / 1_000_000) * 1_000_000);
  const maxTokenUsage = tickStep * 4;
  const xPosition = (tokenUsage) => margin.left + (tokenUsage / maxTokenUsage) * plotWidth;
  const yPosition = (weightedPassRate) => margin.top + ((100 - weightedPassRate) / 100) * plotHeight;
  const xTickValues = [0, 0.25, 0.5, 0.75, 1].map((ratio) => ratio * maxTokenUsage);
  const bestChartItem = getModelOverallChartBestItem(chartData, xPosition, yPosition, {
    x: margin.left,
    y: margin.top,
  });

  elements.modelTokenEfficiencyChart.setAttribute("viewBox", `0 0 ${width} ${height}`);
  elements.modelTokenEfficiencyChart.setAttribute("preserveAspectRatio", "xMidYMid meet");
  const title = createChartSvgElement("title", { id: "model-token-efficiency-chart-svg-title" }, "模型 token 用量与加权通过率散点图");
  elements.modelTokenEfficiencyChart.setAttribute("aria-labelledby", title.id);
  elements.modelTokenEfficiencyChart.append(title);

  const grid = createChartSvgElement("g", { class: "model-overall-chart__grid" });
  [0, 25, 50, 75, 100].forEach((value) => {
    const y = yPosition(value);
    grid.append(createChartSvgElement("line", { x1: margin.left, y1: y, x2: width - margin.right, y2: y }));
  });
  xTickValues.forEach((value) => {
    const x = xPosition(value);
    grid.append(createChartSvgElement("line", { x1: x, y1: margin.top, x2: x, y2: margin.top + plotHeight }));
  });
  elements.modelTokenEfficiencyChart.append(grid);

  const axes = createChartSvgElement("g", { class: "model-overall-chart__axes" });
  axes.append(
    createChartSvgElement("line", { x1: margin.left, y1: margin.top + plotHeight, x2: width - margin.right, y2: margin.top + plotHeight }),
    createChartSvgElement("line", { x1: margin.left, y1: margin.top, x2: margin.left, y2: margin.top + plotHeight }),
  );
  elements.modelTokenEfficiencyChart.append(axes);

  const labels = createChartSvgElement("g", { class: "model-overall-chart__labels" });
  [0, 25, 50, 75, 100].forEach((value) => {
    const y = yPosition(value);
    labels.append(createChartSvgElement("text", { x: margin.left - 12, y: y + 4, "text-anchor": "end" }, `${value}%`));
  });
  xTickValues.forEach((value) => {
    const x = xPosition(value);
    labels.append(createChartSvgElement("text", { x, y: margin.top + plotHeight + 23, "text-anchor": "middle" }, formatChartTokenUsage(value)));
  });
  labels.append(
    createChartSvgElement("text", { class: "model-overall-chart__axis-title", x: margin.left + plotWidth / 2, y: height - 6, "text-anchor": "middle" }, "加权平均 token 用量"),
    createChartSvgElement("text", { class: "model-overall-chart__axis-title", transform: `translate(16 ${margin.top + plotHeight / 2}) rotate(-90)`, "text-anchor": "middle" }, "加权通过率"),
  );
  elements.modelTokenEfficiencyChart.append(labels);

  const chartBounds = {
    left: margin.left + 4,
    right: margin.left + plotWidth - 4,
    top: margin.top + 4,
    bottom: margin.top + plotHeight - 4,
  };
  const pointLabelLayout = createModelOverallChartLabelLayout(chartData, xPosition, yPosition, chartBounds, {
    fontSize: 8,
    preferHorizontalLabels: true,
  });
  const expandedPointLabelLayout = createModelOverallChartLabelLayout(
    chartData,
    xPosition,
    yPosition,
    chartBounds,
    {
      fontSize: 6,
      pointRadius: 4,
      collisionPadding: 0.5,
      sideDistance: 9,
      sideBaselineOffset: 2,
      belowDistance: 12,
      aboveDistance: 8,
      extraDistances: [0, 8, 16, 26, 38, 52],
      preferHorizontalLabels: true,
      connectorMinimumDistance: 4,
    },
  );
  const connectors = createChartSvgElement("g", {
    class: "model-overall-chart__label-connectors model-overall-chart__label-connectors--default",
  });
  pointLabelLayout.forEach((label) => {
    if (label.connector) {
      connectors.append(createChartSvgElement("line", {
        class: "model-overall-chart__label-connector",
        ...label.connector,
      }));
    }
  });
  elements.modelTokenEfficiencyChart.append(connectors);

  const expandedConnectors = createChartSvgElement("g", {
    class: "model-overall-chart__label-connectors model-overall-chart__label-connectors--expanded",
  });
  expandedPointLabelLayout.forEach((label) => {
    if (label.connector) {
      expandedConnectors.append(createChartSvgElement("line", {
        class: "model-overall-chart__label-connector",
        ...label.connector,
      }));
    }
  });
  elements.modelTokenEfficiencyChart.append(expandedConnectors);

  const points = createChartSvgElement("g", { class: "model-overall-chart__points" });
  chartData.forEach((item) => {
    const isBest = item === bestChartItem;
    const point = createChartSvgElement("circle", {
      class: `model-overall-chart__point${isBest ? " model-overall-chart__point--best" : ""}`,
      cx: xPosition(item.tokenUsage),
      cy: yPosition(item.weightedPassRate),
      r: 5,
      fill: item.color,
      tabindex: 0,
      role: "button",
      "data-model-id": item.entry.model.id,
      "aria-label": `${item.entry.model.name}，加权平均 token 用量 ${formatTokenUsage(item.tokenUsage, "token", "compact")}，加权通过率 ${item.weightedPassRate.toFixed(0)}%${isBest ? "，当前最强（距离左上角最近）" : ""}`,
    });
    point.append(createChartSvgElement("title", {}, `${item.entry.model.name}：加权平均 token 用量 ${formatTokenUsage(item.tokenUsage, "token", "compact")}，加权通过率 ${item.weightedPassRate.toFixed(0)}%${isBest ? "，当前最强（距离左上角最近）" : ""}`));
    bindModelOverallChartPoint(point, item.entry);
    points.append(point);
  });
  elements.modelTokenEfficiencyChart.append(points);

  if (bestChartItem) {
    const bestMarker = createChartSvgElement("g", {
      class: "model-overall-chart__best-marker",
      transform: `translate(${xPosition(bestChartItem.tokenUsage)} ${yPosition(bestChartItem.weightedPassRate)})`,
      "aria-hidden": "true",
    });
    bestMarker.append(
      createChartSvgElement("line", {
        class: "model-overall-chart__best-marker-connector",
        x1: 0,
        y1: -3.5,
        x2: 0,
        y2: -7,
      }),
      createChartSvgElement("text", { class: "model-overall-chart__best-marker-label", x: 0, y: -8, "text-anchor": "middle" }, "BEST"),
    );
    elements.modelTokenEfficiencyChart.append(bestMarker);
  }

  const pointLabels = createChartSvgElement("g", { class: "model-overall-chart__point-labels" });
  pointLabelLayout.forEach((label, index) => {
    const expandedLabel = expandedPointLabelLayout[index];
    pointLabels.append(createChartSvgElement("text", {
      class: "model-overall-chart__point-label",
      x: label.x,
      y: label.y,
      "text-anchor": label.anchor,
      "data-expanded-x": expandedLabel.x,
      "data-expanded-y": expandedLabel.y,
      "data-expanded-anchor": expandedLabel.anchor,
    }, label.item.entry.model.name));
  });
  elements.modelTokenEfficiencyChart.append(pointLabels);
  elements.modelTokenEfficiencyChartExpand.disabled = false;
  elements.modelTokenEfficiencyChartDownload.disabled = false;
  elements.modelTokenEfficiencyChartNote.textContent = `${chartData.length} 个 token 模型；credit usage 模型未纳入`;
}

function getRequirementModelEntries(requirement) {
  if (!requirement) {
    return undefined;
  }
  return [
    requirement.models,
    requirement.results,
    requirement.evaluations,
    requirement.modelResults,
  ].find(Array.isArray);
}

function hasExplicitRequirementModelEntries(requirement) {
  return [
    requirement?.models,
    requirement?.results,
    requirement?.evaluations,
    requirement?.modelResults,
  ].some(Array.isArray);
}

function getTestedRequirements(modelId) {
  const requirements = leaderboardData?.requirements ?? [];
  const hasPerRequirementResults = requirements.some(hasExplicitRequirementModelEntries);
  if (!hasPerRequirementResults) {
    return requirements.length > 0 && leaderboardData.models.some((entry) => entry.modelId === modelId) ? requirements : [];
  }

  return requirements.filter((requirement) => {
    const entries = hasExplicitRequirementModelEntries(requirement)
      ? (getRequirementModelEntries(requirement) ?? [])
      : leaderboardData.models;
    return entries.some((entry) => (entry.modelId ?? entry.id) === modelId);
  });
}

function getTestedRequirementCount(modelId) {
  return getTestedRequirements(modelId).length;
}

function getRequirementModelEntry(requirement, modelId) {
  const entries = getRequirementModelEntries(requirement);
  if (hasExplicitRequirementModelEntries(requirement)) {
    return entries.find((entry) => (entry.modelId ?? entry.id) === modelId) ?? null;
  }
  return leaderboardData?.models.find((entry) => entry.modelId === modelId) ?? null;
}

function getRequirementModelImages(requirement, modelId) {
  const model = models.find((item) => item.id === modelId);
  const screenshotMap = requirement?.screenshots;
  if (hasExplicitRequirementModelEntries(requirement) && !screenshotMap) {
    return [];
  }
  if (!screenshotMap || !Object.prototype.hasOwnProperty.call(screenshotMap, String(modelId))) {
    return model?.images ?? [];
  }
  const rawImages = Array.isArray(screenshotMap[String(modelId)])
    ? screenshotMap[String(modelId)]
    : [];
  return rawImages.map((image, index) => {
    if (Array.isArray(image)) {
      return {
        file: image[0],
        title: image[1],
        tags: Array.isArray(image[2]) ? image[2] : [],
        modelId,
        modelName: model?.name,
        sequence: index + 1,
      };
    }
    return {
      ...image,
      tags: Array.isArray(image.tags) ? image.tags : [],
      modelId,
      modelName: model?.name,
      sequence: image.sequence ?? index + 1,
    };
  });
}

function getRequirementTestedAt(requirement, modelId) {
  if (hasExplicitRequirementModelEntries(requirement)) {
    return getRequirementModelEntry(requirement, modelId)?.testedAt ?? null;
  }
  return models.find((model) => model.id === modelId)?.testedAt ?? null;
}

function getRequirementScore(entry, requirement) {
  if (!entry) {
    return null;
  }
  const testCases = getRequirementTestCases(requirement);
  const scoring = getRequirementScoring(requirement);
  const failedIds = new Set(Object.keys(entry.failures ?? {}));
  const deductions = testCases.reduce(
    (total, testCase) => total + (failedIds.has(testCase.id) ? scoring.deductionByPriority[testCase.priority] : 0),
    0,
  );
  return {
    score: scoring.initial - deductions,
    maxScore: scoring.initial,
  };
}

function getOverallModelMetrics(modelId) {
  if (!leaderboardData) {
    return null;
  }
  const requirements = getTestedRequirements(modelId);
  const scoreRecords = requirements
    .map((requirement) => {
      const score = getRequirementScore(getRequirementModelEntry(requirement, modelId), requirement);
      const weightedPassRate = getWeightedPassRate(score?.score, score?.maxScore);
      return score && weightedPassRate !== null
        ? { requirement, score, weightedPassRate, weight: getRequirementWeight(requirement) }
        : null;
    })
    .filter(Boolean);
  if (scoreRecords.length === 0) {
    return null;
  }
  const totalWeight = scoreRecords.reduce((total, record) => total + record.weight, 0);
  if (totalWeight <= 0) {
    return null;
  }
  const weightedPassRate = scoreRecords.reduce(
    (total, record) => total + record.weightedPassRate * record.weight,
    0,
  ) / totalWeight;
  return {
    score: scoreRecords.reduce((total, record) => total + record.score.score * record.weight, 0) / totalWeight,
    maxScore: scoreRecords.reduce((total, record) => total + record.score.maxScore * record.weight, 0) / totalWeight,
    weightedPassRate,
  };
}

function formatAverageScore(score) {
  return Number.isInteger(score) ? String(score) : score.toFixed(1);
}

function formatWeightedPassRate(weightedPassRate) {
  const value = Number(weightedPassRate);
  return Number.isFinite(value) ? `${Math.round(value)}%` : "暂无";
}

function getModelToolName(entry) {
  return entry.agent?.software || entry.model.tool;
}

function createMultimodalIcon(model) {
  if (!model?.supportsMultimodal) {
    return null;
  }
  const icon = document.createElement("span");
  icon.className = "model-multimodal-icon";
  icon.setAttribute("role", "img");
  icon.setAttribute("aria-label", "支持多模态");
  icon.title = "支持图片输入（多模态）";
  icon.innerHTML = `
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <rect x="1.5" y="2.5" width="13" height="11" rx="2"></rect>
      <circle cx="5" cy="6" r="1"></circle>
      <path d="m2.7 11 3.1-3.1 2.3 2.2 1.7-1.7 3.5 3.4"></path>
    </svg>
  `;
  return icon;
}

function appendModelName(container, model, fallbackName) {
  container.append(document.createTextNode(model?.name ?? fallbackName));
  const multimodalIcon = createMultimodalIcon(model);
  if (multimodalIcon) {
    container.append(multimodalIcon);
  }
}

function createResultBranchLink(entry, className = "") {
  if (!entry.resultBranchUrl) {
    return null;
  }
  const link = document.createElement("a");
  link.className = `result-branch-link${className ? ` ${className}` : ""}`;
  link.href = entry.resultBranchUrl;
  link.target = "_blank";
  link.rel = "noreferrer";
  link.textContent = "查看源码";
  link.setAttribute("aria-label", `在 GitHub 查看 ${entry.model?.name ?? entry.modelId} 的源码`);
  return link;
}

function openModelOverallDetails(entry) {
  const requirements = getTestedRequirements(entry.model.id);
  const overallMetrics = getOverallModelMetrics(entry.model.id);
  const modelToolName = getModelToolName(entry);
  const weightedAverageUsage = getWeightedAverageUsage(entry.model.id);
  const usageMeta = weightedAverageUsage
    ? `加权平均 ${weightedAverageUsage.unit === "credit" ? "credit usage" : "token usage"} ${formatTokenUsage(weightedAverageUsage.value, weightedAverageUsage.unit, "compact")}`
    : "加权平均用量暂无数据";
  const dialogMeta = [
    `已测试 ${requirements.length} / ${leaderboardData.requirements.length}`,
    overallMetrics ? `加权平均得分 ${formatAverageScore(overallMetrics.score)} / ${formatAverageScore(overallMetrics.maxScore)}` : "加权平均得分暂无数据",
    entry.weightedAverageDurationSeconds === null
      ? "加权平均耗时暂无数据"
      : `加权平均耗时 ${formatDurationSeconds(entry.weightedAverageDurationSeconds)}`,
    usageMeta,
  ];
  elements.modelOverallDialogModel.textContent = `${entry.model.name} · ${modelToolName}`;
  elements.modelOverallDialogMeta.textContent = dialogMeta.join(" · ");
  elements.modelOverallDialogList.replaceChildren();

  if (requirements.length === 0) {
    const empty = document.createElement("p");
    empty.className = "model-overall-dialog__empty";
    empty.textContent = "暂无已测试需求记录";
    elements.modelOverallDialogList.append(empty);
  } else {
    requirements.forEach((requirement) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "model-overall-dialog__item";
      const title = document.createElement("strong");
      title.textContent = requirement.title;
      const meta = document.createElement("span");
      meta.textContent = `${requirement.baseRepository} · commit ${requirement.baseCommit}`;
      button.append(title, meta);
      button.addEventListener("click", () => {
        state.modelId = entry.model.id;
        state.requirementId = requirement.id;
        elements.modelOverallDialog.close();
        renderGlobalRequirementSelect();
        setView("model");
      });
      elements.modelOverallDialogList.append(button);
    });
  }

  elements.modelOverallDialog.showModal();
}

function createModelOverallRow(entry) {
  const row = document.createElement("button");
  row.type = "button";
  row.className = "model-overall-row";
  row.style.setProperty("--item-index", String(Math.max(0, (entry.rank ?? 1) - 1)));
  row.setAttribute("aria-label", `查看 ${entry.model.name}${entry.model.supportsMultimodal ? "（支持多模态）" : ""} 已测试的需求`);
  row.addEventListener("click", () => openModelOverallDetails(entry));

  const identity = document.createElement("div");
  identity.className = "model-overall-row__identity";
  const rank = document.createElement("span");
  rank.className = "model-overall-row__rank";
  rank.textContent = entry.overallMetrics ? `第 ${String(entry.rank).padStart(2, "0")} 名` : "未纳入测试";
  const name = document.createElement("strong");
  name.className = "model-overall-row__name";
  appendModelName(name, entry.model, entry.modelId);
  name.append(document.createTextNode(" · "));
  const tool = document.createElement("span");
  tool.className = "model-overall-row__tool";
  tool.textContent = getModelToolName(entry);
  name.append(tool);
  identity.append(rank, name);

  const testedRequirements = document.createElement("div");
  testedRequirements.className = "model-overall-row__score-block";
  const testedLabel = document.createElement("span");
  testedLabel.className = "model-overall-row__label";
  testedLabel.textContent = "已测试需求数量";
  const testedValue = document.createElement("strong");
  testedValue.className = "model-overall-row__score";
  testedValue.textContent = String(entry.testedRequirementCount);
  const testedMeta = document.createElement("span");
  testedMeta.className = "model-overall-row__meta";
  testedMeta.textContent = `${entry.testedRequirementCount} / ${leaderboardData.requirements.length}`;
  testedRequirements.append(testedLabel, testedValue, testedMeta);

  const testScore = document.createElement("div");
  testScore.className = "model-overall-row__score-block";
  const testLabel = document.createElement("span");
  testLabel.className = "model-overall-row__label";
  testLabel.textContent = "加权平均评分";
  const testValue = document.createElement("strong");
  testValue.className = "model-overall-row__score";
  testValue.textContent = entry.overallMetrics
    ? `${formatAverageScore(entry.overallMetrics.score)} / ${formatAverageScore(entry.overallMetrics.maxScore)}`
    : "暂无数据";
  const testMeta = document.createElement("span");
  testMeta.className = "model-overall-row__meta";
  if (entry.overallMetrics) {
    testMeta.textContent = `${entry.testedRequirementCount} 个需求 · 加权通过率 ${formatWeightedPassRate(entry.overallMetrics.weightedPassRate)}`;
  } else {
    testMeta.textContent = "暂无测试记录";
  }
  testScore.append(testLabel, testValue, testMeta);

  const duration = document.createElement("div");
  duration.className = "model-overall-row__score-block";
  const durationLabel = document.createElement("span");
  durationLabel.className = "model-overall-row__label";
  durationLabel.textContent = "加权平均耗时";
  const durationValue = document.createElement("strong");
  durationValue.className = "model-overall-row__score";
  durationValue.textContent = entry.weightedAverageDurationSeconds === null
    ? "暂无数据"
    : formatDurationSeconds(entry.weightedAverageDurationSeconds);
  const durationMeta = document.createElement("span");
  durationMeta.className = "model-overall-row__meta";
  durationMeta.textContent = entry.weightedAverageDurationSeconds === null ? "暂无测试记录" : "按需求权重计算";
  duration.append(durationLabel, durationValue, durationMeta);

  const userScore = document.createElement("div");
  userScore.className = "model-overall-row__score-block";
  const userLabel = document.createElement("span");
  userLabel.className = "model-overall-row__label";
  userLabel.textContent = "用户打星评分";
  const userValue = document.createElement("strong");
  userValue.className = "model-overall-row__score";
  userValue.textContent = entry.rating ? `${entry.rating.averageStars.toFixed(2)} / 5` : "暂无评分";
  const userStars = createRatingStars(entry.rating?.averageStars ?? 0);
  userStars.classList.add("model-overall-row__stars");
  const userMeta = document.createElement("span");
  userMeta.className = "model-overall-row__meta";
  userMeta.textContent = entry.rating ? `${entry.rating.voteCount} 次评分` : "等待用户评分数据";
  userScore.append(userLabel, userValue, userStars, userMeta);

  row.append(identity, testedRequirements, testScore, duration, userScore);
  return row;
}

function renderModelOverall() {
  elements.modelOverallList.replaceChildren();
  if (!leaderboardData) {
    elements.modelOverallNote.textContent = "正在加载";
    renderModelOverallChart();
    renderModelTokenEfficiencyChart();
    return;
  }

  const ranking = getOverallRatingData();
  renderModelOverallChart(ranking);
  renderModelTokenEfficiencyChart(ranking);
  ranking.forEach((entry) => elements.modelOverallList.append(createModelOverallRow(entry)));
  const ratedCount = ranking.filter((entry) => entry.rating).length;
  elements.modelOverallNote.textContent = ratingState.allLoading
    ? "正在加载评分"
    : ratingState.allError
      ? "评分服务尚未部署"
      : `${ranking.length} 个参赛模型 · ${ratedCount} 个已有用户评分`;
}

const state = {
  view: "home",
  modelId: models[0].id,
  featureId: features[0].id,
  requirementId: null,
  modelContentTab: "screenshots",
  requirementsTab: "requirement",
  dialogItems: [],
  dialogIndex: 0,
  leaderboardDetailCaseVoteId: null,
};

let activeViewTransition = null;

const elements = {
  viewButtons: [...document.querySelectorAll("[data-view]")],
  modelOverallButton: document.querySelector('[data-view="model-overall"]'),
  homeView: document.getElementById("home-view"),
  requirementList: document.getElementById("requirement-list"),
  homeHeaderEntries: document.querySelector(".home-header-entries"),
  buildUpdatedAt: document.getElementById("build-updated-at"),
  homeModelOverallEntry: document.getElementById("home-model-overall-entry"),
  homeTestMethodEntry: document.getElementById("home-test-method-entry"),
  globalAverageNote: document.getElementById("global-average-note"),
  modelOverallView: document.getElementById("model-overall-view"),
  modelOverallList: document.getElementById("model-overall-list"),
  modelOverallNote: document.getElementById("model-overall-note"),
  modelOverallChart: document.getElementById("model-overall-chart"),
  modelOverallChartEmpty: document.getElementById("model-overall-chart-empty"),
  modelOverallChartNote: document.getElementById("model-overall-chart-note"),
  modelOverallChartShell: document.getElementById("model-overall-chart-shell"),
  modelOverallChartExpand: document.getElementById("model-overall-chart-expand"),
  modelOverallChartDownload: document.getElementById("model-overall-chart-download"),
  modelTokenEfficiencyChart: document.getElementById("model-token-efficiency-chart"),
  modelTokenEfficiencyChartEmpty: document.getElementById("model-token-efficiency-chart-empty"),
  modelTokenEfficiencyChartNote: document.getElementById("model-token-efficiency-chart-note"),
  modelTokenEfficiencyChartShell: document.getElementById("model-token-efficiency-chart-shell"),
  modelTokenEfficiencyChartExpand: document.getElementById("model-token-efficiency-chart-expand"),
  modelTokenEfficiencyChartDownload: document.getElementById("model-token-efficiency-chart-download"),
  modelOverallChartDialog: document.getElementById("model-overall-chart-dialog"),
  modelOverallChartDialogTitle: document.getElementById("model-overall-chart-dialog-title"),
  modelOverallChartDialogNote: document.getElementById("model-overall-chart-dialog-note"),
  modelOverallChartDialogClose: document.getElementById("model-overall-chart-dialog-close"),
  modelOverallChartDialogBest: document.getElementById("model-overall-chart-dialog-best"),
  modelOverallChartExpanded: document.getElementById("model-overall-chart-expanded"),
  modelOverallDialog: document.getElementById("model-overall-dialog"),
  modelOverallDialogModel: document.getElementById("model-overall-dialog-model"),
  modelOverallDialogMeta: document.getElementById("model-overall-dialog-meta"),
  modelOverallDialogList: document.getElementById("model-overall-dialog-list"),
  modelOverallDialogClose: document.getElementById("model-overall-dialog-close"),
  leaderboardDetailDialog: document.getElementById("leaderboard-detail-dialog"),
  leaderboardDetailDialogLabel: document.getElementById("leaderboard-detail-dialog-label"),
  leaderboardDetailDialogTitle: document.getElementById("leaderboard-detail-dialog-title"),
  leaderboardDetailDialogRequirement: document.getElementById("leaderboard-detail-dialog-requirement"),
  leaderboardDetailDialogModel: document.getElementById("leaderboard-detail-dialog-model"),
  leaderboardDetailDialogTestCase: document.getElementById("leaderboard-detail-dialog-test-case"),
  leaderboardDetailDialogScenario: document.getElementById("leaderboard-detail-dialog-scenario"),
  leaderboardDetailDialogReasonSection: document.getElementById("leaderboard-detail-dialog-reason-section"),
  leaderboardDetailDialogReasonTitle: document.getElementById("leaderboard-detail-dialog-reason-title"),
  leaderboardDetailDialogReason: document.getElementById("leaderboard-detail-dialog-reason"),
  leaderboardDetailDialogCaseVoteSection: document.getElementById("leaderboard-detail-dialog-case-vote-section"),
  leaderboardDetailDialogCaseVote: document.getElementById("leaderboard-detail-dialog-case-vote"),
  leaderboardDetailDialogClose: document.getElementById("leaderboard-detail-dialog-close"),
  pageHeaderControls: document.querySelector(".page-header__controls"),
  viewSwitch: document.querySelector(".view-switch"),
  globalRequirementSwitch: document.querySelector(".global-requirement-switch"),
  backHome: document.getElementById("back-home"),
  globalRequirementSelect: document.getElementById("global-requirement-select"),
  modelView: document.getElementById("model-view"),
  featureView: document.getElementById("feature-view"),
  modelTabs: document.getElementById("model-tabs"),
  modelContentTabs: document.getElementById("model-content-tabs"),
  modelKicker: document.getElementById("model-kicker"),
  modelTitle: document.getElementById("model-title"),
  modelTestedAt: document.getElementById("model-tested-at"),
  modelCount: document.getElementById("model-count"),
  modelTokenUsage: document.getElementById("model-token-usage"),
  modelRating: document.getElementById("model-rating"),
  modelGallery: document.getElementById("model-gallery"),
  modelUnexpectedCasesView: document.getElementById("model-unexpected-cases-view"),
  modelUnexpectedCasesEmpty: document.getElementById("model-unexpected-cases-empty"),
  modelUnexpectedCasesList: document.getElementById("model-unexpected-cases-list"),
  featureTabs: document.getElementById("feature-tabs"),
  featureTitle: document.getElementById("feature-title"),
  featureDescription: document.getElementById("feature-description"),
  featureCount: document.getElementById("feature-count"),
  featureComparison: document.getElementById("feature-comparison"),
  leaderboardView: document.getElementById("leaderboard-view"),
  leaderboardRequirement: document.getElementById("leaderboard-requirement"),
  leaderboardDescription: document.getElementById("leaderboard-description"),
  leaderboardTestCount: document.getElementById("leaderboard-test-count"),
  leaderboardExport: document.getElementById("leaderboard-export"),
  leaderboardSummary: document.getElementById("leaderboard-summary"),
  leaderboardNote: document.getElementById("leaderboard-note"),
  leaderboardTable: document.querySelector(".leaderboard-table"),
  leaderboardHead: document.getElementById("leaderboard-head"),
  leaderboardBody: document.getElementById("leaderboard-body"),
  requirementsView: document.getElementById("requirements-view"),
  requirementTabs: document.getElementById("requirement-tabs"),
  testMethodTab: document.getElementById("test-method-tab"),
  requirementDetailView: document.getElementById("requirement-detail-view"),
  testMethodView: document.getElementById("test-method-view"),
  testMethodFirstPrompt: document.getElementById("test-method-first-prompt"),
  copyTestMethodFirstPrompt: document.getElementById("copy-test-method-first-prompt"),
  requirementTitle: document.getElementById("requirement-title"),
  requirementRepository: document.getElementById("requirement-repository"),
  requirementCommit: document.getElementById("requirement-commit"),
  copyRequirementCommit: document.getElementById("copy-requirement-commit"),
  copyRequirementPrompt: document.getElementById("copy-requirement-prompt"),
  requirementDatabase: document.getElementById("requirement-database"),
  requirementWeight: document.getElementById("requirement-weight"),
  requirementWeightNote: document.getElementById("requirement-weight-note"),
  requirementPrompt: document.getElementById("requirement-prompt"),
  agentRosterBody: document.getElementById("agent-roster-body"),
  dialog: document.getElementById("image-dialog"),
  dialogModel: document.getElementById("dialog-model"),
  dialogTitle: document.getElementById("dialog-title"),
  dialogImage: document.getElementById("dialog-image"),
  dialogFile: document.getElementById("dialog-file"),
  dialogClose: document.getElementById("dialog-close"),
  dialogPrev: document.getElementById("dialog-prev"),
  dialogNext: document.getElementById("dialog-next"),
  toast: document.getElementById("toast"),
};

let toastTimer = null;

function hideToast() {
  if (!elements.toast) {
    return;
  }
  window.clearTimeout(toastTimer);
  elements.toast.hidden = true;
  elements.toast.replaceChildren();
  elements.toast.classList.remove("toast--anchored", "toast--anchored-below");
  elements.toast.style.removeProperty("left");
  elements.toast.style.removeProperty("top");
  elements.toast.style.removeProperty("--toast-arrow-left");
}

function showToast(message, tone = "info", options = {}) {
  if (!elements.toast) {
    return;
  }
  window.clearTimeout(toastTimer);
  elements.toast.className = `toast toast--${tone}`;
  elements.toast.style.removeProperty("left");
  elements.toast.style.removeProperty("top");
  elements.toast.style.removeProperty("--toast-arrow-left");
  const toastAnchor = options.anchor instanceof Element ? options.anchor : null;
  if (toastAnchor) {
    elements.toast.classList.add("toast--anchored");
  }
  elements.toast.replaceChildren();
  if (typeof message === "string") {
    elements.toast.textContent = message;
  } else if (message instanceof Node) {
    elements.toast.append(message);
  } else {
    elements.toast.textContent = String(message);
  }
  elements.toast.hidden = false;
  if (toastAnchor) {
    positionAnchoredToast(toastAnchor);
  }
  toastTimer = window.setTimeout(hideToast, 3200);
}

function positionAnchoredToast(anchor) {
  const anchorRect = anchor.getBoundingClientRect();
  const toastRect = elements.toast.getBoundingClientRect();
  const viewportPadding = 8;
  const gap = 10;
  const centeredLeft = anchorRect.left + anchorRect.width / 2 - toastRect.width / 2;
  const left = Math.min(
    Math.max(viewportPadding, centeredLeft),
    Math.max(viewportPadding, window.innerWidth - toastRect.width - viewportPadding),
  );
  const preferredTop = anchorRect.top - toastRect.height - gap;
  const isBelow = preferredTop < viewportPadding;
  const top = isBelow
    ? Math.min(anchorRect.bottom + gap, window.innerHeight - toastRect.height - viewportPadding)
    : preferredTop;
  const arrowLeft = Math.min(
    Math.max(12, anchorRect.left + anchorRect.width / 2 - left),
    Math.max(12, toastRect.width - 12),
  );
  elements.toast.classList.toggle("toast--anchored-below", isBelow);
  elements.toast.style.left = `${left}px`;
  elements.toast.style.top = `${Math.max(viewportPadding, top)}px`;
  elements.toast.style.setProperty("--toast-arrow-left", `${arrowLeft}px`);
}

document.addEventListener("click", (event) => {
  if (!elements.toast || elements.toast.hidden || !elements.toast.classList.contains("toast--anchored")) {
    return;
  }
  const target = event.target instanceof Element ? event.target : null;
  if (!target || elements.toast.contains(target) || target.closest(".leaderboard-final-adopted-banner")) {
    return;
  }
  hideToast();
});

function createScreenshotCard(image, items, index, compact = false) {
  const article = document.createElement("article");
  article.className = "screenshot-card";
  article.style.setProperty("--item-index", String(index));

  const meta = document.createElement("div");
  meta.className = "screenshot-meta";

  const sequence = document.createElement("span");
  sequence.className = "sequence-number";
  sequence.textContent = String(image.sequence).padStart(2, "0");

  const title = document.createElement("p");
  title.className = "screenshot-title";
  title.textContent = image.title;

  const button = document.createElement("button");
  button.type = "button";
  button.className = "image-button";
  button.setAttribute("aria-label", `查看大图：${image.modelName}，${image.title}`);
  button.addEventListener("click", () => openDialog(items, index));

  const placeholder = document.createElement("span");
  placeholder.className = "image-placeholder";
  placeholder.setAttribute("aria-hidden", "true");
  const placeholderShimmer = document.createElement("span");
  placeholderShimmer.className = "image-placeholder__shimmer";
  const placeholderContent = document.createElement("span");
  placeholderContent.className = "image-placeholder__content";
  const placeholderLabel = document.createElement("strong");
  placeholderLabel.className = "image-placeholder__label";
  placeholderLabel.textContent = "正在加载截图";
  const placeholderMeta = document.createElement("span");
  placeholderMeta.className = "image-placeholder__meta";
  placeholderMeta.textContent = "图片载入后显示";
  placeholderContent.append(placeholderLabel, placeholderMeta);
  placeholder.append(placeholderShimmer, placeholderContent);

  const img = document.createElement("img");
  img.alt = `${image.modelName}：${image.title}`;
  img.loading = "lazy";
  img.decoding = "async";
  const setImageState = (state) => {
    button.classList.remove("image-button--loading", "image-button--loaded", "image-button--error");
    button.classList.add(`image-button--${state}`);
    if (state === "error") {
      placeholderLabel.textContent = "截图加载失败";
      placeholderMeta.textContent = "请稍后重试";
    }
  };
  img.addEventListener("load", () => setImageState("loaded"), { once: true });
  img.addEventListener("error", () => setImageState("error"), { once: true });
  img.src = assetRoot + image.file;
  setImageState(img.complete ? (img.naturalWidth > 0 ? "loaded" : "error") : "loading");

  meta.append(sequence, title);
  button.append(placeholder, img);
  article.append(meta, button);

  if (compact) {
    article.classList.add("screenshot-card--compact");
  }

  return article;
}

function renderModelTabs() {
  elements.modelTabs.replaceChildren();
  for (const model of models) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "tab-button";
    button.role = "tab";
    button.textContent = model.name;
    button.setAttribute("aria-selected", String(model.id === state.modelId));
    button.addEventListener("click", () => {
      state.modelId = model.id;
      state.modelContentTab = "screenshots";
      setView("model");
    });
    elements.modelTabs.append(button);
  }
}

function renderModelContentTabs() {
  elements.modelContentTabs.replaceChildren();
  const tabs = [
    ["screenshots", "测试截图"],
    ["unexpected", "意外情况"],
  ];
  tabs.forEach(([tabId, label]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "tab-button";
    button.role = "tab";
    button.textContent = label;
    button.setAttribute("aria-selected", String(state.modelContentTab === tabId));
    button.addEventListener("click", () => {
      state.modelContentTab = tabId;
      setView("model");
    });
    elements.modelContentTabs.append(button);
  });
}

function createRatingStars(averageStars) {
  const value = Math.max(0, Math.min(5, Number(averageStars) || 0));
  const roundedValue = Math.round(value * 2) / 2;
  const fullStars = Math.floor(roundedValue);
  const hasHalfStar = roundedValue - fullStars === 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  const container = document.createElement("span");
  container.className = "rating-stars";
  container.setAttribute("aria-hidden", "true");

  const appendStar = (className, character) => {
    const star = document.createElement("span");
    star.className = `rating-star ${className}`;
    star.textContent = character;
    container.append(star);
  };

  for (let index = 0; index < fullStars; index += 1) {
    appendStar("rating-star--full", "★");
  }
  if (hasHalfStar) {
    appendStar("rating-star--half", "☆");
  }
  for (let index = 0; index < emptyStars; index += 1) {
    appendStar("rating-star--empty", "☆");
  }
  return container;
}

function renderModelRating() {
  elements.modelRating.replaceChildren();
  if (!state.requirementId) {
    return;
  }

  const rating = ratingState.values.get(state.modelId);
  const panel = document.createElement("div");
  panel.className = "rating-panel";

  const summary = document.createElement("div");
  summary.className = "rating-summary";
  const stars = createRatingStars(rating?.averageStars ?? 0);
  stars.classList.add("rating-summary__stars");
  const summaryText = document.createElement("span");
  summaryText.className = "rating-summary__text";
  summaryText.textContent = rating && rating.voteCount > 0
    ? `${rating.averageStars.toFixed(2)} / 5 · ${rating.voteCount} 次`
    : "暂无评分";
  summary.append(stars, summaryText);

  const form = document.createElement("div");
  form.className = "rating-form";
  const label = document.createElement("label");
  label.className = "rating-form__label";
  label.textContent = "为此模型评分";
  const input = document.createElement("input");
  input.type = "range";
  input.min = "0";
  input.max = "10";
  input.step = "1";
  input.value = "10";
  input.className = "rating-form__range";
  input.setAttribute("aria-label", "选择半星评分");
  const value = document.createElement("output");
  value.className = "rating-form__value";
  value.textContent = "5 星";
  input.addEventListener("input", () => {
    value.textContent = `${Number(input.value) / 2} 星`;
  });
  const submit = document.createElement("button");
  submit.type = "button";
  submit.className = "rating-form__submit";
  submit.textContent = "提交评分";
  submit.addEventListener("click", async () => {
    submit.disabled = true;
    showToast("正在提交评分", "info");
    try {
      const response = await fetch(apiUrl("/api/ratings/vote"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requirementId: state.requirementId,
          modelId: state.modelId,
          starsHalf: Number(input.value),
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error === "request_rate_limited"
          ? "请求过于频繁"
          : payload.error === "already_rated"
            ? "该模型已评分"
            : payload.error === "daily_limit_reached" && Number.isInteger(payload.limit)
              ? `今日对该模型的评分次数已达 ${payload.limit} 次上限`
              : "评分服务暂不可用");
      }
      showToast("评分已记录", "success");
      await loadRatingsForRequirement(true);
      await loadAllRatingsForRequirements(true);
    } catch (error) {
      showToast(error instanceof Error && error.message ? error.message : "评分服务尚未部署", "error");
    } finally {
      submit.disabled = false;
    }
  });
  form.append(label, input, value, submit);
  panel.append(summary, form);
  elements.modelRating.append(panel);
}

async function requestRatingsForRequirement(requirementId, force = false) {
  if (!force && ratingState.valuesByRequirement.has(requirementId)) {
    return ratingState.valuesByRequirement.get(requirementId);
  }
  if (!force && ratingState.requestsByRequirement.has(requirementId)) {
    return ratingState.requestsByRequirement.get(requirementId);
  }

  const request = (async () => {
    const response = await fetch(apiUrl(`/api/ratings?requirementId=${encodeURIComponent(requirementId)}`), {
      cache: "no-store",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("评分服务尚未部署");
    }
    const payload = await response.json();
    const values = Array.isArray(payload.data) ? payload.data : [];
    ratingState.valuesByRequirement.set(requirementId, values);
    return values;
  })();
  ratingState.requestsByRequirement.set(requirementId, request);
  try {
    return await request;
  } finally {
    if (ratingState.requestsByRequirement.get(requirementId) === request) {
      ratingState.requestsByRequirement.delete(requirementId);
    }
  }
}

async function loadRatingsForRequirement(force = false) {
  const requirementId = state.requirementId;
  if (!requirementId) {
    return;
  }
  if (!force && ratingState.loaded && ratingState.requirementId === requirementId) {
    if (state.view === "leaderboard") {
      renderLeaderboard();
    } else {
      renderModelRating();
    }
    return;
  }
  ratingState.requirementId = requirementId;
  ratingState.loading = true;
  try {
    const values = await requestRatingsForRequirement(requirementId, force);
    if (state.requirementId === requirementId) {
      ratingState.values = new Map(values.map((item) => [item.modelId, item]));
      ratingState.loaded = true;
    }
  } catch {
    if (state.requirementId === requirementId) {
      ratingState.values = new Map();
      ratingState.loaded = false;
    }
  } finally {
    if (state.requirementId === requirementId) {
      ratingState.loading = false;
      const activeElement = document.activeElement;
      if (activeElement?.classList.contains("rating-form__range")) {
        return;
      }
      if (state.view === "leaderboard") {
        renderLeaderboard();
      } else {
        renderModelRating();
      }
    }
  }
}

async function loadAllRatingsForRequirements(force = false) {
  if (!leaderboardData || ratingState.allLoading || (ratingState.allLoaded && !force)) {
    return;
  }

  const requirements = leaderboardData.requirements ?? [];
  if (requirements.length === 0) {
    ratingState.allLoaded = true;
    renderModelOverall();
    return;
  }

  ratingState.allLoading = true;
  ratingState.allError = false;
  renderModelOverall();
  try {
    const responses = await Promise.all(
      requirements.map((requirement) => requestRatingsForRequirement(requirement.id, force)),
    );
    const totals = new Map();
    responses.flat().forEach((item) => {
      const averageStars = Number(item.averageStars);
      const voteCount = Number(item.voteCount);
      if (!item.modelId || !Number.isFinite(averageStars) || !Number.isFinite(voteCount) || voteCount <= 0) {
        return;
      }
      const current = totals.get(item.modelId) ?? { totalStars: 0, voteCount: 0 };
      current.totalStars += averageStars * voteCount;
      current.voteCount += voteCount;
      totals.set(item.modelId, current);
    });
    ratingState.allValues = new Map(
      [...totals.entries()].map(([modelId, total]) => [modelId, {
        averageStars: total.totalStars / total.voteCount,
        voteCount: total.voteCount,
      }]),
    );
  } catch (error) {
    console.error("Overall ratings load failed", error);
    ratingState.allValues = new Map();
    ratingState.allError = true;
  } finally {
    ratingState.allLoading = false;
    ratingState.allLoaded = true;
    renderModelOverall();
  }
}

function getCaseVotePendingKey(requirementId, testCaseId) {
  return `${requirementId}:${testCaseId}`;
}

async function requestCaseVotesForRequirement(requirementId, force = false) {
  if (!force && caseVoteState.valuesByRequirement.has(requirementId)) {
    return caseVoteState.valuesByRequirement.get(requirementId);
  }
  if (!force && caseVoteState.requestsByRequirement.has(requirementId)) {
    return caseVoteState.requestsByRequirement.get(requirementId);
  }

  const request = (async () => {
    const response = await fetch(apiUrl(`/api/case-votes?requirementId=${encodeURIComponent(requirementId)}`), {
      cache: "no-store",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("用例反馈服务尚未部署");
    }
    const payload = await response.json();
    const values = Array.isArray(payload.data) ? payload.data : [];
    caseVoteState.valuesByRequirement.set(requirementId, values);
    return values;
  })();
  caseVoteState.requestsByRequirement.set(requirementId, request);
  try {
    return await request;
  } finally {
    if (caseVoteState.requestsByRequirement.get(requirementId) === request) {
      caseVoteState.requestsByRequirement.delete(requirementId);
    }
  }
}

async function loadCaseVotesForRequirement(force = false) {
  const requirementId = state.requirementId;
  if (!requirementId) {
    return;
  }
  if (!force && caseVoteState.loaded && caseVoteState.requirementId === requirementId) {
    if (state.view === "leaderboard") {
      renderLeaderboard();
    }
    return;
  }

  if (caseVoteState.requirementId !== requirementId) {
    caseVoteState.values = new Map();
    caseVoteState.loaded = false;
  }
  caseVoteState.requirementId = requirementId;
  caseVoteState.loading = true;
  try {
    const values = await requestCaseVotesForRequirement(requirementId, force);
    if (state.requirementId === requirementId) {
      caseVoteState.values = new Map(values.map((item) => [item.testCaseId, item]));
      caseVoteState.loaded = true;
    }
  } catch {
    if (state.requirementId === requirementId) {
      caseVoteState.values = new Map();
      caseVoteState.loaded = false;
    }
  } finally {
    if (state.requirementId === requirementId) {
      caseVoteState.loading = false;
      if (state.view === "leaderboard") {
        renderLeaderboard();
      }
    }
  }
}

async function submitCaseVote(testCaseId, reaction) {
  const requirementId = state.requirementId;
  if (!requirementId) {
    return;
  }
  const current = caseVoteState.values.get(testCaseId);
  if (current?.viewerReaction === reaction) {
    showToast(reaction === "up" ? "你已点赞此测试用例" : "你已踩此测试用例", "info");
    return;
  }

  const pendingKey = getCaseVotePendingKey(requirementId, testCaseId);
  if (caseVoteState.pending.has(pendingKey)) {
    return;
  }
  caseVoteState.pending.add(pendingKey);
  renderLeaderboard();
  renderLeaderboardDetailCaseVote();
  try {
    const response = await fetch(apiUrl("/api/case-votes/vote"), {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requirementId, testCaseId, reaction }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.error === "request_rate_limited"
        ? "操作过于频繁"
        : payload.error === "daily_limit_reached" && Number.isInteger(payload.limit)
          ? `今日对该用例的反馈已达 ${payload.limit} 次上限`
          : "用例反馈服务暂不可用");
    }
    const item = payload.data;
    if (!item || item.testCaseId !== testCaseId) {
      throw new Error("用例反馈服务返回异常");
    }
    const values = new Map((caseVoteState.valuesByRequirement.get(requirementId) ?? [])
      .map((value) => [value.testCaseId, value]));
    values.set(testCaseId, item);
    caseVoteState.valuesByRequirement.set(requirementId, [...values.values()]);
    if (state.requirementId === requirementId) {
      caseVoteState.values = values;
      caseVoteState.loaded = true;
    }
    const label = reaction === "up" ? "点赞" : "踩";
    showToast(item.result === "updated" ? `已改为${label}` : `已${label}`, "success");
  } catch (error) {
    showToast(error instanceof Error && error.message ? error.message : "用例反馈服务尚未部署", "error");
  } finally {
    caseVoteState.pending.delete(pendingKey);
    if (state.requirementId === requirementId && state.view === "leaderboard") {
      renderLeaderboard();
      renderLeaderboardDetailCaseVote();
    }
  }
}

function createCaseVoteControls(testCase, { showLabel = true, dialog = false } = {}) {
  const controls = document.createElement("div");
  controls.className = "case-vote-controls";
  if (dialog) {
    controls.classList.add("case-vote-controls--dialog");
  }
  controls.setAttribute("aria-label", `${testCase.id} 用例反馈`);
  controls.setAttribute("aria-live", "polite");
  const loading = caseVoteState.requirementId === state.requirementId && caseVoteState.loading;
  controls.setAttribute("aria-busy", String(loading));

  const value = caseVoteState.requirementId === state.requirementId
    ? caseVoteState.values.get(testCase.id)
    : null;
  const upvoteCount = Number(value?.upvoteCount) || 0;
  const downvoteCount = Number(value?.downvoteCount) || 0;
  const pending = caseVoteState.pending.has(getCaseVotePendingKey(state.requirementId, testCase.id));

  const createButton = (reaction, text, count) => {
    const button = document.createElement("button");
    const selected = value?.viewerReaction === reaction;
    button.type = "button";
    button.className = `case-vote-controls__button case-vote-controls__button--${reaction}`;
    button.textContent = `${text} ${count}`;
    button.disabled = pending;
    button.setAttribute("aria-pressed", String(selected));
    button.setAttribute("aria-label", `为 ${testCase.id} ${text}，当前 ${count} 次`);
    button.title = `${text}此测试用例`;
    button.addEventListener("click", () => {
      void submitCaseVote(testCase.id, reaction);
    });
    return button;
  };

  if (showLabel) {
    const label = document.createElement("span");
    label.className = "case-vote-controls__label";
    label.textContent = loading && !caseVoteState.loaded ? "反馈加载中" : "用例反馈";
    controls.append(label);
  }
  controls.append(createButton("up", "赞", upvoteCount), createButton("down", "踩", downvoteCount));
  return controls;
}

function createCaseVoteSummaryItem(total, reaction) {
  const item = document.createElement("span");
  item.className = "leaderboard-test__feedback-item";
  const count = document.createElement("span");
  count.className = "leaderboard-test__feedback-count";
  count.textContent = String(total);
  const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  icon.classList.add("leaderboard-test__feedback-icon");
  if (reaction === "down") {
    icon.classList.add("leaderboard-test__feedback-icon--down");
  }
  icon.setAttribute("viewBox", "0 0 24 24");
  icon.setAttribute("aria-hidden", "true");
  icon.setAttribute("focusable", "false");
  icon.setAttribute("fill", "currentColor");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M2 21h4V9H2v12Zm20-11c0-1.1-.9-2-2-2h-6.3l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L13.17 1 6.59 7.59C6.22 7.95 6 8.45 6 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2Z");
  icon.append(path);
  item.append(count, icon);
  return item;
}

function createCaseVoteSummary(testCase) {
  const summary = document.createElement("span");
  summary.className = "leaderboard-test__feedback";
  const value = caseVoteState.requirementId === state.requirementId
    ? caseVoteState.values.get(testCase.id)
    : null;
  const upvoteCount = Number(value?.upvoteCount) || 0;
  const downvoteCount = Number(value?.downvoteCount) || 0;
  summary.append(
    createCaseVoteSummaryItem(upvoteCount, "up"),
    createCaseVoteSummaryItem(downvoteCount, "down"),
  );
  summary.setAttribute("aria-label", `${testCase.id} 共有 ${upvoteCount} 人点赞，${downvoteCount} 人踩`);
  return summary;
}

function renderLeaderboardDetailCaseVote() {
  const testCaseId = state.leaderboardDetailCaseVoteId;
  elements.leaderboardDetailDialogCaseVote.replaceChildren();
  elements.leaderboardDetailDialogCaseVoteSection.hidden = !testCaseId;
  if (!testCaseId) {
    return;
  }

  const testCase = getRequirementTestCases(getCurrentRequirement())
    .find((item) => item.id === testCaseId);
  if (!testCase) {
    state.leaderboardDetailCaseVoteId = null;
    elements.leaderboardDetailDialogCaseVoteSection.hidden = true;
    return;
  }
  elements.leaderboardDetailDialogCaseVote.append(createCaseVoteControls(testCase, {
    showLabel: false,
    dialog: true,
  }));
}

function renderModelView() {
  const model = models.find((item) => item.id === state.modelId) ?? models[0];
  const requirement = getCurrentRequirement();
  const modelEntry = getRequirementModelEntry(requirement, model.id);
  const images = getRequirementModelImages(requirement, model.id);
  renderModelTabs();
  renderModelContentTabs();
  elements.modelKicker.textContent = model.tool;
  elements.modelTitle.textContent = model.name;
  elements.modelTestedAt.textContent = `测试时间：${formatTestedAt(getRequirementTestedAt(requirement, model.id))}`;
  elements.modelCount.textContent = `${images.length} 张 · 原文顺序`;
  const usageUnit = modelEntry?.tokenUsageUnit ?? modelEntry?.agent?.tokenUsageUnit ?? "token";
  const usageLabel = usageUnit === "credit" ? "credit usage" : "token usage";
  elements.modelTokenUsage.textContent = `${usageLabel}：${formatTokenUsage(modelEntry?.tokenUsage ?? modelEntry?.agent?.tokenUsage, usageUnit, "detailed")}`;
  renderModelRating();
  loadRatingsForRequirement();
  const showScreenshots = state.modelContentTab === "screenshots";
  elements.modelGallery.hidden = !showScreenshots;
  elements.modelUnexpectedCasesView.hidden = showScreenshots;
  if (!showScreenshots) {
    renderModelUnexpectedCases(model.id);
    return;
  }
  elements.modelGallery.replaceChildren();
  if (images.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "暂无截图资料";
    elements.modelGallery.append(empty);
    return;
  }
  images.forEach((image, index) => {
    elements.modelGallery.append(createScreenshotCard(image, images, index));
  });
}

function renderModelUnexpectedCases(modelId) {
  const requirement = getCurrentRequirement();
  const modelEntry = getRequirementModelEntry(requirement, modelId);
  const unexpectedCases = Array.isArray(modelEntry?.unexpectedCases)
    ? modelEntry.unexpectedCases.filter((item) => typeof item === "string" && item.trim())
    : [];
  elements.modelUnexpectedCasesList.replaceChildren();
  elements.modelUnexpectedCasesEmpty.hidden = unexpectedCases.length > 0;
  elements.modelUnexpectedCasesList.hidden = unexpectedCases.length === 0;
  if (unexpectedCases.length === 0) {
    elements.modelUnexpectedCasesEmpty.textContent = "暂无记录";
    return;
  }
  unexpectedCases.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.textContent = item;
    elements.modelUnexpectedCasesList.append(listItem);
  });
}

function getFeatureItems(featureId, modelId) {
  return getRequirementModelImages(getCurrentRequirement(), modelId)
    .filter((image) => image.tags.includes(featureId));
}

function getFeatureCount(featureId) {
  return models.reduce((total, model) => total + getFeatureItems(featureId, model.id).length, 0);
}

function renderFeatureTabs() {
  elements.featureTabs.replaceChildren();
  for (const feature of features) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "feature-tab";
    button.role = "tab";
    button.setAttribute("aria-selected", String(feature.id === state.featureId));

    const name = document.createElement("span");
    name.textContent = feature.name;
    const count = document.createElement("span");
    count.className = "feature-tab__count";
    count.textContent = getFeatureCount(feature.id);

    button.append(name, count);
    button.addEventListener("click", () => {
      state.featureId = feature.id;
      setView("feature");
    });
    elements.featureTabs.append(button);
  }
}

function createComparisonColumn(model, items, index = 0) {
  const column = document.createElement("section");
  column.className = "comparison-column";
  column.style.setProperty("--item-index", String(index));

  const header = document.createElement("header");
  header.className = "comparison-column__header";
  const title = document.createElement("h3");
  title.className = "comparison-column__title";
  title.textContent = model.name;
  const count = document.createElement("p");
  count.className = "comparison-column__count";
  count.textContent = `${items.length} 张`;
  header.append(title, count);

  const stack = document.createElement("div");
  stack.className = "comparison-stack";
  if (items.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "暂无对应截图";
    stack.append(empty);
  } else {
    items.forEach((image, index) => {
      stack.append(createScreenshotCard(image, items, index, true));
    });
  }

  column.append(header, stack);
  return column;
}

function renderFeatureView() {
  const feature = features.find((item) => item.id === state.featureId) ?? features[0];
  renderFeatureTabs();
  elements.featureTitle.textContent = feature.name;
  elements.featureDescription.textContent = feature.description;
  elements.featureCount.textContent = `${getFeatureCount(feature.id)} 张相关截图`;
  elements.featureComparison.replaceChildren();

  const modelEntries = models
    .map((model, sourceIndex) => ({ model, items: getFeatureItems(feature.id, model.id), sourceIndex }))
    .sort((left, right) => right.items.length - left.items.length || left.sourceIndex - right.sourceIndex);
  modelEntries.forEach(({ model, items }, index) => {
    elements.featureComparison.append(createComparisonColumn(model, items, index));
  });
}

function createFinalAdoptedBanner(modelName, pullRequestUrl = "") {
  const banner = document.createElement("button");
  banner.type = "button";
  banner.className = "leaderboard-final-adopted-banner";
  banner.textContent = "最终采纳";
  banner.title = "查看“最终采纳”的含义";
  banner.setAttribute("aria-label", `${modelName}：最终采纳`);
  banner.addEventListener("click", () => {
    if (!elements.toast.hidden && elements.toast.classList.contains("toast--anchored")) {
      hideToast();
      return;
    }
    const toast = document.createElement("span");
    toast.append("“最终采纳”表示作者最终采用了该模型的实现，并将其合入叙界主仓。 ");
    if (pullRequestUrl) {
      const link = document.createElement("a");
      link.href = pullRequestUrl;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.textContent = "查看合入 PR";
      toast.append(link);
    }
    showToast(toast, "info", { anchor: banner });
  });
  return banner;
}

function createLeaderboardSummaryCard(entry, finalAdoptedModelId = null, finalAdoptedPrUrl = "") {
  const card = document.createElement("article");
  card.className = "leaderboard-card";
  card.style.setProperty("--item-index", String(Math.max(0, entry.rank - 1)));

  const rank = document.createElement("p");
  rank.className = "leaderboard-card__rank";
  rank.textContent = `第 ${entry.rank} 名`;

  const name = document.createElement("h3");
  name.className = "leaderboard-card__name";
  appendModelName(name, entry.model, entry.modelId);
  if (entry.modelId === finalAdoptedModelId) {
    name.append(createFinalAdoptedBanner(entry.model?.name ?? entry.modelId, finalAdoptedPrUrl));
  }
  const branchCell = document.createElement("div");
  branchCell.className = "leaderboard-card__branch";
  const branchLink = createResultBranchLink(entry);
  if (branchLink) {
    branchCell.append(branchLink);
  }

  const agent = document.createElement("p");
  agent.className = "leaderboard-card__agent";
  agent.textContent = `${entry.agent?.software ?? "软件版本未记录"} · ${entry.agent?.version ?? "版本未记录"}`;

  const context = document.createElement("p");
  context.className = "leaderboard-card__context";
  const contextValue = String(entry.agent?.context ?? "未记录").split(/[（(]/, 1)[0].trim() || "未记录";
  context.textContent = `上下文 ${contextValue}`;
  context.title = context.textContent;

  const score = document.createElement("p");
  score.className = "leaderboard-card__score";
  score.textContent = `${entry.score} / ${entry.maxScore}`;

  const totalCount = entry.testCaseCount;
  const failureCount = entry.failureCount ?? Object.keys(entry.failures ?? {}).length;
  const passCount = totalCount - failureCount;
  const weightedPassRate = formatWeightedPassRate(entry.weightedPassRate);
  const meta = document.createElement("p");
  meta.className = "leaderboard-card__meta";
  const durationText = entry.durationSeconds === null || entry.durationSeconds === undefined
    ? "耗时未记录"
    : formatDurationSeconds(entry.durationSeconds);
  const usageUnit = entry.tokenUsageUnit ?? entry.agent?.tokenUsageUnit ?? "token";
  const usageValue = entry.tokenUsage ?? entry.agent?.tokenUsage;
  const usageText = usageValue === null || usageValue === undefined
    ? "用量未记录"
    : formatTokenUsage(usageValue, usageUnit, "compact");
  meta.textContent = `通过 ${passCount} / ${totalCount} · 加权通过率 ${weightedPassRate} · ${durationText} · ${usageText}`;

  card.append(rank, name, agent, context, score, meta, branchCell);
  return card;
}

function createLeaderboardSummaryList(entries, className = "leaderboard-summary__list", finalAdoptedModelId = null, finalAdoptedPrUrl = "") {
  const list = document.createElement("div");
  list.className = className;
  for (const entry of entries) {
    list.append(createLeaderboardSummaryCard(entry, finalAdoptedModelId, finalAdoptedPrUrl));
  }
  return list;
}

function formatLeaderboardExportDateTime(date) {
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date).replaceAll("/", "-");
}

function getRequirementFirstTestAt(requirement) {
  const dates = models
    .map((model) => getRequirementTestedAt(requirement, model.id))
    .map((value) => {
      const date = value ? new Date(value) : null;
      return date && !Number.isNaN(date.getTime()) && date.getTime() >= earliestRecordedTestAt ? date : null;
    })
    .filter(Boolean)
    .sort((left, right) => left.getTime() - right.getTime());
  return dates[0] ?? null;
}

function createLeaderboardExportSvg() {
  const requirement = getCurrentRequirement();
  if (!requirement) {
    return null;
  }

  const entries = getRankingData();
  const generatedAt = new Date();
  const firstTestAt = getRequirementFirstTestAt(requirement);
  const scoring = getRequirementScoring(requirement);
  const testedAtText = firstTestAt
    ? formatLeaderboardExportDateTime(firstTestAt)
    : formatLeaderboardExportDateTime(generatedAt);
  const scoringText = `评分机制：初始 ${scoring.initial} 分；${formatDeductionRules(scoring.deductionByPriority) || "暂无扣分规则"}`;
  const finalAdoptedModelId = getFinalAdoptedModelId(requirement);
  const width = 2048;
  const headerHeight = 194;
  const cardHeight = 100;
  const cardGap = 12;
  const horizontalPadding = 28;
  const footerHeight = 46;
  const contentHeight = entries.length > 0
    ? entries.length * cardHeight + (entries.length - 1) * cardGap
    : 62;
  const height = headerHeight + contentHeight + footerHeight + horizontalPadding;
  const exportSvg = createChartSvgElement("svg", {
    xmlns: chartSvgNamespace,
    width,
    height,
    viewBox: `0 0 ${width} ${height}`,
  });

  exportSvg.append(
    createChartSvgElement("rect", { x: 0, y: 0, width, height, fill: "#111210" }),
    createChartSvgElement("rect", { class: "leaderboard-export__header", x: 0, y: 0, width, height: headerHeight }),
    createChartSvgElement("line", {
      class: "leaderboard-export__divider",
      x1: 0,
      y1: headerHeight,
      x2: width,
      y2: headerHeight,
    }),
    createChartSvgElement("text", {
      class: "leaderboard-export__title",
      x: 36,
      y: 38,
    }, "叙界真实需求 Agent 评测娱乐榜"),
    createChartSvgElement("text", {
      class: "leaderboard-export__subtitle",
      x: 36,
      y: 70,
    }, `${requirement.title}｜需求排行榜`),
    createChartSvgElement("text", {
      class: "leaderboard-export__meta",
      x: 36,
      y: 101,
    }, `测试时间：${testedAtText}`),
    createChartSvgElement("text", {
      class: "leaderboard-export__scoring",
      x: 36,
      y: 132,
    }, scoringText),
    createChartSvgElement("text", {
      class: "leaderboard-export__legend-label",
      x: 36,
      y: 161,
    }, "图例："),
    createChartSvgElement("text", {
      class: "leaderboard-export__legend-multimodal",
      x: 92,
      y: 161,
    }, "橙色模型名 = 支持多模态"),
    createChartSvgElement("text", {
      class: "leaderboard-export__legend-adopted",
      x: 390,
      y: 161,
    }, "金色模型名 = 最终采纳合入主仓"),
    createChartSvgElement("text", {
      class: "leaderboard-export__domain",
      x: width - 36,
      y: 38,
      "text-anchor": "end",
    }, "llm-racing.scriverse.top"),
    createChartSvgElement("text", {
      class: "leaderboard-export__domain-note",
      x: width - 36,
      y: 60,
      "text-anchor": "end",
    }, "更多详情见站点"),
  );

  if (entries.length === 0) {
    exportSvg.append(createChartSvgElement("text", {
      class: "leaderboard-export__empty",
      x: width / 2,
      y: headerHeight + 38,
      "text-anchor": "middle",
    }, "该需求暂无测试结果"));
  }

  entries.forEach((entry, index) => {
    const top = headerHeight + index * (cardHeight + cardGap);
    const cardWidth = width - horizontalPadding * 2;
    const cardX = horizontalPadding;
    const textY = top + 53;
    const passCount = entry.passCount ?? entry.testCaseCount - (entry.failureCount ?? Object.keys(entry.failures ?? {}).length);
    const weightedPassRate = formatWeightedPassRate(entry.weightedPassRate);
    const durationText = entry.durationSeconds === null || entry.durationSeconds === undefined
      ? "耗时未记录"
      : formatDurationSeconds(entry.durationSeconds);
    const usageUnit = entry.tokenUsageUnit ?? entry.agent?.tokenUsageUnit ?? "token";
    const usageValue = entry.tokenUsage ?? entry.agent?.tokenUsage;
    const usageText = usageValue === null || usageValue === undefined
      ? "用量未记录"
      : formatTokenUsage(usageValue, usageUnit, "compact");
    const modelName = entry.model?.name ?? entry.modelId;
    const modelX = cardX + 180;
    const isMultimodal = Boolean(entry.model?.supportsMultimodal);
    const isFinalAdopted = entry.modelId === finalAdoptedModelId;
    const modelTool = `${entry.agent?.software ?? "软件版本未记录"} · ${entry.agent?.version ?? "版本未记录"}`;
    const contextValue = String(entry.agent?.context ?? "未记录").split(/[（(]/, 1)[0].trim() || "未记录";
    const modelTextElement = createChartSvgElement("text", {
      class: `leaderboard-export__model${isFinalAdopted ? " leaderboard-export__model--adopted" : isMultimodal ? " leaderboard-export__model--multimodal" : ""}`,
      x: modelX,
      y: textY,
    }, modelName);

    exportSvg.append(
      createChartSvgElement("rect", {
        class: "leaderboard-export__card",
        x: cardX,
        y: top,
        width: cardWidth,
        height: cardHeight,
        rx: 12,
      }),
      createChartSvgElement("text", {
        class: "leaderboard-export__rank",
        x: cardX + 18,
        y: textY,
      }, `第 ${entry.rank} 名`),
      modelTextElement,
      createChartSvgElement("text", {
        class: "leaderboard-export__agent",
        x: cardX + 560,
        y: textY,
      }, modelTool),
      createChartSvgElement("text", {
        class: "leaderboard-export__context",
        x: cardX + 920,
        y: textY,
      }, `上下文 ${contextValue}`),
      createChartSvgElement("text", {
        class: "leaderboard-export__score",
        x: cardX + 1200,
        y: textY + 1,
        "text-anchor": "middle",
      }, `${entry.score} / ${entry.maxScore}`),
      createChartSvgElement("text", {
        class: "leaderboard-export__meta-column",
        x: cardX + 1450,
        y: textY,
        "text-anchor": "end",
      }, `通过 ${passCount} / ${entry.testCaseCount}`),
      createChartSvgElement("text", {
        class: "leaderboard-export__meta-separator",
        x: cardX + 1472,
        y: textY,
        "text-anchor": "middle",
      }, "·"),
      createChartSvgElement("text", {
        class: "leaderboard-export__meta-column",
        x: cardX + 1700,
        y: textY,
        "text-anchor": "end",
      }, `加权通过率 ${weightedPassRate}`),
      createChartSvgElement("text", {
        class: "leaderboard-export__meta-separator",
        x: cardX + 1718,
        y: textY,
        "text-anchor": "middle",
      }, "·"),
      createChartSvgElement("text", {
        class: "leaderboard-export__meta-column",
        x: cardX + 1830,
        y: textY,
        "text-anchor": "end",
      }, durationText),
      createChartSvgElement("text", {
        class: "leaderboard-export__meta-separator",
        x: cardX + 1848,
        y: textY,
        "text-anchor": "middle",
      }, "·"),
      createChartSvgElement("text", {
        class: "leaderboard-export__meta-column",
        x: cardX + 1964,
        y: textY,
        "text-anchor": "end",
      }, usageText),
    );

  });

  exportSvg.append(
    createChartSvgElement("line", {
      class: "leaderboard-export__divider",
      x1: 0,
      y1: height - footerHeight,
      x2: width,
      y2: height - footerHeight,
    }),
    createChartSvgElement("text", {
      class: "leaderboard-export__footer",
      x: width / 2,
      y: height - 17,
      "text-anchor": "middle",
    }, `共 ${entries.length} 个模型 · 图片生成于 ${formatLeaderboardExportDateTime(generatedAt)}`),
    createChartSvgElement(
      "style",
      {},
      `
        .leaderboard-export__header { fill: #171816; }
        .leaderboard-export__divider { stroke: #30322f; stroke-width: 1; }
        .leaderboard-export__title { fill: #f4f4f1; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif; font-size: 30px; font-weight: 700; }
        .leaderboard-export__subtitle { fill: #e0a084; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif; font-size: 20px; font-weight: 700; }
        .leaderboard-export__meta, .leaderboard-export__scoring, .leaderboard-export__legend-label, .leaderboard-export__footer { fill: #969791; font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace; font-size: 16px; }
        .leaderboard-export__legend-multimodal { fill: #e58b66; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif; font-size: 16px; font-weight: 650; }
        .leaderboard-export__legend-adopted { fill: #f3c76b; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif; font-size: 16px; font-weight: 650; }
        .leaderboard-export__domain { fill: #e0a084; font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace; font-size: 14px; }
        .leaderboard-export__domain-note { fill: #969791; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif; font-size: 13px; }
        .leaderboard-export__card { fill: #151614; stroke: #30322f; stroke-width: 1; }
        .leaderboard-export__rank { fill: #d77855; font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace; font-size: 20px; }
        .leaderboard-export__model { fill: #f4f4f1; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif; font-size: 26px; font-weight: 650; }
        .leaderboard-export__model--multimodal { fill: #e58b66; }
        .leaderboard-export__model--adopted { fill: #f3c76b; }
        .leaderboard-export__agent, .leaderboard-export__context { fill: #969791; font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace; font-size: 17px; }
        .leaderboard-export__meta-column { fill: #b8b9b4; font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace; font-size: 21px; }
        .leaderboard-export__meta-separator { fill: #969791; font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace; font-size: 21px; }
        .leaderboard-export__score { fill: #fffaf6; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif; font-size: 34px; font-weight: 700; }
        .leaderboard-export__empty { fill: #969791; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif; font-size: 15px; }
      `,
    ),
  );
  return {
    svg: exportSvg,
    width,
    height,
    filename: `llm-ranking-${requirement.id}-${formatChartExportTimestamp(generatedAt)}.png`,
  };
}

function downloadLeaderboardPng() {
  const exportData = createLeaderboardExportSvg();
  if (!exportData) {
    showToast("需求榜单 PNG 生成失败", "error");
    return;
  }

  const serializer = new XMLSerializer();
  const svgBlob = new Blob([serializer.serializeToString(exportData.svg)], {
    type: "image/svg+xml;charset=utf-8",
  });
  const svgUrl = URL.createObjectURL(svgBlob);
  const image = new Image();
  image.onload = () => {
    URL.revokeObjectURL(svgUrl);
    const scale = 2;
    const canvas = document.createElement("canvas");
    canvas.width = exportData.width * scale;
    canvas.height = exportData.height * scale;
    const context = canvas.getContext("2d");
    if (!context) {
      showToast("需求榜单 PNG 生成失败", "error");
      return;
    }
    context.fillStyle = "#111210";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((pngBlob) => {
      if (!pngBlob) {
        showToast("需求榜单 PNG 生成失败", "error");
        return;
      }
      const downloadUrl = URL.createObjectURL(pngBlob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = exportData.filename;
      link.hidden = true;
      document.body.append(link);
      link.click();
      window.setTimeout(() => {
        link.remove();
        URL.revokeObjectURL(downloadUrl);
      }, 1000);
      showToast("需求榜单 PNG 已下载", "success");
    }, "image/png");
  };
  image.onerror = () => {
    URL.revokeObjectURL(svgUrl);
    showToast("需求榜单 PNG 生成失败", "error");
  };
  image.src = svgUrl;
}

function createLeaderboardResultCell(entry, testCase) {
  const failed = Object.prototype.hasOwnProperty.call(entry.failures, testCase.id);
  const cell = document.createElement("td");
  cell.className = `leaderboard-result ${failed ? "leaderboard-result--fail" : "leaderboard-result--pass"}`;

  const status = document.createElement("button");
  status.className = "leaderboard-status leaderboard-status--trigger";
  status.textContent = failed ? "未通过" : "通过";
  status.type = "button";

  if (failed) {
    const reason = entry.failures[testCase.id] || "失败原因未记录";
    status.setAttribute("aria-label", `查看 ${entry.model?.name ?? entry.modelId} ${testCase.id} 失败原因`);
    status.addEventListener("click", () => openLeaderboardDetail({
      label: `${entry.model?.name ?? entry.modelId} · ${testCase.id}`,
      title: "失败原因",
      requirementName: getCurrentRequirement()?.title ?? "当前测试需求",
      modelName: entry.model?.name ?? entry.modelId,
      testCaseId: testCase.id,
      priority: testCase.priority,
      scenario: testCase.scenario,
      detail: reason,
      detailTitle: "失败原因",
      detailFallback: "失败原因未记录",
    }));
  } else {
    const detail = entry.successes?.[testCase.id];
    status.setAttribute("aria-label", `查看 ${entry.model?.name ?? entry.modelId} ${testCase.id} 成功用例说明`);
    status.addEventListener("click", () => openLeaderboardDetail({
      label: `${entry.model?.name ?? entry.modelId} · ${testCase.id} · 通过`,
      title: "成功用例说明",
      requirementName: getCurrentRequirement()?.title ?? "当前测试需求",
      modelName: entry.model?.name ?? entry.modelId,
      testCaseId: testCase.id,
      priority: testCase.priority,
      scenario: testCase.scenario,
      detail,
      detailTitle: "成功说明",
      detailFallback: "无详情",
    }));
  }

  cell.append(status);
  return cell;
}

function openLeaderboardDetail({
  label,
  title,
  requirementName,
  modelName,
  testCaseId,
  priority,
  scenario,
  detail,
  detailTitle,
  detailFallback,
  showCaseVote = false,
}) {
  elements.leaderboardDetailDialogLabel.textContent = label;
  elements.leaderboardDetailDialogTitle.textContent = title;
  elements.leaderboardDetailDialogRequirement.textContent = requirementName;
  elements.leaderboardDetailDialogModel.textContent = modelName;
  elements.leaderboardDetailDialogTestCase.textContent = `${testCaseId} · ${priority}`;
  elements.leaderboardDetailDialogScenario.textContent = scenario;
  const hasStatusDetail = typeof detailTitle === "string" && typeof detailFallback === "string";
  elements.leaderboardDetailDialogReasonSection.hidden = !hasStatusDetail;
  if (hasStatusDetail) {
    elements.leaderboardDetailDialogReasonTitle.textContent = detailTitle;
    elements.leaderboardDetailDialogReason.textContent = typeof detail === "string" && detail.trim()
      ? detail
      : detailFallback;
  } else {
    elements.leaderboardDetailDialogReasonTitle.textContent = "";
    elements.leaderboardDetailDialogReason.textContent = "";
  }
  state.leaderboardDetailCaseVoteId = showCaseVote ? testCaseId : null;
  renderLeaderboardDetailCaseVote();
  elements.leaderboardDetailDialog.showModal();
}

function renderLeaderboard() {
  const rankingData = getRankingData();
  const currentRequirement = getCurrentRequirement();
  const testCases = getRequirementTestCasesForDisplay(currentRequirement);
  const scoring = getRequirementScoring(currentRequirement);
  elements.leaderboardSummary.replaceChildren();
  elements.leaderboardHead.replaceChildren();
  elements.leaderboardBody.replaceChildren();
  elements.leaderboardRequirement.textContent = currentRequirement
    ? `最终测试结果：${currentRequirement.title}`
    : "最终测试结果";
  elements.leaderboardTestCount.textContent = currentRequirement
    ? `${testCases.length} 个测试用例`
    : "测试用例数量读取中";

  if (!leaderboardData) {
    const message = document.createElement("p");
    message.className = "leaderboard-loading";
    message.textContent = leaderboardLoadError ? "排行榜数据加载失败，请刷新页面重试。" : "正在加载排行榜数据……";
    elements.leaderboardSummary.append(message);
    elements.leaderboardNote.textContent = "排行榜数据来自 source/leaderboard.json。";
    return;
  }

  const deductionRules = formatDeductionRules(scoring.deductionByPriority);
  elements.leaderboardNote.textContent = `扣分规则：初始 ${scoring.initial} 分；${deductionRules || "暂无扣分规则"}。状态来自初步人工复核记录；点击通过或未通过状态可查看对应说明，成功说明未填写时显示“无详情”。在测试用例“查看说明”中可点赞或踩。`;
  elements.leaderboardDescription.textContent = "按人工评分复核记录汇总排名、得分与每个测试用例的通过状态。点击“通过”或“未通过”状态可查看对应说明；在测试用例说明中可点赞或踩。";
  if (rankingData.length === 0) {
    const message = document.createElement("p");
    message.className = "leaderboard-loading";
    message.textContent = "该需求尚未有测试结果，参赛选手已在需求信息中列出。";
    elements.leaderboardSummary.append(message);
  }
  const visibleEntries = rankingData.slice(0, leaderboardTopN);
  const hiddenEntries = rankingData.slice(leaderboardTopN);
  const finalAdoptedModelId = getFinalAdoptedModelId(currentRequirement);
  const finalAdoptedPrUrl = getFinalAdoptedPrUrl(currentRequirement);
  elements.leaderboardSummary.append(createLeaderboardSummaryList(
    visibleEntries,
    "leaderboard-summary__list",
    finalAdoptedModelId,
    finalAdoptedPrUrl,
  ));

  if (hiddenEntries.length > 0) {
    const hiddenList = createLeaderboardSummaryList(
      hiddenEntries,
      "leaderboard-summary__list leaderboard-summary__list--additional",
      finalAdoptedModelId,
      finalAdoptedPrUrl,
    );
    hiddenList.hidden = true;
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "leaderboard-summary__toggle";
    toggle.setAttribute("aria-expanded", "false");
    toggle.textContent = `展开其余 ${hiddenEntries.length} 个模型`;
    toggle.addEventListener("click", () => {
      const expanded = !hiddenList.hidden;
      hiddenList.hidden = expanded;
      toggle.setAttribute("aria-expanded", String(!expanded));
      toggle.textContent = expanded
        ? `展开其余 ${hiddenEntries.length} 个模型`
        : `收起其余 ${hiddenEntries.length} 个模型`;
    });
    elements.leaderboardSummary.append(toggle, hiddenList);
  }
  elements.leaderboardTable.style.setProperty("--leaderboard-model-count", rankingData.length);

  const headerRow = document.createElement("tr");
  const testHeader = document.createElement("th");
  testHeader.scope = "col";
  testHeader.className = "leaderboard-test-header";
  testHeader.textContent = "测试用例";
  headerRow.append(testHeader);
  for (const entry of rankingData) {
    const modelHeader = document.createElement("th");
    modelHeader.scope = "col";
    modelHeader.className = "leaderboard-model-header";
    const rank = document.createElement("span");
    rank.className = "leaderboard-model-header__rank";
    rank.textContent = `第 ${entry.rank} 名`;
    const name = document.createElement("span");
    name.className = "leaderboard-model-header__name";
    appendModelName(name, entry.model, entry.modelId);
    name.title = entry.model?.name ?? String(entry.modelId);
    const rating = ratingState.values.get(entry.modelId);
    const ratingRow = document.createElement("div");
    ratingRow.className = "leaderboard-model-header__rating";
    const ratingStars = createRatingStars(rating?.averageStars ?? 0);
    ratingStars.classList.add("leaderboard-model-header__stars");
    const ratingText = document.createElement("span");
    ratingText.className = "leaderboard-model-header__rating-text";
    ratingText.textContent = rating && rating.voteCount > 0
      ? `${rating.averageStars.toFixed(2)} / 5 · ${rating.voteCount} 次`
      : "暂无评分";
    ratingRow.append(ratingStars, ratingText);
    modelHeader.append(rank, name, ratingRow);
    headerRow.append(modelHeader);
  }
  elements.leaderboardHead.replaceChildren(headerRow);

  const rows = testCases.map((testCase) => {
    const row = document.createElement("tr");
    const testCell = document.createElement("th");
    testCell.scope = "row";
    testCell.className = "leaderboard-test";
    const identity = document.createElement("div");
    identity.className = "leaderboard-test__identity";
    const id = document.createElement("span");
    id.className = "leaderboard-test__id";
    id.textContent = testCase.id;
    const priority = document.createElement("span");
    priority.className = "leaderboard-test__priority";
    priority.textContent = testCase.priority;
    identity.append(id, priority);
    const scenario = document.createElement("button");
    scenario.type = "button";
    scenario.className = "leaderboard-test__details";
    scenario.textContent = "查看说明";
    scenario.setAttribute("aria-label", `查看 ${testCase.id} 测试说明`);
    scenario.addEventListener("click", () => openLeaderboardDetail({
      label: `${testCase.id} · ${testCase.priority}`,
      title: "测试用例说明",
      requirementName: currentRequirement?.title ?? "当前测试需求",
      modelName: "全部参赛模型",
      testCaseId: testCase.id,
      priority: testCase.priority,
      scenario: testCase.scenario,
      showCaseVote: true,
    }));
    const actions = document.createElement("div");
    actions.className = "leaderboard-test__actions";
    actions.append(scenario, createCaseVoteSummary(testCase));
    testCell.append(identity, actions);
    row.append(testCell);
    for (const entry of rankingData) {
      row.append(createLeaderboardResultCell(entry, testCase));
    }
    return row;
  });
  elements.leaderboardBody.replaceChildren(...rows);
}

function getRequirementAverageScore(requirement) {
  if (typeof requirement.averageScore === "number") {
    return requirement.averageScore;
  }
  if (typeof requirement.summary?.averageScore === "number") {
    return requirement.summary.averageScore;
  }
  return null;
}

function createRequirementCard(requirement, index = 0) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "requirement-card";
  card.style.setProperty("--item-index", String(index));
  card.addEventListener("click", () => {
    state.requirementId = requirement.id;
    renderGlobalRequirementSelect();
    setView("leaderboard");
  });

  const label = document.createElement("span");
  label.className = "requirement-card__label";
  label.textContent = "测试需求";
  const title = document.createElement("strong");
  title.className = "requirement-card__title";
  title.textContent = requirement.title;
  const base = document.createElement("span");
  base.className = "requirement-card__base";
  base.textContent = requirement.baseRepository;
  const summary = document.createElement("span");
  summary.className = "requirement-card__summary";
  summary.textContent = requirement.summary || "统一记录该项测试需求的执行结果与参赛配置。";
  const action = document.createElement("span");
  action.className = "requirement-card__action";
  action.textContent = "进入需求详情";

  card.append(label, title, base, summary, action);
  return card;
}

function renderHomeView() {
  elements.requirementList.replaceChildren();
  elements.globalAverageNote.hidden = true;

  if (!leaderboardData) {
    const message = document.createElement("p");
    message.className = "leaderboard-loading";
    message.textContent = leaderboardLoadError ? "需求数据加载失败，请刷新页面重试。" : "正在加载测试需求……";
    elements.requirementList.append(message);
    return;
  }

  const requirements = leaderboardData.requirements ?? [];
  requirements.forEach((requirement, index) => {
    elements.requirementList.append(createRequirementCard(requirement, index));
  });

  if (requirements.length > 1) {
    const scores = requirements.map(getRequirementAverageScore).filter((score) => score !== null);
    const initialScore = getRequirementScoring(requirements[0]).initial;
    elements.globalAverageNote.hidden = false;
    elements.globalAverageNote.textContent = scores.length === requirements.length
      ? `全局平均评分：${(scores.reduce((total, score) => total + score, 0) / scores.length).toFixed(1)} / ${initialScore}`
      : "全局平均评分将在每项需求补齐评分后显示。";
  }
}

function renderGlobalRequirementSelect() {
  const requirements = leaderboardData?.requirements ?? [];
  elements.globalRequirementSelect.replaceChildren();
  if (requirements.length === 0) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = leaderboardLoadError ? "需求加载失败" : "正在加载需求……";
    elements.globalRequirementSelect.append(option);
    elements.globalRequirementSelect.disabled = true;
    return;
  }

  for (const requirement of requirements) {
    const option = document.createElement("option");
    option.value = requirement.id;
    option.textContent = requirement.title;
    elements.globalRequirementSelect.append(option);
  }
  elements.globalRequirementSelect.value = state.requirementId ?? requirements[0].id;
  elements.globalRequirementSelect.disabled = false;
}

function renderRequirementTabs(requirements) {
  elements.requirementTabs.replaceChildren();
  for (const requirement of requirements) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "requirement-tab";
    button.role = "tab";
    button.textContent = requirement.title;
    button.setAttribute("aria-selected", String(state.requirementsTab === "requirement" && requirement.id === state.requirementId));
    button.addEventListener("click", () => {
      state.requirementsTab = "requirement";
      state.requirementId = requirement.id;
      renderGlobalRequirementSelect();
      setView("requirements");
    });
    elements.requirementTabs.append(button);
  }
  elements.testMethodTab.setAttribute("aria-selected", String(state.requirementsTab === "method"));
}

function renderRequirementsView() {
  const showMethod = state.requirementsTab === "method";
  elements.requirementDetailView.hidden = showMethod;
  elements.testMethodView.hidden = !showMethod;

  if (!leaderboardData) {
    elements.requirementTabs.replaceChildren();
    elements.testMethodTab.setAttribute("aria-selected", String(showMethod));
    elements.requirementTitle.textContent = "正在加载测试需求……";
    elements.requirementWeight.textContent = "未记录";
    elements.agentRosterBody.replaceChildren();
    return;
  }

  const requirements = leaderboardData.requirements ?? [];
  const requirement = requirements.find((item) => item.id === state.requirementId) ?? requirements[0];
  if (!requirement) {
    elements.requirementTabs.replaceChildren();
    elements.testMethodTab.setAttribute("aria-selected", String(showMethod));
    elements.requirementTitle.textContent = "暂无测试需求";
    elements.requirementWeight.textContent = "未记录";
    elements.agentRosterBody.replaceChildren();
    return;
  }

  state.requirementId = requirement.id;
  renderRequirementTabs(requirements);
  if (showMethod) {
    return;
  }
  elements.requirementTitle.textContent = requirement.title;
  elements.requirementRepository.href = requirement.baseRepositoryUrl;
  elements.requirementRepository.textContent = requirement.baseRepository;
  elements.requirementCommit.textContent = requirement.baseCommit;
  elements.requirementDatabase.href = requirement.evaluationDatabaseUrl ?? "#";
  elements.requirementDatabase.textContent = requirement.evaluationDatabase ?? "未记录";
  const requirementWeight = getRequirementWeight(requirement);
  elements.requirementWeight.textContent = formatRequirementWeight(requirementWeight);
  elements.requirementWeightNote.textContent = "相对系数，1.0 为基准";
  elements.requirementPrompt.textContent = requirement.prompt;

  const hasExplicitResults = hasExplicitRequirementModelEntries(requirement);
  const testedModelIds = new Set((hasExplicitResults
    ? (getRequirementModelEntries(requirement) ?? [])
    : leaderboardData.models).map((entry) => entry.modelId ?? entry.id));
  const participants = Array.isArray(requirement.participants)
    ? requirement.participants
    : (leaderboardData.agents ?? []);
  const agentRows = participants.map((agent) => {
    const row = document.createElement("tr");
    const model = document.createElement("th");
    model.scope = "row";
    model.textContent = agent.modelName;
    if (agent.supportsMultimodal) {
      model.classList.add("agent-roster-table__model--multimodal");
      model.setAttribute("aria-label", `${agent.modelName}，支持多模态`);
      model.title = "支持图片输入（多模态）";
    }
    const software = document.createElement("td");
    software.textContent = agent.software || "未记录";
    const version = document.createElement("td");
    version.textContent = agent.version || "未记录";
    const context = document.createElement("td");
    context.textContent = agent.context || "未记录";
    const status = document.createElement("td");
    const statusText = hasExplicitResults
      ? (testedModelIds.has(agent.modelId) ? "已测试" : "待测试")
      : agent.status;
    status.className = `agent-status ${statusText === "已测试" ? "agent-status--tested" : "agent-status--pending"}`;
    status.textContent = statusText;
    if (agent.note) {
      status.title = agent.note;
    }
    row.append(model, software, version, context, status);
    return row;
  });
  elements.agentRosterBody.replaceChildren(...agentRows);
}

async function loadLeaderboardData() {
  try {
    const response = await fetch(leaderboardDataUrl, { cache: "no-cache" });
    if (!response.ok) {
      throw new Error(`Leaderboard data request failed: ${response.status}`);
    }
    const payload = await response.json();
    const hasValidRequirementScoring = Array.isArray(payload?.requirements)
      && payload.requirements.length > 0
      && payload.requirements.every((requirement) => {
        const scoring = requirement?.scoring ?? { initial: 0, deductionByPriority: {} };
        const deductionByPriority = scoring?.deductionByPriority;
        const testCases = requirement?.testCases ?? [];
        return Number.isSafeInteger(scoring?.initial)
          && scoring.initial >= 0
          && deductionByPriority
          && typeof deductionByPriority === "object"
          && Array.isArray(testCases)
          && testCases.every((testCase) => (
            testCase?.id
            && testCase?.priority
            && Object.prototype.hasOwnProperty.call(deductionByPriority, testCase.priority)
          ));
      });
    const hasValidUnexpectedCases = Array.isArray(payload?.models)
      && payload.models.every((entry) => (
        entry?.unexpectedCases === undefined
        || (Array.isArray(entry.unexpectedCases) && entry.unexpectedCases.every((item) => typeof item === "string" && item.trim()))
      ));
    const hasValidAgentCapabilities = Array.isArray(payload?.agents)
      && payload.agents.every((agent) => typeof agent?.supportsMultimodal === "boolean");
    const hasValidScreenshots = Array.isArray(payload?.requirements)
      && payload.requirements.every((requirement) => (
        requirement?.screenshots === undefined
        || (requirement.screenshots
          && typeof requirement.screenshots === "object"
          && !Array.isArray(requirement.screenshots)
          && Object.values(requirement.screenshots).every(Array.isArray))
      ));
    if (!payload || !Array.isArray(payload.models) || !Array.isArray(payload.requirements) || !Array.isArray(payload.agents) || !hasValidRequirementScoring || !hasValidUnexpectedCases || !hasValidAgentCapabilities || !hasValidScreenshots) {
      throw new Error("Leaderboard data shape is invalid");
    }
    leaderboardData = payload;
    for (const model of models) {
      const agent = payload.agents.find((item) => item.modelId === model.id);
      model.supportsMultimodal = agent?.supportsMultimodal === true;
    }
    rankingDataCache = null;
    rankingDataCacheSource = null;
    rankingDataCacheRequirementId = null;
    renderGlobalRequirementSelect();
    let routeNeedsReplacement = false;
    const requirements = payload.requirements;
    const currentRequirement = requirements.find((requirement) => requirement.id === state.requirementId);
    if (state.view !== "home" && state.view !== "model-overall" && !(state.view === "requirements" && state.requirementsTab === "method") && !currentRequirement) {
      state.view = "home";
      state.requirementId = null;
      state.requirementsTab = "requirement";
      routeNeedsReplacement = true;
    }
    if (state.view === "model" && !models.some((model) => model.id === state.modelId)) {
      state.modelId = models[0].id;
      routeNeedsReplacement = true;
    }
    if (state.view === "feature" && !features.some((feature) => feature.id === state.featureId)) {
      state.featureId = features[0].id;
      routeNeedsReplacement = true;
    }
    setView(state.view, { updateRoute: false });
    if (routeNeedsReplacement) {
      updateBrowserRoute({ replace: true });
    }
  } catch (error) {
    leaderboardLoadError = true;
    console.error("Leaderboard data load failed", error);
    if (state.view === "leaderboard") {
      renderLeaderboard();
    }
    if (state.view === "requirements") {
      renderRequirementsView();
    }
  }
}

function getRoutePath() {
  if (state.view === "home") {
    return "/";
  }
  if (state.view === "model-overall") {
    return "/model-overall";
  }
  if (state.view === "requirements" && state.requirementsTab === "method") {
    return "/test-method";
  }
  if (!state.requirementId) {
    return "/";
  }

  const requirementPath = encodeURIComponent(state.requirementId);
  if (state.view === "leaderboard") {
    return `/req/${requirementPath}/leaderboard`;
  }
  if (state.view === "requirements") {
    return `/req/${requirementPath}/info`;
  }
  if (state.view === "model") {
    const modelPath = `/req/${requirementPath}/mdl/${encodeURIComponent(state.modelId)}`;
    return state.modelContentTab === "unexpected" ? `${modelPath}?tab=unexpected` : modelPath;
  }
  if (state.view === "feature") {
    return `/req/${requirementPath}/feature/${encodeURIComponent(state.featureId)}`;
  }
  return "/";
}

function updateBrowserRoute({ replace = false } = {}) {
  const nextPath = getRoutePath();
  const currentPath = `${window.location.pathname}${window.location.search}`;
  if (currentPath === nextPath) {
    return;
  }
  const method = replace ? "replaceState" : "pushState";
  window.history[method]({}, "", nextPath);
}

function decodeRoutePart(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return "";
  }
}

function parseBrowserRoute() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  if (path === "/") {
    return { view: "home" };
  }
  if (path === "/model-overall") {
    return { view: "model-overall" };
  }
  if (path === "/test-method") {
    return { view: "requirements", requirementsTab: "method" };
  }

  const parts = path.split("/").filter(Boolean).map(decodeRoutePart);
  if (parts[0] !== "req" || !parts[1]) {
    return { view: "home" };
  }

  const requirementId = parts[1];
  if (!parts[2] || parts[2] === "leaderboard") {
    return { view: "leaderboard", requirementId };
  }
  if (parts[2] === "info") {
    return { view: "requirements", requirementsTab: "requirement", requirementId };
  }
  if ((parts[2] === "mdl" || parts[2] === "model") && parts[3]) {
    const modelId = Number(parts[3]);
    return {
      view: "model",
      requirementId,
      modelId: Number.isSafeInteger(modelId) ? modelId : models[0].id,
      modelContentTab: new URLSearchParams(window.location.search).get("tab") === "unexpected"
        ? "unexpected"
        : "screenshots",
    };
  }
  if (parts[2] === "feature" && parts[3]) {
    return { view: "feature", requirementId, featureId: parts[3] };
  }
  return { view: "home" };
}

function applyBrowserRoute() {
  const route = parseBrowserRoute();
  state.view = route.view;
  state.requirementId = route.requirementId ?? null;
  state.requirementsTab = route.requirementsTab ?? "requirement";
  state.modelId = route.modelId ?? models[0].id;
  state.modelContentTab = route.modelContentTab ?? "screenshots";
  state.featureId = route.featureId ?? features[0].id;
  setView(state.view, { updateRoute: false });
}

function setView(view, { updateRoute = true, replaceRoute = false } = {}) {
  const isGlobalTestMethod = view === "requirements" && state.requirementsTab === "method";
  if (view !== "home" && view !== "model-overall" && !state.requirementId && !isGlobalTestMethod) {
    view = "home";
  }
  state.view = view;
  const renderView = () => {
    const isHome = view === "home";
    const isModelOverall = view === "model-overall";
    const isModel = view === "model";
    const isFeature = view === "feature";
    const isRequirements = view === "requirements";
    const isMethodView = isRequirements && state.requirementsTab === "method";
    elements.homeView.hidden = !isHome;
    elements.modelOverallView.hidden = !isModelOverall;
    elements.modelView.hidden = !isModel;
    elements.featureView.hidden = !isFeature;
    elements.leaderboardView.hidden = view !== "leaderboard";
    elements.requirementsView.hidden = !isRequirements;
    elements.pageHeaderControls.hidden = isHome;
    elements.homeHeaderEntries.hidden = !isHome;
    elements.homeModelOverallEntry.hidden = !isHome;
    elements.globalRequirementSwitch.hidden = isModelOverall || isMethodView;
    elements.viewSwitch.hidden = isMethodView;
    elements.modelOverallButton.hidden = Boolean(state.requirementId);
    elements.backHome.hidden = isHome;
    const backHomeLabel = isModelOverall ? "返回主页" : "返回需求列表";
    elements.backHome.setAttribute("aria-label", backHomeLabel);
    elements.backHome.title = backHomeLabel;
    elements.viewButtons.forEach((button) => {
      button.hidden = isMethodView
        || (isModelOverall && button.dataset.view !== "model-overall")
        || (button.dataset.view === "model-overall" && Boolean(state.requirementId));
      button.setAttribute("aria-selected", String(button.dataset.view === view));
    });
    if (isHome) {
      renderHomeView();
    } else if (isModelOverall) {
      renderModelOverall();
      loadAllRatingsForRequirements();
    } else if (isModel) {
      renderModelView();
    } else if (isFeature) {
      renderFeatureView();
    } else if (isRequirements) {
      renderRequirementsView();
    } else {
      renderLeaderboard();
      loadRatingsForRequirement();
      loadCaseVotesForRequirement();
    }
    if (updateRoute) {
      updateBrowserRoute({ replace: replaceRoute });
    }
  };

  if (typeof document.startViewTransition === "function"
    && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    activeViewTransition?.skipTransition();
    const transition = document.startViewTransition(renderView);
    activeViewTransition = transition;
    transition.finished.then(
      () => {
        if (activeViewTransition === transition) {
          activeViewTransition = null;
        }
      },
      () => {
        if (activeViewTransition === transition) {
          activeViewTransition = null;
        }
      },
    );
    return;
  }

  renderView();
}

function openDialog(items, index) {
  state.dialogItems = items;
  state.dialogIndex = index;
  renderDialog();
  elements.dialog.showModal();
}

function renderDialog() {
  const image = state.dialogItems[state.dialogIndex];
  if (!image) {
    return;
  }
  elements.dialogModel.textContent = `${image.modelName} · ${String(image.sequence).padStart(2, "0")}`;
  elements.dialogTitle.textContent = image.title;
  elements.dialogImage.src = assetRoot + image.file;
  elements.dialogImage.alt = `${image.modelName}：${image.title}`;
  elements.dialogFile.textContent = image.file;
  const hasMultiple = state.dialogItems.length > 1;
  elements.dialogPrev.disabled = !hasMultiple;
  elements.dialogNext.disabled = !hasMultiple;
}

function moveDialog(offset) {
  const length = state.dialogItems.length;
  if (length < 2) {
    return;
  }
  state.dialogIndex = (state.dialogIndex + offset + length) % length;
  renderDialog();
}

async function copyRequirementCommit() {
  const commit = elements.requirementCommit.textContent.trim();
  if (!commit) {
    return;
  }

  const button = elements.copyRequirementCommit;
  try {
    await navigator.clipboard.writeText(commit);
    button.textContent = "已复制";
    button.setAttribute("aria-label", "已复制基础 commit");
  } catch (error) {
    console.error("Commit copy failed", error);
    button.textContent = "复制失败";
    button.setAttribute("aria-label", "复制基础 commit 失败");
  }

  window.setTimeout(() => {
    button.textContent = "复制";
    button.setAttribute("aria-label", "复制基础 commit");
  }, 1400);
}

async function copyRequirementPrompt() {
  const prompt = elements.requirementPrompt.textContent.trim();
  if (!prompt) {
    return;
  }

  const button = elements.copyRequirementPrompt;
  try {
    await navigator.clipboard.writeText(prompt);
    button.textContent = "已复制";
    button.setAttribute("aria-label", "已复制测试 Prompt");
  } catch (error) {
    console.error("Prompt copy failed", error);
    button.textContent = "复制失败";
    button.setAttribute("aria-label", "复制测试 Prompt 失败");
  }

  window.setTimeout(() => {
    button.textContent = "复制";
    button.setAttribute("aria-label", "复制测试 Prompt");
  }, 1400);
}

async function copyTestMethodFirstPrompt() {
  const prompt = elements.testMethodFirstPrompt.textContent.trim();
  if (!prompt) {
    return;
  }

  const button = elements.copyTestMethodFirstPrompt;
  try {
    await navigator.clipboard.writeText(prompt);
    button.textContent = "已复制";
    button.setAttribute("aria-label", "已复制首个 Prompt");
  } catch (error) {
    console.error("First prompt copy failed", error);
    button.textContent = "复制失败";
    button.setAttribute("aria-label", "复制首个 Prompt 失败");
  }

  window.setTimeout(() => {
    button.textContent = "复制";
    button.setAttribute("aria-label", "复制首个 Prompt");
  }, 1400);
}

elements.viewButtons.forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.view));
});
elements.homeModelOverallEntry.addEventListener("click", () => setView("model-overall"));
elements.homeTestMethodEntry.addEventListener("click", () => {
  state.requirementsTab = "method";
  setView("requirements");
});
elements.globalRequirementSelect.addEventListener("change", (event) => {
  state.requirementId = event.target.value;
  state.requirementsTab = "requirement";
  setView(state.view);
});
elements.backHome.addEventListener("click", () => {
  state.requirementId = null;
  state.requirementsTab = "requirement";
  renderGlobalRequirementSelect();
  setView("home");
});
elements.testMethodTab.addEventListener("click", () => {
  state.requirementsTab = "method";
  setView("requirements");
});
elements.copyRequirementCommit.addEventListener("click", copyRequirementCommit);
elements.copyRequirementPrompt.addEventListener("click", copyRequirementPrompt);
elements.copyTestMethodFirstPrompt.addEventListener("click", copyTestMethodFirstPrompt);
elements.leaderboardExport.addEventListener("click", downloadLeaderboardPng);
elements.modelOverallChartExpand.addEventListener("click", openModelOverallChartDialog);
elements.modelOverallChartShell.addEventListener("click", (event) => {
  if (!event.target.closest?.(".model-overall-chart__point")) {
    openModelOverallChartDialog();
  }
});
elements.modelOverallChartDownload.addEventListener("click", () => downloadModelOverallChartPng("duration"));
elements.modelTokenEfficiencyChartExpand.addEventListener("click", () => openModelOverallChartDialog("token"));
elements.modelTokenEfficiencyChartShell.addEventListener("click", (event) => {
  if (!event.target.closest?.(".model-overall-chart__point")) {
    openModelOverallChartDialog("token");
  }
});
elements.modelTokenEfficiencyChartDownload.addEventListener("click", () => downloadModelOverallChartPng("token"));
elements.modelOverallChartDialogClose.addEventListener("click", () => elements.modelOverallChartDialog.close());
elements.modelOverallChartDialog.addEventListener("click", (event) => {
  if (event.target === elements.modelOverallChartDialog) {
    elements.modelOverallChartDialog.close();
  }
});
elements.modelOverallDialogClose.addEventListener("click", () => elements.modelOverallDialog.close());
elements.modelOverallDialog.addEventListener("click", (event) => {
  if (event.target === elements.modelOverallDialog) {
    elements.modelOverallDialog.close();
  }
});
elements.leaderboardDetailDialogClose.addEventListener("click", () => elements.leaderboardDetailDialog.close());
elements.leaderboardDetailDialog.addEventListener("click", (event) => {
  if (event.target === elements.leaderboardDetailDialog) {
    elements.leaderboardDetailDialog.close();
  }
});
elements.dialogClose.addEventListener("click", () => elements.dialog.close());
elements.dialogPrev.addEventListener("click", () => moveDialog(-1));
elements.dialogNext.addEventListener("click", () => moveDialog(1));
elements.dialog.addEventListener("click", (event) => {
  if (event.target === elements.dialog) {
    elements.dialog.close();
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && elements.modelOverallChartDialog.open && !elements.modelOverallDialog.open) {
    event.preventDefault();
    elements.modelOverallChartDialog.close();
    return;
  }
  if (!elements.dialog.open) {
    return;
  }
  if (event.key === "ArrowLeft") {
    moveDialog(-1);
  }
  if (event.key === "ArrowRight") {
    moveDialog(1);
  }
});

window.addEventListener("popstate", applyBrowserRoute);
applyBrowserRoute();
renderBuildUpdatedAt();
loadLeaderboardData();
