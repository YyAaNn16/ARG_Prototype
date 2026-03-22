// --- 全局游戏状态 (核心) ---
let gameState = {
    introWatched: false,       // 是否已经看过了开场剧情
    notesContent: "",          // 记录记事本里玩家写的字
    // 以后可以在这里随意添加剧情节点，比如：
    // unlockedHiddenFolder: false,
    // foundFaceMatch: false
};

// --- 存读档核心功能 ---
function saveGame() {
    localStorage.setItem('maya_save_data', JSON.stringify(gameState));
    console.log("Game Saved!", gameState);
}

function loadGame() {
    const savedData = localStorage.getItem('maya_save_data');
    if (savedData) {
        // 如果有存档，则覆盖默认的 gameState
        gameState = JSON.parse(savedData);
        return true;
    }
    return false; // 没有存档
}

// 调试用：清除存档功能 (开发时必备)
function clearSave() {
    localStorage.removeItem('maya_save_data');
    location.reload(); // 刷新页面
}

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
            { type: "left", xhsLink: true, postId: "luna_post_1", linkTitle: "Best street food in BKK! 🍜 Found a hidden gem...", author: "Luna_99" },
            { type: "left", text: "Babe! Look what I got!" },
            { type: "img", src: "https://cdn.shopify.com/s/files/1/0879/1520/0785/files/30_1024x1024.jpg?v=1726396117" },
            { type: "left", text: "Finally got the Birkin 30. You are the best! ❤️" },
            // 链接到名牌包开箱帖子
            { type: "left", xhsLink: true, postId: "luna_post_unboxing", linkTitle: "Unboxing my new Chanel! Limited Edition! ✨🥰", author: "Luna_99" },
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

function renderChatList() {
    const listContainer = document.getElementById('chat-list-view');
    listContainer.innerHTML = ''; 
    for (const [id, data] of Object.entries(chatData)) {
        const lastMsg = data.messages[data.messages.length - 1];
        let preview = lastMsg.type === 'img' ? '[Image]' : lastMsg.text;
        listContainer.innerHTML += `
            <div class="contact-item" id="contact-${id}" onclick="openChat('${id}')">
                <div class="avatar" style="background:${data.avatarColor}">${data.avatarText}</div>
                <div class="contact-info">
                    <div class="contact-name">${data.name}</div>
                    <div class="last-msg">${preview || 'Link Shared'}</div>
                </div>
            </div>`;
    }
}

function openChat(userId) {
    const data = chatData[userId];
    const container = document.getElementById('chat-messages');
    document.getElementById('active-chat-name').innerText = data.name;
    container.innerHTML = '';

    // 处理左侧列表的绿色选中状态
    document.querySelectorAll('.contact-item').forEach(item => item.classList.remove('active'));
    document.getElementById(`contact-${userId}`).classList.add('active');

    // 定义 Adam (玩家) 的默认黑灰头像
    const adamAvatarHTML = `<div class="msg-avatar" style="background:#333;">Ad</div>`;
    // 当前聊天对象的头像
    const contactAvatarHTML = `<div class="msg-avatar" style="background:${data.avatarColor}">${data.avatarText}</div>`;

    data.messages.forEach(msg => {
        if (msg.type === 'sys') {
            container.innerHTML += `<div class="system-msg">${msg.text}</div>`;
            return;
        }

        let innerContent = '';
        if (msg.type === 'img') {
            innerContent = `<div class="img-bubble"><img src="${msg.src}" style="max-width:180px; border-radius:6px;"></div>`;
        } else if (msg.xhsLink) {
            innerContent = `
            <div class="chat-link-card" onclick="openWindow('win-xhs'); openXhsDetail('${msg.postId}');">
                <div class="chat-link-title">${msg.linkTitle}</div>
                <div class="chat-link-desc"><span class="chat-link-icon">📕</span> Note Shared by ${msg.author}</div>
            </div>`;
        } else if (msg.isLink) {
            innerContent = `<div class="bubble ${msg.type}">${msg.text}<span class="chat-link" onclick="openWindow('win-xhs')">See details</span></div>`;
        } else {
            innerContent = `<div class="bubble ${msg.type}">${msg.text}</div>`;
        }

        // 组装带头像的一整行
        const isLeft = msg.type === 'left';
        const rowAvatar = isLeft ? contactAvatarHTML : adamAvatarHTML;
        
        container.innerHTML += `
            <div class="msg-row ${isLeft ? 'left' : 'right'}">
                ${isLeft ? rowAvatar : ''}
                <div class="msg-content">${innerContent}</div>
                ${!isLeft ? rowAvatar : ''}
            </div>
        `;
    });

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
    
    // 1. 判断是否需要“再次点击关闭”
    if (win.style.display === 'flex') {
        if (parseInt(win.style.zIndex) === zIndex) {
            win.style.display = 'none';
            return;
        }
    }

    // 2. 显示窗口并置顶
    win.style.display = 'flex';
    win.style.zIndex = ++zIndex;

    // 特定窗口逻辑
    if (id === 'win-chat') renderChatList();
}

function closeWindow(id) {
    document.getElementById(id).style.display = 'none';
}

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
        author: "Luna_99", avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        text: "Bangkok street food gems! 🍜 Found a hidden gem near the night market. Everything is so authentic and spicy! \n\n#BangkokFood #TravelLog #Foodie",
        date: "10-05 Thailand", comments: "2 Comments",
        commentsList: [
            { user: "Travel_Master", avatar: "https://randomuser.me/api/portraits/men/22.jpg", text: "Looks amazing! Where is this?", time: "10-05" },
            { user: "Chris", avatar: "https://randomuser.me/api/portraits/men/45.jpg", text: "Check your private messages.", time: "10-06" } // 关键线索
        ]
    },
    "luna_post_unboxing": {
        img: "https://cdn.shopify.com/s/files/1/0879/1520/0785/files/30_1024x1024.jpg?v=1726396117",
        author: "Luna_99", avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        text: "Unboxing my new Chanel! Limited Edition! ✨🥰 \n\nAdam surprised me with this beauty today. I'm literally crying! It's so much more beautiful in person. \n\n#Chanel #Unboxing #GiftFromBae #LuxuryLife",
        date: "10-01 Thailand", comments: "2 Comments",
        commentsList: [
            { user: "FashionGuru", avatar: "https://randomuser.me/api/portraits/women/12.jpg", text: "Omg so jealous! 😍", time: "10-01" },
            { user: "Adam.TheOne", avatar: "https://randomuser.me/api/portraits/men/32.jpg", text: "Only the best for my queen. ❤️", time: "10-01" }
        ]
    },
    "mock_post_1": {
        img: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=500",
        author: "CoffeeLover", avatar: "https://randomuser.me/api/portraits/women/12.jpg",
        text: "Quiet afternoon with a good cup of coffee ☕️",
        date: "10-12 Local", comments: "1 Comments",
        commentsList: [{ user: "DailyVibes", avatar: "https://randomuser.me/api/portraits/women/18.jpg", text: "Love this vibe!", time: "10-12" }]
    },

    "mock_post_2": {
        img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=500",
        author: "Wanderlust_Dreamer",
        avatar: "https://randomuser.me/api/portraits/men/22.jpg",
        text: "There is nothing quite like the sound of waves to calm the mind. Planning my next island escape already! Where should I go next? 🌴🌊\n\n#TravelGram #BeachLife #Wanderlust",
        date: "10-15 Remote",
        commentsList: []
    },

    "mock_post_3": {
        img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=500",
        author: "StyleByMe",
        avatar: "https://randomuser.me/api/portraits/women/33.jpg",
        text: "Keeping it monochrome today. You can never go wrong with a classic black blazer and vintage jeans. 🖤👖\n\n#OOTD #FashionDiary #StreetStyle",
        date: "10-18 Local",
        commentsList: []
    },

    "mock_post_4": {
        img: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=500",
        author: "Art_Enthusiast",
        avatar: "https://randomuser.me/api/portraits/men/44.jpg",
        text: "Finally got to see the new contemporary art exhibit. The use of light and shadows in these installations is just mind-blowing. ✨🎨\n\n#ArtGallery #Exhibition #Inspiration",
        date: "10-20 Local",
        commentsList: []
    },

    "mock_post_5": {
        img: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=500",
        author: "CatMom_Daily",
        avatar: "https://randomuser.me/api/portraits/women/55.jpg",
        text: "It’s raining outside, but it’s cozy in here. Look at this little fluffball sleeping on my laptop. Guess I'm not working today! 😂🐱💤\n\n#CatLife #PetLover #Cozy",
        date: "10-21 Local",
        commentsList: []
    }
};

// --- 小红书私信对话数据 ---
const xhsDMs = {
    "ryan": {
        name: "Deactivated Account", avatar: "", // 空白代表默认灰色
        messages: [
            { type: "sys", text: "3 years ago" },
            { type: "right", text: "Please, just let me explain. I didn't mean for this to happen." },
            { type: "right", text: "I'm so sorry. Answer me." },
            { type: "left", text: "Don't ever contact me again. I will never forgive you." }
        ]
    },
    "luna": {
        name: "Luna_99", avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        messages: [
            { type: "sys", text: "Today" },
            { type: "left", text: "Did you see my new post? 🥰" },
            { type: "right", text: "Yes babe, looks amazing." }
        ]
    }
};

function openXhsDetail(postId) {
    const data = xhsPostData[postId];
    if (!data) return;

    document.getElementById('xhs-detail-img').src = data.img;
    document.getElementById('xhs-detail-author').innerText = data.author;
    document.getElementById('xhs-detail-avatar').style.background = `url('${data.avatar}') center/cover`;
    document.getElementById('xhs-detail-text').innerText = data.text;
    document.getElementById('xhs-detail-date').innerText = data.date;
    document.getElementById('xhs-comment-count').innerText = data.comments;

    // 动态渲染评论列表
    const commentsContainer = document.getElementById('xhs-comments-list');
    commentsContainer.innerHTML = '';
    if (data.commentsList && data.commentsList.length > 0) {
        data.commentsList.forEach(c => {
            commentsContainer.innerHTML += `
                <div class="xhs-comment-item">
                    <div class="xhs-msg-avatar" style="width:28px; height:28px; margin-right:0; background:url('${c.avatar}') center/cover;"></div>
                    <div class="xhs-comment-right">
                        <div class="xhs-comment-user">${c.user}</div>
                        <div class="xhs-comment-text">${c.text}</div>
                        <div class="xhs-comment-meta"><span>${c.time}</span></div>
                    </div>
                </div>`;
        });
    } else {
        commentsContainer.innerHTML = '<div style="color:#999; font-size:12px; text-align:center;">No comments yet.</div>';
    }

    const win = document.getElementById('win-xhs');
    win.style.display = 'flex';
    win.style.zIndex = ++zIndex;
    document.getElementById('xhs-detail').style.display = 'flex';
}


function closeXhsDetail() {
    document.getElementById('xhs-detail').style.display = 'none';
}

// 渲染私信对话 (蓝白气泡 + 圆头像)
function openXhsDm(userId) {
    const data = xhsDMs[userId];
    if (!data) return;

    document.getElementById('xhs-dm-name').innerText = data.name;
    const container = document.getElementById('xhs-dm-messages');
    container.innerHTML = '';

    // Adam 的小红书头像
    const adamXhsAvatar = `background-image: url('https://randomuser.me/api/portraits/men/32.jpg')`;
    const targetXhsAvatar = data.avatar ? `background-image: url('${data.avatar}')` : `background-color: #ccc;`;

    data.messages.forEach(msg => {
        if(msg.type === 'sys') {
            container.innerHTML += `<div class="system-msg">${msg.text}</div>`;
            return;
        }

        const isLeft = msg.type === 'left';
        const avatarStyle = isLeft ? targetXhsAvatar : adamXhsAvatar;
        const avatarHTML = `<div class="xhs-dm-avatar" style="${avatarStyle}"></div>`;
        
        container.innerHTML += `
            <div class="xhs-dm-row ${isLeft ? 'left' : 'right'}">
                ${isLeft ? avatarHTML : ''}
                <div class="xhs-dm-content">
                    <div class="xhs-bubble ${msg.type}">${msg.text}</div>
                </div>
                ${!isLeft ? avatarHTML : ''}
            </div>
        `;
    });

    document.getElementById('xhs-dm-view').style.display = 'flex';
    container.scrollTop = container.scrollHeight;
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
        "year of the monkey": [
            {
                // 直接在数据里插入卡片的 HTML
                customHTML: `
                <div class="featured-snippet-card" style="margin-bottom: 25px;">
                    <div class="snippet-text-area">
                        <h2 class="snippet-title">The Year of the Monkey is an important year in the Chinese zodiac...</h2>
                        <p class="snippet-desc">It symbolizes cleverness, flexibility, and humor, often associated with intelligence and innovation.</p>
                        <h3 class="snippet-subtitle">Recent Years of the Monkey:</h3>
                        <ul class="snippet-years">
                            <li>1968</li>
                            <li>1980</li>
                            <li>1992</li>
                            <li>2004</li>
                            <li>2016</li>
                            <li>2028</li>
                        </ul>
                    </div>
                    <div class="snippet-image-area">
                        [ Image Placeholder: <br> Red Paper-cut Monkey Calendar ]
                    </div>
                </div>`
            },
            { 
                url: "www.chinahighlights.com/travelguide/chinese-zodiac/monkey.htm", 
                title: "Year of the Monkey: 2028, 2016, 2004, 1992...", 
                snippet: "The Monkey is the ninth of the 12 Chinese zodiac animals. Learn about Monkey personality traits, lucky things, and love compatibility.",
                clickAction: ""
            }
        ],
        "adam": [
{ 
                url: "www.bkk-daily.com/news/tourist-incident", 
                title: "Tragic Incident: Foreign Guest Found Dead at Wedding Venue", 
                snippet: "Local authorities are investigating the sudden death of 32-year-old Adam at a wedding venue. Preliminary reports suggest a suspected overdose... traveled with his girlfriend, Luna...",
                clickAction: "navBrowser('news-adam')"
            },
            { 
                url: "www.linkedin.com/in/adam-operations", 
                title: "Adam - Airport Operations Supervisor - LinkedIn", 
                snippet: "Experienced Operations Supervisor with a demonstrated history of working in the aviation and airport industry. Skilled in logistics and passenger safety.",
                clickAction: ""
            },
            { 
                url: "www.facebook.com/public/Adam", 
                title: "Adam Profiles | Facebook", 
                snippet: "View the profiles of people named Adam. Join Facebook to connect with Adam and others you may know.",
                clickAction: ""
            },
            { 
                url: "www.global-obituaries.com/adam-memorial", 
                title: "In Loving Memory of Adam - Online Memorials", 
                snippet: "Share your condolences, send flowers, and light a candle in memory of Adam. Gone too soon.",
                clickAction: ""
            }
        ],
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
    else if (viewId === 'news-adam') urlBar.value = "www.bkk-daily.com/news/tourist-fall-incident";
    else if (viewId === 'zodiac-monkey') urlBar.value = "www.google.com/search?q=Year+of+the+Monkey";
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
    let inputId = fromResultsPage ? 'result-search-input' : 'main-search-input';
    const query = document.getElementById(inputId).value.toLowerCase().trim();
    if (!query) return;

    // 同步输入框和地址栏
    document.getElementById('main-search-input').value = query;
    document.getElementById('result-search-input').value = query;
    document.getElementById('browser-url').value = `www.google.com/search?q=${encodeURIComponent(query)}`;

    // 记录历史
    browserData.history.unshift({ time: "Just now", title: `${query} - Google Search`, url: document.getElementById('browser-url').value });

    const container = document.getElementById('search-results-list');
    container.innerHTML = '';
    let results = [];
    
    // 关键词匹配
    for (const [key, value] of Object.entries(browserData.searchDatabase)) {
        if (query.includes(key) || key.includes(query)) {
            results = results.concat(value);
        }
    }

    if (results.length > 0) {
        document.getElementById('results-stats').innerText = `About ${results.length} results (0.12 seconds)`;
        results.forEach(res => {
            // 如果数据包含 customHTML，直接渲染卡片
            if (res.customHTML) {
                container.innerHTML += res.customHTML;
            } else {
                // 普通结果渲染
                let clickAttr = res.clickAction ? `onclick="${res.clickAction}"` : `onclick="document.getElementById('browser-url').value='${res.url}'"`;
                container.innerHTML += `
                    <div class="result-item">
                        <div class="result-url">${res.url}</div>
                        <div class="result-title" ${clickAttr} style="cursor:pointer; color:#1a0dab;">${res.title}</div>
                        <div class="result-snippet">${res.snippet}</div>
                    </div>`;
            }
        });
    } else {
        document.getElementById('results-stats').innerText = "";
        container.innerHTML = `
            <div style="margin-top: 30px;">
                <p>Your search - <b>${query}</b> - did not match any documents.</p>
                <p style="margin-top:10px;">Suggestions:</p>
                <ul style="color:#555; font-size:14px; margin-top:5px; line-height:1.6;">
                    <li>Make sure all words are spelled correctly.</li>
                    <li>Try different keywords. (e.g., 'adam death', 'year of the monkey')</li>
                    <li>Try more general keywords.</li>
                </ul>
            </div>`;
    }

    // 统一跳转到搜索结果列表页
    navBrowser('results');
}

// --- 开场逻辑 ---
function startGame() {
    const introScreen = document.getElementById('intro-screen');
    introScreen.style.opacity = '0';
    introScreen.style.visibility = 'hidden';
    
    // 记录玩家已经看过了开场，并存档
    gameState.introWatched = true;
    saveGame();
}


// 监听记事本的输入并存档
document.querySelector('.notes-textarea').addEventListener('input', function(e) {
    gameState.notesContent = e.target.value;
    saveGame();
});

// --- 游戏初始化与恢复状态 ---
function initGame() {
    const hasSave = loadGame(); // 尝试读取存档

    if (hasSave) {
        // --- 恢复读档状态 ---
        if (gameState.introWatched) {
            const introScreen = document.getElementById('intro-screen');
            if (introScreen) introScreen.style.display = 'none'; 
        }
        
        const notesArea = document.querySelector('.notes-textarea');
        if (notesArea) notesArea.value = gameState.notesContent || "";
        
        // 刷新后不再自动打开窗口，让玩家自己点开，避免UI渲染Bug
        
    } else {
        // --- 全新游戏 (无存档) ---
        const introScreen = document.getElementById('intro-screen');
        if (introScreen) introScreen.style.display = 'flex';
    }

    // 初始化其他组件
    renderBookmarks(); 
    setInterval(() => {
        document.getElementById('clock').innerText = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
    }, 1000);
}

// 页面加载完毕后执行初始化
initGame();