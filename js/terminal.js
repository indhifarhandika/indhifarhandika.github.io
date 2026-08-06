/* ==========================================================================
   Software Engineer Portfolio - Interactive CLI Terminal Simulation
   Developer: Indhi Farhandika Rochimansyah
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const terminalBody = document.getElementById('terminal-body');
  const termInput = document.getElementById('terminal-input');

  if (!terminalBody || !termInput) return;

  const commands = {
    help: `Available commands:
  <span class="text-gradient">bio</span>       - Brief developer biography
  <span class="text-gradient">skills</span>    - Core technical stack & expertise
  <span class="text-gradient">projects</span>  - Highlighted engineering projects
  <span class="text-gradient">certs</span>     - Official certifications
  <span class="text-gradient">contact</span>   - Get in touch & social channels
  <span class="text-gradient">whoami</span>    - Display your session info
  <span class="text-gradient">sudo hire</span> - Direct inquiry command
  <span class="text-gradient">clear</span>     - Clear terminal screen`,

    bio: `Indhi Farhandika Rochimansyah
---------------------------------------
Role: Software Engineer
Specialties: Python, PHP, Flutter, Microservices, API Design & Scalable Systems.
Passionate about code optimization, algorithm design, clean architecture, and modern mobile/web software.`,

    skills: `Technical Stack Overview:
---------------------------------------
[Languages]   : Python, JavaScript, TypeScript, PHP, SQL, Dart
[Frontend]    : React, Next.js, HTML5, CSS3, TailwindCSS
[Backend]     : Flask, Fast API, Node.js, Express, REST APIs, Laravel
[Mobile]      : Flutter, React Native
[Databases]   : PostgreSQL, MySQL, Redis, MongoDB
[DevOps/Tools]: Docker, Git, CI/CD Pipelines, Linux/Shell scripting`,

    projects: `Featured Projects:
---------------------------------------
1. Flask MVC Framework (v1.4)  - Standardized Python Web MVC Architecture
2. Cryptography Engine (v1.2)  - Data Encryption & Security Suite
3. PDF Merge Utility (v1.1)    - High-Performance PDF Processing Utility
4. Mobile Kuota & E-Commerce   - Cross-Platform Digital Commerce Application`,

    certs: `Verified Certifications:
---------------------------------------
- Python 3 Tutorial Course (SoloLearn)
- Python Algorithms & Data Structures (TestDome)
- Python 101 for Data Science (IBM Cognitive Class)
- HTML Fundamentals & JavaScript Core (SoloLearn)`,

    contact: `Contact Channels:
---------------------------------------
Email    : indhifarhandika@gmail.com
GitHub   : https://github.com/indhifarhandika
LinkedIn : https://linkedin.com/in/indhifarhandika
Telegram : https://t.me/Indhifarhandika
Twitter  : https://twitter.com/indhiodi`,

    whoami: `Guest User @ indhi-dev-terminal (Permission: Read/Execute)`,

    'sudo hire': `<span style="color: #10b981; font-weight: bold;">[ACCESS GRANTED]</span> Candidate Status: Available for hire & freelance engineering projects!
Direct contact: indhifarhandika@gmail.com or Telegram @Indhifarhandika.`
  };

  // Command History tracking
  let history = [];
  let historyIndex = -1;

  termInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const inputVal = termInput.value.trim();
      if (!inputVal) return;

      history.push(inputVal);
      historyIndex = history.length;

      // Print prompt line
      appendLine(`<div><span class="term-prompt">indhi@dev</span>:<span class="term-path">~</span>$ ${escapeHTML(inputVal)}</div>`);

      // Process Command
      const cmdKey = inputVal.toLowerCase();
      if (cmdKey === 'clear') {
        terminalBody.querySelectorAll('.term-line:not(.initial)').forEach(el => el.remove());
      } else if (commands[cmdKey]) {
        appendLine(`<div class="term-response">${commands[cmdKey]}</div>`);
      } else {
        appendLine(`<div class="term-response" style="color: #ff5f56;">Command not found: '${escapeHTML(inputVal)}'. Type <span style="color: #06b6d4;">'help'</span> for available commands.</div>`);
      }

      termInput.value = '';
      terminalBody.scrollTop = terminalBody.scrollHeight;
    } else if (e.key === 'ArrowUp') {
      if (history.length > 0 && historyIndex > 0) {
        historyIndex--;
        termInput.value = history[historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIndex < history.length - 1) {
        historyIndex++;
        termInput.value = history[historyIndex];
      } else {
        historyIndex = history.length;
        termInput.value = '';
      }
    }
  });

  // Global Chip click helper
  window.runTerminalCommand = function (cmd) {
    termInput.value = cmd;
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    termInput.dispatchEvent(event);
    termInput.focus();
  };

  function appendLine(htmlContent) {
    const line = document.createElement('div');
    line.className = 'term-line';
    line.innerHTML = htmlContent;

    // Insert before the input line
    const inputLine = document.getElementById('terminal-input-line');
    terminalBody.insertBefore(line, inputLine);
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g,
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }
});
