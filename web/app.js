const assetRoot = "./source/assets/";
const assetVersion = "?v=8";
const apiBase = String(window.__RATING_API_BASE__ || "").trim().replace(/\/+$/, "");

function apiUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${apiBase}${normalizedPath}`;
}

const models = [
  {
    id: "seed",
    name: "Doubao-Seed-2.1-Turbo",
    tool: "TRAE SOLO",
    images: [
      ["image-20260801230707-wdg04ed.png", "模型与模式选择", ["process"]],
      ["image-20260802095037-ltvoeks.png", "系统设置中的 S3 备份入口", ["settings"]],
      ["image-20260802095115-7ud4y54.png", "S3 备份设置主面板", ["overview"]],
      ["image-20260802095314-i6apboj.png", "新增 S3 目标配置", ["target"]],
      ["image-20260802095340-b7df0q9.png", "已保存的目标与全局配置", ["target", "status"]],
      ["image-20260802095352-pyixxux.png", "立即备份失败与运行记录", ["manual", "status"]],
      ["image-20260802095447-ruc5et2.png", "Cron 预览与定时设置", ["schedule"]],
      ["image-20260802095640-hay3wgb.png", "定时任务触发后的失败记录", ["schedule", "status"]],
      ["image-20260802100706-j9v0lm6.png", "服务重启提示", ["session"]],
      ["image-20260802100721-q2kvp0v.png", "重启后设置弹窗仍未关闭", ["session"]],
      ["image-20260802095746-56o6hjq.png", "AICR 问题命中表", ["review"]],
      ["image-20260802101849-4tjjb4z.png", "最终评分与主要结论", ["review"]],
    ],
  },
  {
    id: "qwen",
    name: "Qwen3.8-Max-Preview",
    tool: "QoderCN IDE Quest",
    images: [
      ["image-20260801230701-fvwhgxb.png", "1M 上下文与模型模式选择", ["process"]],
      ["image-20260802102318-b3vam73.png", "系统设置中的数据备份入口", ["settings"]],
      ["image-20260802102327-gu9mwx1.png", "数据备份主页面空状态", ["overview"]],
      ["image-20260802102336-ejm0dgy.png", "新建备份目标空表单", ["target"]],
      ["image-20260802102819-9u0ug4f.png", "填写完整的目标配置", ["target"]],
      ["image-20260802102825-qn4kldo.png", "已保存的目标配置", ["target", "status"]],
      ["image-20260802102848-n8rmn9c.png", "立即备份执行中", ["manual"]],
      ["image-20260802102846-dq1qowi.png", "备份成功提示", ["manual", "status"]],
      ["image-20260802102902-5s75tlk.png", "云端 scriverse 目录结构", ["remote"]],
      ["image-20260802102937-c6sgjia.png", "带时间戳的数据库快照", ["remote", "schedule"]],
      ["image-20260802101348-14c3h12.png", "AICR 问题命中表", ["review"]],
      ["image-20260802101945-orrtnq5.png", "最终评分与主要结论", ["review"]],
    ],
  },
  {
    id: "longcat",
    name: "LongCat-2.0",
    tool: "CatPaw",
    images: [
      ["image-20260801230716-nekt5zt.png", "模型选择界面", ["process"]],
      ["image-20260801235849-ejyt7r1.png", "任务完成与后续确认", ["process"]],
      ["image-20260802101228-1jv5yz0.png", "主仓库出现未跟踪改动", ["process"]],
      ["image-20260802101234-whvtc9k.png", "代码写入了错误目录", ["process"]],
      ["image-20260802101206-26lb7v6.png", "重新执行后的交付总结", ["process"]],
      ["image-20260802105941-ditpgyh.png", "系统设置中的 S3 备份入口", ["settings"]],
      ["image-20260802105943-0u6kpek.png", "S3 备份管理空状态", ["overview"]],
      ["image-20260802110845-9qxodgo.png", "新增目标空表单", ["target"]],
      ["image-20260802111003-5bh7bhw.png", "填写完整的目标配置", ["target"]],
      ["image-20260802111010-i775fw8.png", "已保存目标与启用状态", ["target", "status"]],
      ["image-20260802111031-w4li04j.png", "立即备份失败提示", ["manual", "status"]],
      ["image-20260802111235-i9pab3s.png", "测试连接失败提示", ["manual", "status"]],
      ["image-longcat-aicr-supplement.png", "AICR 审查完成与评分补充", ["review"]],
    ],
  },
  {
    id: "hy3",
    name: "Hy3",
    tool: "WorkBuddy",
    images: [
      ["image-20260801230712-zy199ri.png", "Max 模式与模型选择", ["process"]],
      ["image-20260802000001-749b4nc.png", "任务完成耗时", ["process"]],
      ["image-20260802105342-05j8kzb.png", "系统设置中的 S3 备份入口", ["settings"]],
      ["image-20260802105344-4m737cu.png", "S3 备份设置主面板", ["overview"]],
      ["image-20260802105527-4aabvqp.png", "新增备份目标基础字段", ["target"]],
      ["image-20260802110135-gj8rzs2.png", "填写完整的目标配置", ["target"]],
      ["image-20260802110141-bq3mewy.png", "目标配置与备份选项", ["target", "schedule"]],
      ["image-20260802110149-r0aikm6.png", "后端停止后的失败提示", ["manual", "status"]],
      ["image-20260802110340-okgd7vf.png", "已保存目标与编辑状态", ["target", "status"]],
      ["image-20260802110343-p6u33ob.png", "目标配置复核", ["target"]],
      ["image-20260802110406-kp4682t.png", "备份执行结果与日志", ["manual", "status"]],
      ["image-20260802110422-6ofe2h3.png", "云端 scriverse 目录结构", ["remote"]],
      ["image-20260802110447-u0g1mhb.png", "定时备份时间选择", ["schedule"]],
      ["image-20260802110503-98zcpg6.png", "保存定时配置后的面板", ["schedule"]],
      ["image-20260802110536-omtk6dq.png", "备份操作与状态反馈", ["manual", "status"]],
      ["image-20260802110648-m6ql5d7.png", "云端数据库快照列表", ["remote", "schedule"]],
      ["image-20260802110657-p6fe1ds.png", "定时备份触发后的记录", ["schedule", "status"]],
      ["image-20260802101359-jjt35bk.png", "AICR 问题命中表", ["review"]],
      ["image-20260802101931-0udpb3d.png", "最终评分与主要结论", ["review"]],
    ],
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
}

const leaderboardDataUrl = "./source/leaderboard.json?v=3";
let leaderboardData = null;
let leaderboardLoadError = false;
const ratingState = {
  requirementId: null,
  loading: false,
  loaded: false,
  error: "",
  values: new Map(),
};

function getRankingData() {
  if (!leaderboardData) {
    return [];
  }
  const testCases = leaderboardData.testCases;
  const scoreByPriority = leaderboardData.scoring.deductionByPriority;
  return leaderboardData.models
    .map((entry) => {
      const failedIds = new Set(Object.keys(entry.failures));
      const deductions = testCases.reduce(
        (total, testCase) => total + (failedIds.has(testCase.id) ? scoreByPriority[testCase.priority] : 0),
        0,
      );
      return {
        ...entry,
        model: models.find((model) => model.id === entry.modelId),
        agent: leaderboardData.agents.find((agent) => agent.modelId === entry.modelId) ?? entry.agent,
        score: leaderboardData.scoring.initial - deductions,
        passCount: testCases.length - failedIds.size,
        failureCount: failedIds.size,
      };
    })
    .sort((left, right) => right.score - left.score || right.passCount - left.passCount)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
}

const state = {
  view: "home",
  modelId: models[0].id,
  featureId: features[0].id,
  requirementId: null,
  dialogItems: [],
  dialogIndex: 0,
};

const elements = {
  viewButtons: [...document.querySelectorAll("[data-view]")],
  homeView: document.getElementById("home-view"),
  requirementList: document.getElementById("requirement-list"),
  globalAverageNote: document.getElementById("global-average-note"),
  pageHeaderControls: document.querySelector(".page-header__controls"),
  backHome: document.getElementById("back-home"),
  globalRequirementSelect: document.getElementById("global-requirement-select"),
  modelView: document.getElementById("model-view"),
  featureView: document.getElementById("feature-view"),
  modelTabs: document.getElementById("model-tabs"),
  modelKicker: document.getElementById("model-kicker"),
  modelTitle: document.getElementById("model-title"),
  modelCount: document.getElementById("model-count"),
  modelRating: document.getElementById("model-rating"),
  modelGallery: document.getElementById("model-gallery"),
  featureTabs: document.getElementById("feature-tabs"),
  featureTitle: document.getElementById("feature-title"),
  featureDescription: document.getElementById("feature-description"),
  featureCount: document.getElementById("feature-count"),
  featureComparison: document.getElementById("feature-comparison"),
  leaderboardView: document.getElementById("leaderboard-view"),
  leaderboardSummary: document.getElementById("leaderboard-summary"),
  leaderboardNote: document.getElementById("leaderboard-note"),
  leaderboardHead: document.getElementById("leaderboard-head"),
  leaderboardBody: document.getElementById("leaderboard-body"),
  requirementsView: document.getElementById("requirements-view"),
  requirementTabs: document.getElementById("requirement-tabs"),
  requirementTitle: document.getElementById("requirement-title"),
  requirementSummary: document.getElementById("requirement-summary"),
  requirementRepository: document.getElementById("requirement-repository"),
  requirementVersion: document.getElementById("requirement-version"),
  requirementCommit: document.getElementById("requirement-commit"),
  requirementDatabase: document.getElementById("requirement-database"),
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
};

function createScreenshotCard(image, items, index, compact = false) {
  const article = document.createElement("article");
  article.className = "screenshot-card";

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

  const img = document.createElement("img");
  img.src = assetRoot + image.file + assetVersion;
  img.alt = `${image.modelName}：${image.title}`;
  img.loading = "lazy";
  img.decoding = "async";

  meta.append(sequence, title);
  button.append(img);
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
      renderModelView();
    });
    elements.modelTabs.append(button);
  }
}

function formatRatingStars(averageStars) {
  const value = Math.max(0, Math.min(5, Number(averageStars) || 0));
  const fullStars = Math.floor(value);
  const hasHalfStar = value - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  return `${"★".repeat(fullStars)}${hasHalfStar ? "½" : ""}${"☆".repeat(emptyStars)}`;
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
  const stars = document.createElement("span");
  stars.className = "rating-summary__stars";
  stars.textContent = rating ? formatRatingStars(rating.averageStars) : "☆☆☆☆☆";
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
  input.min = "1";
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
  const status = document.createElement("span");
  status.className = "rating-form__status";
  status.textContent = ratingState.error;
  submit.addEventListener("click", async () => {
    submit.disabled = true;
    status.textContent = "提交中……";
    try {
      const response = await fetch(apiUrl("/api/ratings/vote"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requirementId: state.requirementId,
          modelId: state.modelId,
          starsHalf: Number(input.value),
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error === "daily_limit_reached" && Number.isInteger(payload.limit)
          ? `今日对该模型的评分次数已达 ${payload.limit} 次上限`
          : "评分服务暂不可用");
      }
      ratingState.error = "评分已记录";
      await loadRatingsForRequirement(true);
    } catch (error) {
      ratingState.error = error instanceof Error && error.message ? error.message : "评分服务尚未部署";
      renderModelRating();
    } finally {
      submit.disabled = false;
    }
  });
  form.append(label, input, value, submit, status);
  panel.append(summary, form);
  elements.modelRating.append(panel);
}

async function loadRatingsForRequirement(force = false) {
  if (!state.requirementId || (ratingState.loading && !force)) {
    return;
  }
  if (!force && ratingState.loaded && ratingState.requirementId === state.requirementId) {
    renderModelRating();
    return;
  }
  ratingState.requirementId = state.requirementId;
  ratingState.loading = true;
  ratingState.error = "";
  try {
    const response = await fetch(apiUrl(`/api/ratings?requirementId=${encodeURIComponent(state.requirementId)}`), { cache: "no-store" });
    if (!response.ok) {
      throw new Error("评分服务尚未部署");
    }
    const payload = await response.json();
    ratingState.values = new Map((payload.data || []).map((item) => [item.modelId, item]));
    ratingState.loaded = true;
  } catch {
    ratingState.values = new Map();
    ratingState.loaded = false;
    ratingState.error = "评分服务尚未部署";
  } finally {
    ratingState.loading = false;
    const activeElement = document.activeElement;
    if (activeElement?.classList.contains("rating-form__range")) {
      const status = elements.modelRating.querySelector(".rating-form__status");
      if (status) {
        status.textContent = ratingState.error || "每日每个模型最多 10 次";
      }
    } else {
      renderModelRating();
    }
  }
}

function renderModelView() {
  const model = models.find((item) => item.id === state.modelId) ?? models[0];
  renderModelTabs();
  elements.modelKicker.textContent = model.tool;
  elements.modelTitle.textContent = model.name;
  elements.modelCount.textContent = `${model.images.length} 张 · 原文顺序`;
  renderModelRating();
  loadRatingsForRequirement();
  elements.modelGallery.replaceChildren();
  model.images.forEach((image, index) => {
    elements.modelGallery.append(createScreenshotCard(image, model.images, index));
  });
}

function getFeatureItems(featureId, modelId) {
  const model = models.find((item) => item.id === modelId);
  return model ? model.images.filter((image) => image.tags.includes(featureId)) : [];
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
      renderFeatureView();
    });
    elements.featureTabs.append(button);
  }
}

function createComparisonColumn(model, items) {
  const column = document.createElement("section");
  column.className = "comparison-column";

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

  for (const model of models) {
    elements.featureComparison.append(createComparisonColumn(model, getFeatureItems(feature.id, model.id)));
  }
}

function createLeaderboardSummaryCard(entry) {
  const card = document.createElement("article");
  card.className = "leaderboard-card";

  const rank = document.createElement("p");
  rank.className = "leaderboard-card__rank";
  rank.textContent = `第 ${entry.rank} 名`;

  const name = document.createElement("h3");
  name.className = "leaderboard-card__name";
  name.textContent = entry.model?.name ?? entry.modelId;

  const agent = document.createElement("p");
  agent.className = "leaderboard-card__agent";
  agent.textContent = `${entry.agent?.software ?? "软件版本未记录"} · ${entry.agent?.version ?? "版本未记录"}`;

  const context = document.createElement("p");
  context.className = "leaderboard-card__context";
  context.textContent = `上下文 ${entry.agent?.context ?? "未记录"}`;

  const score = document.createElement("p");
  score.className = "leaderboard-card__score";
  score.textContent = `${entry.score} / ${leaderboardData?.scoring.initial ?? 200}`;

  const totalCount = leaderboardData?.testCases.length ?? 0;
  const failureCount = Object.keys(entry.failures).length;
  const meta = document.createElement("p");
  meta.className = "leaderboard-card__meta";
  meta.textContent = `通过 ${totalCount - failureCount} / ${totalCount} · 未通过 ${failureCount} · ${entry.duration}`;

  card.append(rank, name, agent, context, score, meta);
  return card;
}

function createLeaderboardResultCell(entry, testCase) {
  const failed = Object.prototype.hasOwnProperty.call(entry.failures, testCase.id);
  const cell = document.createElement("td");
  cell.className = `leaderboard-result ${failed ? "leaderboard-result--fail" : "leaderboard-result--pass"}`;

  const status = document.createElement("span");
  status.className = "leaderboard-status";
  status.textContent = failed ? "未通过" : "通过";
  cell.append(status);

  if (failed) {
    const reason = entry.failures[testCase.id];
    const reasonElement = document.createElement("span");
    reasonElement.className = "leaderboard-reason";
    if (reason) {
      reasonElement.textContent = reason;
    } else {
      reasonElement.classList.add("leaderboard-reason--empty");
      reasonElement.title = "失败原因未记录";
      reasonElement.setAttribute("aria-label", "失败原因未记录");
    }
    cell.append(reasonElement);
  }

  return cell;
}

function renderLeaderboard() {
  const rankingData = getRankingData();
  const testCases = leaderboardData?.testCases ?? [];
  elements.leaderboardSummary.replaceChildren();
  elements.leaderboardHead.replaceChildren();
  elements.leaderboardBody.replaceChildren();

  if (!leaderboardData) {
    const message = document.createElement("p");
    message.className = "leaderboard-loading";
    message.textContent = leaderboardLoadError ? "排行榜数据加载失败，请刷新页面重试。" : "正在加载排行榜数据……";
    elements.leaderboardSummary.append(message);
    elements.leaderboardNote.textContent = "排行榜数据来自 source/leaderboard.json。";
    return;
  }

  const deductions = leaderboardData.scoring.deductionByPriority;
  elements.leaderboardNote.textContent = `扣分规则：初始 ${leaderboardData.scoring.initial} 分；P00 每项扣 ${deductions.P00} 分，P0 每项扣 ${deductions.P0} 分，P1 每项扣 ${deductions.P1} 分，P2 不扣分。状态来自初步人工复核记录；失败原因为空表示资料中尚未记录明确原因。TC-20 的状态按各模型表格记录展示，但不计入得分扣分。`;
  for (const entry of rankingData) {
    elements.leaderboardSummary.append(createLeaderboardSummaryCard(entry));
  }

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
    name.textContent = entry.model?.name ?? entry.modelId;
    modelHeader.append(rank, name);
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
    const scenario = document.createElement("span");
    scenario.className = "leaderboard-test__scenario";
    scenario.textContent = testCase.scenario;
    testCell.append(identity, scenario);
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

function createRequirementCard(requirement) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "requirement-card";
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
  base.textContent = `${requirement.baseRepository} · ${requirement.baseVersion}`;
  const action = document.createElement("span");
  action.className = "requirement-card__action";
  action.textContent = "进入需求详情";

  card.append(label, title, base, action);
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
  for (const requirement of requirements) {
    elements.requirementList.append(createRequirementCard(requirement));
  }

  if (requirements.length > 1) {
    const scores = requirements.map(getRequirementAverageScore).filter((score) => score !== null);
    elements.globalAverageNote.hidden = false;
    elements.globalAverageNote.textContent = scores.length === requirements.length
      ? `全局平均评分：${(scores.reduce((total, score) => total + score, 0) / scores.length).toFixed(1)} / ${leaderboardData.scoring.initial}`
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
    button.setAttribute("aria-selected", String(requirement.id === state.requirementId));
    button.addEventListener("click", () => {
      state.requirementId = requirement.id;
      renderGlobalRequirementSelect();
      renderRequirementsView();
    });
    elements.requirementTabs.append(button);
  }
}

function renderRequirementsView() {
  if (!leaderboardData) {
    elements.requirementTabs.replaceChildren();
    elements.requirementTitle.textContent = "正在加载测试需求……";
    elements.requirementSummary.textContent = "需求信息来自 source/leaderboard.json。";
    elements.agentRosterBody.replaceChildren();
    return;
  }

  const requirements = leaderboardData.requirements ?? [];
  const requirement = requirements.find((item) => item.id === state.requirementId) ?? requirements[0];
  if (!requirement) {
    elements.requirementTabs.replaceChildren();
    elements.requirementTitle.textContent = "暂无测试需求";
    elements.requirementSummary.textContent = "可以在 leaderboard.json 的 requirements 数组中继续添加需求。";
    elements.agentRosterBody.replaceChildren();
    return;
  }

  state.requirementId = requirement.id;
  renderRequirementTabs(requirements);
  elements.requirementTitle.textContent = requirement.title;
  elements.requirementSummary.textContent = `基于 ${requirement.baseRepository} ${requirement.baseVersion}，用于记录本轮测试基线与参赛配置。`;
  elements.requirementRepository.href = requirement.baseRepositoryUrl;
  elements.requirementRepository.textContent = requirement.baseRepository;
  elements.requirementVersion.textContent = requirement.baseVersion;
  elements.requirementCommit.textContent = requirement.baseCommit;
  elements.requirementDatabase.href = requirement.evaluationDatabaseUrl ?? "#";
  elements.requirementDatabase.textContent = requirement.evaluationDatabase ?? "未记录";
  elements.requirementPrompt.textContent = requirement.prompt;

  const agentRows = (leaderboardData.agents ?? []).map((agent) => {
    const row = document.createElement("tr");
    const model = document.createElement("th");
    model.scope = "row";
    model.textContent = agent.modelName;
    const software = document.createElement("td");
    software.textContent = agent.software || "未记录";
    const version = document.createElement("td");
    version.textContent = agent.version || "未记录";
    const context = document.createElement("td");
    context.textContent = agent.context || "未记录";
    const status = document.createElement("td");
    status.className = `agent-status ${agent.status === "已测试" ? "agent-status--tested" : "agent-status--pending"}`;
    status.textContent = agent.status;
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
    const response = await fetch(leaderboardDataUrl, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Leaderboard data request failed: ${response.status}`);
    }
    const payload = await response.json();
    if (!payload || !Array.isArray(payload.testCases) || !Array.isArray(payload.models) || !Array.isArray(payload.requirements) || !Array.isArray(payload.agents) || !payload.scoring) {
      throw new Error("Leaderboard data shape is invalid");
    }
    leaderboardData = payload;
    renderGlobalRequirementSelect();
    if (state.view === "home") {
      renderHomeView();
    }
    if (state.view === "leaderboard") {
      renderLeaderboard();
    }
    if (state.view === "requirements") {
      renderRequirementsView();
    }
    if (state.view === "home") {
      renderHomeView();
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

function setView(view) {
  if (view !== "home" && !state.requirementId) {
    view = "home";
  }
  state.view = view;
  const isHome = view === "home";
  const isModel = view === "model";
  const isFeature = view === "feature";
  const isRequirements = view === "requirements";
  elements.homeView.hidden = !isHome;
  elements.modelView.hidden = !isModel;
  elements.featureView.hidden = !isFeature;
  elements.leaderboardView.hidden = view !== "leaderboard";
  elements.requirementsView.hidden = !isRequirements;
  elements.pageHeaderControls.hidden = isHome;
  elements.backHome.hidden = isHome;
  elements.viewButtons.forEach((button) => {
    button.setAttribute("aria-selected", String(button.dataset.view === view));
  });
  if (isHome) {
    renderHomeView();
  } else if (isModel) {
    renderModelView();
  } else if (isFeature) {
    renderFeatureView();
  } else if (isRequirements) {
    renderRequirementsView();
  } else {
    renderLeaderboard();
  }
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
  elements.dialogImage.src = assetRoot + image.file + assetVersion;
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

elements.viewButtons.forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.view));
});
elements.globalRequirementSelect.addEventListener("change", (event) => {
  state.requirementId = event.target.value;
  setView(state.view);
});
elements.backHome.addEventListener("click", () => {
  state.requirementId = null;
  renderGlobalRequirementSelect();
  setView("home");
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

setView("home");
loadLeaderboardData();
