(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const elements = ["fileInput","dropZone","chooseButton","fileReady","fileName","error","v4Button","v6Button","endpoint","tunnelIp","port","dns","udp","cc","flag","name","result","copyButton","hint","status"].reduce((o,id)=>(o[id]=$(id),o),{});
  let config = null;
  let family = "v4";
  let udpEnabled = true;

  const pemBody = (value="") => value.replace(/-----BEGIN PUBLIC KEY-----|-----END PUBLIC KEY-----/g, "").replace(/\s/g, "");
  const enc = (value) => encodeURIComponent(value).replace(/%2C/gi, ",");

  function refreshFamily() {
    const v4 = family === "v4";
    elements.endpoint.value = config ? (v4 ? config.endpoint_v4 || "" : config.endpoint_v6 || "") : "";
    elements.tunnelIp.value = config ? (v4 ? config.ipv4 || "" : config.ipv6 || "") : "";
    elements.v4Button.classList.toggle("active", v4);
    elements.v6Button.classList.toggle("active", !v4);
    generate();
  }

  function generate() {
    if (!config || !elements.endpoint.value || !elements.tunnelIp.value || !config.private_key || !config.endpoint_pub_key) {
      elements.result.textContent = "masque://…";
      elements.copyButton.disabled = true;
      return;
    }
    const host = family === "v6" ? `[${elements.endpoint.value}]` : elements.endpoint.value;
    const params = [
      ["publicKey", pemBody(config.endpoint_pub_key)], ["privateKey", config.private_key.trim()],
      ["ip", elements.tunnelIp.value], ["dns", elements.dns.value.trim()],
      ["udp", udpEnabled ? "1" : "0"], ["cc", elements.cc.value], ["flag", elements.flag.value.trim()]
    ].map(([key,value]) => `${key}=${enc(value)}`).join("&");
    elements.result.textContent = `masque://${host}:${elements.port.value}?${params}#${enc(elements.name.value.trim() || "WARP-MASQUE")}`;
    elements.copyButton.disabled = false;
    elements.hint.textContent = "已完成轉換，可以直接複製並匯入 Shadowrocket。";
    elements.status.textContent = "準備就緒";
    elements.status.classList.add("ready");
  }

  async function load(file) {
    if (!file) return;
    elements.error.textContent = "";
    try {
      const parsed = JSON.parse(await file.text());
      const required = ["private_key","endpoint_pub_key","ipv4"];
      const missing = required.filter((key) => !parsed[key]);
      if (!parsed.endpoint_v4 && !parsed.endpoint_v6) missing.push("endpoint_v4 / endpoint_v6");
      if (missing.length) throw new Error(`缺少必要欄位：${missing.join(", ")}`);
      config = parsed;
      family = parsed.endpoint_v4 ? "v4" : "v6";
      elements.fileName.textContent = file.name;
      elements.fileReady.hidden = false;
      elements.v4Button.disabled = !parsed.endpoint_v4;
      elements.v6Button.disabled = !parsed.endpoint_v6 || !parsed.ipv6;
      refreshFamily();
    } catch (error) {
      config = null;
      elements.fileReady.hidden = true;
      elements.error.textContent = error instanceof Error ? error.message : "無法解析 JSON";
      generate();
    }
  }

  elements.chooseButton.addEventListener("click", (event) => { event.stopPropagation(); elements.fileInput.click(); });
  elements.dropZone.addEventListener("click", () => elements.fileInput.click());
  elements.dropZone.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") elements.fileInput.click(); });
  elements.fileInput.addEventListener("change", () => load(elements.fileInput.files[0]));
  elements.dropZone.addEventListener("dragover", (event) => { event.preventDefault(); elements.dropZone.classList.add("dragging"); });
  elements.dropZone.addEventListener("dragleave", () => elements.dropZone.classList.remove("dragging"));
  elements.dropZone.addEventListener("drop", (event) => { event.preventDefault(); elements.dropZone.classList.remove("dragging"); load(event.dataTransfer.files[0]); });
  elements.v4Button.addEventListener("click", () => { family="v4"; refreshFamily(); });
  elements.v6Button.addEventListener("click", () => { family="v6"; refreshFamily(); });
  elements.udp.addEventListener("click", () => { udpEnabled=!udpEnabled; elements.udp.classList.toggle("on",udpEnabled); elements.udp.setAttribute("aria-checked",String(udpEnabled)); generate(); });
  [elements.port,elements.dns,elements.cc,elements.flag,elements.name].forEach((el) => el.addEventListener("input", generate));
  elements.port.addEventListener("input", () => elements.port.value = elements.port.value.replace(/\D/g, "").slice(0,5));
  elements.copyButton.addEventListener("click", async () => { await navigator.clipboard.writeText(elements.result.textContent); const old=elements.copyButton.innerHTML; elements.copyButton.innerHTML="✓<br><strong>已複製</strong>"; setTimeout(()=>elements.copyButton.innerHTML=old,1500); });
})();
