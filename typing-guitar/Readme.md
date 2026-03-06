# Typing Guitar Keyboard 🎸

Play a guitar sound every time you press a key on your keyboard.

This guide explains how to build a **global keyboard sound app** using **Node.js** that works on:

- 🍎 macOS
- 🪟 Windows

The app listens for keyboard input globally and plays a sound when keys are pressed.

---

# 📦 Tech Stack

- **Node.js**
- **uiohook-napi** – global keyboard listener
- **afplay (macOS)** – play audio
- **PowerShell / Windows Media Player (Windows)** – play audio

---

# 📁 Project Structure

```
typing-guitar
│
├── index.js
├── C.mp3
├── D.mp3
├── E.mp3
├── F.mp3
├── package.json
└── node_modules
```

---

# 1️⃣ Create Project

Open Terminal / Command Prompt.

```bash
mkdir typing-guitar
cd typing-guitar
npm init -y
```

---

# 2️⃣ Install Keyboard Listener

Install **uiohook-napi**.

```bash
npm install uiohook-napi
```

This library listens to **global keyboard events**.

---

# 3️⃣ Add Sound Files

Download some short guitar sounds:

Example:

```
C.mp3
D.mp3
E.mp3
F.mp3
```

Place them inside the project folder.

Example structure:

```
typing-guitar
 ├── index.js
 ├── C.mp3
 ├── D.mp3
 ├── E.mp3
 └── F.mp3
```

---

# 4️⃣ Create Script

Create the file:

```
index.js
```

Add the following code:

```javascript
const { uIOhook, UiohookKey } = require("uiohook-napi");
const { exec } = require("child_process");
const path = require("path");

function play(file) {
  const sound = path.join(__dirname, file);

  if (process.platform === "darwin") {
    exec(`afplay "${sound}"`);
  } else if (process.platform === "win32") {
    exec(`powershell -c (New-Object Media.SoundPlayer '${sound}').PlaySync();`);
  }
}

uIOhook.on("keydown", (event) => {
  if (event.keycode === UiohookKey.A) play("C.mp3");
  if (event.keycode === UiohookKey.S) play("D.mp3");
  if (event.keycode === UiohookKey.D) play("E.mp3");
  if (event.keycode === UiohookKey.F) play("F.mp3");
});

uIOhook.start();

console.log("🎸 Typing guitar started...");
```

---

# 5️⃣ Run the App

Run:

```bash
node index.js
```

Now press:

```
A → guitar sound
S → guitar sound
D → guitar sound
F → guitar sound
```

Works in **any application**.

---

# 🍎 macOS Setup

## Enable Accessibility Permission

macOS blocks keyboard listeners by default.

Go to:

```
System Settings
→ Privacy & Security
→ Accessibility
```

Enable:

```
Terminal
or
Node
```

---

# 🍎 Auto Start on Login (macOS)

To run the script automatically when you log in.

### Create LaunchAgent Folder

```bash
mkdir -p ~/Library/LaunchAgents
```

---

### Create Startup File

```bash
nano ~/Library/LaunchAgents/com.typingguitar.plist
```

Paste:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
"http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>

<key>Label</key>
<string>com.typingguitar</string>

<key>ProgramArguments</key>
<array>
<string>/opt/homebrew/bin/node</string>
<string>/Users/YOUR_USERNAME/typing-guitar/index.js</string>
</array>

<key>RunAtLoad</key>
<true/>

<key>KeepAlive</key>
<true/>

</dict>
</plist>
```

Replace:

```
YOUR_USERNAME
```

Example:

```
/Users/apple/typing-guitar/index.js
```

---

### Load the Service

```bash
launchctl load ~/Library/LaunchAgents/com.typingguitar.plist
```

### Unload (stop) the Service

```bash
launchctl unload ~/Library/LaunchAgents/com.typingguitar.plist
```

Now it will start **automatically when you log in**.

---

# 🪟 Windows Setup

Windows requires a different method for auto start.

---

## Create Start Script

Create:

```
start-guitar.bat
```

Add:

```bat
cd C:\typing-guitar
node index.js
```

---

## Add to Startup Folder

Press:

```
Win + R
```

Type:

```
shell:startup
```

Copy:

```
start-guitar.bat
```

into this folder.

Now the script runs **every time Windows starts**.

---

# 🧪 Test

Restart your computer.

Then press keys:

```
A
S
D
F
```

You should hear **guitar sounds**.

---

# 🛠 Troubleshooting

## Problem: No sound

Check audio command:

Mac:

```
afplay C.mp3
```

Windows:

```
powershell -c (New-Object Media.SoundPlayer 'C.mp3').PlaySync();
```

---

## Problem: Keyboard events not detected (Mac)

Enable:

```
System Settings
→ Privacy & Security
→ Accessibility
```

Allow:

```
Terminal
Node
```

---

## Problem: Script not running on login

Check:

```
launchctl list | grep typingguitar
```

If not running:

```
launchctl load ~/Library/LaunchAgents/com.typingguitar.plist
```

---

# 🚀 Possible Upgrades

You can extend this project:

### 🎸 Full Keyboard Guitar

Map all keys:

```
Q W E R T Y
A S D F G H
Z X C V B
```

---

### 🎵 Multiple Sounds

- mechanical keyboard
- piano
- drum kit
- electric guitar

---

### 🖥 Build Desktop App

Using:

```
Electron
Node.js
WebAudio API
```

You can create a full **keyboard sound application like Mechvibes**.

---

# 📚 Summary

This project demonstrates:

- global keyboard listening
- audio playback
- Node system scripting
- OS startup automation

Works on:

```
macOS
Windows
```
