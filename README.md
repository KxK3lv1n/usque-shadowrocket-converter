[Converter網頁入口](https://kxk3lv1n.github.io/usque-shadowrocket-clashmi-converter)

# Usque JSON → Shadowrocket / Clash Mi MASQUE Converter
這是一個純前端的轉換工具，可將 [Diniboy1123/usque](https://github.com/Diniboy1123/usque) 產生的 `config.json` 轉換成 Shadowrocket 可匯入的 `masque://` URL 或可供Clash Mi (Mihomo)匯入的.yaml檔案。

### 1. 下載 usque Windows 版本
前往 [usque Releases](https://github.com/Diniboy1123/usque/releases/latest) 下載usque_X.X.X_windows_386.zip
解壓縮到一個獨立資料夾，例如：
```text
C:\usque
```
解壓後應能在資料夾中找到 `usque.exe`。


### 2. 開啟 PowerShell
在 `C:\usque` 資料夾空白處按住 `Shift` 並按滑鼠右鍵，選擇「在此處開啟 PowerShell 視窗」，或者手動執行：
```powershell
cd C:\usque
```
確認程式可以執行：
```powershell
.\usque.exe version
```

### 3. 註冊 WARP 並產生 JSON
執行官方的 `register` 指令：
```powershell
.\usque.exe register
```
```
成功時通常會看到 `Successful registration`，並在目前資料夾產生：
config.json
```
如果遇到註冊頻率限制，請稍後再試，不要短時間連續重複註冊。


### 4. 轉換成 Shadowrocket MASQUE URL
1. 將 usque 產生的 `config.json` 拖進[Converter網頁](https://kxk3lv1n.github.io/usque-shadowrocket-clahmi-converter)，或按「點擊選擇檔案」。
2. 確認 Endpoint、內部 IP、Port、DNS 等設定。
3. 按「複製 URL」。
4. 將 `masque://...` URL 貼到 Shadowrocket 匯入 或 將下載到的.yaml直接匯入Clash Mi (Mihomo)。
