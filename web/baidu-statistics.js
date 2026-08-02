(() => {
  const statisticsId = String(window.__BAIDU_STATISTICS_ID__ || "").trim();
  if (!statisticsId) {
    return;
  }

  window._hmt = window._hmt || [];
  const hm = document.createElement("script");
  hm.src = `https://hm.baidu.com/hm.js?${encodeURIComponent(statisticsId)}`;
  const firstScript = document.getElementsByTagName("script")[0];
  if (!firstScript || !firstScript.parentNode) {
    return;
  }
  firstScript.parentNode.insertBefore(hm, firstScript);
})();
