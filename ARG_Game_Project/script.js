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

// --- 小红书用户数据库 ---
const xhsUsers = {
    "luna": {
        name: "Luna_99", id: "994021",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        bio: "Exploring the world one spicy dish at a time 🌶️",
        stats: { posts: 12, followers: "1.2k", following: 892 },
        posts: ["luna_post_1", "luna_post_unboxing"] // 绑定她的帖子
    },
    "ryan": {
        name: "Deactivated Account", id: "Account Disabled",
        avatar: "", // 留空则显示灰色
        bio: "This account has been deactivated by the user.",
        stats: { posts: 4, followers: 128, following: 150 }, // 更新帖子数量为 3
        posts: ["ryan_post_eng1", "ryan_post_video_clue", "ryan_post_eng2", "ryan_post_1"] // 绑定新设计的工科帖子和视频线索
    }
};

// --- 小红书帖子详情数据 (后续可移入 JSON) ---
const xhsPostData = {
    "luna_post_1": {
        img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=500",
        author: "Luna_99", avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        text: "Bangkok street food gems! 🍜 Found a hidden gem near the night market. Everything is so authentic and spicy! \n\n#BangkokFood #TravelLog #Foodie",
        date: "10-05 Thailand", comments: "2 Comments",
        commentsList: [
            { user: "Travel_Master", avatar: "https://randomuser.me/api/portraits/men/22.jpg", text: "Looks amazing! Where is this?", time: "10-05" },
            { user: "Chris", avatar: "https://randomuser.me/api/portraits/men/45.jpg", text: "Check your private messages.", time: "10-06" }
        ]
    },
    "luna_post_unboxing": {
        img: "https://cdn.shopify.com/s/files/1/0879/1520/0785/files/30_1024x1024.jpg?v=1726396117",
        author: "Luna_99", avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        text: "Unboxing my new Chanel! Limited Edition! ✨🥰 \n\nAdam surprised me with this beauty today. I'm literally crying! It's so much more beautiful in person. \n\n#Chanel #Unboxing #GiftFromBae #LuxuryLife",
        date: "10-01 Thailand", comments: "2 Comments",
        commentsList: [
            { user: "FashionGuru", avatar: "https://randomuser.me/api/portraits/women/12.jpg", text: "Omg so jealous! 😍", time: "10-01" },
            { user: "Adam", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150", text: "Only the best for you. ❤️", time: "10-01" }
        ]
    },

    // === Ryan 的旧账帖子 (核心剧情线索) ===
    "ryan_post_1": {
        img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=500", // 耳机图
        author: "Deactivated Account", avatar: "",
        text: "Thanks to my awesome roommate Adam for the early birthday gift! These headphones are sick. He even helped me fix my laptop today. 🙏🎧 \n\n#BestRoommate #CollegeLife",
        date: "2015-09-12", comments: "1 Comments",
        commentsList: [{ user: "Adam", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150", text: "Happy early birthday bro! Enjoy.", time: "2015-09-12" }]
    },
    "ryan_post_2": {
        img: "https://images.unsplash.com/photo-1470229722913-7c090be5f524?q=80&w=500", // 演唱会图
        author: "Deactivated Account", avatar: "",
        text: "Finally got the tickets for Jay Chou's concert!! Been waiting for this for years. So hyped! 🎶🎤 \n\n#JayChou #Concert #Music",
        date: "2015-10-05", comments: "0 Comments", commentsList: []
    },
    "ryan_post_3": {
        img: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?q=80&w=500", // 桌面图 (用CSS加上了药瓶提示)
        customImgOverlay: "<div style='position:absolute; top:10px; right:10px; background:rgba(217,48,37,0.9); color:white; padding:4px 8px; font-size:10px; border-radius:4px; font-weight:bold;'>[Clue: A small white pill bottle is visible on the desk corner]</div>",
        author: "Deactivated Account", avatar: "",
        text: "Been feeling so tired and dizzy lately... sleeping 12 hours a day and still waking up exhausted. My brain is all foggy. Finals week is getting to me. 😵‍💫📚 Need more coffee.",
        date: "2015-11-20", comments: "2 Comments",
        commentsList: [
            { user: "Chris", avatar: "https://randomuser.me/api/portraits/men/45.jpg", text: "You should go see a doctor man, that doesn't sound normal.", time: "2015-11-21" },
            { user: "Adam", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150", text: "Take it easy, I'll bring you some hot soup later.", time: "2015-11-21" }
        ]
    },
    "ryan_post_4": {
        img: "https://images.unsplash.com/photo-1550534731-2e673f4e2f4a?q=80&w=500", // 随便一张电脑打码图
        author: "Deactivated Account", avatar: "",
        text: "Late night coding sessions... 💻☕️",
        date: "2015-12-02", comments: "0 Comments", commentsList: []
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
    },
    "ryan_post_eng1": {
        img: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=500", // 实验室/电路板图片
        author: "Deactivated Account", avatar: "",
        text: "AutoCAD just crashed, and I didn't save. Three hours of gear reducer modeling just vanished into thin air. I need a moment. ⚙️📐 \n\n#MechanicalEngineering #FinalsWeek #EngineeringStruggles",
        date: "2015-11-10", comments: "1 Comments",
        commentsList: [
            { user: "Adam", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150", text: "Bro, always remember to Ctrl+S. Let's go, I'll buy you a drink.", time: "2015-11-10" }
        ]
    },
    "ryan_post_video_clue": {
        isVideo: true, // 标记这是一个视频帖子
        videoSrc: "assets/ryan_desk_pan.mp4", // 这里填入你实际的视频文件路径
        img: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?q=80&w=500", // 视频加载失败或在首页列表显示的封面图
        author: "Deactivated Account", avatar: "",
        text: "Been feeling so dizzy lately, my brain feels like mush. Sleeping 12 hours a day and still feeling exhausted. Finals week is killing me. 😵‍💫📚 Need more coffee. \n\n#StudyGrind #AllNighter",
        date: "2015-11-20", comments: "2 Comments",
        commentsList: [
            { user: "Chris", avatar: "https://randomuser.me/api/portraits/men/45.jpg", text: "You should go see a doctor man, that doesn't sound normal.", time: "2015-11-21" },
            { user: "Adam", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150", text: "Take it easy, I'll bring you some hot soup later.", time: "2015-11-21" }
        ]
    },
    "ryan_post_eng2": {
        img: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?q=80&w=500", // 熬夜写代码/复习图片
        author: "Deactivated Account", avatar: "",
        text: "Who even invented 'Microcomputer Principles and Interface Technology'? Going blind staring at assembly language. 💻🔌 \n\n#EngineeringStudent #EE",
        date: "2015-12-02", comments: "0 Comments", commentsList: []
    },
};

function renderXhsHomeFeed() {
    const feedContainer = document.querySelector('#xhs-home .xhs-feed');
    feedContainer.innerHTML = ''; // 清空原本写死的HTML结构

    // 定义你想在首页展示的帖子 ID 数组（可以随意调整顺序或增减）
    const homePosts = [
        'luna_post_1', 
        'luna_post_unboxing', 
        'mock_post_1', 
        'mock_post_2', 
        'mock_post_3', 
        'mock_post_4', 
        'mock_post_5'
    ];

    homePosts.forEach(postId => {
        const post = xhsPostData[postId];
        if (post) {
            feedContainer.innerHTML += `
                <div class="xhs-post" onclick="openXhsDetail('${postId}')">
                    <img src="${post.img}" alt="post">
                    <div class="xhs-post-title">${post.text.substring(0, 35)}...</div>
                </div>
            `;
        }
    });
}

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

    // 获取图片和视频的 DOM 元素
    const imgEl = document.getElementById('xhs-detail-img');
    const vidEl = document.getElementById('xhs-detail-video');

    // === 核心逻辑：判断并切换媒体类型 ===
    if (data.isVideo) {
        imgEl.style.display = 'none';
        vidEl.style.display = 'block';
        vidEl.src = data.videoSrc; // 加载视频源
    } else {
        vidEl.style.display = 'none';
        vidEl.pause(); // 如果之前在放视频，切换到图片时将其暂停
        imgEl.style.display = 'block';
        imgEl.src = data.img; // 加载图片源
    }

    document.getElementById('xhs-detail-img').src = data.img;
    document.getElementById('xhs-detail-author').innerText = data.author;
    document.getElementById('xhs-detail-avatar').style.background = data.avatar ? `url('${data.avatar}') center/cover` : '#ccc';
    document.getElementById('xhs-detail-text').innerText = data.text;
    document.getElementById('xhs-detail-date').innerText = data.date;
    document.getElementById('xhs-comment-count').innerText = data.comments;

    const commentsContainer = document.getElementById('xhs-comments-list');
    commentsContainer.innerHTML = '';
    if (data.commentsList && data.commentsList.length > 0) {
        data.commentsList.forEach(c => {
            const cAvatar = c.avatar ? `url('${c.avatar}') center/cover` : '#ccc';
            commentsContainer.innerHTML += `
                <div class="xhs-comment-item">
                    <div class="xhs-msg-avatar" style="width:28px; height:28px; margin-right:0; background:${cAvatar};"></div>
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

    // 点击顶部的对方名字也可以进入主页
    document.getElementById('xhs-dm-name').innerHTML = `<span style="cursor:pointer;" onclick="openXhsUser('${userId}')">${data.name}</span>`;
    
    const container = document.getElementById('xhs-dm-messages');
    container.innerHTML = '';

    const adamXhsAvatar = `background-image: url('https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150')`;
    const targetXhsAvatar = data.avatar ? `background-image: url('${data.avatar}')` : `background-color: #ccc;`;

    data.messages.forEach(msg => {
        if(msg.type === 'sys') {
            container.innerHTML += `<div class="system-msg">${msg.text}</div>`;
            return;
        }

        const isLeft = msg.type === 'left';
        const avatarStyle = isLeft ? targetXhsAvatar : adamXhsAvatar;
        
        // 关键：给左侧对方的头像加上 onclick 事件，点击跳转主页
        const clickAction = isLeft ? `onclick="openXhsUser('${userId}')" style="${avatarStyle}; cursor:pointer;"` : `style="${avatarStyle}"`;
        const avatarHTML = `<div class="xhs-dm-avatar" ${clickAction}></div>`;
        
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

// 新增：渲染并打开他人主页
function openXhsUser(userId) {
    const user = xhsUsers[userId];
    if (!user) return;

    document.getElementById('xhs-up-name').innerText = user.name;
    document.getElementById('xhs-up-id').innerText = `ID: ${user.id}`;
    document.getElementById('xhs-up-avatar').style.background = user.avatar ? `url('${user.avatar}') center/cover` : '#ccc';
    document.getElementById('xhs-up-posts').innerText = user.stats.posts;
    document.getElementById('xhs-up-followers').innerText = user.stats.followers;
    document.getElementById('xhs-up-following').innerText = user.stats.following;
    document.getElementById('xhs-up-bio').innerHTML = user.bio;

    // 渲染该用户的帖子
    const feedContainer = document.getElementById('xhs-up-feed');
    feedContainer.innerHTML = '';
    user.posts.forEach(postId => {
        const post = xhsPostData[postId];
        if (post) {
            feedContainer.innerHTML += `
                <div class="xhs-post" onclick="openXhsDetail('${postId}')">
                    <img src="${post.img}" alt="post">
                    <div class="xhs-post-title">${post.text.substring(0, 30)}...</div>
                </div>`;
        }
    });

    document.getElementById('xhs-external-user').style.display = 'flex';
}

function closeXhsUser() {
    document.getElementById('xhs-external-user').style.display = 'none';
}

// --- 浏览器数据 ---
const browserData = {
    // 预设的历史记录 (埋藏剧情线索)
  /*  history: [
        { time: "Today 09:15", title: "Bangkok weather", url: "www.google.com/search?q=bangkok+weather" },
        { time: "Yesterday 23:40", title: "FaceMatch AI - Compare Faces", url: "www.facematch-ai.com/demo", isClue: true },
        { time: "Yesterday 23:35", title: "Ryan Maya face match", url: "www.google.com/search?q=ryan+maya+face+match" }
    ],
*/


    history: [
        { time: "Yesterday 22:10", title: "Our Eternal Aurora - C&L", url: "www.aurora-love-forever.com", clickAction: "navBrowser('couple-login')" },
        { time: "Yesterday 18:45", title: "Bangkok Expats Forum", url: "www.bkk-expats.com/thread/7721" },
        { time: "Yesterday 14:20", title: "Currency Converter (THB/CNY)", url: "www.xe.com/currencyconverter" }
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

    // else if (viewId === 'history') urlBar.value = "chrome://history";

    else if (viewId === 'history') {
        urlBar.value = "chrome://history";
        renderHistory(); // [关键新增] 只有加了这一行，点击三个点时才会去读取数据并生成列表
    }
    

    else if (viewId === 'tracking') urlBar.value = "www.global-express.com/track";
    else if (viewId === 'news-adam') urlBar.value = "www.bkk-daily.com/news/tourist-fall-incident";
    else if (viewId === 'zodiac-monkey') urlBar.value = "www.google.com/search?q=Year+of+the+Monkey";


    else if (viewId === 'couple-login') urlBar.value = "www.aurora-love-forever.com/login";
    else if (viewId === 'couple-main') urlBar.value = "www.aurora-love-forever.com/home";

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

// // 渲染历史记录
// function renderHistory() {
//     const container = document.getElementById('history-container');
//     container.innerHTML = '';
//     browserData.history.forEach(item => {
//         // 如果是线索，可以用稍微不同的样式或直接允许点击
//         container.innerHTML += `
//             <div class="history-item">
//                 <div class="history-time">${item.time}</div>
//                 <div class="history-title" onclick="document.getElementById('main-search-input').value='${item.title}'; executeSearch();">${item.title}</div>
//             </div>`;
//     });
// }


// --- 替换原有的 renderHistory 函数 ---
function renderHistory() {
    const container = document.getElementById('history-container');
    container.innerHTML = ''; // 先清空旧的列表内容
    
    browserData.history.forEach(item => {
        // 判断这条记录是否有特殊的点击动作（比如去情侣登录页），如果没有则默认搜标题
        let clickAction = item.clickAction 
            ? `${item.clickAction}` 
            : `document.getElementById('main-search-input').value='${item.title}'; executeSearch();`;

        container.innerHTML += `
            <div class="history-item">
                <div class="history-time">${item.time}</div>
                <div class="history-title" onclick="${clickAction}">${item.title}</div>
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


// --- 1. 新增数据：Ryan 文件夹内容 ---
const ryanFolderData = {
    password: "Ryan20001218",
    files: [
        { type: "img", name: "IMG_0821.jpg", url: "https://images.unsplash.com/photo-1516195851888-6f1a981a8a2a?q=80&w=200" }, // 偷拍的手1
        { type: "img", name: "IMG_0822.jpg", url: "https://images.unsplash.com/photo-1583005825000-85f750739906?q=80&w=200" }, // 偷拍的手2
        { type: "img", name: "IMG_0910.jpg", url: "https://images.unsplash.com/photo-1542553458-79a13aebfda6?q=80&w=200" }, // 偷拍的手3
        { 
            type: "txt", 
            name: "Diary_20231001.txt", 
            content: "Oct 1st. Ryan looks perfect today. He thinks he can just exist without my permission. I captured 12 shots of his hands while he was distracted. He is a masterpiece that only I deserve to own. Every finger, every movement... it all belongs to me. He is nothing without my eyes on him." 
        },
        { 
            type: "txt", 
            name: "Note_to_Self.txt", 
            content: "He tried to talk to that girl again. Pathetic. He doesn't realize that I am the only one who truly sees him. I've spent years curating his life, and he will never escape this frame. My collection is growing. He is mine, forever and always." 
        }
    ]
};

// --- 2. 新增功能函数 ---

// 显示密码输入框
function showRyanPasswordPrompt() {
    document.getElementById('files-main-view').style.display = 'none';
    document.getElementById('ryan-password-screen').style.display = 'flex';
}

// 返回主文件夹视图
function backToFilesMain() {
    document.getElementById('ryan-password-screen').style.display = 'none';
    document.getElementById('ryan-content-view').style.display = 'none';
    document.getElementById('files-main-view').style.display = 'flex';
    document.getElementById('ryan-pwd-input').value = '';
    document.getElementById('ryan-pwd-error').innerText = '';
}

// 检查密码
function checkRyanPassword() {
    const input = document.getElementById('ryan-pwd-input').value;
    if (input === ryanFolderData.password) {
        renderRyanContent();
    } else {
        const error = document.getElementById('ryan-pwd-error');
        error.innerText = "Access Denied. Incorrect credentials.";
        document.getElementById('ryan-pwd-input').style.animation = "shake 0.3s";
        setTimeout(() => document.getElementById('ryan-pwd-input').style.animation = "", 300);
    }
}


// 渲染 Ryan 文件夹内容
function renderRyanContent() {
    document.getElementById('ryan-password-screen').style.display = 'none';
    const container = document.getElementById('ryan-content-view');
    container.style.display = 'flex';
    container.innerHTML = '';

    ryanFolderData.files.forEach((file, index) => {
        let html = '';
        if (file.type === 'img') {
            html = `
                <div class="ryan-item" onclick="openImagePreview('${file.url}')">
                    <img src="${file.url}" class="ryan-photo-thumb">
                    <div class="icon-name" style="font-size:10px;">${file.name}</div>
                </div>`;
        } else {
            html = `
                <div class="ryan-item" onclick="openDiaryPreview('${file.name}', \`${file.content}\`)">
                    <span class="ryan-file-icon">📄</span>
                    <div class="icon-name" style="font-size:10px;">${file.name}</div>
                </div>`;
        }
        container.innerHTML += html;
    });
}

// 借用现有的 Preview 窗口展示大图 (简单的覆盖逻辑)
function openImagePreview(url) {
    const previewWin = document.getElementById('win-preview');
    // 修改 Preview 窗口的内容为图片
    const contentArea = previewWin.querySelector('.receipt-paper').parentElement;
    contentArea.innerHTML = `<img src="${url}" style="max-width:90%; border:5px solid white; box-shadow: 0 5px 15px rgba(0,0,0,0.5);">`;
    openWindow('win-preview');
}

// 借用现有的 Preview 窗口展示日记内容
function openDiaryPreview(title, content) {
    const previewWin = document.getElementById('win-preview');
    const contentArea = previewWin.querySelector('.receipt-paper').parentElement;
    contentArea.innerHTML = `
        <div style="background:#fff; padding:30px; width:80%; min-height:80%; font-family:serif; line-height:1.6; color:#222; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h4 style="border-bottom:1px solid #eee; padding-bottom:10px;">${title}</h4>
            <p style="white-space: pre-wrap; font-size:14px;">${content}</p>
        </div>`;
    openWindow('win-preview');
}



// --- 1. 新增数据：音乐列表 ---
// 修改 likedSongs 数据，增加 url 字段
const likedSongs = [
    { 
        title: "Havana", 
        artist: "Camila Cabello / Young Thug", 
        cover: "https://images.unsplash.com/photo-1514525253361-bee8718a300a?q=80&w=100", 
        duration: "03:37",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" // 替换为你的真实音频链接
    },
    { 
        title: "Every Breath You Take", 
        artist: "The Police", 
        cover: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=100", 
        duration: "04:13",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" 
    },
    { 
        title: "Stan", 
        artist: "Eminem", 
        cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=100", 
        duration: "06:44",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
    },
    { 
        title: "Creep", 
        artist: "Radiohead", 
        cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=100", 
        duration: "03:56",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
    },
    { 
        title: "Somebody's Watching Me", 
        artist: "Rockwell", 
        cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=100", 
        duration: "03:59",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
    }
];

let isPlaying = false;
let progressInterval = null;

// --- 2. 音乐播放器逻辑 ---

// 显示“喜欢”列表
function showLikedSongs() {
    const main = document.getElementById('music-main-content');
    let html = `
        <h2 style="margin-bottom:10px;">Liked Songs</h2>
        <table class="song-list-table">
            <thead>
                <tr>
                    <th style="width:40px;">#</th>
                    <th>Song</th>
                    <th>Artist</th>
                    <th>Time</th>
                </tr>
            </thead>
            <tbody>`;
    
    likedSongs.forEach((song, index) => {
        html += `
            <tr class="song-row" onclick="playSong(${index})">
                <td style="color:#999;">0${index + 1}</td>
                <td style="font-weight:bold;">${song.title}</td>
                <td style="color:#666;">${song.artist}</td>
                <td style="color:#999;">${song.duration}</td>
            </tr>`;
    });

    html += `</tbody></table>`;
    main.innerHTML = html;
}

// 获取音频 DOM 元素
const audioEntity = document.getElementById('real-audio');




// --- 修改/新增音乐播放逻辑 ---

let currentSongIndex = 0; // 记录当前播放的歌曲索引

// 修改原有的 playSong 函数，增加索引同步
function playSong(index) {
    currentSongIndex = index; // 同步当前索引
    const song = likedSongs[index];
    
    // 更新 UI 内容
    document.getElementById('player-title').innerText = song.title;
    document.getElementById('player-artist').innerText = song.artist;
    document.getElementById('player-cover').innerHTML = `<img src="${song.cover}">`;
    document.getElementById('play-btn').innerText = "⏸️";
    
    // 加载并播放真实音频
    audioEntity.src = song.url;
    audioEntity.play().catch(e => console.log("Audio play blocked or error:", e));
    
    isPlaying = true;
}

// 新增：下一首
function playNextSong() {
    // 如果是最后一首，则跳回第一首
    currentSongIndex = (currentSongIndex + 1) % likedSongs.length;
    playSong(currentSongIndex);
}

// 新增：上一首
function playPrevSong() {
    // 如果是第一首，则跳到最后一首
    currentSongIndex = (currentSongIndex - 1 + likedSongs.length) % likedSongs.length;
    playSong(currentSongIndex);
}

// 修改：歌曲播放结束后的处理 (自动播放下一首)
audioEntity.onended = function() {
    playNextSong(); 
};



// 修改播放/暂停切换函数
function togglePlay() {
    if (!audioEntity.src) return; // 如果还没选歌，不执行
    
    if (isPlaying) {
        audioEntity.pause();
        document.getElementById('play-btn').innerText = "▶️";
    } else {
        audioEntity.play();
        document.getElementById('play-btn').innerText = "⏸️";
    }
    isPlaying = !isPlaying;
}

// 利用 timeupdate 事件同步真实进度
audioEntity.ontimeupdate = function() {
    const progressFill = document.getElementById('progress-fill');
    const currTimeText = document.getElementById('curr-time');
    
    if (audioEntity.duration) {
        // 计算百分比
        const percentage = (audioEntity.currentTime / audioEntity.duration) * 100;
        progressFill.style.width = percentage + "%";
        
        // 格式化当前时间显示
        let m = Math.floor(audioEntity.currentTime / 60);
        let s = Math.floor(audioEntity.currentTime % 60);
        currTimeText.innerText = `${m < 10 ? '0'+m : m}:${s < 10 ? '0'+s : s}`;
    }
};

// 歌曲播放结束后的处理
audioEntity.onended = function() {
    document.getElementById('play-btn').innerText = "▶️";
    isPlaying = false;
};



// 模拟进度条
function startProgress() {
    clearInterval(progressInterval);
    let progress = 0;
    const bar = document.getElementById('progress-fill');
    const timeText = document.getElementById('curr-time');
    
    progressInterval = setInterval(() => {
        if (isPlaying && progress < 100) {
            progress += 0.5;
            bar.style.width = progress + "%";
            
            // 简单的时间滚动模拟
            let totalSeconds = Math.floor((progress / 100) * 217); // 假设 3:37 = 217s
            let min = Math.floor(totalSeconds / 60);
            let sec = totalSeconds % 60;
            timeText.innerText = `0${min}:${sec < 10 ? '0'+sec : sec}`;
        }
    }, 1000);
}


function checkCouplePassword() {
    const pwd = document.getElementById('couple-pwd-input').value;
    const errorMsg = document.getElementById('couple-login-error');
    
    if (pwd === "LC20220808") {
        navBrowser('couple-main'); // 密码正确，调用导航函数去主页
    } else {
        // 密码错误逻辑
        errorMsg.innerText = "Only for those who remember the beginning.";
        const inputField = document.getElementById('couple-pwd-input');
        inputField.style.animation = "shake 0.3s";
        setTimeout(() => inputField.style.animation = "", 300);
    }
}



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
    renderXhsHomeFeed();
    setInterval(() => {
        document.getElementById('clock').innerText = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
    }, 1000);
}

// 页面加载完毕后执行初始化
initGame();