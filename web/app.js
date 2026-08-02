const assetRoot = "/source/assets/";
const apiBase = String(window.__RATING_API_BASE__ || "").trim().replace(/\/+$/, "");

function apiUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${apiBase}${normalizedPath}`;
}

const models = [
  {
    id: 1,
    name: "Doubao-Seed-2.1-Turbo",
    tool: "TRAE SOLO",
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
    images: [],
  },
  {
    id: 6,
    name: "DeepSeek V4 Pro Preview",
    tool: "Claude Code",
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

const leaderboardDataUrl = "/source/leaderboard.json?v=16";
let leaderboardData = null;
let leaderboardLoadError = false;
let rankingDataCache = null;
let rankingDataCacheSource = null;
let rankingDataCacheRequirementId = null;
const ratingState = {
  requirementId: null,
  loading: false,
  loaded: false,
  error: "",
  values: new Map(),
  allLoading: false,
  allLoaded: false,
  allError: false,
  allValues: new Map(),
  valuesByRequirement: new Map(),
  requestsByRequirement: new Map(),
};

function getCurrentRequirement() {
  const requirements = leaderboardData?.requirements ?? [];
  return requirements.find((requirement) => requirement.id === state.requirementId) ?? requirements[0] ?? null;
}

function getRequirementScoring(requirement) {
  return requirement?.scoring ?? { initial: 200, deductionByPriority: {} };
}

function getRequirementTestCases(requirement) {
  return requirement?.testCases ?? [];
}

function formatDeductionRules(deductionByPriority = {}) {
  return Object.entries(deductionByPriority)
    .map(([priority, deduction]) => `${priority} ${Number(deduction) > 0 ? `每项扣 ${deduction} 分` : "不扣分"}`)
    .join("，");
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
  rankingDataCache = leaderboardData.models
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
        score: scoring.initial - deductions,
        maxScore: scoring.initial,
        testCaseCount: testCases.length,
        passCount: testCases.length - failedIds.size,
        failureCount: failedIds.size,
      };
    })
    .sort((left, right) => right.score - left.score || right.passCount - left.passCount)
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

function renderBuildUpdatedAt() {
  const source = window.__WEB_UPDATED_AT__ || document.lastModified;
  elements.buildUpdatedAt.textContent = `最近更新时间：${formatBuildUpdatedAt(source)}`;
}

function getOverallRatingData() {
  const testRanking = new Map(getRankingData().map((entry) => [entry.modelId, entry]));
  const ranking = models.map((model) => ({
    model,
    agent: leaderboardData?.agents.find((entry) => entry.modelId === model.id),
    test: testRanking.get(model.id) ?? null,
    testedRequirementCount: getTestedRequirementCount(model.id),
    weightedAverageDurationSeconds: getWeightedAverageDurationSeconds(model.id),
    rating: ratingState.allValues.get(model.id) ?? null,
  }));

  ranking.sort((left, right) => {
    return (left.test?.rank ?? Number.MAX_SAFE_INTEGER) - (right.test?.rank ?? Number.MAX_SAFE_INTEGER)
      || left.model.name.localeCompare(right.model.name);
  });

  return ranking;
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
  const hasPerRequirementResults = requirements.some((requirement) => getRequirementModelEntries(requirement));
  const durationRecords = hasPerRequirementResults
    ? requirements.flatMap((requirement) => (getRequirementModelEntries(requirement) ?? [])
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
  const minutes = Number(durationSeconds) / 60;
  if (minutes >= 60) {
    return `${(minutes / 60).toFixed(minutes >= 100 ? 0 : 1)} h`;
  }
  return `${minutes.toFixed(minutes >= 10 ? 0 : 1)} min`;
}

function createModelOverallChartData(ranking) {
  return ranking
    .map((entry, index) => {
      const weightedAverageDurationSeconds = Number(entry.weightedAverageDurationSeconds);
      const testCaseCount = Number(entry.test?.testCaseCount);
      const passCount = Number(entry.test?.passCount);
      if (!Number.isFinite(weightedAverageDurationSeconds) || weightedAverageDurationSeconds <= 0 || !Number.isFinite(testCaseCount) || testCaseCount <= 0) {
        return null;
      }
      const passRate = Math.max(0, Math.min(100, (passCount / testCaseCount) * 100));
      return {
        entry,
        weightedAverageDurationSeconds,
        passRate,
        color: chartPointColors[index % chartPointColors.length],
      };
    })
    .filter(Boolean);
}

function renderModelOverallChart(ranking = []) {
  elements.modelOverallChart.replaceChildren();
  elements.modelOverallChartEmpty.hidden = true;
  const chartData = createModelOverallChartData(ranking);
  if (chartData.length === 0) {
    elements.modelOverallChartNote.textContent = leaderboardData ? "暂无可绘制的加权平均耗时数据" : "正在加载数据";
    elements.modelOverallChartEmpty.hidden = false;
    elements.modelOverallChartEmpty.textContent = leaderboardData ? "目前没有同时记录加权平均耗时和用例通过率的模型。" : "正在加载散点图数据……";
    return;
  }

  const width = 900;
  const height = 420;
  const margin = { top: 24, right: 28, bottom: 68, left: 64 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const maxDurationSeconds = Math.max(60, ...chartData.map((item) => item.weightedAverageDurationSeconds)) * 1.12;
  const xPosition = (durationSeconds) => margin.left + (durationSeconds / maxDurationSeconds) * plotWidth;
  const yPosition = (passRate) => margin.top + ((100 - passRate) / 100) * plotHeight;

  elements.modelOverallChart.setAttribute("viewBox", `0 0 ${width} ${height}`);
  elements.modelOverallChart.setAttribute("preserveAspectRatio", "xMidYMid meet");
  const title = createChartSvgElement("title", { id: "model-overall-chart-svg-title" }, "模型加权平均耗时与用例通过率散点图");
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
    labels.append(createChartSvgElement("text", { x, y: margin.top + plotHeight + 42, "text-anchor": "middle" }, formatChartDuration(value)));
  });
  labels.append(
    createChartSvgElement("text", { class: "model-overall-chart__axis-title", x: margin.left + plotWidth / 2, y: height - 12, "text-anchor": "middle" }, "加权平均耗时"),
    createChartSvgElement("text", { class: "model-overall-chart__axis-title", transform: `translate(16 ${margin.top + plotHeight / 2}) rotate(-90)`, "text-anchor": "middle" }, "用例通过率"),
  );
  elements.modelOverallChart.append(labels);

  const points = createChartSvgElement("g", { class: "model-overall-chart__points" });
  chartData.forEach((item) => {
    const point = createChartSvgElement("circle", {
      class: "model-overall-chart__point",
      cx: xPosition(item.weightedAverageDurationSeconds),
      cy: yPosition(item.passRate),
      r: 5,
      fill: item.color,
      tabindex: 0,
      role: "button",
      "aria-label": `${item.entry.model.name}，加权平均耗时 ${formatChartDuration(item.weightedAverageDurationSeconds)}，用例通过率 ${item.passRate.toFixed(0)}%`,
    });
    const pointTitle = createChartSvgElement("title", {}, `${item.entry.model.name}：加权平均耗时 ${formatChartDuration(item.weightedAverageDurationSeconds)}，通过率 ${item.passRate.toFixed(0)}%`);
    point.append(pointTitle);
    const openDetails = () => openModelOverallDetails(item.entry);
    point.addEventListener("click", openDetails);
    point.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openDetails();
      }
    });
    points.append(point);
  });
  elements.modelOverallChart.append(points);

  const pointLabels = createChartSvgElement("g", { class: "model-overall-chart__point-labels" });
  chartData.forEach((item) => {
    const pointY = yPosition(item.passRate);
    const labelY = Math.min(pointY + 24, margin.top + plotHeight + 22);
    pointLabels.append(createChartSvgElement(
      "text",
      {
        class: "model-overall-chart__point-label",
        x: xPosition(item.weightedAverageDurationSeconds),
        y: labelY,
        "text-anchor": "middle",
      },
      item.entry.model.name,
    ));
  });
  elements.modelOverallChart.append(pointLabels);
  elements.modelOverallChartNote.textContent = `${chartData.length} 个模型有完整加权平均耗时与通过率数据`;
}

function getRequirementModelEntries(requirement) {
  return [
    requirement.models,
    requirement.results,
    requirement.evaluations,
    requirement.modelResults,
  ].find(Array.isArray);
}

function getTestedRequirements(modelId) {
  const requirements = leaderboardData?.requirements ?? [];
  const hasPerRequirementResults = requirements.some((requirement) => getRequirementModelEntries(requirement));
  if (!hasPerRequirementResults) {
    return requirements.length > 0 && leaderboardData.models.some((entry) => entry.modelId === modelId) ? requirements : [];
  }

  return requirements.filter((requirement) => {
    const entries = getRequirementModelEntries(requirement) ?? [];
    return entries.some((entry) => (entry.modelId ?? entry.id) === modelId);
  });
}

function getTestedRequirementCount(modelId) {
  return getTestedRequirements(modelId).length;
}

function openModelOverallDetails(entry) {
  const requirements = getTestedRequirements(entry.model.id);
  elements.modelOverallDialogModel.textContent = entry.model.name;
  elements.modelOverallDialogMeta.textContent = `工具：${entry.agent?.software || entry.model.tool} · 已测试 ${requirements.length} / ${leaderboardData.requirements.length}`;
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
      meta.textContent = `${requirement.baseRepository} · ${requirement.baseVersion}`;
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
  row.setAttribute("aria-label", `查看 ${entry.model.name} 已测试的需求`);
  row.addEventListener("click", () => openModelOverallDetails(entry));

  const identity = document.createElement("div");
  identity.className = "model-overall-row__identity";
  const rank = document.createElement("span");
  rank.className = "model-overall-row__rank";
  rank.textContent = entry.test ? `第 ${String(entry.test.rank).padStart(2, "0")} 名` : "未纳入测试";
  const name = document.createElement("strong");
  name.className = "model-overall-row__name";
  name.textContent = entry.model.name;
  const tool = document.createElement("span");
  tool.className = "model-overall-row__tool";
  tool.textContent = `工具：${entry.agent?.software || entry.model.tool}`;
  identity.append(rank, name, tool);

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
  testLabel.textContent = "测试用例评分";
  const testValue = document.createElement("strong");
  testValue.className = "model-overall-row__score";
  testValue.textContent = entry.test ? `${entry.test.score} / ${entry.test.maxScore}` : "暂无数据";
  const testMeta = document.createElement("span");
  testMeta.className = "model-overall-row__meta";
  if (entry.test) {
    const passRate = entry.test.testCaseCount > 0
      ? Math.round((entry.test.passCount / entry.test.testCaseCount) * 100)
      : 0;
    testMeta.textContent = `${entry.test.passCount}/${entry.test.testCaseCount} 个用例通过 ${passRate}%`;
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
    return;
  }

  const ranking = getOverallRatingData();
  renderModelOverallChart(ranking);
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
  requirementsTab: "requirement",
  dialogItems: [],
  dialogIndex: 0,
};

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
  leaderboardDetailDialogReason: document.getElementById("leaderboard-detail-dialog-reason"),
  leaderboardDetailDialogClose: document.getElementById("leaderboard-detail-dialog-close"),
  pageHeaderControls: document.querySelector(".page-header__controls"),
  viewSwitch: document.querySelector(".view-switch"),
  globalRequirementSwitch: document.querySelector(".global-requirement-switch"),
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
  leaderboardRequirement: document.getElementById("leaderboard-requirement"),
  leaderboardDescription: document.getElementById("leaderboard-description"),
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
  requirementTitle: document.getElementById("requirement-title"),
  requirementSummary: document.getElementById("requirement-summary"),
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
  img.src = assetRoot + image.file;
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
      setView("model");
    });
    elements.modelTabs.append(button);
  }
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
  const status = document.createElement("span");
  status.className = "rating-form__status";
  status.textContent = ratingState.error;
  submit.addEventListener("click", async () => {
    submit.disabled = true;
    status.textContent = "提交中……";
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
      ratingState.error = "评分已记录";
      await loadRatingsForRequirement(true);
      await loadAllRatingsForRequirements(true);
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
  ratingState.error = "";
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
      ratingState.error = "评分服务尚未部署";
    }
  } finally {
    if (state.requirementId === requirementId) {
      ratingState.loading = false;
      const activeElement = document.activeElement;
      if (activeElement?.classList.contains("rating-form__range")) {
        const status = elements.modelRating.querySelector(".rating-form__status");
        if (status) {
          status.textContent = ratingState.error || "每日每个模型最多 10 次";
        }
      } else if (state.view === "leaderboard") {
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

function renderModelView() {
  const model = models.find((item) => item.id === state.modelId) ?? models[0];
  renderModelTabs();
  elements.modelKicker.textContent = model.tool;
  elements.modelTitle.textContent = model.name;
  elements.modelCount.textContent = `${model.images.length} 张 · 原文顺序`;
  renderModelRating();
  loadRatingsForRequirement();
  elements.modelGallery.replaceChildren();
  if (model.images.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "暂无截图资料";
    elements.modelGallery.append(empty);
    return;
  }
  model.images.forEach((image, index) => {
    elements.modelGallery.append(createScreenshotCard(image, model.images, index));
  });
}

function getFeatureItems(featureId, modelId) {
  const model = models.find((item) => item.id === modelId);
  return model?.imagesByFeature.get(featureId) ?? [];
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
  score.textContent = `${entry.score} / ${entry.maxScore}`;

  const totalCount = entry.testCaseCount;
  const failureCount = Object.keys(entry.failures).length;
  const passCount = totalCount - failureCount;
  const passRate = totalCount > 0 ? Math.round((passCount / totalCount) * 100) : 0;
  const meta = document.createElement("p");
  meta.className = "leaderboard-card__meta";
  const durationText = entry.durationSeconds === null || entry.durationSeconds === undefined
    ? "耗时未记录"
    : formatDurationSeconds(entry.durationSeconds);
  meta.textContent = `通过 ${passCount} / ${totalCount} · 通过率 ${passRate}% · ${durationText}`;

  card.append(rank, name, agent, context, score, meta);
  return card;
}

function createLeaderboardSummaryList(entries, className = "leaderboard-summary__list") {
  const list = document.createElement("div");
  list.className = className;
  for (const entry of entries) {
    list.append(createLeaderboardSummaryCard(entry));
  }
  return list;
}

function createLeaderboardResultCell(entry, testCase) {
  const failed = Object.prototype.hasOwnProperty.call(entry.failures, testCase.id);
  const cell = document.createElement("td");
  cell.className = `leaderboard-result ${failed ? "leaderboard-result--fail" : "leaderboard-result--pass"}`;

  const status = document.createElement(failed ? "button" : "span");
  status.className = `leaderboard-status${failed ? " leaderboard-status--trigger" : ""}`;
  status.textContent = failed ? "未通过" : "通过";

  if (failed) {
    const reason = entry.failures[testCase.id] || "失败原因未记录";
    status.type = "button";
    status.setAttribute("aria-label", `查看 ${entry.model?.name ?? entry.modelId} ${testCase.id} 失败原因`);
    status.addEventListener("click", () => openLeaderboardDetail({
      label: `${entry.model?.name ?? entry.modelId} · ${testCase.id}`,
      title: "失败原因",
      requirementName: getCurrentRequirement()?.title ?? "当前测试需求",
      modelName: entry.model?.name ?? entry.modelId,
      testCaseId: testCase.id,
      priority: testCase.priority,
      scenario: testCase.scenario,
      reason,
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
  reason,
}) {
  elements.leaderboardDetailDialogLabel.textContent = label;
  elements.leaderboardDetailDialogTitle.textContent = title;
  elements.leaderboardDetailDialogRequirement.textContent = requirementName;
  elements.leaderboardDetailDialogModel.textContent = modelName;
  elements.leaderboardDetailDialogTestCase.textContent = `${testCaseId} · ${priority}`;
  elements.leaderboardDetailDialogScenario.textContent = scenario;
  elements.leaderboardDetailDialogReasonSection.hidden = !reason;
  elements.leaderboardDetailDialogReason.textContent = reason ?? "";
  elements.leaderboardDetailDialog.showModal();
}

function renderLeaderboard() {
  const rankingData = getRankingData();
  const currentRequirement = getCurrentRequirement();
  const testCases = getRequirementTestCases(currentRequirement);
  const scoring = getRequirementScoring(currentRequirement);
  elements.leaderboardSummary.replaceChildren();
  elements.leaderboardHead.replaceChildren();
  elements.leaderboardBody.replaceChildren();
  elements.leaderboardRequirement.textContent = currentRequirement
    ? `最终测试结果：${currentRequirement.title}`
    : "最终测试结果";

  if (!leaderboardData) {
    const message = document.createElement("p");
    message.className = "leaderboard-loading";
    message.textContent = leaderboardLoadError ? "排行榜数据加载失败，请刷新页面重试。" : "正在加载排行榜数据……";
    elements.leaderboardSummary.append(message);
    elements.leaderboardNote.textContent = "排行榜数据来自 source/leaderboard.json。";
    return;
  }

  const deductionRules = formatDeductionRules(scoring.deductionByPriority);
  elements.leaderboardNote.textContent = `扣分规则：初始 ${scoring.initial} 分；${deductionRules || "暂无扣分规则"}。状态来自初步人工复核记录；失败原因为空表示资料中尚未记录明确原因。TC-20 的状态按各模型表格记录展示，但不计入得分扣分。`;
  elements.leaderboardDescription.textContent = "按人工评分复核记录汇总排名、得分与每个测试用例的通过状态。点击“未通过”状态可查看详细失败原因。";
  const visibleEntries = rankingData.slice(0, 3);
  const hiddenEntries = rankingData.slice(3);
  elements.leaderboardSummary.append(createLeaderboardSummaryList(visibleEntries));

  if (hiddenEntries.length > 0) {
    const hiddenList = createLeaderboardSummaryList(hiddenEntries, "leaderboard-summary__list leaderboard-summary__list--additional");
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
    name.textContent = entry.model?.name ?? entry.modelId;
    name.title = name.textContent;
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
    }));
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
  for (const requirement of requirements) {
    elements.requirementList.append(createRequirementCard(requirement));
  }

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
    elements.requirementSummary.textContent = "需求信息来自 source/leaderboard.json。";
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
    elements.requirementSummary.textContent = "可以在 leaderboard.json 的 requirements 数组中继续添加需求。";
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
  elements.requirementSummary.textContent = `基于 ${requirement.baseRepository} ${requirement.baseVersion}，用于记录本轮测试基线与参赛配置。`;
  elements.requirementRepository.href = requirement.baseRepositoryUrl;
  elements.requirementRepository.textContent = requirement.baseRepository;
  elements.requirementCommit.textContent = requirement.baseCommit;
  elements.requirementDatabase.href = requirement.evaluationDatabaseUrl ?? "#";
  elements.requirementDatabase.textContent = requirement.evaluationDatabase ?? "未记录";
  const requirementWeight = getRequirementWeight(requirement);
  elements.requirementWeight.textContent = formatRequirementWeight(requirementWeight);
  elements.requirementWeightNote.textContent = "相对系数，1.0 为基准";
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
    const response = await fetch(leaderboardDataUrl, { cache: "no-cache" });
    if (!response.ok) {
      throw new Error(`Leaderboard data request failed: ${response.status}`);
    }
    const payload = await response.json();
    const hasValidRequirementScoring = Array.isArray(payload?.requirements)
      && payload.requirements.length > 0
      && payload.requirements.every((requirement) => {
        const scoring = requirement?.scoring;
        const deductionByPriority = scoring?.deductionByPriority;
        return scoring?.initial === 200
          && deductionByPriority
          && typeof deductionByPriority === "object"
          && Array.isArray(requirement.testCases)
          && requirement.testCases.every((testCase) => (
            testCase?.id
            && testCase?.priority
            && Object.prototype.hasOwnProperty.call(deductionByPriority, testCase.priority)
          ));
      });
    if (!payload || !Array.isArray(payload.models) || !Array.isArray(payload.requirements) || !Array.isArray(payload.agents) || !hasValidRequirementScoring) {
      throw new Error("Leaderboard data shape is invalid");
    }
    leaderboardData = payload;
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
    return `/req/${requirementPath}/model/${encodeURIComponent(state.modelId)}`;
  }
  if (state.view === "feature") {
    return `/req/${requirementPath}/feature/${encodeURIComponent(state.featureId)}`;
  }
  return "/";
}

function updateBrowserRoute({ replace = false } = {}) {
  const nextPath = getRoutePath();
  if (window.location.pathname === nextPath) {
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
  if (parts[2] === "model" && parts[3]) {
    const modelId = Number(parts[3]);
    return {
      view: "model",
      requirementId,
      modelId: Number.isSafeInteger(modelId) ? modelId : models[0].id,
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
  state.featureId = route.featureId ?? features[0].id;
  setView(state.view, { updateRoute: false });
}

function setView(view, { updateRoute = true, replaceRoute = false } = {}) {
  const isGlobalTestMethod = view === "requirements" && state.requirementsTab === "method";
  if (view !== "home" && view !== "model-overall" && !state.requirementId && !isGlobalTestMethod) {
    view = "home";
  }
  state.view = view;
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
  }
  if (updateRoute) {
    updateBrowserRoute({ replace: replaceRoute });
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
