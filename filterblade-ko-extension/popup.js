const enabled = document.querySelector("#enabled");
const status = document.querySelector("#status");

chrome.storage.sync.get({ enabled: true }, (items) => {
  enabled.checked = items.enabled;
  status.textContent = items.enabled ? "번역이 켜져 있습니다." : "번역이 꺼져 있습니다.";
});

enabled.addEventListener("change", () => {
  chrome.storage.sync.set({ enabled: enabled.checked }, () => {
    status.textContent = enabled.checked ? "번역이 켜졌습니다." : "번역이 꺼졌습니다.";
  });
});
