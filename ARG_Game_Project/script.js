// ==========================================
// --- 研究数据打点系统 (System Log System) ---
// ==========================================
let gameLogs = JSON.parse(localStorage.getItem('maya_research_logs')) || [];
let sessionStartTime = Date.now();

/**
 * 核心打点函数
 * 每次记录都会附带距离游戏开始的秒数，便于分析停滞时长(Stagnation)
 */
function recordAction(eventType, details = {}) {
    const logEntry = {
        timestamp: new Date().toLocaleString(),
        elapsedTime: Math.floor((Date.now() - sessionStartTime) / 1000), // 单位：秒
        event: eventType,
        ...details
    };
    gameLogs.push(logEntry);
    
    // 实时保存，防止玩家刷新页面丢失数据
    localStorage.setItem('maya_research_logs', JSON.stringify(gameLogs));
    console.log(`[LOG] ${eventType}:`, details); // 调试用
}

// 导出 JSON 文件的函数
function exportLogs() {
    if (gameLogs.length === 0) {
        showNotification("System", "No logs to export.");
        return;
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(gameLogs, null, 2));
    const downloadNode = document.createElement('a');
    downloadNode.setAttribute("href", dataStr);
    downloadNode.setAttribute("download", "maya_player_log_" + Date.now() + ".json");
    document.body.appendChild(downloadNode);
    downloadNode.click();
    downloadNode.remove();
    showNotification("System", "Research logs exported.", "⬇️");
}

// 记录游戏启动
recordAction('GAME_START', { loaded: true });
// ==========================================

// --- 小红书历史记录堆栈 ---
let xhsHistoryStack = [];

// --- 全局游戏状态 (核心) ---
let gameState = {
    introWatched: false,       // 是否已经看过了开场剧情
    notesContent: "",          // 记录记事本里玩家写的字
    xhsMsgUnlocked: false,      // 记录小红书私信是否已解锁
    foundFaceMatch: false,       // 记录是否已经找到人脸匹配的线索
    unlockedRyanFolder: false,   // 记录 Ryan 文件夹是否已解锁
    unlockedHandsFolder: false,   // 记录 Data_Recovered(Hands) 文件夹是否已解锁
    unlockedCoupleSite: false,  // ✨ 新增：情侣网站是否已解锁
    unlockedDownloads: ['adam_now', 'adam_school', 'luna_now'],    // 假设默认可见的两个文件的 ID 分别是 'ryan_school' 和 'adam_school'
    unlockedDiary: false   // ✨ 新增：记录最终日记是否已解锁

    // 以后可以在这里随意添加剧情节点，比如：
    // unlockedHiddenFolder: false,

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

// --- OS 系统通知功能 ---
function showNotification(title, message, icon = "💬", onClickCallback = null) {
    const container = document.getElementById('os-notification-container');
    const toast = document.createElement('div');
    toast.className = 'os-toast';
    
    toast.innerHTML = `
        <div class="os-toast-title"><span>${icon}</span> ${title}</div>
        <div class="os-toast-body">${message}</div>
    `;
    
    // 点击通知的逻辑：执行回调并向右滑出移除
    const dismissToast = () => {
        toast.style.animation = 'fadeOutRight 0.3s forwards';
        setTimeout(() => toast.remove(), 300);
    };

    toast.onclick = () => {
        if (onClickCallback) onClickCallback();
        dismissToast();
    };

    container.appendChild(toast);
    
    // 6秒后自动消失
    setTimeout(() => {
        if (toast.parentElement) dismissToast();
    }, 6000);
}

// --- 小红书用户数据库 ---
const xhsUsers = {


    "luna": {
        name: "🌙 YUE 🌙", id: "994021",
        avatar: "assets/Luna1.png",
        bio: "Exploring the world one spicy dish at a time 🌶️",
        stats: { posts: 6, followers: "1.2k", following: 892 },
        // 按时间倒序排列
        posts: ["luna_post_bkk_2026", "luna_post_unboxing_2025", "luna_post_luosifen", "luna_post_cola_chicken", "luna_post_tomato_egg", "luna_post_hello"]
    },


    "ryan": {
        name: "Deactivated Account", id: "Account Disabled",
        avatar: "", 
        bio: "This account has been deactivated by the user.",
        stats: { posts: 5, followers: 128, following: 150 },
        posts: ["ryan_post_5", "ryan_post_4", "ryan_post_3", "ryan_post_2", "ryan_post_1"] // 按时间倒序
    },
    
    "adam": {
        name: "Augenster", id: "8832910",
        avatar: "assets/Adam.png",
        bio: "Less is more.",
        stats: { posts: 4, followers: 45, following: 128 },
        // 按时间倒序排列：10.25 -> 09.18
        posts: ["adam_post_laziji", "adam_post_mango", "adam_post_mapo", "adam_post_cooking_start"]
    },


    "basketball_boy": {
        name: "BasketballBoy", id: "772105",
        avatar: "assets/Lucas.png",
        bio: "Ball is life. 🏀 | MUST Class of 2016",
        stats: { posts: 5, followers: 310, following: 215 },
        // 按时间倒序排列：2025 -> 2019
        posts: ["l_post_proposal", "l_post_couple", "l_post_valentines_2024", "l_post_thailand", "l_post_graduation", "l_post_basketball_win"] 
    },
    "hl_forever": {
        name: "HL_FOREVER", id: "5201314",
        avatar: "assets/HL-beiying.png",
        bio: "Happily preparing for the next chapter of life. ✨",
        stats: { posts: 3, followers: 890, following: 156 },
        // 按时间倒序排列：2026 -> 2024
        posts: ["hl_post_wedding", "hl_post_bday", "hl_post_dress"]
    },

    "luna_burner": {
        name: "1_4_1_13_1010", id: "Burner_772",
        avatar: "", // 留空显示默认灰色头像
        bio: "Just looking for answers.",
        stats: { posts: 1, followers: 5, following: 0 },
        posts: ["luna_burner_sos"] // 仅保留图片中的这条帖子
    },
    "work_hard": {
        name: "KeepRunning", id: "229103",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        bio: "Fitness is a lifestyle. 💪",
        stats: { posts: 15, followers: 800, following: 200 },
        posts: []
    },
    "felin": {
        name: "FELIN", id: "441029",
        avatar: "https://randomuser.me/api/portraits/women/22.jpg",
        bio: "Capturing light and shadows. 📸",
        stats: { posts: 42, followers: "2.5k", following: 310 },
        posts: []
    },


};

// --- 小红书帖子详情数据  ---
const xhsPostData = {
// === Luna 大号帖子 (按时间倒序) ===
// === Luna 的主页帖子 (地道英文版) ===

    "luna_post_hello": {
        img: "assets/Luna1.png",
        author: "🌙 YUE 🌙", avatar: "assets/Luna1.png",
        text: "Hello RedGram! ✌️\nMy previous TickTock account got banned out of nowhere, was really sad about it for a long time, lost so many memories.\nBut that's okay, considering this as a fresh start! From now on, I'll be sharing my daily life, travels, and random moments here. Nice to meet you all! 🥰\n#NewHere #TickTockrefugee #HelloRG",
        date: "2025.8.20", comments: "1 Comments",
        commentsList: [{ user: "DailyVibes", avatar: "", text: "Welcome! Hope you enjoy it here! 😊", time: "2025.8.20" }]
    },
    "luna_post_tomato_egg": {
        img: "assets/fanqiechaodan.png",
        author: "🌙 YUE 🌙", avatar: "assets/Luna1.png",
        text: "My first time making Chinese food! ~ 🍳\nTomato and egg stir-fry is so tasty and easy. It's hands-down the best companion for a bowl of rice, no competition! \n#TomatoEggStirFry #ChineseStomach #ILoveTomatoes #ChineseFood",
        date: "2025.09.15", comments: "2 Comments",
        commentsList: [
            { user: "Foodie_Girl", avatar: "", text: "Looks delicious! ~", time: "2025.09.15" },
            { user: "PrettyBoy", avatar: "", text: "Highly recommend trying Cola Chicken Wings next! You'll love them!", time: "2025.09.16" }
        ]
    },
    "luna_post_cola_chicken": {
        img: "assets/kelejichi.png",
        author: "🌙 YUE 🌙", avatar: "assets/Luna1.png",
        text: "So many people recommended I try Cola Chicken Wings~ \nThanks for the suggestions, I finally got to taste this perfection! What Chinese dish should I challenge next? 🍗\n#ColaChickenWings #Foodie",
        date: "2025.09.28", comments: "2 Comments",
        commentsList: [
            { user: "HomeCook_Sam", avatar: "", text: "Stir-fried potato shreds! 🥔", time: "2025.09.28" },
            { user: "Augenster", avatar: "assets/Adam.png", text: "Mapo Tofu is also great for beginners. You can check the recipe on my page~", time: "2025.09.29" }
        ]
    },
    "luna_post_luosifen": {
        img: "assets/luosifen.png",
        author: "🌙 YUE 🌙", avatar: "assets/Luna1.png",
        text: "Food Share 🍜\nBravely took on the 'mild spicy' Luosifen (Snail Rice Noodles) challenge! How can something be so smelly yet so delicious at the same time? Such a unique flavor! \n#LuosifenChallenge",
        date: "2025.10.13", comments: "2 Comments",
        commentsList: [
            { user: "TravelChina", avatar: "", text: "You have to come to China and try the authentic version one day!", time: "2025.10.13" },
            { user: "Guangxi_Native", avatar: "", text: "Welcome from a Guangxi local! 😂", time: "2025.10.14" }
        ]
    },
    "luna_post_unboxing_2025": {
        img: "assets/unboxing.png",
        author: "🌙 YUE 🌙", avatar: "assets/Luna1.png",
        text: "Unboxing! ✨\nAbsolutely in love with the gift from my babe 🎁",
        date: "2025.12.21", comments: "1 Comments",
        commentsList: [
            { user: "Augenster", avatar: "assets/Adam.png", text: "Looks sooooo good on you. 😍", time: "2025.12.21" }
        ]
    },
    "luna_post_bkk_2026": {
        img: "https://images.unsplash.com/photo-1563492065599-3520f775eeed?q=80&w=500",
        author: "🌙 YUE 🌙", avatar: "assets/Luna1.png",
        text: "Thailand🇹🇭\nThe weather is amazing here ☀️ So many street food choices~ The Tom Yum soup is so sour and spicy, it's the perfect appetizer! 🤩",
        date: "2026.4.1", comments: "0 Comments",
        commentsList: []
    },   


// === Ryan 的旧账帖子 (核心剧情线索) ===
// === Ryan 的旧帖：地道英文版 ===
    "ryan_post_1": {
        img: "assets/biandang.png",
        author: "Deactivated Account", avatar: "",
        text: "Met the absolute best roommate ever! 🥺 Another day of them grabbing me food. Blessed.",
        date: "2017-09-10", comments: "1 Comments",
        commentsList: [
            { user: "Augenster", avatar: "assets/Adam.png", text: "Still gotta remember to eat on time, buddy!", time: "2017-09-10" }
        ]
    },
    "ryan_post_2": {
        img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=500",
        author: "Deactivated Account", avatar: "",
        text: "Perfect weather to just get lost in music today. ☀️🎵",
        date: "2018-03-24", comments: "1 Comments",
        commentsList: [
            { user: "BasketballBoy", avatar: "assets/Lucas.png", text: "Great taste! 👍", time: "2018-03-24" }
        ]
    },
    "ryan_post_3": {
        img: "assets/birthday_.png",
        author: "Deactivated Account", avatar: "",
        text: "Another year older, wishing to be even happier than yesterday. Thanks for all the wishes and gifts! ~",
        date: "2019-03-15", comments: "2 Comments",
        commentsList: [
            { user: "BasketballBoy", avatar: "assets/Lucas.png", text: "Happy Birthday! 🤩", time: "2019-03-15" },
            { user: "Augenster", avatar: "assets/Adam.png", text: "Happy Birthday🥳 Hope you finally catch that Live House show soon!", time: "2019-03-15" }
        ]
    },
    "ryan_post_4": {
        img: "assets/sleeping.png",
        author: "Deactivated Account", avatar: "",
        text: "Not sure why, but I've been feeling so lightheaded lately. Maybe winter is just made for sleeping... 🥱",
        date: "2019-11-21", comments: "2 Comments",
        commentsList: [
            { user: "Augenster", avatar: "assets/Adam.png", text: "Time to save up some energy for hibernation~", time: "2019-11-21" },
            { user: "BasketballBoy", avatar: "assets/Lucas.png", text: "Get up and play a round of hoops with me! 💪", time: "2019-11-21" }
        ]
    },
// --- script.js ---

"ryan_post_5": {
    isVideo: true,                // 👈 标记为视频
    videoSrc: "assets/1.mp4",     // 👈 视频文件路径
    img: "assets/1.png", // 保留封面图，用于在列表页显示
    author: "Deactivated Account", 
    avatar: "",
    text: "Quick Room Tour of the Dorm Culture Fest winner! Honestly, it's just way too cozy for sleeping. 😴",
    date: "2020-02-18", 
    comments: "1 Comments",
    commentsList: [
        { user: "BasketballBoy", avatar: "assets/Lucas.png", text: "Damn, Augenster's desk is way too tidy! 🐱", time: "2020-02-18" }
    ]
},

    // === Adam 大号帖子 (按时间倒序) ===
    // === Adam (Augenster) 的主页帖子 (地道英文版) ===
    "adam_post_cooking_start": {
        img: "assets/kitchen.png",
        author: "Augenster", avatar: "assets/Adam.png",
        text: "Lately I've been obsessed with cooking 🥘 Planning to share my culinary journey with everyone here. 😋",
        date: "2025.09.18", comments: "0 Comments",
        commentsList: []
    },
    "adam_post_mapo": {
        img: "assets/mapodoufu2.png",
        author: "Augenster", avatar: "assets/Adam.png",
        text: "The ultimate rice-killer Mapo Tofu tutorial is here! 🍛\nIngredients 🥬: 1 block of tofu, 50g minced meat, Doubanjiang (bean paste), Sichuan peppercorns, green onions, minced garlic, Thai chili. Check the video for steps! ~\n#ChineseFood #Foodie",
        date: "2025.09.20", comments: "3 Comments",
        commentsList: [
            { user: "SweetPascal", avatar: "", text: "Saved.", time: "2025.09.20" },
            { user: "CzxKeeho", avatar: "", text: "👍👍", time: "2025.09.26" },
            { user: "🌙 YUE 🌙", avatar: "assets/Luna1.png", text: "Will this be super spicy? I can't handle too much heat 🌶️", time: "2025.10.03" }
        
        ]
    },
    "adam_post_mango": {
        img: "assets/yangzhi-ganlu.png",
        author: "Augenster", avatar: "assets/Adam.png",
        text: "Spent an hour making Mango Pomelo Sago （Yang Zhi Gan Lu）~ It's so sweet, refreshing, and delicious! But the prep takes way too long... I think I'll just stick to takeout next time. 😂",
        date: "2025.10.05", comments: "2 Comments",
        commentsList: [
            { user: "MangoLover", avatar: "", text: "The mangoes 🥭 look so tasty!", time: "2025.10.05" },
            { user: "SweetTooth", avatar: "", text: "I want a sip! 🤩", time: "2025.10.06" }
        ]
    },
    "adam_post_laziji": {
        img: "assets/laziji2.png",
        author: "Augenster", avatar: "assets/Adam.png",
        text: "Another delicious way to cook chicken 🐔. Spicy Chicken (La Zi Ji) tutorial is here! 😄\nIngredients 🌶: Diced chicken breast, onion, dried chilies, minced garlic, green onions, Sichuan peppercorns... Check the video for steps! ~\n#ChineseFood #Foodie",
        date: "2025.10.25", comments: "2 Comments",
        commentsList: [
            { user: "🌙 YUE 🌙", avatar: "assets/Luna1.png", text: "My mouth is watering just looking at this! 😜", time: "2025.10.25" },
            { user: "Augenster", avatar: "assets/Adam.png", text: "This one just looks like it has a lot of chilies hahaha, but it's actually barely spicy.", time: "2025.10.25" }
        ]
    },
    
// === BasketballBoy (Lucas) 的主页帖子 (地道英文版) ===

    "l_post_basketball_win": {
        img: "assets/Lucas.png",
        downloadId: "lucas_basketball",
        author: "BasketballBoy", avatar: "assets/Lucas.png",
        text: "First place in the MingZhou University Basketball League! 🏅 Good work, brothers!!! 💗💗💗",
        date: "2019.12.15", comments: "20 Comments",
        commentsList: [
            { user: "Augenster", avatar: "assets/Adam.png", text: "Holy sh*t, let's goooo!!! 🔥🔥🔥", time: "2019.12.15" },
            { user: "Deactivated Account", avatar: "", text: "Huge congrats! What an incredible game! 🏆", time: "2019.12.15" }
        ]
    },
    "l_post_graduation": {
        img: "assets/graduation-biketrip.png",
        author: "BasketballBoy", avatar: "assets/Lucas.png",
        text: "Stop planning, just go. Graduation trip in progress! 🎓 The only regret is that Xin couldn't make it 🥺\n#Youth #Graduation",
        date: "2021.7.13", comments: "8 Comments",
        commentsList: []
    },
    "l_post_thailand": {
        img: "assets/Bangkok-work.jpeg",
        author: "BasketballBoy", avatar: "assets/Lucas.png",
        text: "Starting my new 'brick-moving' (hustle) life in a brand new country! 📌 Thailand",
        date: "2023.09.30", comments: "3 Comments",
        commentsList: []
    },
    "l_post_valentines_2024": {
        img: "assets/zhuguangwancan.png", // 找了一张浪漫晚餐的配图
        author: "BasketballBoy", avatar: "assets/Lucas.png",
        text: "Officially together! 🎉 Celebrating our first Valentine's Day. 🥩🍷🍷\n#ValentinesDay #Couple",
        date: "2024.02.14", comments: "5 Comments",
        commentsList: [
            { user: "HL_FOREVER", avatar: "assets/HL-beiying.png", text: "🌹", time: "2024.02.14" }
        ]
    },
    "l_post_couple": {
        img: "assets/cha.png",
        author: "BasketballBoy", avatar: "assets/Lucas.png",
        text: "Gotta do the challenge with my girl too 👫\n#CoupleChallenge",
        date: "2024.6.16", comments: "28 Comments",
        commentsList: [
            { user: "HL_FOREVER", avatar: "assets/HL-beiying.png", text: "💗", time: "2024.6.16" }
        ]
    },
    "l_post_proposal": {
        img: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=500",
        author: "BasketballBoy", avatar: "assets/Lucas.png",
        text: "SHE SAID YESSSSS!! 💍❤️💍",
        date: "2025.12.25", comments: "8 Comments",
        commentsList: [{ user: "HL_FOREVER", avatar: "assets/HL-beiying.png", text: "The aurora tonight is our witness❤️", time: "2025.12.25" }

        ]
    },

    // === HL_FOREVER (Hope) 的主页帖子 (地道英文版) ===
    "hl_post_dress": {
        img: "assets/yellowdress-beiying.png",
        author: "HL_FOREVER", avatar: "assets/HL-beiying.png",
        text: "This yellow dress from Brand C is so perfect for this season! 🌼✨\n#OOTD",
        date: "2024.03.23", comments: "0 Comments",
        commentsList: []
    },
    "hl_post_bday": {
        img: "assets/HL-beiying.png",
        author: "HL_FOREVER", avatar: "assets/HL-beiying.png",
        text: "Happy birthday babe 💖 @BasketballBoy",
        date: "2024.07.22", comments: "1 Comments",
        commentsList: [
            { 
                user: "BasketballBoy", 
                avatar: "assets/Lucas.png", 
                text: "🎵 Listen to this for you! 🎤", 
                time: "2024.07.22",
                isAudio: true,                                       // 新增：标记为音频评论
                audioSrc: "assets/falling_in_love.m4a"              // 新增：替换为你实际的音频文件路径
            }
        ]
    },
    "hl_post_wedding": {
        img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=500",
        author: "HL_FOREVER", avatar: "assets/HL-beiying.png",
        text: "Wedding planning is seriously so exhausting ⛪️~\n#WeddingPrep #Happiness",
        date: "2026.02.19", comments: "1 Comments",
        commentsList: [
            { user: "BasketballBoy", avatar: "assets/Lucas.png", text: "Babe, let's treat ourselves to a great dinner tonight! 😘", time: "2026.02.19" }
        ]
    },

// === Luna 小号 (1_4_1_13_1010) 的帖子 (地道英文版) ===
    "luna_burner_sos": {
        img: "https://images.unsplash.com/photo-1584308666744-24d5e471956c?q=80&w=500", // 药瓶图片
        author: "1_4_1_13_1010", avatar: "",
        text: "Help: Found this in my friend's bag.\nThe label says 'Novacard', which I searched and it's for the heart condition. But the pills inside are plain white and round, completely different from the blue ones on the internet. \n\nDoes anyone have any idea what these are? ❓",
        date: "2026.04.03", comments: "2 Comments",
        commentsList: [
            { 
                user: "MedStudent_Anna", 
                avatar: "https://randomuser.me/api/portraits/women/11.jpg", 
                text: "Novacard pills are strictly blue and hexagonal. White round pills could be anything. Be careful!", 
                time: "2026.04.03" 
            },
            { 
                user: "HL_FOREVER", 
                avatar: "assets/HL-beiying.png", 
                text: "CHECK YOUR DMs NOW!!!", 
                time: "2026.04.03" 
            }
        ]
    },

         // 主页
    "post_work_1": {
        img: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=500",
        author: "Aero_Nav", avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        text: "Midnight shift at the terminal. 🌙\nEverything is moving like clockwork. Watching the last flight land safely at 2 AM is the best relief. \n#Aviation #AirportDaily #ATC",
        date: "2026.03.28", comments: "42 Comments",
        commentsList: [{ user: "SkyWalker_99", avatar: "", text: "The tarmac looks beautiful tonight.", time: "1h ago" }]
    },
    "post_work_3": {
        img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=500",
        author: "Smart_Traveler", avatar: "https://randomuser.me/api/portraits/men/21.jpg",
        text: "Don't wait at the gate. ✈️\nTrack weather patterns yourself to predict delays before the airline even knows. Take control of your schedule.\n#TravelHacks #Aviation #Efficiency",
        date: "2026.04.02", comments: "128 Comments",
        commentsList: [{ user: "User_8821", avatar: "", text: "This actually saved me today!", time: "5h ago" }]
    },
    "post_heart_1": {
        img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=500",
        author: "Matcha_Daily", avatar: "https://randomuser.me/api/portraits/women/11.jpg",
        text: "100 days caffeine-free update. ☕\nThe heart palpitations have completely vanished. Switched to high-grade matcha for a cleaner boost.\n#HeartHealth #Biohacking #CleanEnergy",
        date: "2026.03.15", comments: "85 Comments",
        commentsList: [{ user: "Zen_Lover", avatar: "", text: "Switching was the best choice for me too.", time: "3d ago" }]
    },
    "post_heart_3": {
        img: "assets/hailuyu.png",
        author: "Clean_Kitchen", avatar: "https://randomuser.me/api/portraits/women/63.jpg",
        text: "Heart-Friendly Meal: Steamed Seabass with Ginger. 🥗\nLow sodium, zero oil, high protein. Keeping things light.\n#CleanEating #HealthyRecipes #Wellness",
        date: "2026.03.25", comments: "16 Comments",
        commentsList: [{ user: "Foodie_Fan", avatar: "", text: "Looks simple and delicious.", time: "2d ago" }]
    },
    "post_photo_1": {
        img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=500",
        author: "Tech_Hobbyist", avatar: "https://randomuser.me/api/portraits/men/7.jpg",
        text: "Is the SOFU X56 worth it? 📸\nThe mechanical tactile feedback is incredible. Perfect compact companion for my trip to Thailand.\n#CameraGear #SOFUX56 #Photography",
        date: "2026.04.01", comments: "94 Comments",
        commentsList: [{ user: "ShutterBug", avatar: "", text: "The color science on this is amazing.", time: "1h ago" }]
    },
    "post_game_1": {
        img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=500",
        author: "Pixel_Joe", avatar: "https://randomuser.me/api/portraits/men/9.jpg",
        text: "Review: 'College Student Missing Hiking Case' is a masterpiece. 🎮\nThe logic is flawless. The side plot about the missing student from years ago was haunting. 10/10.\n#ARG #Mystery #IndieGame",
        date: "2026.03.18", comments: "210 Comments",
        commentsList: [{ user: "MysteryFan", avatar: "", text: "That ending left me speechless...", time: "1d ago" }]
    },
    "post_psych_1": {
        img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=500",
        author: "Alpha_Logic", avatar: "https://randomuser.me/api/portraits/women/10.jpg",
        text: "The Power of 'Silent Quitting' in Relationships. 🚪\nIf someone doesn't align with your trajectory, remove them quietly. Efficiency over emotion.\n#SuccessMindset #Boundaries #Growth",
        date: "2026.04.02", comments: "532 Comments",
        commentsList: [{ user: "Success_Seeker", avatar: "", text: "Brutal but true.", time: "3h ago" }]
    },
    "post_psych_2": {
        img: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=500",
        author: "Social_Strategist", avatar: "https://randomuser.me/api/portraits/men/11.jpg",
        text: "Control the frame, control the outcome. ♟️\nThe person who sets the rules wins. Use psychological gaps to lead the rhythm.\n#Psychology #SocialStrategy #Influence",
        date: "2026.04.05", comments: "76 Comments",
        commentsList: [{ user: "ThinkDeep", avatar: "", text: "A vital skill for any professional.", time: "2h ago" }]
    },
    "post_thai_2": {
        img: "https://images.unsplash.com/photo-1552611052-d59a0d9741bc?q=80&w=500",
        author: "Thai_Kitchen", avatar: "https://randomuser.me/api/portraits/women/13.jpg",
        text: "Real Tom Yum doesn't need milk. 🦐\nAuthentic herbs are enough to create a complex, spicy, and sour soup. This is the real deal.\n#ThaiCooking #Foodie #Travel",
        date: "2026.04.01", comments: "58 Comments",
        commentsList: [{ user: "Chef_Ron", avatar: "", text: "Finally! No milk is the traditional way.", time: "1d ago" }]
    },
    "post_thai_3": {
        img: "assets/chuanmian.png",
        author: "Street_Guide", avatar: "https://randomuser.me/api/portraits/men/14.jpg",
        text: "Holy grail of Boat Noodles in BKK. 🍜\nTiny roadside stall, rich broth, and a local crowd. Skip the tourist traps.\n#HiddenGems #BKK #FoodGuide",
        date: "2026.04.03", comments: "39 Comments",
        commentsList: [{ user: "Sam_Travels", avatar: "", text: "Where exactly is this located?", time: "1d ago" }]
    },
    "post_thai_4": {
        img: "assets/qingcaogao.png",
        author: "BKK_Events", avatar: "https://randomuser.me/api/portraits/women/15.jpg",
        text: "The Glass Chapel is absolutely stunning. ⛪\nThe way sunlight filters through is calculated for pure perfection.\n#Architecture #BKK #WeddingVibes",
        date: "2026.04.05", comments: "12 Comments",
        commentsList: [{ user: "Dream_Day", avatar: "", text: "Stunning venue.", time: "1d ago" }]
    },
    "post_thai_5": {
        img: "assets/qingcaogao.png",
        author: "Shopaholic_BKK", avatar: "https://randomuser.me/api/portraits/women/16.jpg",
        text: "BKK Souvenirs: Don't leave without these! 🎁\nTraditional Herbal Balm for everything and sleep-well spray. Practical and local.\n#ShoppingList #Thailand #TravelGifts",
        date: "2026.04.07", comments: "245 Comments",
        commentsList: [{ user: "GiftFinder", avatar: "", text: "The balm is a lifesaver.", time: "1d ago" }]
    
    },
    "post_news_adam": {
        img: "assets/BreakingNews.png", 
        author: "Bangkok Daily", 
        avatar: "https://randomuser.me/api/portraits/men/82.jpg",
        text: "[Bangkok News]\nOn April 8th, a Chinese man surnamed Lu (also known as Adam) tragically passed away after suddenly collapsing during a wedding ceremony at a Bangkok hotel. Preliminary reports suggest a possible heart condition, though the exact cause of death remains under investigation. Local authorities are currently collecting evidence and reviewing surveillance footage.\n#BangkokNews #BreakingNews",
        date: "2026.04.10", 
        comments: "26 Comments",
        commentsList: [
            { user: "CuriousCat", avatar: "", text: "I heard his girlfriend is a foreigner he met online. Could this be some sort of romance scam?", time: "2h ago" },
            { user: "RationalThinker", avatar: "", text: "@CuriousCat  Are you serious right now? Please don't make malicious speculations before the police release their official findings.", time: "1h ago" },
            { user: "BKK_Insider", avatar: "", text: "Ah, I was actually there. It looked like a heart attack... They gave him medicine right away, but it was too late.", time: "1h ago" },
            { user: "Fragile", avatar: "", text: "Such a pity... he was so young. RIP.", time: "45m ago" },
            { user: "Swimm", avatar: "", text: "My friend works at that hotel. They said the scene was pretty chaotic and it wasn't just a simple fainting spell... I shouldn't say too much.", time: "30m ago" },
            { user: "Observer99", avatar: "", text: "Didn't they say he wasn't looking well even before the wedding? Someone saw him drinking heavily and arguing with someone.", time: "10m ago" }
        ]
    },
    


    // 原本的帖子内容
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
            { user: "Adam", avatar: "assets/Adam.png", text: "Bro, always remember to Ctrl+S. Let's go, I'll buy you a drink.", time: "2015-11-10" }
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
            { user: "Chris", avatar: "assets/Lucas.png", text: "You should go see a doctor man, that doesn't sound normal.", time: "2015-11-21" },
            { user: "Adam", avatar: "assets/Adam.png", text: "Take it easy, I'll bring you some hot soup later.", time: "2015-11-21" }
        ]
    },
    "ryan_post_eng2": {
        img: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?q=80&w=500", // 熬夜写代码/复习图片
        author: "Deactivated Account", avatar: "",
        text: "Who even invented 'Microcomputer Principles and Interface Technology'? Going blind staring at assembly language. 💻🔌 \n\n#EngineeringStudent #EE",
        date: "2015-12-02", comments: "0 Comments", commentsList: []
    },
   
};

// xhs帖子转换函数
function generateXhsLinkMsg(postId, senderType = "left") {
    const post = xhsPostData[postId];
    if (!post) return { type: senderType, text: "[分享的帖子已失效]" };
    const firstLine = post.text.split('\n')[0];
    const shortTitle = firstLine.length > 30 ? firstLine.substring(0, 30) + "..." : firstLine;
    return { type: senderType, xhsLink: true, postId: postId, linkTitle: shortTitle, author: post.author };
}


// --- 1. DATA: Chat History ---
const chatData = {
    "user_cousin": {
        name: "陆白", avatarColor: "#4285f4", avatarText: "白",
        inChatList: true,
        unread: true,
        messages: [
            { type: "sys", text: "Aug 31, 2024" },
            { type: "left", text: "Hey, the elective you recommended for next semester is so hard to get into." },
            { type: "right", text: "That class is super popular. Maybe consider another elective in the same department." },
            { type: "left", text: "Got it." },

            { type: "sys", text: "Jun 05, 2025" },
            { type: "right", text: "I'm heading back to campus next week for an alumni event." },
            { type: "right", text: "Let's grab food together~" },
            { type: "left", text: "Sounds good! I'm definitely going to make you treat me to a huge meal haha." },
            { type: "right", text: "No problem, whatever you want to eat is on me hahaha 😊" },

            { type: "sys", text: "Apr 09, 2026" },
            { type: "sys", text: "The call could not be connected." },
            { type: "left", text: "Hey?" },
            { type: "left", text: "Auntie says she can't reach you at all." },
            { type: "left", text: "Hit me back when you see this." }
        ]
    },

    "user_mom": {
        name: "Mom", avatarColor: "#e57373", avatarText: "Mom",
        inChatList: true,
        unread: true,
        messages: [
            { type: "sys", text: "Nov 12, 2024" },
            { type: "left", text: "How's work lately?" },
            { type: "right", text: "Going well. How's your health, Mom?" },
            { type: "left", text: "I'm doing fine." },
            { type: "left", text: "Take good care of yourself out there." },
            { type: "right", text: "Will do." },

            { type: "sys", text: "Jan 29, 2025" },
            { type: "right", text: "Happy Year of the Snake, Mom! 🥳 Wishing you good health and all your dreams come true! ❤️" },
            { type: "sys", text: "You transferred ¥5,000.00 to Mom." },
            { type: "left", text: "Thanks, son!" },
            { type: "left", text: "Happy New Year to you too!" },
            { type: "left", text: "Hope you find a girlfriend soon~ 😜" },


            { type: "sys", text: "Oct 10, 2025" },
            { type: "left", text: "Happy Birthday, my dear son🎉🎉🎉" },
            { type: "sys", text: "Mom sent you ￥1000.00." },
            { type: "right", text: "Thanks, Mom! Love you❤️" },


            { type: "sys", text: "Mar 25, 2026" },
            { type: "right", text: "Mom, I'm heading to Thailand in a few days for a college buddy's wedding. I'll bring back some local treats for you! 😍" },
            { type: "left", text: "Is it that good friend of yours from college?" },
            { type: "right", text: "Yeah, he met his other half in Thailand." },
            { type: "left", text: "That's wonderful. Hope to hear some good news about you and Luna soon." },

            { type: "sys", text: "Apr 08, 2026" },
            { type: "sys", text: "The call could not be connected." },
            { type: "sys", text: "The call could not be connected." },
            { type: "left", text: "Son? Why aren't you picking up?" },
            { type: "sys", text: "The call could not be connected." },
            { type: "left", text: "Is everything okay?" },
            { type: "sys", text: "The call could not be connected." },
            { type: "sys", text: "The call could not be connected." },
        ]
    },

    "user_luna": {
        name: "月 🌙", avatarColor: "#e91e63", avatarText: "🌙",
        inChatList: false, // 👉 默认隐藏
        messages: [
            { type: "sys", text: "Oct 30, 2025" },
            { type: "left", text: "I’m glad we finally moved to CallMe 😄" },
            { type: "right", text: "yeah RG chat is too slow sometimes" },
            { type: "left", text: "Is the dish in your new post really made of lion meat? 😂" },
            { type: "right", text: "Hahaha no, 'Lion's Head' is just giant meatballs. It's mostly pork, it just looks like a lion's head." },
            { type: "left", text: "Ohh, that sounds delicious." },
            { type: "right", text: "It's my signature dish. I'll make it for you when I get the chance!" },
            { type: "sys", text: "☎️ Video Call ended (45:12)" },

            { type: "sys", text: "Nov 28, 2025" },
            { type: "left", text: "Babe! I tried making Mapo Tofu today following your Chinese recipe! Look! 🌶️" },
            { type: "left", isImg: true, src: "assets/mapo2.jpg" },
            { type: "right", text: "Looks amazing 😋 My baby is a culinary genius." },
            { type: "left", text: "Hehe" },
            { type: "left", text: "But I still can't handle the spice 😭" },
            { type: "right", text: "You're doing great just by trying it babe 💗" },

            { type: "sys", text: "Dec 04, 2025" },
            { type: "left", text: "I saw a post on RedGram about the Chinese zodiac. Does everyone have their own zodiac sign?" },
            { type: "left", text: "I wonder what mine is." },
            { type: "right", text: "Let me recommend a website to you, it's called Destiny Finder." },
            { type: "right", text: "You can find out your zodiac sign and Five Elements based on your birthday." },
            { type: "right", text: "I was born in the Year of the 🐰~" },
            { type: "left", text: "Oh, let me go check it out." },
            { type: "left", text: "Turns out I'm a Rooster." },
            { type: "left", text: "I really wish I was a 🐉~" },
            { type: "right", text: "Hahaha, I wish I was a Dragon too, a member of House Targaryen~" },
            { type: "left", text: "I love Game of Thrones too!!" },

            { type: "sys", text: "Dec 21, 2025" },
            { type: "right", text: "Honey, did you get the birthday gift I prepared for you?" },
            { type: "left", text: "Ahhh!!! It's way too expensive baby!!" },
            { type: "right", text: "This bag perfectly matches your style." },
            { type: "right", text: "I wanted to buy it for you the second I saw it!" },
            generateXhsLinkMsg("luna_post_unboxing_2025", "left"),
            { type: "left", text: "❤️❤️❤️ Love you babe~ But seriously, don't get me anything this expensive next time 😘" },
            { type: "right", text: "I just thought it suited you so well~ But alright, I'll listen to you. Won't go this 'crazy' next time 🥺" },
            { type: "sys", text: "☎️ Video Call ended (01:12:05)" },

            { type: "sys", text: "Jan 15, 2026" },
            { type: "right", text: "I got the keyboard package!" },
            { type: "right", text: "I absolutely love it! Thank you baby ❤️❤️❤️" },
            { type: "left", text: "Yay so happy ~~" },
            { type: "right", text: "You're still a college student, you really don't need to buy me gifts." },
            { type: "right", text: "Just being with you makes me happy enough!" },
            { type: "left", text: "[Sticker: Love]" },

            { type: "sys", text: "Mar 05, 2026" },
            { type: "right", isImg: true, src: "https://images.unsplash.com/photo-1544592732-83bbd75bbec4?q=80&w=200" },
            { type: "right", text: "Babe, a good friend of mine from college is getting married in Thailand next month." },
            { type: "right", text: "Do you want to go together?" },
            { type: "right", text: "We could turn it into a vacation in Thailand~" },
            { type: "left", text: "Omg, I've always wanted to visit Thailand! Plus my classes next month are super boring anyway 😝" },
            { type: "right", text: "Awesome, I'll book our flights then." },
            { type: "right", text: "Can't wait for our Thailand trip." },
            { type: "left", text: "Can't wait to see you too~ ❤️" }
        ]
    },

    "user_lucas": {
        name: "程光", avatarColor: "#ff9800", avatarText: "Lucas",
        inChatList: false, // 👉 默认隐藏
        messages: [
            { type: "sys", text: "Apr 27, 2022" },
            { type: "right", text: "Hey Lucas, how've you been? Have you heard anything from Xin?" },
            { type: "left", text: "I'm doing good." },
            { type: "left", text: "I haven't been in touch with Xin for a long time either." },

            { type: "sys", text: "Oct 03, 2023" },
            { type: "right", text: "Bro, saw your new RG post. Did you settle down in Thailand?" },
            { type: "left", text: "Yeah bro. Found a new job in Thailand." },
            { type: "left", text: "Are you still in Mingzhou?" },
            { type: "right", text: "Yes, working at customs now." },
            { type: "left", text: "Nice, let's hit the courts at MUST next time you're back!" },

            { type: "sys", text: "Mar 04, 2026" },
            { type: "left", isImg: true, src: "assets/wedding.png" },
            { type: "left", text: "Hey Adam, I'm getting married in Thailand next month!" },
            { type: "left", text: "Would love to invite you and your partner to the wedding~" },
            { type: "right", text: "Omggg, congrats bro! Didn't expect you to be the first one to tie the knot out of the three of us!!" },
            { type: "right", text: "My girlfriend and I will definitely be there! Can't wait to see you guys~" }
        ]
    },

    "user_ryan": {
        name: "木心（💗）", avatarColor: "#607d8b", avatarText: "Xin",
        inChatList: false, // 👉 默认隐藏
        messages: [
            { type: "sys", text: "Jun 05, 2021" },
            { type: "sys", text: "You transferred ¥100,000.00 to 木心（💗）." },
            { type: "sys", text: "Transfer returned by 木心（💗）." }
        ]
    }
};

// --- 2. DATA: Contacts Directory (通讯录数据) ---
const contactsData = {
    "user_cousin": { 
        name: "陆白", avatarColor: "#4285f4", avatarText: "白", wechatId: "wxid_hfjs88", 
        signature: "Family first." 
    },
    "user_luna": { 
        name: "月 🌙", avatarColor: "#e91e63", avatarText: "🌙", wechatId: "LunaCarter1007", 
        signature: "Living my best life" 
    },
    "user_lucas": { 
        name: "程光", avatarColor: "#ff9800", avatarText: "Lucas", wechatId: "LUCAS_THE_TALL", 
        signature: "Work hard, play hard." 
    },
    "user_ryan": { 
        name: "木心（💗）", avatarColor: "#607d8b", avatarText: "Xin", wechatId: "XinWoodenHeart", 
        signature: "Dragon in da house. 🐉" 
    },
    "user_mom": { 
        name: "Mom", avatarColor: "#e57373", avatarText: "Mom", wechatId: "wxid_mom_home", 
        signature: "Blessed and grateful." 
    },
    "user_boss": { 
        name: "Mr. Henderson (Ex-Boss)", avatarColor: "#795548", avatarText: "Joe", wechatId: "henderson_logistics", 
        signature: "Logistics & Supply Chain Management." 
    },
    "user_landlord": { 
        name: "BKK Landlord", avatarColor: "#8d6e63", avatarText: "Tay", wechatId: "bkk_rent_01", 
        signature: "Rooms for rent. DM for inquiries." 
    },
    "user_airline": { 
        name: "Thai Airways HR", avatarColor: "#5c6bc0", avatarText: "Lily", wechatId: "tg_hr_recruit", 
        signature: "Smooth as silk." 
    },
    "user_adam": { 
        name: "陆原", avatarColor: "#333", avatarText: "Adam", wechatId: "Adam_99", 
        signature: "The misunderstood carry the vision of the future" 
    }
};

function renderChatList() {
    const listContainer = document.getElementById('chat-list-view');
    listContainer.innerHTML = ''; 
    for (const [id, data] of Object.entries(chatData)) {
        // 👉 新增：如果被标记为隐藏，则跳过渲染
        if (data.inChatList === false) continue;
        
        const lastMsg = data.messages.length > 0 ? data.messages[data.messages.length - 1] : null;
        let preview = 'No messages yet';
        
        if (lastMsg) {
            // 修复：兼容 isImg 属性
            if (lastMsg.isImg || lastMsg.type === 'img') preview = '[Image]';
            else if (lastMsg.xhsLink) preview = '[Link Shared]';
            else preview = lastMsg.text;
        }

        // 👉 新增：判断是否未读，生成对应的 class 字符串
        const unreadClass = data.unread ? ' unread' : '';

        listContainer.innerHTML += `
            <div class="contact-item${unreadClass}" id="contact-${id}" onclick="openChat('${id}')">
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

    // 👇 插入打点：记录玩家点开了谁的对话框 👇
    recordAction('WECHAT_OPEN_CHAT', { targetUser: userId });

    // 👉 新增：如果当前对话是未读状态，标记为已读并刷新左侧列表
    if (data.unread) {
        data.unread = false;
        renderChatList(); 
    }

    const container = document.getElementById('chat-messages');
    document.getElementById('active-chat-name').innerText = data.name;
    container.innerHTML = '';

    document.querySelectorAll('.contact-item').forEach(item => item.classList.remove('active'));
    document.getElementById(`contact-${userId}`).classList.add('active');

    const adamAvatarHTML = `<div class="msg-avatar" style="background:#333;">Adam</div>`;
    const contactAvatarHTML = `<div class="msg-avatar" style="background:${data.avatarColor}; cursor:pointer;" onclick="jumpToContactFromChat('${userId}')">${data.avatarText}</div>`;

    data.messages.forEach(msg => {
        if (data.messages.length === 0) {
            container.innerHTML = `<div class="system-msg">You are now connected. Start chatting!</div>`;
        } else {
            if (msg.type === 'sys') {
                container.innerHTML += `<div class="system-msg">${msg.text}</div>`;
                return;
            }

            let innerContent = '';
            // 修复：增加对 isImg 的判断
            if (msg.isImg || msg.type === 'img') {
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

            // 这里的判断现在能正确读取 type 里的 left/right 了
            const isLeft = msg.type === 'left';
            const rowAvatar = isLeft ? contactAvatarHTML : adamAvatarHTML;
            
            container.innerHTML += `
                <div class="msg-row ${isLeft ? 'left' : 'right'}">
                    ${isLeft ? rowAvatar : ''}
                    <div class="msg-content">${innerContent}</div>
                    ${!isLeft ? rowAvatar : ''}
                </div>
            `;
        }
    });

    container.scrollTop = container.scrollHeight;
}

// 从聊天界面点击头像跳转到联系人详情
function jumpToContactFromChat(userId) {
    // 1. 模拟点击左侧的“联系人”导航栏图标
    document.getElementById('nav-contacts').click();
    
    // 2. 渲染对应的联系人卡片
    showContactProfile(userId);
}

function showChatList() {
    document.getElementById('chat-detail-view').style.display = 'none';
    document.getElementById('chat-list-view').style.display = 'block';
}

// --- 微信侧边栏切换逻辑 ---
function switchWechatTab(tabId, element) {
    // 👇 插入打点：记录玩家在微信里切换了哪个底部 Tab 👇
    recordAction('WECHAT_TAB_SWITCH', { targetTab: tabId });
    // 隐藏所有分页
    document.querySelectorAll('.wechat-page').forEach(p => p.classList.remove('active'));
    // 激活对应分页
    document.getElementById('wechat-' + tabId).classList.add('active');

    // 更新侧边栏图标高亮状态
    document.querySelectorAll('.wechat-sidebar .nav-icon').forEach(i => i.classList.remove('active'));
    element.classList.add('active');

    // 触发对应界面的渲染
    if (tabId === 'contacts') renderContactsList();
    if (tabId === 'wallet') renderWallet();
}

// --- 联系人界面逻辑 ---
function renderContactsList() {
    const listContainer = document.getElementById('contacts-list-view');
    listContainer.innerHTML = ''; 
    
    // 改为遍历 contactsData 而不是 chatData
    for (const [id, data] of Object.entries(contactsData)) {
        listContainer.innerHTML += `
            <div class="contact-item" onclick="showContactProfile('${id}')">
                <div class="avatar" style="background:${data.avatarColor}">${data.avatarText}</div>
                <div class="contact-info">
                    <div class="contact-name">${data.name}</div>
                </div>
            </div>`;
    }
    // 在联系人列表最下方添加总数显示
    listContainer.innerHTML += `
        <div style="text-align: center; color: #999; font-size: 13px; padding: 20px 0; margin-top: 10px; border-top: 1px solid #eee;">
            583 contacts
        </div>
    `;
}

// 在右侧展示联系人详情
function showContactProfile(userId) {
    const data = contactsData[userId];
    // 👇 插入打点：记录玩家查看了谁的名片 👇
    recordAction('WECHAT_VIEW_PROFILE', { targetUser: userId });

    const detailContainer = document.getElementById('contacts-detail-view');
    
    // 如果没有配置签名，显示默认占位符
    const signatureText = data.signature ? `"${data.signature}"` : "No signature.";
    
    detailContainer.innerHTML = `
        <div style="text-align:center; background:#fff; padding: 40px; border-radius:8px; box-shadow:0 2px 10px rgba(0,0,0,0.05); width: 320px;">
            <div style="width:80px; height:80px; background:${data.avatarColor}; color:white; font-size:32px; font-weight:bold; display:flex; align-items:center; justify-content:center; border-radius:8px; margin: 0 auto 15px auto;">${data.avatarText}</div>
            <h2 style="margin:0 0 5px 0; color:#333;">${data.name}</h2>
            <p style="color:#999; font-size:13px; margin-bottom: 10px;">CallMe ID: ${data.wechatId}</p>
            <p style="color:#666; font-size:14px; margin-bottom: 30px; font-style: italic;">${signatureText}</p>
            <button onclick="jumpToChatFromContact('${userId}')" style="background:#07c160; color:white; border:none; padding:10px 40px; border-radius:4px; font-size:15px; font-weight:600; cursor:pointer; width: 100%;">Call Me</button>
        </div>
    `;
}

// 点击 "Message" 按钮跳转回对话列表
function jumpToChatFromContact(userId) {
    document.getElementById('nav-chats').click(); // 切换到对话Tab
    
    // 如果这个人不在聊天列表(chatData)里，我们就临时给他建一个空的聊天记录
    if (!chatData[userId]) {
        const cData = contactsData[userId];
        chatData[userId] = {
            name: cData.name,
            avatarColor: cData.avatarColor,
            avatarText: cData.avatarText,
            inChatList: true, // 👉 标记为显示
            messages: [] // 空聊天记录
        };
    } else {
        // 👉 如果已经在 chatData 中，说明有历史记录，将其解锁显示
        chatData[userId].inChatList = true;
    }
    
    renderChatList(); // 刷新左侧的对话列表，被解锁的对话就会出现了
    openChat(userId); // 打开聊天记录
}

// --- 钱包界面逻辑 ---
function renderWallet() {
    const list = document.getElementById('wallet-records');
    
    // 预设交易记录，完美契合剧情时间线：给Ryan的转账以及给Luna买包的消费
    const records = [
        { title: "Salary Incoming", time: "Aug 10, 2025 18:00", amount: "+25,000.00", type: "positive", status: "Success" },
        { title: "Transfer to Mon", time: "Jan 29, 2025 09:15", amount: "-5,000.00", type: "negative", status: "Success" },
        { title: "Salary Incoming", time: "Sep 10, 2023 18:00", amount: "+15,000.00", type: "positive", status: "Success" },
        { title: "Salary Incoming", time: "Oct 10, 2022 18:00", amount: "+7,500.00", type: "positive", status: "Success" },
        { title: "Refund from Xin", time: "Jun 06, 2021 09:15", amount: "+100,000.00", type: "positive", status: "Success" },
        { title: "Transfer to Xin", time: "Jun 05, 2021 14:30", amount: "-100,000.00", type: "negative", status: "Returned" },
    ];

    list.innerHTML = '';
    records.forEach(r => {
        // 如果状态是退回，给标题加上红色提示
        let statusTag = r.status === 'Returned' ? '<span style="color:#d93025; font-size:12px; margin-left:8px;">(Returned)</span>' : '';
        
        list.innerHTML += `
            <div class="wallet-item">
                <div class="wallet-item-left">
                    <span class="wallet-item-title">${r.title} ${statusTag}</span>
                    <span class="wallet-item-time">${r.time}</span>
                </div>
                <div class="wallet-item-amount ${r.type}">${r.amount}</div>
            </div>
        `;
    });
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
    recordAction('OPEN_APP', { appId: id });
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

    // 如果是加密信息窗口，直接拦截，不执行关闭逻辑
    if (id === 'win-secret-msg' && gameState.foundFaceMatch) {
        console.log("System error: Process 'sys_enc_ch.exe' cannot be terminated.");
        return; 
    }

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

// --- 小红书统一后退逻辑 ---
function goXhsBack() {
    // 1. 弹出当前页面状态
    if (xhsHistoryStack.length > 0) {
        xhsHistoryStack.pop();
    }

    // 2. 隐藏所有的详情与私信页面，防止层级遮挡
    document.getElementById('xhs-detail').style.display = 'none';
    document.getElementById('xhs-external-user').style.display = 'none';
    document.getElementById('xhs-dm-view').style.display = 'none';

    // 3. 暂停可能正在播放的视频
    const vidEl = document.getElementById('xhs-detail-video');
    if (vidEl) vidEl.pause();

    // 4. 如果栈里还有页面，重新渲染栈顶页面
    if (xhsHistoryStack.length > 0) {
        const prevState = xhsHistoryStack[xhsHistoryStack.length - 1];
        if (prevState.type === 'post') {
            openXhsDetail(prevState.id, true);
        } else if (prevState.type === 'user') {
            openXhsUser(prevState.id, true);
        } else if (prevState.type === 'dm') {
            openXhsDm(prevState.id, true);
        }
    }
}

// --- 小红书标签切换逻辑 ---
// function switchXhsTab(pageId, navElement) {
//     // 隐藏所有页面
//     document.querySelectorAll('.xhs-page').forEach(p => p.classList.remove('active'));
//     // 取消所有导航激活状态
//     document.querySelectorAll('.xhs-nav-item').forEach(n => n.classList.remove('active'));
    
//     // 激活当前选中的页面和导航
//     document.getElementById(pageId).classList.add('active');
//     navElement.classList.add('active');
// }

function switchXhsTab(pageId, navElement) {
    // 1. 隐藏所有页面（移除 active 类）
    document.querySelectorAll('.xhs-page').forEach(p => {
        p.classList.remove('active');
    });
    
    // 2. 取消所有导航图标的高亮
    document.querySelectorAll('.xhs-nav-item').forEach(n => {
        n.classList.remove('active');
    });
    
    // 3. 显示目标页面并高亮对应图标
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    navElement.classList.add('active');
}


// 辅助函数：统一生成帖子 HTML 结构
function createXhsPostHTML(postId) {
    const post = xhsPostData[postId];
    if (!post) return '';
    // 统一取第一行作为标题
    const titleText = post.text.split('\n')[0]; 
    return `
        <div class="xhs-post" onclick="openXhsDetail('${postId}')">
            <img src="${post.img}" alt="post">
            <div class="xhs-post-title">${titleText}</div>
        </div>`;
}

// 1. 修改首页渲染
function renderXhsHomeFeed() {
    const feedContainer = document.querySelector('#xhs-home .xhs-feed');
    if (!feedContainer) return;
    feedContainer.innerHTML = ''; 
    const homePosts = ['post_work_1', 'post_heart_1', 'post_thai_3', 'post_photo_1', 'post_game_1', 'post_psych_1', 'post_news_adam','post_thai_5', 'post_heart_3'];
    homePosts.forEach(postId => {
        feedContainer.innerHTML += createXhsPostHTML(postId);
    });
}

// 2. 修改“我”的页面渲染
function renderAdamProfileFeed() {
    const feedContainer = document.getElementById('xhs-my-feed');
    if (!feedContainer) return;
    feedContainer.innerHTML = '';
    const adamData = xhsUsers["adam"];
    adamData.posts.forEach(postId => {
        feedContainer.innerHTML += createXhsPostHTML(postId);
    });
}




// --- 渲染 Adam 自己的个人主页帖子 ---
// function renderAdamProfileFeed() {
//     const feedContainer = document.getElementById('xhs-my-feed');
//     if (!feedContainer) return;
    
//     feedContainer.innerHTML = '';
//     const adamData = xhsUsers["adam"];
    
//     adamData.posts.forEach(postId => {
//         const post = xhsPostData[postId];
//         if (post) {
//             feedContainer.innerHTML += `
//                 <div class="xhs-post" onclick="openXhsDetail('${postId}')">
//                     <img src="${post.img}" alt="post">
//                     <div class="xhs-post-title">${post.text.substring(0, 30)}...</div>
//                 </div>`;
//         }
//     });
// }
// --- 渲染 "我" (Adam) 的个人主页 Feed ---




// // --- 小红书私信对话数据 ---
// const xhsDMs = {
//     "ryan": {
//         name: "Deactivated Account", avatar: "", // 空白代表默认灰色
//         messages: [
//             { type: "sys", text: "3 years ago" },
//             { type: "right", text: "Please, just let me explain. I didn't mean for this to happen." },
//             { type: "right", text: "I'm so sorry. Answer me." },
//             { type: "left", text: "Don't ever contact me again. I will never forgive you." }
//         ]
//     },
//     "luna": {
//         name: "Luna_99", avatar: "assets/Luna1.png",
//         messages: [
//             { type: "sys", text: "Today" },
//             { type: "left", text: "Did you see my new post? 🥰" },
//             { type: "right", text: "Yes babe, looks amazing." }
//         ]
//     }
// };
// --- 小红书私信对话数据 ---
const xhsDMs = {
    "luna": {
        name: "🌙 YUE 🌙", avatar: "assets/Luna1.png",
        messages: [
            { type: "sys", text: "2025.10.3" },
            { type: "right", text: "You can try adding fewer Thai chilies first. Peppercorns just give that numbing sensation to your lips." },
            { type: "right", text: "Feel free to ask me anything you don't understand." },
            { type: "left", text: "Got it! 🙏" },
            { type: "sys", text: "2025.10.6" },
            { type: "right", text: "Did you try making the Mapo Tofu yet?" },
            { type: "left", text: "Not yet, school has been so busy lately." },
            { type: "right", text: "Oh, what's your major?" },
            { type: "left", text: "Game Design" },
            { type: "right", text: "Sounds interesting! 😊" },
            { type: "left", text: "I also really love Chinese tea culture." },
            { type: "right", text: "What kind of tea do you like? Our Mingzhou green tea is very famous~" },
            { type: "left", text: "OMG~ You're from Mingzhou? I've always wanted to visit that city!" },
            { type: "right", text: "Next time you come to Mingzhou, I'll show you around and we can grab some great food together~ 🥰" }
        ]
    },
    "work_hard": {
        name: "KeepRunning", avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        messages: [
            { type: "sys", text: "2025.8.11" },
            { type: "right", text: "Hey, where did you get the workout outfit in your latest post? They look great! 🤩" }
        ]
    },
    "felin": {
        name: "FELIN", avatar: "https://randomuser.me/api/portraits/women/22.jpg",
        messages: [
            { type: "sys", text: "2025.9.3" },
            { type: "right", text: "Hey there, what camera model are you using? The photos have such a nice texture! 🥰" },
            { type: "left", text: "Thanks~ It's the SOFU X56." },
            { type: "right", text: "Wow, would you be down for a photoshoot together later?" },
            { type: "right", text: "Hello?" }
        ]
    },
    "ryan": {
        name: "Deactivated Account", avatar: "", 
        messages: [
            { type: "sys", text: "5 years ago" },
            { type: "right", text: "Please, just let me explain. I didn't mean for this to happen." },
            { type: "right", text: "I'm so sorry. Please answer me." },
            { type: "left", text: "Don't ever contact me again. I will never forgive you." }
        ]
    }
};

function openXhsDetail(postId, isBack = false) {
    const data = xhsPostData[postId];
    if (!data) return;

    // 👇 插入这行 👇
    recordAction('XHS_VIEW_POST', { postId: postId, isBack: isBack });

    // 推入历史栈
    if (!isBack) {
        xhsHistoryStack.push({ type: 'post', id: postId });
    }

    // 获取图片和视频的 DOM 元素
    const imgEl = document.getElementById('xhs-detail-img');
    const vidEl = document.getElementById('xhs-detail-video');

    // ✨ 核心逻辑 1：先清理上一次打开帖子时可能遗留的下载按钮
    const existingBtn = document.getElementById('dynamic-xhs-download-btn');
    if (existingBtn) {
        existingBtn.remove();
    }

    if (data.isVideo) {
        imgEl.style.display = 'none';
        vidEl.style.display = 'block';
        vidEl.src = data.videoSrc; 
    } else {
        vidEl.style.display = 'none';
        vidEl.pause(); 
        imgEl.style.display = 'block';
        imgEl.src = data.img; 

        // ✨ 核心逻辑 2：如果该帖子数据中有 downloadId，动态创建并插入下载按钮
        if (data.downloadId) {
            // 确保图片的父容器有相对定位，这样绝对定位的按钮才能附着在图片上
            imgEl.parentElement.style.position = 'relative';

            const btn = document.createElement('button');
            btn.id = 'dynamic-xhs-download-btn';
            btn.className = 'minimal-download-btn'; // 使用你之前定义的极简透明样式
            btn.title = 'Download Photo';
            btn.onclick = () => triggerDownload(data.downloadId);
            
            // 插入 SVG 图标
            btn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
            `;
            
            // 将按钮添加到图片旁边
            imgEl.parentElement.appendChild(btn);
        }
    }

    // 填充文本信息
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
            let audioHTML = '';
            if (c.isAudio && c.audioSrc) {
                audioHTML = `<div style="margin-top: 6px;"><audio controls src="${c.audioSrc}" style="height: 32px; width: 100%; max-width: 220px; outline: none;"></audio></div>`;
            }
            commentsContainer.innerHTML += `
                <div class="xhs-comment-item">
                    <div class="xhs-msg-avatar" 
                         onclick="jumpToUserFromComment('${c.user}')" 
                         style="width:28px; height:28px; margin-right:10px; background:${cAvatar}; cursor:pointer; border-radius:50%;">
                    </div>
                    <div class="xhs-comment-right">
                        <div class="xhs-comment-user" 
                             onclick="jumpToUserFromComment('${c.user}')" 
                             style="cursor:pointer; font-weight:600; color:#666; font-size:12px;">${c.user}</div>
                        <div class="xhs-comment-text" style="color:#333; margin-bottom:4px;">
                            ${c.text}
                            ${audioHTML}
                        </div>
                        <div class="xhs-comment-meta" style="font-size:10px; color:#bbb;"><span>${c.time}</span></div>
                    </div>
                </div>`;
        });
    } else {
        commentsContainer.innerHTML = '<div style="color:#999; font-size:12px; text-align:center;">No comments yet.</div>';
    }

    const win = document.getElementById('win-xhs');
    win.style.display = 'flex';
    win.style.zIndex = ++zIndex;

    const detailWin = document.getElementById('xhs-detail');
    detailWin.style.display = 'flex';
    detailWin.style.zIndex = ++zIndex;
}


function closeXhsDetail() {
    document.getElementById('xhs-detail').style.display = 'none';
}

// 渲染私信对话 (蓝白气泡 + 圆头像)
function openXhsDm(userId, isBack = false) {
    const data = xhsDMs[userId];
    if (!data) return;

    if (!isBack) {
        xhsHistoryStack.push({ type: 'dm', id: userId });
    }

    document.getElementById('xhs-dm-name').innerHTML = `<span style="cursor:pointer;" onclick="openXhsUser('${userId}')">${data.name}</span>`;
    
    const container = document.getElementById('xhs-dm-messages');
    container.innerHTML = '';

    const adamXhsAvatar = `background-image: url('assets/Adam.png')`;
    const targetXhsAvatar = data.avatar ? `background-image: url('${data.avatar}')` : `background-color: #ccc;`;
    
    data.messages.forEach(msg => {
        if(msg.type === 'sys') {
            container.innerHTML += `<div class="system-msg">${msg.text}</div>`;
            return;
        }

        const isLeft = msg.type === 'left';
        const avatarStyle = isLeft ? targetXhsAvatar : adamXhsAvatar;
        
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

    const dmView = document.getElementById('xhs-dm-view');
    dmView.style.display = 'flex';
    dmView.style.zIndex = ++zIndex; 
    container.scrollTop = container.scrollHeight;
}

// 验证小红书私信密码
function checkXhsMsgPassword() {
    const input = document.getElementById('xhs-msg-pwd-input').value;
    
    // 如果你最后决定用1994，请在这里把 1999 改成 1994
    if (input === '1999') {
        // 密码正确：更新状态并存档
        gameState.xhsMsgUnlocked = true;
        saveGame();
        
        // 切换 UI
        updateXhsMsgView();
    } else {
        // 密码错误：提示并震动
        const error = document.getElementById('xhs-msg-pwd-error');
        error.innerText = "Verification failed. Incorrect birth year.";
        const inputField = document.getElementById('xhs-msg-pwd-input');
        inputField.style.animation = "shake 0.3s";
        setTimeout(() => inputField.style.animation = "", 300);
    }
}

// 根据存档状态更新小红书私信界面的显示
function updateXhsMsgView() {
    const lockScreen = document.getElementById('xhs-msg-lock-screen');
    const msgList = document.getElementById('xhs-msg-list-container');
    
    if (gameState.xhsMsgUnlocked) {
        lockScreen.style.display = 'none';
        msgList.style.display = 'block';
    } else {
        lockScreen.style.display = 'flex';
        msgList.style.display = 'none';
    }
}

// 新增：渲染并打开他人主页
function openXhsUser(userId, isBack = false) {
    const user = xhsUsers[userId];
    if (!user) return;

    if (!isBack) {
        xhsHistoryStack.push({ type: 'user', id: userId });
    }

    document.getElementById('xhs-up-name').innerText = user.name;
    document.getElementById('xhs-up-id').innerText = `ID: ${user.id}`;
    document.getElementById('xhs-up-avatar').style.background = user.avatar ? `url('${user.avatar}') center/cover` : '#ccc';
    document.getElementById('xhs-up-posts').innerText = user.stats.posts;
    document.getElementById('xhs-up-followers').innerText = user.stats.followers;
    document.getElementById('xhs-up-following').innerText = user.stats.following;
    document.getElementById('xhs-up-bio').innerHTML = user.bio;

    const feedContainer = document.getElementById('xhs-up-feed');
    feedContainer.innerHTML = '';
    user.posts.forEach(postId => {
        const post = xhsPostData[postId];
        if (post) {
            feedContainer.innerHTML += `
                <div class="xhs-post" onclick="openXhsDetail('${postId}')">
                    <img src="${post.img}" alt="post">
                    <div class="xhs-post-title">${post.text.split('\n')[0]}</div>
                </div>`;
        }
    });
   
    const userWin = document.getElementById('xhs-external-user');
    userWin.style.display = 'flex';
    userWin.style.zIndex = ++zIndex;
}

function closeXhsUser() {
    document.getElementById('xhs-external-user').style.display = 'none';
}

// --- 跨应用跳转：从浏览器打开小红书帖子 ---
function jumpToXhsFromBrowser(postId) {
    // 1. 打开小红书应用窗口
    openWindow('win-xhs');
    
    // 2. 延迟执行详情页渲染，确保窗口已经完全显示
    setTimeout(() => {
        openXhsDetail(postId);
    }, 100);
}

// --- 浏览器数据 ---
const browserData = {
    // 预设的历史记录 (埋藏剧情线索)

    history: [
        { time: "04.05 14:20", title: "Currency Converter (THB/CNY)", url: "www.xe.com/currencyconverter" },
        { time: "04.02 18:45", title: "Bangkok Expats Forum", url: "www.bkk-expats.com/thread/7721" },
        { time: "03.04 23:45", title: "DeepScan AI - Face Comparison", url: "www.deepscan-ai.com/biometrics", clickAction: "navBrowser('facematch')" },
        
    ],



    // 预设的收藏夹
    bookmarks: [
        // 👇 就是这行，加一个健康百科的假书签
        { title: "Health", icon: "🏥", url: "www.wikihealth.org" },
       // 1. 食谱网站 (点击仅改变地址栏，无实际页面跳转)
       { title: "Daily Recipes", icon: "🍳", url: "www.daily-recipes.com" },
       // 2. 机场信息网站 (点击仅改变地址栏，无实际页面跳转)
       { title: "Mingzhou Airport Info", icon: "✈️", url: "www.mz-airport.com" },
       // 3. 算命网站 (保留不变)
       { title: "Destiny Finder", icon: "☯️", id: "divination", url: "www.fate-unveiled.com" }
    ],
    
    // 搜索引擎关键词数据库 (可以配置多个关键词触发同一结果)
    searchDatabase: {

        "year of the monkey, monkey year": [
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
            // 1. 维基百科 (干扰项)
            { 
                url: "en.wikipedia.org/wiki/Adam", 
                title: "Adam - Wikipedia", 
                snippet: "Adam is a figure in the Book of Genesis in the Hebrew Bible, and in the Quran and Christian belief. According to the creation myth of the Abrahamic religions, he was the first human...",
                clickAction: "navBrowser('wiki-adam')"
            },
            // 2. 深度学习优化算法 (干扰项)
            { 
                url: "machinelearningmastery.com/adam-optimization-algorithm", 
                title: "A Gentle Introduction to the Adam Optimization Algorithm", 
                snippet: "Adam is an optimization algorithm that can be used instead of the classical stochastic gradient descent procedure to update network weights iterative based in training data...",
                clickAction: "navBrowser('algo-adam')"
            },
            // // 3. 曼谷死亡新闻报道 (核心剧情线索！)
            // { 
            //     url: "www.bkk-daily.com/news/tourist-incident", 
            //     title: "Tragic Incident: Foreign Guest Found Dead at Wedding Venue", 
            //     snippet: "Local authorities are investigating the sudden death of 32-year-old Adam at a wedding venue. Preliminary reports suggest a suspected overdose... traveled with his girlfriend, Luna...",
            //     clickAction: "navBrowser('news-adam')"
            // },
            // 4. LinkedIn 档案 (职业线索)
            // { 
            //     url: "www.linkedin.com/in/adam-operations", 
            //     title: "Adam - Airport Operations Supervisor - LinkedIn", 
            //     snippet: "Experienced Operations Supervisor with a demonstrated history of working in the aviation and airport industry. Skilled in logistics and passenger safety.",
            //     clickAction: "navBrowser('linkedin-adam')"
            // },
            // 5. 乱七八糟的干扰项 - 同名电影
            { 
                url: "www.imdb.com/title/tt1184698", 
                title: "Adam (2009) - IMDb", 
                snippet: "Directed by Max Mayer. With Hugh Dancy, Rose Byrne, Peter Gallagher. Adam, a lonely man with Asperger's Syndrome, develops a relationship with his upstairs neighbor...",
                clickAction: ""
            },
            // 6. 乱七八糟的干扰项 - 男士理容品牌
            { 
                url: "www.adam-grooming.com", 
                title: "ADAM | Premium Men's Grooming & Barbershop", 
                snippet: "Discover the ADAM experience. Elevate your daily routine with our premium grooming products, from beard oils to revitalizing face washes. Book an appointment today.",
                clickAction: ""
            }
        ],

        // 大学搜索结果
        "mingzhou university of science and technology, mingzhou university": [
            { 
                url: "en.mingzhou.edu.cn", 
                title: "Mingzhou University of Science and Technology (MUST)", 
                snippet: "Welcome to MUST. A premier institution in engineering, applied sciences, and technology, dedicated to fostering global innovators since 1952.",
                clickAction: "navBrowser('uni')" 
            },
            { 
                url: "en.mingzhou.edu.cn/alumni/newsletter-2015", 
                title: "Alumni Archive: Fall 2015 Highlights - MUST", 
                snippet: "Celebrating the outstanding achievements of our Engineering cohort. Read about the National CAD Design Competition and student updates...",
                clickAction: "navBrowser('uni')" 
            },
            { 
                url: "www.campus-forum.cn/thread/9921", 
                title: "Is the workload at Mingzhou Tech really that insane? - Campus Forum", 
                snippet: "Freshman here. Heard the exams at MUST are brutal. Someone told me a senior literally passed out from exhaustion a few years ago...",
                clickAction: "" 
            }
        ],
        // 普通搜索 "novacard" 的结果（隐藏真实线索，提供背景设定）
        "novacard": [
            { 
                url: "www.wikihealth.org/novacard", 
                title: "Novacard (Medication) - MikiHealth", 
                snippet: "Novacard is a prescription medication primarily used to treat chronic cardiac arrhythmias. <strong>Warning:</strong> The authentic pills are small, blue, and hexagonal.",
                clickAction: ""
            },
            // 新增脑洞1：药店购买页面（强调它作为心脏病药的常规属性）
            { 
                url: "www.cardio-care-pharmacy.com/products/novacard", 
                title: "Order Novacard Online | CardioCare Pharmacy", 
                snippet: "Buy Novacard with a valid prescription. Learn about dosage instructions, precautions, and drug interactions. Always consult your cardiologist before starting treatment.",
                clickAction: ""
            },
            // 新增脑洞2：医药论坛的普通讨论（强调正版药是蓝色的，降低防备）
            { 
                url: "www.medforum.com/discussions/heart-health/novacard-questions", 
                title: "Anyone else taking Novacard? Side effects? - MedForum", 
                snippet: "I recently started taking Novacard for my irregular heartbeat. Does anyone else get mild headaches in the first week? Also, the blue pills are kind of hard to swallow.",
                clickAction: ""
            }
        ],

        // 进阶搜索 "novacard white" 的结果（核心真相爆发）
        "novacard white, white novacard, novacard white pill": [
            // 原有的小红书线索（移到这里）
            { 
                url: "www.RedGram.com/explore/luna_burner_sos", 
                title: "Is this normal? Found Novacard in my friend's bag... - RedGram", 
                snippet: "2 days ago — I found this <strong>Novacard</strong> bottle in my friend's bag. But the pills inside are white and round, not blue.",
                clickAction: "jumpToXhsFromBrowser('luna_burner_sos')"
            },
            // 新增：点击跳转假新闻页面（假药的致命警告）
            { 
                url: "www.medical-times.com/alerts/counterfeit-novacard-warning", 
                title: "WARNING: Counterfeit 'White Novacard' Linked to Fatalities", 
                snippet: "Authorities warn of a dangerous counterfeit drug disguised as Novacard. These round white pills contain a potent sedative causing severe dizziness, coma, and death...",
                clickAction: ""
            },
            // 新增脑洞3：药品识别网的查无此药（从侧面印证这根本不是治疗药，而是毒药）
            { 
                url: "www.pill-identifier.org/search?color=white&shape=round&imprint=novacard", 
                title: "Pill Identifier: White Round Pill 'Novacard' - 0 Matches", 
                snippet: "Search Results for 'White, Round, Novacard'. <strong>0 matches found.</strong> If you possess a white round pill labeled as Novacard, DO NOT consume it. Authentic Novacard is strictly blue.",
                clickAction: ""
            }
        ],

        // ▼▼▼ 新增：SF Express 搜索结果 ▼▼▼
        "sf express, sf-express, sf": [
            { 
                url: "www.global-express.com/track", 
                title: "Global Express Track - Official Site", 
                snippet: "Track your international and domestic shipments in real-time. Enter your tracking number (e.g., SF-1001) to check the latest logistics status.",
                clickAction: "navBrowser('tracking')" // 点击直接跳转到你写好的物流查询页面
            },
            // 添加一个干扰项，增加真实感
            {
                url: "www.sf-logistics-forum.com/rates",
                title: "Shipping Rates & Delivery Times - SF Express",
                snippet: "Calculate shipping rates and estimated delivery times for your packages. Check our updated price list for Southeast Asia routes.",
                clickAction: "" 
            }
        ],

        // ▼▼▼ 第一层：只搜名字 (获得社会身份和干扰项) ▼▼▼
        "lucas cheng, lucas": [
            // 剧情关联：大学官网校友访谈
            { 
                url: "www.mingzhou.edu.cn/alumni/lucas-cheng", 
                title: "Alumni Spotlight: Lucas Cheng ('16) - MUST", 
                snippet: "Rebuilding Lives through Architecture: An Interview with Lucas Cheng ('16). MUST provided the structural foundation for my mind...",
                // 注意：记得在 HTML 里把你原本写的 chris 访谈页面 ID/文字改成 lucas
                clickAction: "navBrowser('uni-chris-interview')" 
            },
            // 干扰项：同名房产经纪人
            { 
                url: "www.zillow.com/profile/LucasChengRealEstate", 
                title: "Lucas Cheng - Real Estate Agent in Seattle, WA", 
                snippet: "Looking for your dream home? Lucas Cheng has over 10 years of experience in the Seattle real estate market. Contact me today for a free consultation.",
                clickAction: "" 
            },
            // 干扰项：同名学术教授
            { 
                url: "scholar.google.com/citations?user=lucascheng", 
                title: "Lucas Cheng - Google Scholar Citations", 
                snippet: "Professor of Materials Science. Carbon Nanotubes, Graphene, Nanomaterials. Cited by 12,405. 'Synthesis of high-quality graphene...', Nature, 2018.",
                clickAction: "" 
            }
        ],

        // ▼▼▼ 第二层：极光 (触发核心隐藏线索) ▼▼▼
        "Our Eternal Aurora": [
            // 核心线索：情侣博客网站
            { 
                url: "www.aurora-love-forever.com", 
                title: "Our Eternal Aurora - H&L", 
                snippet: "Welcome to our digital diary. A place where Hope and Lucas keep their most precious memories, from Bangkok to Iceland...",
                clickAction: "navBrowser('couple-login')" 
            },
            // 伪装的干扰项：让搜索结果看起来像一个真实的页面合集
            { 
                url: "www.travel-blog.com/iceland-aurora-guide", 
                title: "Chasing the Aurora in Iceland - Travel Guide", 
                snippet: "Tips for photographing the Northern Lights. Recommended by architect and travel enthusiast Lucas Cheng. Make sure to check the weather forecast...",
                clickAction: "" 
            }
        ],


    }
};

// --- 浏览器逻辑 ---

// --- 更新后的导航函数，支持后退栈、动态标题和真实 URL ---
function navBrowser(viewId, isBack = false) {

    recordAction('BROWSER_NAV', { viewId: viewId, isBack: isBack });
    // 1. 记录历史栈
    if (!isBack && currentBrowserPage !== viewId) {
        browserHistoryStack.push(currentBrowserPage);
    }
    currentBrowserPage = viewId;

    // 2. 切换 UI 视图
    document.querySelectorAll('.browser-page').forEach(page => page.classList.remove('active'));
    document.getElementById(`browser-${viewId}`).classList.add('active');
    
    // 3. 更新地址栏和窗口标题
    const urlBar = document.getElementById('browser-url');
    let currentTitle = "New Tab";

    if (viewId === 'home') {
        urlBar.value = "www.google.com"; // 修改 1：始终显示真实网址
        currentTitle = "Google";
    }
    else if (viewId === 'history') {
        urlBar.value = "chrome://history";
        currentTitle = "History";
        renderHistory(); 
    }
    else if (viewId === 'results') {
        // 地址栏已在 executeSearch 中更新，这里只改标题
        currentTitle = document.getElementById('main-search-input').value + " - Google Search";
    }
    else if (viewId === 'tracking') {
        urlBar.value = "www.global-express.com/track";
        currentTitle = "Global Express Track";
    }

    // Adam 相关的多个页面
    else if (viewId === 'news-adam') {
        urlBar.value = "www.bkk-daily.com/news/tourist-incident";
        currentTitle = "BKK Daily News";
    }
    else if (viewId === 'wiki-adam') {
        urlBar.value = "en.wikipedia.org/wiki/Adam";
        currentTitle = "Adam - Wikipedia";
    }
    else if (viewId === 'algo-adam') {
        urlBar.value = "machinelearningmastery.com/adam-optimization-algorithm";
        currentTitle = "Adam Optimization Algorithm";
    }
    else if (viewId === 'linkedin-adam') {
        urlBar.value = "www.linkedin.com/in/adam-operations";
        currentTitle = "Adam - LinkedIn";
    }

    else if (viewId === 'zodiac-monkey') {
        urlBar.value = "www.google.com/search?q=Year+of+the+Monkey";
        currentTitle = "Year of the Monkey - Search";
    }

    else if (viewId === 'couple-login') {
        // ✨ 如果已经解锁，直接重定向到主页，不再显示登录框
        if (gameState.unlockedCoupleSite) {
            navBrowser('couple-main', true); 
            return;
        }
        urlBar.value = "www.aurora-love-forever.com/login";
        currentTitle = "Our Eternal Aurora";
    }
    else if (viewId === 'couple-main') {
        urlBar.value = "www.aurora-love-forever.com/home";
        currentTitle = "Our Eternal Aurora - Home";
    }
    else if (viewId === 'divination') {
        urlBar.value = "www.fate-unveiled.com";
        currentTitle = "Destiny Finder";
    }

    // 在 navBrowser 函数内部的 if/else 链中添加
    else if (viewId === 'facematch') {
        urlBar.value = "www.deepscan-ai.com/biometrics";
        currentTitle = "DeepScan AI - Biometric Analysis";
    }

    else if (viewId === 'uni') {
        urlBar.value = "www.mingzhou.edu.cn";
        currentTitle = "Mingzhou University of Science and Technology";
    }
    else if (viewId === 'must-chris-interview') {
        urlBar.value = "www.mingzhou.edu.cn/alumni/chris-henderson";
        currentTitle = "Alumni Spotlight - Chris";
    }


    // 4. 更新浏览器顶部的窗口标题
    const browserWin = document.getElementById('win-browser');
    if (browserWin) {
        const titleEl = browserWin.querySelector('.win-title');
        if (titleEl) {
            titleEl.innerText = currentTitle;
        }
    }

    // ✨ 5. 新增：更新浏览器内部标签页的名字 ✨
    const tabTitleEl = document.getElementById('browser-tab-title');
    if (tabTitleEl) {
        // 如果名字太长，在标签页里可以截断一下，比如只显示前 15 个字符
        tabTitleEl.innerText = currentTitle.length > 20 ? currentTitle.substring(0, 20) + '...' : currentTitle;
    }
}

// --- 浏览器导航堆栈逻辑 ---
let browserHistoryStack = [];
let currentBrowserPage = 'home'; // 默认初始页面是 home

// 执行后退操作
function goBrowserBack() {
    if (browserHistoryStack.length > 0) {
        // 弹出上一页的 ID
        const prevPage = browserHistoryStack.pop();
        // 调用导航函数，并标记 isBack 为 true，防止无限套娃压栈
        navBrowser(prevPage, true); 
    }
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

    // 👇 插入这段：记录搜索词，便于后续分析信噪比和语义偏离 👇
    recordAction('SEARCH', { 
        query: query, 
        isFromResultsPage: fromResultsPage
    });

    // 同步输入框和地址栏
    document.getElementById('main-search-input').value = query;
    document.getElementById('result-search-input').value = query;
    document.getElementById('browser-url').value = `www.google.com/search?q=${encodeURIComponent(query)}`;

    // 记录历史
    // browserData.history.unshift({ time: "Just now", title: `${query} - Google Search`, url: document.getElementById('browser-url').value });

    const container = document.getElementById('search-results-list');
    container.innerHTML = '';
    let results = [];
    
    // 关键词精准匹配 (支持多对一)
    for (const [keysString, value] of Object.entries(browserData.searchDatabase)) {
        // 将键名按逗号拆分成数组，并去除两端多余空格
        const validKeys = keysString.split(',').map(k => k.trim().toLowerCase());
        
        // 只有当玩家输入的 query 【完全等于】数组中的某一个词时，才算匹配成功
        if (validKeys.includes(query)) {
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

// --- 打开 Downloads 文件夹 ---
function openDownloadsFolder(folderName) {
    // 隐藏主视图
    document.getElementById('files-main-view').style.display = 'none';
    
    // 显示下载文件夹的内容
    document.getElementById('downloads-content-view').style.display = 'flex';
    
    // 更新顶部的地址栏
    document.getElementById('current-folder-path').innerText = "My Documents > " + folderName;
}
// --- 1. 新增数据：Ryan 文件夹内容 ---
const ryanFolderData = {
    password: "20000315",
    files: [
        { type: "img", name: "IMG_0821.jpg", url: "assets/hands/hand1.jpg" }, 
        { type: "img", name: "IMG_0822.jpg", url: "assets/hands/hand2.jpg" }, 
        { type: "img", name: "IMG_0910.jpg", url: "assets/hands/hand3.jpg" }, 
        { type: "img", name: "IMG_1105.jpg", url: "assets/hands/hand4.jpg" }, 
        { type: "img", name: "IMG_0518.jpg", url: "assets/hands/hand5.jpg" }, 
        { type: "img", name: "IMG_0210.jpg", url: "assets/hands/hand6.jpg" }, 
        { type: "img", name: "IMG_0309.jpg", url: "assets/hands/hand7.jpg" }, 
    ]
};

// --- 2. 新增功能函数 ---
// 显示密码输入框 (如果已解锁则直接进入)
function showRyanPasswordPrompt(element) {
    // 更新路径显示
    const folderName = element.querySelector('.icon-name').innerText;
    document.getElementById('current-folder-path').innerText = "My Documents > " + folderName;

    document.getElementById('files-main-view').style.display = 'none';

    // 判断存档：如果已解锁，直接渲染并显示内容
    if (gameState.unlockedRyanFolder) {
        renderRyanContent();
    } else {
        // 未解锁，显示密码输入界面
        document.getElementById('ryan-password-screen').style.display = 'flex';
    }
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
    const isCorrect = (input === ryanFolderData.password);
    
    // 👇 插入打点 👇
    recordAction('PWD_ATTEMPT_RYAN', { input: input, success: isCorrect });
    if (input === ryanFolderData.password) {
        // 密码正确：更新存档状态
        gameState.unlockedRyanFolder = true;
        saveGame();
        
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

// --- 专门用于打开并渲染回收站小票的函数 ---
function openReceiptPreview() {
    const previewWin = document.getElementById('win-preview');
    
    // 小票恢复原本的窄屏 340px
    previewWin.style.width = '340px';
    previewWin.style.height = '480px';

    // 获取存放内容的容器
    const contentArea = previewWin.querySelector('.title-bar').nextElementSibling;
    
    // 彻底清空内容，并恢复小票专属的背景样式
    contentArea.innerHTML = '';
    contentArea.style = "background:#333; flex:1; overflow:auto; display:flex; justify-content:center; padding-top:20px;";
    
    // 重新注入小票的完整 HTML 结构
    contentArea.innerHTML = `
        <div class="receipt-paper">
            <div style="text-align:center; border-bottom:2px dashed #333; padding-bottom:10px; margin-bottom:10px;">
                <h3>RECEIPT</h3>
                <p style="font-size:10px">Guangzhou Logistics Center</p>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:5px;">
                <span>Date: 2023-10-01</span>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:5px; background: yellow; color:black; font-weight:bold;">
                <span>TRACKING NO:</span><span>SF-8823</span>
            </div>
            
            <div style="text-align: center; font-size: 9px; color: #666; margin-top: 5px; margin-bottom: 10px;">
                (Search 'SF Express' to check the tracking status)
            </div>
            <hr style="border-top:1px dashed #ccc; margin:10px 0;">
            <div style="font-weight:bold; font-size:12px; margin-bottom:5px;">ITEM DESCRIPTION</div>
            <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:10px;">
                <span style="width:70%">Fashion Handbag<br><span style="color:#666; font-size:10px;">(Luxury Style / Orange)</span></span>
                <span>¥800,000.00</span>
            </div>
            <div style="border-top:2px dashed #333; margin-top:20px; padding-top:10px; font-weight:bold; display:flex; justify-content:space-between; font-size:14px;">
                <span>TOTAL:</span><span>¥800,000.00</span>
            </div>
            <div class="stamp">PAID</div>
        </div>
    `;
    
    // 打开窗口并置顶
    previewWin.style.display = 'flex';
    previewWin.style.zIndex = ++zIndex;
}

function openImagePreview(url) {
    const previewWin = document.getElementById('win-preview');
    
    // ✨ 核心修改：将窗口宽度扩大至 800px，高度自适应
    previewWin.style.width = '800px'; 
    previewWin.style.height = '600px'; // 给一个固定高度，方便大图滚动

    const contentArea = previewWin.querySelector('.title-bar').nextElementSibling;
    
    contentArea.innerHTML = '';
    // 修改 style：增加 overflow: auto 允许滚动查看超出的图片部分
    contentArea.style = "background:#1a1a1a; flex:1; display:flex; align-items:flex-start; justify-content:center; overflow:auto; padding: 20px;";

    const img = document.createElement('img');
    img.src = url;
    // 让图片宽度撑满容器，高度自动，保证文字清晰度
    img.style = "width:100%; height:auto; border:5px solid white; box-shadow: 0 10px 30px rgba(0,0,0,0.5);";
    
    contentArea.appendChild(img);
    
    previewWin.style.display = 'flex';
    previewWin.style.zIndex = ++zIndex;
}

// 修改日记预览尺寸
function openDiaryPreview(title, content) {
    const previewWin = document.getElementById('win-preview');

    // 日记建议宽度 600px
    previewWin.style.width = '600px';
    previewWin.style.height = '500px';

    const contentArea = previewWin.querySelector('.title-bar').nextElementSibling;
    
    contentArea.innerHTML = '';
    contentArea.style = "background:#333; flex:1; overflow:auto; display:flex; justify-content:center; padding:20px;";
    
    contentArea.innerHTML = `
        <div style="background:#fff9c4; padding:30px; width:85%; height:fit-content; font-family:serif; line-height:1.6; color:#222; box-shadow: 0 5px 15px rgba(0,0,0,0.3); border-radius:2px;">
            <h4 style="border-bottom:1px solid rgba(0,0,0,0.1); padding-bottom:10px; margin-top:0;">${title}</h4>
            <p style="white-space: pre-wrap; font-size:14px;">${content}</p>
        </div>`;
    
    previewWin.style.display = 'flex';
    previewWin.style.zIndex = ++zIndex;
}


// --- Hands 文件夹逻辑 ---
let currentT9Input = "";
const handsPassword = "42637"; // 对应 H-A-N-D-S

// --- [更新] Data_Recovered 文件夹内容，增加了开场 Motto ---
const handsFolderData = {
    files: [
        { type: "img", name: "xin💗.JPG", url: "assets/xin.png", charId: "xin", forFaceMatch: true }, 
        { type: "img", name: "Xin💗💗.JPG", url: "assets/xin2.png", charId: "xin", forFaceMatch: true },
        { type: "img", name: "Xin💗💗💗.JPG", url: "assets/xin3.png", charId: "xin", forFaceMatch: true },
        { type: "img", name: "Xin💗💗💗💗.JPG", url: "assets/xin4.png", charId: "xin", forFaceMatch: true },
        { type: "img", name: "Xin💗💗💗💗💗.JPG", url: "assets/xin5.png", charId: "xin", forFaceMatch: true },
        { type: "img", name: "immigration_record.png", url: "assets/immigration_record.png", charId: "nothing", forFaceMatch: false },
      
        { 
            type: "txt", 
            name: "My Diary.txt", 
            // ✨ 新增自定义图标路径
            customIcon: "assets/npd-logo1.png",
            content: `The misunderstood carry the vision of the future.
The misunderstood define the truth of the world.

17-09-15
University classes are more interesting than I expected.
Everything feels just right—almost surreal.
My roommates get along perfectly. Xin is especially kind to me; he always seems to sense my thoughts before I even speak a word.
Lucas is the life of the party, as if he doesn't have a single care in the world.
Sometimes I think to myself: so this is what it feels like to be understood.

18-11-20
Went to the library with Xin tonight to study.
I didn’t actually get much work done, but it didn’t matter.
What I loved more was the walk back to the dorm, talking about things that had absolutely nothing to do with exams.
Xin always knows exactly how to respond to everything I say.
In that moment, I felt like the world wasn't actually that complicated.
As long as someone truly understands you, that’s enough.

19-08-15
A friend dragged me to an event held by an organization.
I went in with an indifferent attitude, but their words felt like they had been prepared specifically for me.
The experience was a total mental breakthrough; I feel reborn.
Originality and truth are often labeled as madness by the sleeping masses.
I finally realize that all this time, it wasn’t me who was misunderstood—it was the world.

19-11-20
I’ve tested it a few times now, and the results are quite promising.
They say this is a "tool," not a "means."
If the truth cannot be understood, then it must be guided.
I’m beginning to understand what they mean.

20-02-25
I think I’ve mastered the proper dosage for this medication now.
Different people require different "ways of awakening."
But I still can’t bring myself to actually go through with it.
Perhaps I’m still not determined enough.

21-03-03
Xin has been gradually distancing himself from me lately.
He says I’ve changed.
He’s starting to become weak.
He can’t see the things that I see.
I am the one tasked with the responsibility to carry him.
Even if he doesn’t understand, I must lead him toward the right direction.

21-06-05
Xin completely misunderstood my intentions.
He’s even starting to fear me.
Ridiculous.
He doesn’t realize that I am saving him.

22-04-27
I’ve lost track of Xin entirely.
He just fled.
No goodbye, no explanation.
Just like those who choose to stay asleep.

23-09-30
Why did Lucas go to Thailand for work?
Xin’s last exit record was also Thailand.
Are they still in contact?

26-03-04
Received Lucas’s wedding invitation.
So that’s how it is.
She is him.

26-03-25
Xin belongs to me.
I was the one by his side through all his doubt, pain, and struggle.
How could he choose him?
He doesn't understand Xin at all.
I have prepared the Novacard white pills.
This time, there is no need for hesitation.
If the world misunderstands me again—
Then I will define its truth with my own hands.
I am going to destroy this wedding.
Whether I succeed or fail, 
I will die with a smile` 
        }
    ]
};

// 修改 script.js 中的 renderHandsContent 函数

function renderHandsContent() {
    const container = document.getElementById('hands-content-view');
    if (!container) return;
    container.innerHTML = ''; 

    handsFolderData.files.forEach((file, index) => {
        let html = '';
        if (file.type === 'img') {
            html = `
                <div class="ryan-item" onclick="openImagePreview('${file.url}')">
                    <img src="${file.url}" class="ryan-photo-thumb">
                    <div class="icon-name" style="font-size:10px;">${file.name}</div>
                </div>`;
        } else {
            // ✨ 核心修改：在日记图标右下角叠加一个锁 🔒

            // 1. 创建图标的 HTML（保持之前的放大填充逻辑）
            let iconHTML = file.customIcon 
                ? `<img src="${file.customIcon}" style="width:100%; height:100%; object-fit:cover; border-radius:3px;">`
                : `<span class="ryan-file-icon">📄</span>`;

            // 2. 如果是名为 "My Diary.txt" 的加密日记，则准备锁的 HTML
            let lockHTML = (file.name === "My Diary.txt")
                ? `<span style="position: absolute; bottom: 2px; right: 2px; font-size: 16px; background: rgba(0,0,0,0.6); border-radius: 50%; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(255,255,255,0.4); z-index: 10;">🔒</span>`
                : '';

            // 3. 构建完整的 HTML，使用 position: relative 包裹容器，并溢出隐藏
            html = `
                <div class="ryan-item" onclick="openHandsDiaryByIndex(${index})" style="position: relative;">
                    <div class="ryan-photo-thumb" style="overflow:hidden; position: relative;">
                        ${iconHTML}
                        ${lockHTML} 
                    </div>
                    <div class="icon-name" style="font-size:10px;">${file.name}</div>
                </div>`;
        }
        container.innerHTML += html;
    });
}

// 全局变量，用来记住玩家刚才点的是哪一个文件
let currentDiaryIndex = -1;

// 这个函数专门负责根据索引打开 Data_Recovered 里的日记
// 打开文本类文件时的逻辑判定
function openHandsDiaryByIndex(index) {
    const file = handsFolderData.files[index];
    
    // ✨ 核心判定：如果点的是日记，且尚未解锁
    if (file.name === "My Diary.txt" && !gameState.unlockedDiary) {
        currentDiaryIndex = index; // 记录当前索引
        
        // 初始化弹窗并显示
        document.getElementById('diary-pwd-input').value = "";
        document.getElementById('diary-pwd-error').innerText = "";
        document.getElementById('diary-password-screen').style.display = 'flex';
        document.getElementById('diary-pwd-input').focus();
        return; // 终止执行，不直接打开
    }
    
    // 如果是其他普通文本，或者日记已经解锁，则正常打开
    openDiaryPreview(file.name, file.content);
}

// 校验日记密码
function checkDiaryPassword() {
    // 获取输入，转小写并去除两端空格，方便判定
    const input = document.getElementById('diary-pwd-input').value.trim().toLowerCase();
    const errorMsg = document.getElementById('diary-pwd-error');
    const isCorrect = (input === "the misunderstood");

    // 👇 插入打点 👇
    recordAction('PWD_ATTEMPT_DIARY', { input: input, success: isCorrect });
    
    // 目标密码判定 (将 "The misunderstood" 转为小写进行对比)
    if (isCorrect) {
        // 解锁成功：更新存档
        gameState.unlockedDiary = true;
        saveGame();
        
        // 隐藏密码框
        document.getElementById('diary-password-screen').style.display = 'none';
        
        // 提取日记内容并直接打开
        const file = handsFolderData.files[currentDiaryIndex];
        openDiaryPreview(file.name, file.content);
        
    } else {
        // 解锁失败：显示错误提示并触发震动动画
        errorMsg.innerText = "Decryption failed. Incorrect passphrase.";
        const inputField = document.getElementById('diary-pwd-input');
        
        inputField.style.animation = "shake 0.3s";
        setTimeout(() => inputField.style.animation = "", 300);
    }
}

// --- [新增] 处理 Data_Recovered 文件夹内的点击事件 ---
function handleHandsFileClick(index) {
    const file = handsFolderData.files[index];
    if (file && file.type === 'txt') {
        // 调用你已有的预览窗口函数
        openDiaryPreview(file.name, file.content);
    }
}


// 打开键盘界面 (如果已解锁则直接进入)
function showHandsPasswordPrompt(element) {
    // 更新路径显示
    const folderName = element.querySelector('.icon-name').innerText;
    document.getElementById('current-folder-path').innerText = "My Documents > " + folderName;

    document.getElementById('files-main-view').style.display = 'none';

    // 判断存档：如果已解锁，直接渲染并显示内容
    if (gameState.unlockedHandsFolder) {
        document.getElementById('hands-content-view').style.display = 'flex';
        renderHandsContent();
    } else {
        // 未解锁，显示密码键盘
        document.getElementById('hands-password-screen').style.display = 'flex';
        t9Clear(); // 每次打开都清空输入
    }
}

// 返回主文件夹
function backToFilesMainFromHands() {
    document.getElementById('hands-password-screen').style.display = 'none';
    document.getElementById('hands-content-view').style.display = 'none';
    document.getElementById('files-main-view').style.display = 'flex';
}

// 点击数字键
function t9Input(num) {
    if (currentT9Input.length < 8) { // 限制输入长度
        currentT9Input += num;
        updateT9Display();
    }
}

// 清除输入 (CLR)
function t9Clear() {
    currentT9Input = "";
    updateT9Display();
    document.getElementById('hands-pwd-error').innerText = '';
}

// 更新显示框
function updateT9Display() {
    // 你可以选择显示明文数字，或者替换成星号 "*"
    document.getElementById('t9-input-display').innerText = currentT9Input; 
}

// 提交验证 (OK)
function t9Submit() {
    const isCorrect = (currentT9Input === handsPassword);
    
    // 👇 插入打点 👇
    recordAction('PWD_ATTEMPT_HANDS', { input: currentT9Input, success: isCorrect });

    if (isCorrect) {
        // 密码正确：更新存档状态
        gameState.unlockedHandsFolder = true;
        saveGame();

        document.getElementById('hands-password-screen').style.display = 'none';
        const contentView = document.getElementById('hands-content-view');
        contentView.style.display = 'flex';

        // 触发渲染
        renderHandsContent();

    } else {
        // 密码错误：震动效果并清空
        const error = document.getElementById('hands-pwd-error');
        error.innerText = "Incorrect sequence.";
        const display = document.getElementById('t9-input-display');
        display.style.animation = "shake 0.3s";
        setTimeout(() => display.style.animation = "", 300);
        
        // 错误后稍微延迟自动清空，方便玩家重新输入
        setTimeout(t9Clear, 600); 
    }
}

function universalFileBack() {
    // 1. 隐藏所有子界面
    document.getElementById('ryan-password-screen').style.display = 'none';
    document.getElementById('ryan-content-view').style.display = 'none';
    
    const handsPwd = document.getElementById('hands-password-screen');
    if (handsPwd) handsPwd.style.display = 'none';
    
    const handsContent = document.getElementById('hands-content-view');
    if (handsContent) handsContent.style.display = 'none';

    // ✨ 新增：隐藏 Downloads 文件夹内容
    const downloadsContent = document.getElementById('downloads-content-view');
    if (downloadsContent) downloadsContent.style.display = 'none';

    // 2. 显示根目录
    document.getElementById('files-main-view').style.display = 'flex';
    
    // 3. 恢复路径文本
    const pathText = document.getElementById('current-folder-path');
    if (pathText) pathText.innerText = "My Documents";

    // 4. 清理输入残留
    document.getElementById('ryan-pwd-input').value = '';
    document.getElementById('ryan-pwd-error').innerText = '';
    
    // 如果 hands 的键盘函数存在，也顺便清理
    if (typeof t9Clear === 'function') {
        t9Clear();
    }
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
    // 获取两个输入框的值
    const lyricsInput = document.getElementById('couple-pwd-lyrics').value.trim().toLowerCase();
    const dateInput = document.getElementById('couple-pwd-date').value.trim();
    const errorMsg = document.getElementById('couple-login-error');
    
    const isCorrect = (lyricsInput === "only fools" && dateInput === "2024.02.14");
    // 👇 插入打点 👇
    recordAction('PWD_ATTEMPT_COUPLE', { 
        lyrics: lyricsInput, 
        date: dateInput, 
        success: isCorrect 
    });

    // 校验逻辑：歌词（忽略大小写）和日期
    if (isCorrect) {
        // ✨ 核心修改：设置解锁状态并存档
        gameState.unlockedCoupleSite = true;
        saveGame();

        // 成功登录
        browserData.history.unshift({ 
            time: "Just now", 
            title: "Our Eternal Aurora - H&L", 
            url: "www.aurora-love-forever.com/home",
            clickAction: "navBrowser('couple-main')" 
        });
        navBrowser('couple-main'); 
    } else {
        // 失败逻辑
        errorMsg.innerText = "Only for those who remember the beginning.";
        
        // 给两个输入框都加上震动效果
        const fields = [document.getElementById('couple-pwd-lyrics'), document.getElementById('couple-pwd-date')];
        fields.forEach(f => {
            f.style.animation = "shake 0.3s";
            setTimeout(() => f.style.animation = "", 300);
        });
    }
}

const faceMatchHistory = [
    { date: "2025-12-10", result: "6%", isHigh: false },
    { date: "2026-01-15", result: "9%", isHigh: false },
    { date: "2026-03-04", result: "59%", isHigh: true } // 重点线索
];

// --- 5. 算命网站核心逻辑 (1920-2027) ---
const lunarNewYearDates = {
    "1920":"02-20","1921":"02-08","1922":"01-28","1923":"02-16","1924":"02-05","1925":"01-24","1926":"02-13","1927":"02-02","1928":"01-23","1929":"02-10",
    "1930":"01-30","1931":"02-17","1932":"02-06","1933":"01-26","1934":"02-14","1935":"02-04","1936":"01-24","1937":"02-11","1938":"01-31","1939":"02-19",
    "1940":"02-08","1941":"01-27","1942":"02-15","1943":"02-05","1944":"01-25","1945":"02-13","1946":"02-02","1947":"01-22","1948":"02-10","1949":"01-29",
    "1950":"02-17","1951":"02-06","1952":"01-27","1953":"02-14","1954":"02-03","1955":"01-24","1956":"02-12","1957":"01-31","1958":"02-18","1959":"02-08",
    "1960":"01-28","1961":"02-15","1962":"02-05","1963":"01-25","1964":"02-13","1965":"02-02","1966":"01-21","1967":"02-09","1968":"01-30","1969":"02-17",
    "1970":"02-06","1971":"01-27","1972":"02-15","1973":"02-03","1974":"01-23","1975":"02-11","1976":"01-31","1977":"02-18","1978":"02-07","1979":"01-28",
    "1980":"02-16","1981":"02-05","1982":"01-25","1983":"02-13","1984":"02-02","1985":"02-20","1986":"02-09","1987":"01-29","1988":"02-17","1989":"02-06",
    "1990":"01-27","1991":"02-15","1992":"02-04","1993":"01-23","1994":"02-10","1995":"01-31","1996":"02-19","1997":"02-07","1998":"01-28","1999":"02-16",
    "2000":"02-05","2001":"01-24","2002":"02-12","2003":"02-01","2004":"01-22","2005":"02-09","2006":"01-29","2007":"02-18","2008":"02-07","2009":"01-26",
    "2010":"02-14","2011":"02-03","2012":"01-23","2013":"02-10","2014":"01-31","2015":"02-19","2016":"02-08","2017":"01-28","2018":"02-16","2019":"02-05",
    "2020":"01-25","2021":"02-12","2022":"02-01","2023":"01-22","2024":"02-10","2025":"01-29","2026":"02-17","2027":"02-06"
};

// 严谨日期校验：拦截负数、越界年份、越界月份、及2月天数错误
function isValidDate(y, m, d) {
    if (isNaN(y) || isNaN(m) || isNaN(d)) return false;
    if (y < 1920 || y > 2027) return false;
    if (m < 1 || m > 12) return false;
    if (d < 1 || d > 31) return false;

    const dt = new Date(y, m - 1, d);
    return dt.getFullYear() === y && (dt.getMonth() + 1) === m && dt.getDate() === d;
}

function getZodiac(y, m, d) {
    let effectiveYear = y;
    const spring = lunarNewYearDates[y];
    if (spring) {
        const [sm, sd] = spring.split('-').map(Number);
        if (m < sm || (m === sm && d < sd)) effectiveYear -= 1;
    }
    const zodiacs = ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"];
    let idx = (effectiveYear - 4) % 12;
    if (idx < 0) idx += 12;
    return zodiacs[index = idx]; // 修正变量指向
}

function getFiveElements(y, m, d) {
    const ds = `${y}-${m.toString().padStart(2,'0')}-${d.toString().padStart(2,'0')}`;
    
    // 1. 核心角色优先级覆盖 (确保剧情线索不被通用算法覆盖)
    if (ds === "2000-03-15") return { name: "Wood", desc: "Represents growth, ideal, and deep emotions. You are often the anchor in a relationship." };
    if (ds === "1998-07-22") return { name: "Fire", desc: "Represents passion and energy. You need support to keep shining." };
    if (ds === "1999-10-10") return { name: "Metal", desc: "Represents strength and control. Can be cold or restrictive." };

    // 2. 判定土属性 (四季末18天)
    const daysInMonth = new Date(y, m, 0).getDate(); // 获取当月实际总天数
    const seasonalEndMonths = [3, 6, 9, 12]; // 春夏秋冬四季最后一个月
    
    if (seasonalEndMonths.includes(m) && d > (daysInMonth - 18)) {
        return { name: "Earth", desc: "Represents stability, patience, and transformation. You are the grounded balance that holds things together." };
    }

    // 3. 通用季节逻辑
    if (m === 3 || m === 4 || m === 5) return { name: "Wood", desc: "Vibrant and seeking growth." };
    if (m === 6 || m === 7 || m === 8) return { name: "Fire", desc: "Passionate and full of heat." };
    if (m === 9 || m === 10 || m === 11) return { name: "Metal", desc: "Organized and sharp." };
    
    // 默认冬季 (12, 1, 2)
    return { name: "Water", desc: "Deep and introspective." };
}

let currentDivMode = 'single';
function switchDivMode(mode) {
    currentDivMode = mode;
    document.getElementById('p2-input-group').style.display = (mode === 'couple') ? 'block' : 'none';
    document.getElementById('tab-single').classList.toggle('active', mode === 'single');
    document.getElementById('tab-couple').classList.toggle('active', mode === 'couple');
    document.getElementById('div-result').style.display = 'none';
}

// --- 修改后的 runDivination 函数 ---
function runDivination() {
    const y1 = parseInt(document.getElementById('div-y1').value);
    const m1 = parseInt(document.getElementById('div-m1').value);
    const d1 = parseInt(document.getElementById('div-d1').value);
    const res = document.getElementById('div-result');

    if (!isValidDate(y1, m1, d1)) { 
        alert("Invalid Date! Please enter a valid birthday (1920-2027).\nCheck if the month (1-12) and day exist for that month."); 
        return; 
    }

    const z1 = getZodiac(y1, m1, d1), e1 = getFiveElements(y1, m1, d1);
    const ds1 = `${y1}-${m1.toString().padStart(2,'0')}-${d1.toString().padStart(2,'0')}`;

    if (currentDivMode === 'single') {
        res.innerHTML = `<div class="res-card">
            <h2>The Universe Says...</h2>
            <p><b>Zodiac:</b> ${z1}</p>
            <p><b>Wǔ Xíng:</b> ${e1.name}</p>
            <p style="font-size:10px; color:#888; margin-top:-10px; margin-bottom:10px; font-style:italic;">
                * Precise Wǔ Xíng require more data support (such as birth time) for full accuracy.
            </p>
            <hr style="border:0; border-top:1px dashed #d2b48c; margin:15px 0;">
            <p class="res-desc">${e1.desc}</p>
            <p class="science-disclaimer">* Follow science. Fate is in your hands.</p>
        </div>`;
    } else {
        const y2 = parseInt(document.getElementById('div-y2').value), m2 = parseInt(document.getElementById('div-m2').value), d2 = parseInt(document.getElementById('div-d2').value);
        if (!isValidDate(y2, m2, d2)) { alert("Partner's Date is Invalid!"); return; }
        const z2 = getZodiac(y2, m2, d2), e2 = getFiveElements(y2, m2, d2);
        const ds2 = `${y2}-${m2.toString().padStart(2,'0')}-${d2.toString().padStart(2,'0')}`;

        let score = 55, title = "Common Connection", type = "Mixed", desc = "An ordinary meeting of souls.", detail = "Neutral compatibility.";
        const pair = [ds1, ds2].sort();

        // 剧情判词逻辑
        if (ds1 === "2000-03-15" && ds2 === "2000-03-15") {
            score = 92; title = "Mirror Fate (镜像之缘)"; type = "Wood + Wood (Synchronized)";
            desc = "You see each other, but never truly possess."; detail = "Extremely high spiritual synchronization. Your souls are echoes of each other.";
        } else if (pair.includes("1998-07-22") && pair.includes("2000-03-15")) {
            score = 78; title = "Reality Fate (现实之缘)"; type = "Wood feeds Fire (Generative)";
            desc = "Not the hottest fire, but burns the longest."; detail = "A stable, long-lasting partnership.";
        } else if (pair.includes("1999-10-10") && pair.includes("2000-03-15")) {
            score = 85; title = "Destructive Fate (孽缘)"; type = "Metal chops Wood (Restrictive)";
            desc = "The closer you get, the closer you are to losing."; detail = "Intense magnetism but inherently destructive.";
        }

        res.innerHTML = `<div class="res-card couple-res">
            <div class="score-circle"><span class="score-num">${score}%</span><br><span style="font-size:8px;">Match</span></div>
            <h2>${title}</h2>
            <div class="elements-compare"><b>${e1.name} (${z1})</b> ⚡ <b>${e2.name} (${z2})</b></div>
            <p style="font-size:9px; color:#888; text-align:center; margin-top:-10px; margin-bottom:15px; font-style:italic; opacity:0.8;">
                Note: Accurate Wǔ Xíng analysis requires specific birth hours.
            </p>
            <p><b>Relationship:</b> ${type}</p>
            <p class="res-quote">"${desc}"</p>
            <hr style="border:0; border-top:1px dashed #d2b48c; margin:15px 0;">
            <p class="res-desc">${detail}</p>
            <p class="science-disclaimer">* Follow science. Fate is in your hands.</p>
        </div>`;
    }
    res.style.display = 'block';
}

function renderFaceMatchHistory() {
    const container = document.getElementById('face-history-list');
    if (!container) return;
    
    container.innerHTML = '';
    faceMatchHistory.forEach(item => {
        const resultClass = item.isHigh ? 'history-sim-high' : '';
        // 删除了中间的 target，让日期居左，结果居右
        container.innerHTML += `
            <div class="face-history-item">
                <span>📅 ${item.date}</span>
                <span class="${resultClass}">Match: ${item.result}</span>
            </div>
        `;
    });
}

// --- 桌面测试资源数据 (加入了隐藏的 charId) ---
// --- 更新下载文件夹数据 (增加 id 属性) ---
const downloadsFiles = [
    { id: "adam_school", name: "201705075748967948.jpg", url: "assets/Adam_school.png", charId: "adam", forFaceMatch: true },
    { id: "lucas_basketball", name: "Basketball001.jpg", url: "assets/Lucas.png", charId: "lucas", forFaceMatch: true },
    { id: "hope_now", name: "oureternalaurora0214.png", url: "assets/Hope.png", charId: "hope", forFaceMatch: true },
    { id: "adam_now", name: "2024101847238473298.jpg", url: "assets/Adam.png", charId: "adam", forFaceMatch: true },
    { id: "lucas_now", name: "lucas_now.jpg", url: "assets/Lucas_interview.png", charId: "lucas", forFaceMatch: true },
    { id: "luna_now", name: "2026021158345739857.png", url: "assets/Luna1.png", charId: "luna", forFaceMatch: true }
];

// 渲染 Downloads 文件夹内容函数
function renderDownloads() {
    // 这里将渲染目标指向我们新建的 Downloads 容器
    const container = document.getElementById('downloads-content-view');
    if (!container) return;
    
    container.innerHTML = '';

    // ✨ 核心修改：增加过滤逻辑
    const visibleFiles = downloadsFiles.filter(file => 
        gameState.unlockedDownloads.includes(file.id)
    );

    visibleFiles.forEach(file => {
        // ✨ 修改这里：复用 ryan-item 和 ryan-photo-thumb 样式限制图片大小 ✨
        container.innerHTML += `
            <div class="ryan-item" onclick="openImagePreview('${file.url}')">
                <img src="${file.url}" class="ryan-photo-thumb" alt="${file.name}">
                <div class="icon-name" style="font-size:10px; word-break: break-all; margin-top: 5px;">${file.name}</div>
            </div>`;
    });
}

/**
 * 触发“下载”动作
 * @param {string} fileId - 要解锁的文件 ID
 */
function triggerDownload(fileId) {
    // 如果已经下载过了，直接跳过
    if (gameState.unlockedDownloads.includes(fileId)) {
        showNotification("System", "File already exists in Downloads.");
        return;
    }

    // 将文件 ID 加入已解锁列表并存档
    gameState.unlockedDownloads.push(fileId);
    saveGame();

    // 重新渲染下载文件夹（如果窗口开着，玩家能看到即时变化）
    renderDownloads();

    // 发送一个系统通知增加真实感
    const file = downloadsFiles.find(f => f.id === fileId);
    const fileName = file ? file.name : "New File";
    
    showNotification(
        "Download Complete", 
        `${fileName} has been saved to Downloads.`, 
        "⬇️"
    );
}

// 人脸识别预览处理
function handleFacePreview(input, previewId) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById(previewId).innerHTML = `<img src="${e.target.result}">`;
        };
        reader.readAsDataURL(file);
    }
}

function runFaceRecognition() {
    const imgA = document.querySelector('#preview-a img');
    const imgB = document.querySelector('#preview-b img');
    const faceResultBox = document.getElementById('face-result');

    if (!imgA || !imgB) { 
        alert("Please select photos from the database first."); 
        return; 
    }

    // ✨ 核心修改：读取隐藏的身份 ID 进行比对
    const charA = imgA.getAttribute('data-char-id');
    const charB = imgB.getAttribute('data-char-id');
    const nameA = imgA.getAttribute('data-name');
    const nameB = imgB.getAttribute('data-name');

    // 开启扫描动画
    document.querySelectorAll('.face-slot').forEach(el => el.classList.add('scanning'));
    
    setTimeout(() => {
        document.querySelectorAll('.face-slot').forEach(el => el.classList.remove('scanning'));
        
        let sim = 0;
        let verdict = "";

        // --- 核心判定逻辑 (完全基于隐藏的 charId) ---
        
        // 1. 完全是同一张照片文件
        if (nameA === nameB) {
            sim = 99; 
            verdict = "Identical Biological Signature";
        }
        // 2. 同一个人，不同时期的照片 (比如 Adam vs Adam)
        else if (charA === charB) {
            sim = Math.floor(Math.random() * 11) + 80; // 80%-90%
            verdict = "Identity Match Confirmed";
        }
        // 3. Ryan 和 Luna (兄妹线索爆发)
        else if ((charA === 'xin' && charB === 'hope') || (charA === 'hope' && charB === 'xin')) {
            sim = Math.floor(Math.random() * 11) + 55; // 55%-65%
            verdict = "Significant Genetic Correlation";

            if (!gameState.foundFaceMatch) {
                gameState.foundFaceMatch = true;
                saveGame(); 
                
                setTimeout(() => {
                    showNotification(
                        "System Alert", 
                        "Encrypted protocol triggered. New message received.", 
                        "👁️", 
                        () => {
                            openWindow('win-secret-msg');
                        }
                    );
                }, 1000);
            }
        }
        // 4. 跨人配对 (完全无关联)
        else {
            sim = Math.floor(Math.random() * 6) + 5; // 5%-10%
            verdict = "Low Correlation";
        }

        // 渲染结果
        faceResultBox.innerHTML = `
            <div class="res-card">
                <div class="score-circle">
                    <span class="score-num">${sim}%</span><br>
                    <span style="font-size:8px;">Similarity</span>
                </div>
                <h2 style="font-size:16px; color:#8b0000; margin-bottom:10px;">${verdict}</h2>
                <hr style="border:0; border-top:1px dashed #d2b48c; margin:10px 0;">
                <p class="res-desc" style="text-align:center; font-size:13px;">
                    Biometric markers matched: <b>${sim}%</b>. <br>
                    <span style="font-size:11px; color:#666; display:block; margin-top:5px;">
                        ⚠️The result is for reference only and has no authority.
                    </span>
                </p>
            </div>`;
        faceResultBox.style.display = 'block';

    }, 2000);
}


let currentTargetSlot = ''; // 记录当前是在选 A 还是 B

// 1. 打开选择器弹窗
function selectGamePhoto(slot) {
    currentTargetSlot = slot;
    // 如果没有弹窗容器，我们动态创建一个（为了方便，直接用 JS 生成）
    let picker = document.getElementById('file-picker-modal');
    if (!picker) {
        picker = document.createElement('div');
        picker.id = 'file-picker-modal';
        picker.className = 'window';
        picker.style = "display:none; width:320px; position:fixed; z-index:9999; left:50%; top:50%; transform:translate(-50%, -50%); background:white; border:1px solid #444; box-shadow:0 0 20px rgba(0,0,0,0.5);";
        picker.innerHTML = `
            <div class="title-bar"><div class="win-title">Select Photo</div><span onclick="closeFilePicker()" style="cursor:pointer; padding-right:10px;">✕</span></div>
            <div id="file-picker-list" style="padding:15px; display:grid; grid-template-columns:1fr 1fr; gap:10px; max-height:300px; overflow-y:auto;"></div>
        `;
        document.body.appendChild(picker);
    }
    
    const listContainer = document.getElementById('file-picker-list');
    listContainer.innerHTML = '';

    // ✨ 核心修复：基础图库只提取玩家已经“下载（解锁）”的照片
    let allAvailablePhotos = downloadsFiles.filter(file => 
        gameState.unlockedDownloads.includes(file.id)
    );

    // ✨ 判定：如果玩家已经解开了 Data_Recovered 文件夹，就把隐藏图片加进去
    if (gameState.unlockedHandsFolder) {
        // 增加 .forFaceMatch === true 的过滤条件
        const handsImages = handsFolderData.files.filter(f => 
            f.type === 'img' && f.forFaceMatch === true
        );
        allAvailablePhotos = [...allAvailablePhotos, ...handsImages];
    }

    // 渲染桌面上的图片作为选项
    allAvailablePhotos.forEach(file => {
        const item = document.createElement('div');
        item.style = "cursor:pointer; text-align:center; border:1px solid #eee; padding:5px;";
        item.innerHTML = `
            <img src="${file.url}" style="width:100%; height:80px; object-fit:cover;">
            <div style="font-size:10px; margin-top:4px;">${file.name}</div>
        `;
        item.onclick = () => confirmPhotoSelection(file);
        listContainer.appendChild(item);
    });

    picker.style.display = 'block';
}

// 2. 确认选择并更新预览
function confirmPhotoSelection(file) {
    const previewId = currentTargetSlot === 'A' ? 'preview-a' : 'preview-b';
    const previewBox = document.getElementById(previewId);
    
    // ✨ 核心修改：将 charId 作为 data-char-id 写入 DOM，供识别逻辑读取
    previewBox.innerHTML = `<img src="${file.url}" data-char-id="${file.charId}" data-name="${file.name}">`;
    
    closeFilePicker();
}

function closeFilePicker() {
    document.getElementById('file-picker-modal').style.display = 'none';
}



/**
 * 辅助函数：通过评论区的用户名查找用户数据库 ID 并执行跳转
 * @param {string} userName - 评论中显示的用户名
 */


// function jumpToUserFromComment(userName) {
//     const userKey = Object.keys(xhsUsers).find(key => xhsUsers[key].name === userName);
    
//     if (userKey) {
//         // ✨ 不要在这里调用 closeXhsDetail()，让它留在后台
//         openXhsUser(userKey);
//     } else {
//         console.warn("User data not found for name:", userName);
//     }
// }


// function jumpToUserFromComment(userName) {
//     const userKey = Object.keys(xhsUsers).find(key => xhsUsers[key].name === userName);
    
//     if (userKey) {
//         // ✨ 不要在这里调用 closeXhsDetail()，让它留在后台
//         openXhsUser(userKey);
//     } else {
//         console.warn("User data not found for name:", userName);
//     }
// }

function jumpToUserFromComment(userName) {
    const userKey = Object.keys(xhsUsers).find(key => xhsUsers[key].name === userName);
    if (userKey) {
        // 直接打开，它会因为 zIndex 增加而盖在帖子上面
        openXhsUser(userKey); 
    }
}


// --- 新增：动态渲染小红书私信列表 ---
function renderXhsMsgList() {
    const container = document.getElementById('xhs-msg-list-container');
    if (!container) return;
    
    container.innerHTML = ''; // 清空旧列表

    // 遍历 xhsDMs 数据生成 HTML
    for (const [userId, data] of Object.entries(xhsDMs)) {
        const lastMsg = data.messages[data.messages.length - 1];
        const previewText = lastMsg ? lastMsg.text : "No messages";
        const avatarStyle = data.avatar ? `background: url('${data.avatar}') center/cover` : `background: #ccc`;
        
        container.innerHTML += `
            <div class="xhs-msg-item" onclick="openXhsDm('${userId}')">
                <div class="xhs-msg-avatar" style="${avatarStyle}"></div>
                <div class="xhs-msg-info">
                    <div class="xhs-msg-top">
                        <span class="xhs-msg-name" style="${userId === 'ryan' ? 'color:#999' : ''}">${data.name}</span>
                        <span class="xhs-msg-time">${lastMsg ? (lastMsg.time || 'Today') : ''}</span>
                    </div>
                    <div class="xhs-msg-text">${previewText}</div>
                </div>
            </div>`;
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

        // ✨ 新增：如果存档中已经触发了人脸对比成功，则自动打开加密窗口
        if (gameState.foundFaceMatch) {
            // 这里直接调用 openWindow，由于 HTML 里去掉了关闭按钮，窗口一旦打开就无法关闭
            openWindow('win-secret-msg');
        }
        
    } else {
        // --- 全新游戏 (无存档) ---
        const introScreen = document.getElementById('intro-screen');
        if (introScreen) introScreen.style.display = 'flex';
    }

    // 初始化其他组件
    renderDownloads();
    renderBookmarks(); 
    renderXhsHomeFeed();
    renderAdamProfileFeed();
    renderXhsMsgList(); // ✨ 记得调用这个渲染函数

    updateXhsMsgView();

    renderFaceMatchHistory();

    navBrowser('home');

    setInterval(() => {
        document.getElementById('clock').innerText = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
    }, 1000);
}

// 页面加载完毕后执行初始化
initGame();


