// --- 1. DATA: Chat History ---
const chatData = {
    "user_cousin": {
        name: "Cousin", avatarColor: "#4285f4", avatarText: "Co",
        messages: [
            { type: "left", text: "Hey, are you still in Bangkok? Auntie is worried." },
            { type: "right", text: "I'm fine. Just busy making money." },
            { type: "left", text: "Making money? You borrowed rent money last month." },
            { type: "right", text: "That was before. I just bought an 80k Hermes for Luna." },
            { type: "left", text: "80k?! Where did you get that cash?" }
        ]
    },
    "user_luna": {
        name: "Luna 🌙", avatarColor: "#e91e63", avatarText: "🌙",
        messages: [
            { type: "sys", text: "Oct 01, 10:05 AM" },
            { type: "left", text: "I've been sharing so many Bangkok food spots on XHS lately, have you seen them?" },
            // 链接到首页提到的美食帖子
            { type: "left", xhsLink: true, postId: "luna_post_1", linkTitle: "Best street food in BKK! 🍜 Found a hidden gem...", author: "Luna_In_BKK" },
            { type: "left", text: "Babe! Look what I got!" },
            { type: "img", src: "https://cdn.shopify.com/s/files/1/0879/1520/0785/files/30_1024x1024.jpg?v=1726396117" },
            { type: "left", text: "Finally got the Birkin 30. You are the best! ❤️" },
            // 链接到名牌包开箱帖子
            { type: "left", xhsLink: true, postId: "luna_post_unboxing", linkTitle: "Unboxing my new Chanel! Limited Edition! ✨🥰", author: "Luna_In_BKK" },
            { type: "right", text: "Only the best for you. I have the receipt to prove it." },
            { type: "right", text: "Hold on, need to clear my desktop files." }
        ]
    },
    "user_chris": {
        name: "Chris", avatarColor: "#ff9800", avatarText: "Ch",
        messages: [
            { type: "left", text: "I need to find him." },
            { type: "right", text: "Stop asking about Ryan." }
        ]
    },
    "user_ryan": {
        name: "Ryan", avatarColor: "#607d8b", avatarText: "Ry",
        messages: [
            { type: "sys", text: "You transferred ¥100,000.00 to Ryan." },
            { type: "sys", text: "Transfer returned by Ryan." }
        ]
    }
};

// --- 2. Chat Logic ---
function renderChatList() {
    const listContainer = document.getElementById('chat-list-view');
    listContainer.innerHTML = ''; 
    for (const [id, data] of Object.entries(chatData)) {
        const lastMsg = data.messages[data.messages.length - 1];
        let preview = lastMsg.type === 'img' ? '[Image]' : lastMsg.text;
        listContainer.innerHTML += `
            <div class="contact-item" onclick="openChat('${id}')">
                <div class="avatar" style="background:${data.avatarColor}">${data.avatarText}</div>
                <div class="contact-info">
                    <div class="contact-name">${data.name}</div>
                    <div class="last-msg">${preview}</div>
                </div>
            </div>`;
    }
}

function openChat(userId) {
    const data = chatData[userId];
    const container = document.getElementById('chat-messages');
    document.getElementById('active-chat-name').innerText = data.name;
    container.innerHTML = '';

    data.messages.forEach(msg => {
        let content = '';

        // --- 1. 数据处理逻辑 ---
        if (msg.type === 'img') {
            content = `<div class="img-bubble"><img src="${msg.src}"></div>`;
        }
        // 渲染小红书卡片链接
        else if (msg.xhsLink) {
            // 关键修改：点击此卡片会打开XHS窗口并直接跳转详情页
            content = `
            <div class="chat-link-card" onclick="openWindow('win-xhs'); openXhsDetail('${msg.postId}');">
                <div class="chat-link-title">${msg.linkTitle}</div>
                <div class="chat-link-desc">
                    <span class="chat-link-icon">📕</span> Note Shared by ${msg.author}
                </div>
            </div>`;
        }
        // 渲染普通文本链接 (旧逻辑)
        else if (msg.isLink) {
            content = `<div class="bubble left">${msg.text}<span class="chat-link" onclick="openWindow('win-xhs')">See details</span></div>`;
        }
        else {
            content = msg.text;
        }

        // --- 2. 样式类处理 ---
        let typeClass = msg.type === 'sys' ? 'system-msg' : (msg.type === 'img' || msg.isLink || msg.xhsLink ? '' : `bubble ${msg.type}`);

        // --- 3. 渲染逻辑 ---
        if (msg.type === 'sys') {
            container.innerHTML += `<div class="system-msg">${content}</div>`;
        }
        // 确保卡片和图片一样，统一左对齐且不带背景气泡
        else if (msg.isLink || msg.type === 'img' || msg.xhsLink) {
            container.innerHTML += `<div style="align-self: flex-start; max-width: 75%;">${content}</div>`;
        }
        else {
            container.innerHTML += `<div class="${typeClass}">${content}</div>`;
        }
    });

    document.getElementById('chat-list-view').style.display = 'none';
    document.getElementById('chat-detail-view').style.display = 'flex';
    // 自动滚动到底部
    container.scrollTop = container.scrollHeight;
}

function showChatList() {
    document.getElementById('chat-detail-view').style.display = 'none';
    document.getElementById('chat-list-view').style.display = 'block';
}

// --- 3. Logistics Logic ---
function trackPackage() {
    const input = document.getElementById('tracking-input').value.trim().toUpperCase();
    const result = document.getElementById('track-result');
    const error = document.getElementById('track-error');
    
    if (input === 'SF-8823') {
        error.innerText = "";
        result.style.display = 'block';
    } else {
        result.style.display = 'none';
        error.innerText = "Tracking number not found.";
        const box = document.getElementById('tracking-input');
        box.style.animation = "shake 0.3s";
        setTimeout(() => box.style.animation = "", 300);
    }
}

// --- 4. Window System ---
let zIndex = 100;
function openWindow(id) {
    const win = document.getElementById(id);
    win.style.display = 'flex';
    win.style.zIndex = ++zIndex;
    if(id === 'win-chat') renderChatList();
}
function closeWindow(id) { document.getElementById(id).style.display = 'none'; }

document.querySelectorAll('.window').forEach(win => {
    win.addEventListener('mousedown', () => win.style.zIndex = ++zIndex);
    const bar = win.querySelector('.title-bar');
    bar.addEventListener('mousedown', (e) => {
        let shiftX = e.clientX - win.getBoundingClientRect().left;
        let shiftY = e.clientY - win.getBoundingClientRect().top;
        const moveAt = (pageX, pageY) => {
            win.style.left = pageX - shiftX + 'px';
            win.style.top = pageY - shiftY + 'px';
        };
        const onMouseMove = (e) => moveAt(e.pageX, e.pageY);
        document.addEventListener('mousemove', onMouseMove);
        document.onmouseup = () => document.removeEventListener('mousemove', onMouseMove);
    });
});

// --- 小红书标签切换逻辑 ---
function switchXhsTab(pageId, navElement) {
    // 隐藏所有页面
    document.querySelectorAll('.xhs-page').forEach(p => p.classList.remove('active'));
    // 取消所有导航激活状态
    document.querySelectorAll('.xhs-nav-item').forEach(n => n.classList.remove('active'));
    
    // 激活当前选中的页面和导航
    document.getElementById(pageId).classList.add('active');
    navElement.classList.add('active');
}

// --- 小红书帖子详情数据 (后续可移入 JSON) ---
const xhsPostData = {
    "luna_post_1": {
        img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=500",
        author: "Luna_In_BKK",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        text: "Bangkok street food gems! 🍜 Found a hidden gem near the night market. Everything is so authentic and spicy! \n\n#BangkokFood #TravelLog #Foodie",
        date: "10-05 Thailand",
        comments: "12 Comments"
    },

    "luna_post_unboxing": {
        img: "https://cdn.shopify.com/s/files/1/0879/1520/0785/files/30_1024x1024.jpg?v=1726396117",
        author: "Luna_In_BKK",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        text: "Unboxing my new Chanel! Limited Edition! ✨🥰 \n\nAdam surprised me with this beauty today. I'm literally crying! It's so much more beautiful in person. \n\n#Chanel #Unboxing #GiftFromBae #LuxuryLife",
        date: "10-01 Thailand",
        comments: "24 Comments"
    }
};

function openXhsDetail(postId) {
    const data = xhsPostData[postId];
    if (!data) return;

    // 填充数据
    document.getElementById('xhs-detail-img').src = data.img;
    document.getElementById('xhs-detail-author').innerText = data.author;
    document.getElementById('xhs-detail-avatar').style.background = `url('${data.avatar}') center/cover`;
    document.getElementById('xhs-detail-text').innerText = data.text;
    document.getElementById('xhs-detail-date').innerText = data.date;
    document.getElementById('xhs-comment-count').innerText = data.comments;

    // 确保小红书窗口已经在最前面
    const win = document.getElementById('win-xhs');
    win.style.display = 'flex';
    win.style.zIndex = ++zIndex;

    // 显示详情页遮罩
    document.getElementById('xhs-detail').style.display = 'flex';
}

function closeXhsDetail() {
    document.getElementById('xhs-detail').style.display = 'none';
}

// --- 浏览器数据 ---
const browserData = {
    // 预设的历史记录 (埋藏剧情线索)
    history: [
        { time: "Today 09:15", title: "Bangkok weather", url: "www.google.com/search?q=bangkok+weather" },
        { time: "Yesterday 23:40", title: "FaceMatch AI - Compare Faces", url: "www.facematch-ai.com/demo", isClue: true },
        { time: "Yesterday 23:35", title: "Ryan Maya face match", url: "www.google.com/search?q=ryan+maya+face+match" }
    ],
    // 预设的收藏夹
    bookmarks: [
        { title: "Global Express Track", icon: "📦", id: "tracking", url: "www.global-express.com/track" },
        { title: "FaceMatch AI", icon: "👤", isSearch: true, keyword: "face match" },
        { title: "BKK Wedding Planners", icon: "💍", url: "www.bkk-weddings.th" }
    ],
    // 搜索引擎关键词数据库 (可以配置多个关键词触发同一结果)
    searchDatabase: {
        "adam death": [
            { url: "www.citynews.com/local/adam-found", title: "Local Airport Worker Found Dead", snippet: "Adam (32), born in the Year of the Monkey, was found deceased in his apartment..." }
        ],
        "face match": [
            { url: "www.facematch-ai.com/demo", title: "FaceMatch AI - Compare Faces", snippet: "Upload two photos to our advanced AI engine to determine if they are the same person. Fast and secure." }
        ],
        "ryan": [
            { url: "www.xhs-archive.com/user/ryan", title: "Ryan's Archive - Error 404", snippet: "This account has been deactivated. Cached data shows last activity was 3 years ago." }
        ]
    }
};

// --- 浏览器逻辑 ---

// 导航到不同页面 (home, history, bookmarks, results)
function navBrowser(viewId) {
    document.querySelectorAll('.browser-page').forEach(page => page.classList.remove('active'));
    document.getElementById(`browser-${viewId}`).classList.add('active');
    
    const urlBar = document.getElementById('browser-url');
    if (viewId === 'home') urlBar.value = "Search Google or type a URL";
    else if (viewId === 'history') urlBar.value = "chrome://history";
    else if (viewId === 'tracking') urlBar.value = "www.global-express.com/track";
}

function trackPackageWeb() {
    const input = document.getElementById('tracking-input-web').value.trim().toUpperCase();
    const result = document.getElementById('track-result-web');
    const error = document.getElementById('track-error-web');
    
    if (input === 'SF-8823') {
        error.innerText = "";
        result.style.display = 'block';
    } else {
        result.style.display = 'none';
        error.innerText = "Tracking number not found.";
        const box = document.getElementById('tracking-input-web');
        box.style.animation = "shake 0.3s";
        setTimeout(() => box.style.animation = "", 300);
    }
}

// 渲染历史记录
function renderHistory() {
    const container = document.getElementById('history-container');
    container.innerHTML = '';
    browserData.history.forEach(item => {
        // 如果是线索，可以用稍微不同的样式或直接允许点击
        container.innerHTML += `
            <div class="history-item">
                <div class="history-time">${item.time}</div>
                <div class="history-title" onclick="document.getElementById('main-search-input').value='${item.title}'; executeSearch();">${item.title}</div>
            </div>`;
    });
}

// 渲染收藏夹
function renderBookmarks() {
    const bar = document.getElementById('bookmarks-bar');
    bar.innerHTML = '';
    browserData.bookmarks.forEach(bm => {
        let onClickAction = "";
        // 如果有预设id，直接跳转对应的浏览器内部页面
        if (bm.id) {
            onClickAction = `navBrowser('${bm.id}')`;
        } 
        // 如果是搜索类型的书签，直接触发搜索
        else if (bm.isSearch) {
            onClickAction = `document.getElementById('main-search-input').value='${bm.keyword}'; executeSearch();`;
        } 
        // 否则只改变地址栏
        else {
            onClickAction = `document.getElementById('browser-url').value='${bm.url}';`;
        }
        
        bar.innerHTML += `
            <div class="bookmark-item" onclick="${onClickAction}">
                <span class="bm-icon">${bm.icon}</span>
                <span>${bm.title}</span>
            </div>`;
    });
}

// 处理回车键搜索
function handleSearchEnter(e) {
    if (e.key === 'Enter') {
        executeSearch(e.target.id === 'result-search-input');
    }
}

// 执行搜索
function executeSearch(fromResultsPage = false) {
    const inputId = fromResultsPage ? 'result-search-input' : 'main-search-input';
    const query = document.getElementById(inputId).value.toLowerCase().trim();
    
    if (!query) return;

    // 同步两个输入框和URL栏的值
    document.getElementById('main-search-input').value = query;
    document.getElementById('result-search-input').value = query;
    document.getElementById('browser-url').value = `www.google.com/search?q=${encodeURIComponent(query)}`;

    const container = document.getElementById('search-results-list');
    container.innerHTML = '';

    // 模糊匹配关键词
    let results = [];
    for (const [key, value] of Object.entries(browserData.searchDatabase)) {
        if (query.includes(key) || key.includes(query)) {
            results = results.concat(value);
        }
    }

    if (results.length > 0) {
        document.getElementById('results-stats').innerText = `About ${results.length} results (0.12 seconds)`;
        results.forEach(res => {
            container.innerHTML += `
                <div class="result-item">
                    <div class="result-url">${res.url}</div>
                    <div class="result-title">${res.title}</div>
                    <div class="result-snippet">${res.snippet}</div>
                </div>`;
        });
    } else {
        // 未找到结果的提示
        document.getElementById('results-stats').innerText = "";
        container.innerHTML = `
            <div style="margin-top: 30px;">
                <p>Your search - <b>${query}</b> - did not match any documents.</p>
                <p style="margin-top:10px;">Suggestions:</p>
                <ul style="color:#555; font-size:14px; margin-top:5px; line-height:1.6;">
                    <li>Make sure all words are spelled correctly.</li>
                    <li>Try different keywords. (e.g., 'adam death', 'face match')</li>
                    <li>Try more general keywords.</li>
                </ul>
            </div>`;
    }

    // 新增搜索记录到历史 (简单模拟)
    browserData.history.unshift({ time: "Just now", title: `${query} - Google Search`, url: document.getElementById('browser-url').value });

    navBrowser('results');
}

// Init
setInterval(() => {
    document.getElementById('clock').innerText = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
}, 1000);
openWindow('win-chat');
renderBookmarks();