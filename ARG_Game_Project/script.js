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


// --- 小红书用户数据库 ---
const xhsUsers = {
    "luna": {
        name: "Luna_99", id: "994021",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        bio: "Exploring the world one spicy dish at a time 🌶️",
        stats: { posts: 12, followers: "1.2k", following: 892 },
        posts: ["luna_post_unboxing", "luna_post_bkk", "luna_post_airport", "luna_post_cooking", "luna_post_hello"]
    },
    "ryan": {
        name: "Deactivated Account", id: "Account Disabled",
        avatar: "", // 留空则显示灰色
        bio: "This account has been deactivated by the user.",
        stats: { posts: 4, followers: 128, following: 150 }, // 更新帖子数量为 3
        posts: ["ryan_post_4", "ryan_post_video_clue", "ryan_post_2", "ryan_post_1"]    
    },
    "adam_burner": {
        name: "Adam_1010", id: "102400",
        avatar: "", // 默认头像
        bio: "Just looking for some advice.",
        stats: { posts: 1, followers: 2, following: 0 },
        posts: ["luna_burner_post"] 
    },
    "adam": {
        name: "Adam", id: "8832910",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150",
        bio: "Less is more.",
        stats: { posts: 4, followers: 45, following: 128 },
        posts: ["adam_post_1", "adam_post_2", "adam_post_3", "adam_post_4"]
    },
};

// --- 小红书帖子详情数据  ---
const xhsPostData = {
// === Luna 大号帖子 (按时间倒序) ===
    "luna_post_unboxing": {
        img: "https://cdn.shopify.com/s/files/1/0879/1520/0785/files/30_1024x1024.jpg?v=1726396117",
        author: "Luna_99", avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        text: "Unboxing my Dream Bag! ✨🥰\nThe biggest surprise of this Bangkok trip! When the front desk delivered it, I thought there was a mistake. Thank you to the best boyfriend in the world, Adam. I was literally on the verge of crying in the hotel lobby. The leather feels so incredibly good! I am definitely the happiest girl today! ❤️\n#HermesBirkin #Unboxing #BestBoyfriend #BangkokTrip",
        date: "2023-10-05", comments: "2 Comments",
        commentsList: [
            { user: "FashionGuru", avatar: "https://randomuser.me/api/portraits/women/12.jpg", text: "Omg so jealous! That color is super hard to get! 😍", time: "2023-10-05" },
            { user: "Adam", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150", text: "Only the best for you. ❤️", time: "2023-10-05" }
        ]
    },
    "luna_post_bkk": {
        img: "https://images.unsplash.com/photo-1555126634-323283e090fa?q=80&w=500", // 替换为泰国街头美食/冬阴功汤图片
        author: "Luna_99", avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        text: "First time trying authentic Thai street food! 🍜\nThe Tom Yum soup is incredibly spicy, but I just can't stop eating it! The tropical vibe here is amazing, such a perfect vacation spot. Spent the whole day eating through the night markets with Adam, completely gave up on diet control hahahaha! 🌴\n#FirstTimeInBKK #TravelDiary #FoodieLife #VacationMode",
        date: "2023-10-04", comments: "2 Comments",
        commentsList: [
            { user: "Wanderlust_Dreamer", avatar: "https://randomuser.me/api/portraits/women/33.jpg", text: "Looks absolutely amazing! Enjoy your vacation!", time: "2023-10-04" },
            { user: "Adam", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150", text: "Eat as much as you want, I love you just the same even if you gain weight.", time: "2023-10-04" }
        ]
    },
    "luna_post_airport": {
        img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=500", // 替换为机场咖啡/护照的图片
        author: "Luna_99", avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        text: "October vacation mode ON! ✈️ Bangkok here we come!\nFinally redeeming this long-awaited trip! Also attending Adam's college friend's wedding at the end of the month. It's my first time in Thailand, any must-visit spots for first-timers? Waiting online! 👇\n#TravelGram #CouplesTrip #AirportVlog",
        date: "2023-10-01", comments: "1 Comments",
        commentsList: [
            { user: "DailyVibes", avatar: "https://randomuser.me/api/portraits/women/68.jpg", text: "Have a great trip! You definitely need to check out the Grand Palace!", time: "2023-10-01" }
        ]
    },
    "luna_post_cooking": {
        img: "https://images.unsplash.com/photo-1543826173-70651703c5a4?q=80&w=500", // 替换为麻婆豆腐/中餐图片
        author: "Luna_99", avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        text: "First time making authentic Mapo Tofu! 🌶️\nI've always been super fascinated by Chinese culture and food! Today I finally gathered the courage to follow a recipe step by step. Even though my kitchen looks like a warzone now, it tastes surprisingly good! My boyfriend praised it as very authentic (hope he's not just blindly complimenting me haha). Next challenge: Sweet and Sour Pork Ribs! 🥢\n#ChineseFood #CookingDiaries #MapoTofu #CrossCulturalRomance",
        date: "2023-08-15", comments: "2 Comments",
        commentsList: [
            { user: "Adam", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150", text: "Looks incredibly authentic! Giving this dish a 100/100 💯. Next time you challenge the sweet and sour ribs, I can pass on my secret recipe to you. 😉", time: "2023-08-15" },
            { user: "Luna_99", avatar: "https://randomuser.me/api/portraits/women/44.jpg", text: "Wow really?! That's great, looking forward to your secret recipe! ✨", time: "2023-08-15" }
        ]
    },
    "luna_post_hello": {
        img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=500", // 替换为自拍或街景打卡照
        author: "Luna_99", avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        text: "Hello Xiaohongshu! 👋\nMy previous Tiktok account got banned out of nowhere, was really sad about it for a long time, lost so many memories. But that's okay, considering this as a fresh start! From now on, I'll be sharing my daily life, travels, and random moments here. Nice to meet you all! 🥰\n#NewHere #LifeLog #HelloXHS",
        date: "2023-05-20", comments: "3 Comments",
        commentsList: [
            { user: "DailyVibes", avatar: "https://randomuser.me/api/portraits/women/68.jpg", text: "Welcome to Xiaohongshu! Followed!", time: "2023-05-20" },
            { user: "Adam", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150", text: "Finally found you! I used to watch your updates all the time, glad you didn't leave the internet entirely. Followed! 😊", time: "2023-05-20" },
            { user: "Luna_99", avatar: "https://randomuser.me/api/portraits/women/44.jpg", text: "Thank you for the support! ✨", time: "2023-05-21" }
        ]
    },

// === Ryan 的旧账帖子 (核心剧情线索) ===
    "ryan_post_1": {
        img: "https://images.unsplash.com/photo-1461360228754-6e81c478b882?q=80&w=500", // 替换为黑胶唱片/复古音乐图
        author: "Deactivated Account", avatar: "",
        text: "Finally got my hands on this out-of-print vinyl! Been looping 'Can't Help Falling in Love' all week. The King lives on. 🎸👑",
        date: "2015-10-05", comments: "0 Comments",
        commentsList: []
    },
    "ryan_post_2": {
        img: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=500", // 书桌与咖啡/外卖
        author: "Deactivated Account", avatar: "",
        text: "Struggling with the major assignment until my brain melted. Thanks to my awesome roommate Adam for helping me sort out the logic and bringing me late-night snacks. Grateful! 🙏💻",
        date: "2015-10-28", comments: "1 Comments",
        commentsList: [
            { user: "Adam", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150", text: "No problem bro. Finish it up and get some rest.", time: "2015-10-28" }
        ]
    },
    "ryan_post_video_clue": {
        isVideo: true, 
        videoSrc: "assets/ryan_desk_pan.mp4", // 以后替换为包含药瓶的真实视频路径
        img: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?q=80&w=500", // 杂乱书桌封面图
        author: "Deactivated Account", avatar: "",
        text: "The reality of a finals week desk. A total disaster. Note to self: never leave assignments to the last day ever again. 📚😵",
        date: "2015-11-15", comments: "1 Comments",
        commentsList: [
            { user: "Chris", avatar: "https://randomuser.me/api/portraits/men/45.jpg", text: "Your desk is an absolute disaster zone.", time: "2015-11-15" }
        ]
    },
    "ryan_post_4": {
        img: "https://images.unsplash.com/photo-1550534731-2e673f4e2f4a?q=80&w=500", // 模糊眩晕感的图
        author: "Deactivated Account", avatar: "",
        text: "Don't know what's wrong lately, always feeling lightheaded and dizzy. Slept for 12 hours yesterday and still woke up exhausted. My brain feels like mush. Is finals stress really this bad? 😵‍💫 No amount of coffee helps.",
        date: "2015-11-20", comments: "2 Comments",
        commentsList: [
            { user: "Chris", avatar: "https://randomuser.me/api/portraits/men/45.jpg", text: "You don't look right man, you should go to the campus clinic.", time: "2015-11-21" },
            { user: "Adam", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150", text: "Don't push yourself too hard, health comes first. I'll bring some hot soup back to the dorm for you tonight.", time: "2015-11-21" }
        ]
    },
    // === Adam 大号帖子 (按时间倒序) ===
    "adam_post_1": {
        img: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=500", // 整洁的行李箱内部
        author: "Adam", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150",
        text: "Leave finally approved. See you next week, Bangkok. 🌴",
        date: "2023-09-28", comments: "2 Comments",
        commentsList: [
            { user: "Luna_99", avatar: "https://randomuser.me/api/portraits/women/44.jpg", text: "Babe, your luggage packing is so satisfying to look at!! My suitcase looks like a dumpster compared to this 😂", time: "2023-09-28" },
            { user: "Adam", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150", text: "It's fine. I have all the itineraries planned out, just follow my lead.", time: "2023-09-28" }
        ]
    },
    "adam_post_2": {
        img: "https://images.unsplash.com/photo-1554650635-c38f9b9646b9?q=80&w=500", // 机场停机坪夜景
        author: "Adam", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150",
        text: "Three consecutive night shifts. T2 terminal has finally quieted down. Need a double espresso to survive. ☕️✈️",
        date: "2023-09-10", comments: "2 Comments",
        commentsList: [
            { user: "Chris", avatar: "https://randomuser.me/api/portraits/men/45.jpg", text: "Working the night shift again bro? Is the ops center that busy?", time: "2023-09-10" },
            { user: "Adam", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150", text: "Lots of flights lately. Just wrapping up the last departure.", time: "2023-09-10" }
        ]
    },
    "adam_post_3": {
        img: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=500", // 极度整洁的办公桌
        author: "Adam", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150",
        text: "Weekend deep clean. A clear desk equals a clear mind. 🧹✨",
        date: "2023-08-05", comments: "2 Comments",
        commentsList: [
            { user: "Luna_99", avatar: "https://randomuser.me/api/portraits/women/44.jpg", text: "Wow... I don't think there's a single speck of dust in your room. Can you help organize my desk next time? 🥺", time: "2023-08-05" },
            { user: "Adam", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150", text: "Sure, next time I'm over, I'll throw away all your useless stuff. 😜", time: "2023-08-05" }
        ]
    },
    "adam_post_4": {
        img: "https://images.unsplash.com/photo-1495474472204-51ea0d20dcd8?q=80&w=500", // 手冲咖啡特写
        author: "Adam", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150",
        text: "15g light roast, 92°C water, 225ml extraction. A perfect morning starts with precise measurements. ☕️☀️",
        date: "2023-05-12", comments: "2 Comments",
        commentsList: [
            { user: "CoffeeHolic", avatar: "https://randomuser.me/api/portraits/men/32.jpg", text: "Are those Ethiopian beans? That extraction color is absolutely perfect!", time: "2023-05-12" },
            { user: "Adam", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150", text: "Yes, Yirgacheffe.", time: "2023-05-12" }
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
    "luna_burner_post": {
        img: "https://images.unsplash.com/photo-1584308666744-24d5e471956c?q=80&w=500", // 药瓶图片
        author: "Adam_1024", avatar: "",
        text: "Help: Found this in my boyfriend's bag.\nThe label says 'Novacard', which I googled and it's for his heart condition. But the pills inside are plain white and round, completely different from the blue ones on the internet. We are on vacation in Bangkok right now, and tonight he was being super persistent about making me a glass of hot milk to help me sleep... I didn't drink it and poured it away. My heart is racing right now, what should I do?",
        date: "Oct 22", comments: "3 Comments",
        commentsList: [
            { user: "MedStudent_Anna", avatar: "https://randomuser.me/api/portraits/women/11.jpg", text: "Sis, Novacard pills are strictly blue and hexagonal. White round pills could be anything. Be careful!", time: "Oct 22" },
            { user: "TravelSafe", avatar: "https://randomuser.me/api/portraits/men/22.jpg", text: "Don't drink anything he gives you. Lock your door.", time: "Oct 22" },
            { user: "Maya_in_BKK", avatar: "https://randomuser.me/api/portraits/women/33.jpg", text: "DO NOT DRINK IT!!! I know exactly what those pills are. CHECK YOUR DMs NOW!!!", time: "Oct 22" }
        ]
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
    "user_mom": {
        name: "Mom", avatarColor: "#e57373", avatarText: "Mom",
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
        messages: [
            { type: "sys", text: "Oct 30, 2025" },
            { type: "left", text: "I’m glad we finally moved to WeTalk 😄" },
            { type: "right", text: "yeah RG chat is too slow sometimes" },
            { type: "left", text: "Is the dish in your new post really made of lion meat? 😂" },
            { type: "right", text: "Hahaha no, 'Lion's Head' is just giant meatballs. It's mostly pork, it just looks like a lion's head." },
            { type: "left", text: "Ohh, that sounds delicious." },
            { type: "right", text: "It's my signature dish. I'll make it for you when I get the chance!" },
            { type: "sys", text: "☎️ Video Call ended (45:12)" },

            { type: "sys", text: "Nov 28, 2025" },
            { type: "left", text: "Babe! I tried making Mapo Tofu today following your Chinese recipe! Look! 🌶️" },
            { type: "left", isImg: true, src: "https://images.unsplash.com/photo-1543826173-70651703c5a4?q=80&w=200" },
            { type: "right", text: "Looks amazing 😋 My baby is a culinary genius." },
            { type: "left", text: "Hehe" },
            { type: "left", text: "But I still can't handle the spice 😭" },
            { type: "right", text: "You're doing great just by trying it babe 💗" },

            { type: "sys", text: "Dec 21, 2025" },
            { type: "right", text: "Honey, did you get the birthday gift I prepared for you?" },
            { type: "left", text: "Ahhh!!! It's way too expensive baby!!" },
            { type: "right", text: "This bag perfectly matches your style." },
            { type: "right", text: "I wanted to buy it for you the second I saw it!" },
            generateXhsLinkMsg("luna_post_unboxing", "left"),
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
        name: "程光", avatarColor: "#ff9800", avatarText: "Lu",
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
            { type: "left", isImg: true, src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=200" },
            { type: "left", text: "Hey Adam, I'm getting married in Thailand next month!" },
            { type: "left", text: "Would love to invite you and your partner to the wedding~" },
            { type: "right", text: "Omggg, congrats bro! Didn't expect you to be the first one to tie the knot out of the three of us!!" },
            { type: "right", text: "My girlfriend and I will definitely be there! Can't wait to see you guys~" }
        ]
    },

    "user_cousin": {
        name: "陆白", avatarColor: "#4285f4", avatarText: "白",
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
    "user_ryan": {
        name: "木心（❤）", avatarColor: "#607d8b", avatarText: "Ry",
        messages: [
            { type: "sys", text: "You transferred ¥100,000.00 to Ryan." },
            { type: "sys", text: "Transfer returned by Ryan." }
        ]
    }
};

// --- 2. DATA: Contacts Directory (通讯录数据) ---
const contactsData = {
    "user_cousin": { 
        name: "Cousin", avatarColor: "#4285f4", avatarText: "Co", wechatId: "wxid_cousin88", 
        signature: "Family first." 
    },
    "user_luna": { 
        name: "月 🌙", avatarColor: "#e91e63", avatarText: "🌙", wechatId: "LunaCarter1007", 
        signature: "Living my best life" 
    },
    "user_lucas": { 
        name: "程光", avatarColor: "#ff9800", avatarText: "Ch", wechatId: "LUCAS_THE_TALL", 
        signature: "Work hard, play hard." 
    },
    "user_ryan": { 
        name: "木心（❤）", avatarColor: "#607d8b", avatarText: "Ry", wechatId: "XinWoodenHeart", 
        signature: "Dragon in da house. 🐉" 
    },
    "user_mom": { 
        name: "Mom", avatarColor: "#e57373", avatarText: "Mom", wechatId: "wxid_mom_home", 
        signature: "Blessed and grateful." 
    },
    "user_boss": { 
        name: "Mr. Henderson (Ex-Boss)", avatarColor: "#795548", avatarText: "He", wechatId: "henderson_logistics", 
        signature: "Logistics & Supply Chain Management." 
    },
    "user_landlord": { 
        name: "BKK Landlord", avatarColor: "#8d6e63", avatarText: "La", wechatId: "bkk_rent_01", 
        signature: "Rooms for rent. DM for inquiries." 
    },
    "user_airline": { 
        name: "Thai Airways HR", avatarColor: "#5c6bc0", avatarText: "HR", wechatId: "tg_hr_recruit", 
        signature: "Smooth as silk." 
    },
    "user_adam": { 
        name: "陆原", avatarColor: "#333", avatarText: "Ad", wechatId: "Adam_99", 
        signature: "Carry the vision of the future" 
    }
};

function renderChatList() {
    const listContainer = document.getElementById('chat-list-view');
    listContainer.innerHTML = ''; 
    for (const [id, data] of Object.entries(chatData)) {
        const lastMsg = data.messages.length > 0 ? data.messages[data.messages.length - 1] : null;
        let preview = 'No messages yet';
        
        if (lastMsg) {
            // 修复：兼容 isImg 属性
            if (lastMsg.isImg || lastMsg.type === 'img') preview = '[Image]';
            else if (lastMsg.xhsLink) preview = '[Link Shared]';
            else preview = lastMsg.text;
        }

        listContainer.innerHTML += `
            <div class="contact-item" id="contact-${id}" onclick="openChat('${id}')">
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

    document.querySelectorAll('.contact-item').forEach(item => item.classList.remove('active'));
    document.getElementById(`contact-${userId}`).classList.add('active');

    const adamAvatarHTML = `<div class="msg-avatar" style="background:#333;">Ad</div>`;
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
    const detailContainer = document.getElementById('contacts-detail-view');
    
    // 如果没有配置签名，显示默认占位符
    const signatureText = data.signature ? `"${data.signature}"` : "No signature.";
    
    detailContainer.innerHTML = `
        <div style="text-align:center; background:#fff; padding: 40px; border-radius:8px; box-shadow:0 2px 10px rgba(0,0,0,0.05); width: 320px;">
            <div style="width:80px; height:80px; background:${data.avatarColor}; color:white; font-size:32px; font-weight:bold; display:flex; align-items:center; justify-content:center; border-radius:8px; margin: 0 auto 15px auto;">${data.avatarText}</div>
            <h2 style="margin:0 0 5px 0; color:#333;">${data.name}</h2>
            <p style="color:#999; font-size:13px; margin-bottom: 10px;">WeChat ID: ${data.wechatId}</p>
            <p style="color:#666; font-size:14px; margin-bottom: 30px; font-style: italic;">${signatureText}</p>
            <button onclick="jumpToChatFromContact('${userId}')" style="background:#07c160; color:white; border:none; padding:10px 40px; border-radius:4px; font-size:15px; font-weight:600; cursor:pointer; width: 100%;">Message</button>
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
            messages: [] // 空聊天记录
        };
        renderChatList(); // 刷新左侧的对话列表，把新建立的空对话加进去
    }
    
    openChat(userId); // 打开聊天记录
}

// --- 钱包界面逻辑 ---
function renderWallet() {
    const list = document.getElementById('wallet-records');
    
    // 预设交易记录，完美契合剧情时间线：给Ryan的转账以及给Luna买包的消费
    const records = [
        { title: "Transfer to Ryan", time: "Oct 20, 2023 14:30", amount: "-100,000.00", type: "negative", status: "Returned" },
        { title: "Refund from Ryan", time: "Oct 21, 2023 09:15", amount: "+100,000.00", type: "positive", status: "Success" },
        { title: "Guangzhou Logistics Center (Hermes)", time: "Oct 01, 2023 11:00", amount: "-800,000.00", type: "negative", status: "Success" },
        { title: "Salary Incoming", time: "Sep 30, 2023 18:00", amount: "+25,000.00", type: "positive", status: "Success" }
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

// --- 渲染 Adam 自己的个人主页帖子 ---
function renderAdamProfileFeed() {
    const feedContainer = document.getElementById('xhs-my-feed');
    if (!feedContainer) return;
    
    feedContainer.innerHTML = '';
    const adamData = xhsUsers["adam"];
    
    adamData.posts.forEach(postId => {
        const post = xhsPostData[postId];
        if (post) {
            feedContainer.innerHTML += `
                <div class="xhs-post" onclick="openXhsDetail('${postId}')">
                    <img src="${post.img}" alt="post">
                    <div class="xhs-post-title">${post.text.substring(0, 30)}...</div>
                </div>`;
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
        { title: "BKK Wedding Planners", icon: "💍", url: "www.bkk-weddings.th" },
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
            // 3. 曼谷死亡新闻报道 (核心剧情线索！)
            { 
                url: "www.bkk-daily.com/news/tourist-incident", 
                title: "Tragic Incident: Foreign Guest Found Dead at Wedding Venue", 
                snippet: "Local authorities are investigating the sudden death of 32-year-old Adam at a wedding venue. Preliminary reports suggest a suspected overdose... traveled with his girlfriend, Luna...",
                clickAction: "navBrowser('news-adam')"
            },
            // 4. LinkedIn 档案 (职业线索)
            { 
                url: "www.linkedin.com/in/adam-operations", 
                title: "Adam - Airport Operations Supervisor - LinkedIn", 
                snippet: "Experienced Operations Supervisor with a demonstrated history of working in the aviation and airport industry. Skilled in logistics and passenger safety.",
                clickAction: "navBrowser('linkedin-adam')"
            },
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
        // Gemini编了一个药物“Novacard”，我们在搜索结果里埋了一个线索（小红书帖子），点击后直接跳转到小红书的对应帖子详情页
        "novacard": [
            { 
                url: "www.wikihealth.org/novacard", 
                title: "Novacard (Medication) - WikiHealth", 
                snippet: "Novacard is a prescription medication primarily used to treat chronic cardiac arrhythmias. <strong>Warning:</strong> The authentic pills are small, blue, and hexagonal. Do not crush or chew...",
                clickAction: ""
            },
            { 
                url: "www.xiaohongshu.com/explore/luna_burner_post", 
                title: "Is this normal? Found Novacard in his bag... - Xiaohongshu", 
                snippet: "2 days ago — I found this <strong>Novacard</strong> bottle in my boyfriend's luggage. But the pills inside are white and round, not blue. He insisted on making me hot milk...",
                clickAction: "jumpToXhsFromBrowser('luna_burner_post')" // 直接调用我们之前写的跨应用跳转函数
            },
            { 
                url: "www.medforum.com/reviews/novacard", 
                title: "Novacard Side Effects and Reviews - MedForum", 
                snippet: "User discussions on the side effects of Novacard. Many users report mild drowsiness during the first week of usage...",
                clickAction: ""
            }
        ],
    }
};

// --- 浏览器逻辑 ---

// --- 更新后的导航函数，支持后退栈、动态标题和真实 URL ---
function navBrowser(viewId, isBack = false) {
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

// // 借用现有的 Preview 窗口展示大图 (简单的覆盖逻辑)
// function openImagePreview(url) {
//     const previewWin = document.getElementById('win-preview');
//     // 修改 Preview 窗口的内容为图片
//     const contentArea = previewWin.querySelector('.receipt-paper').parentElement;
//     contentArea.innerHTML = `<img src="${url}" style="max-width:90%; border:5px solid white; box-shadow: 0 5px 15px rgba(0,0,0,0.5);">`;
//     openWindow('win-preview');
// }

// // 借用现有的 Preview 窗口展示日记内容
// function openDiaryPreview(title, content) {
//     const previewWin = document.getElementById('win-preview');
//     const contentArea = previewWin.querySelector('.receipt-paper').parentElement;
//     contentArea.innerHTML = `
//         <div style="background:#fff; padding:30px; width:80%; min-height:80%; font-family:serif; line-height:1.6; color:#222; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
//             <h4 style="border-bottom:1px solid #eee; padding-bottom:10px;">${title}</h4>
//             <p style="white-space: pre-wrap; font-size:14px;">${content}</p>
//         </div>`;
//     openWindow('win-preview');
// }


// 修改 script.js 中的 openImagePreview 函数
function openImagePreview(url) {
    const previewWin = document.getElementById('win-preview');
    // 获取存放内容的容器（.title-bar 下方的那个 div）
    const contentArea = previewWin.querySelector('.title-bar').nextElementSibling;
    
    // 彻底清空内容，防止旧的 receipt 或 image 干扰
    contentArea.innerHTML = '';
    contentArea.style = "background:#1a1a1a; flex:1; display:flex; align-items:center; justify-content:center; overflow:hidden;";

    // 创建新的图片元素
    const img = document.createElement('img');
    img.src = url;
    img.style = "max-width:90%; max-height:90%; border:5px solid white; box-shadow: 0 10px 30px rgba(0,0,0,0.5); object-fit: contain;";
    
    contentArea.appendChild(img);
    
    // 打开窗口并置顶
    previewWin.style.display = 'flex';
    previewWin.style.zIndex = ++zIndex;
}

// 同时也建议修复一下 openDiaryPreview 确保它也不会破坏结构
function openDiaryPreview(title, content) {
    const previewWin = document.getElementById('win-preview');
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
    
    // if (pwd === "LC20220808") {
    //     navBrowser('couple-main'); // 密码正确，调用导航函数去主页
    // } 
    

    if (pwd === "LC20220808") {
        // [新增] 成功登录后，向历史记录最前面添加一条“主页”记录
        browserData.history.unshift({ 
            time: "Just now", 
            title: "Our Eternal Aurora - C&L", 
            url: "www.aurora-love-forever.com/home",
            clickAction: "navBrowser('couple-main')" 
        });
        navBrowser('couple-main'); // 进入主页
    }

    
    else {
        // 密码错误逻辑
        errorMsg.innerText = "Only for those who remember the beginning.";
        const inputField = document.getElementById('couple-pwd-input');
        inputField.style.animation = "shake 0.3s";
        setTimeout(() => inputField.style.animation = "", 300);
    }
}


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



// --- 桌面测试资源数据 (1920-2027 符合逻辑) ---
const desktopFiles = [
    { name: "ryan_school.jpg", url: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=200%22%20" },
    { name: "adam_school.jpg", url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200" },
    { name: "chris_school.jpg", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200" },
    { name: "luna_now.png", url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200" },
    { name: "adam_now.jpg", url: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=200" },
    { name: "chris_now.jpg", url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200" }
];

// 渲染桌面图标函数
function renderDesktop() {
    const container = document.getElementById('desktop-icons');
    if (!container) return;
    container.innerHTML = '';
    desktopFiles.forEach(file => {
        container.innerHTML += `
            <div class="desktop-item" onclick="openImagePreview('${file.url}')">
                <img src="${file.url}" class="desktop-icon-img">
                <div class="icon-name">${file.name}</div>
            </div>`;
    });
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
        alert("Please select photos from the desktop first."); 
        return; 
    }

    const nameA = imgA.getAttribute('data-name');
    const nameB = imgB.getAttribute('data-name');

    // 开启扫描动画
    document.querySelectorAll('.face-slot').forEach(el => el.classList.add('scanning'));
    
    setTimeout(() => {
        document.querySelectorAll('.face-slot').forEach(el => el.classList.remove('scanning'));
        
        let sim = 0;
        let verdict = "";

        const isRyan = (n) => n.toLowerCase().includes('ryan');
        const isLuna = (n) => n.toLowerCase().includes('luna');
        const isAdam = (n) => n.toLowerCase().includes('adam');
        const isChris = (n) => n.toLowerCase().includes('chris');

        // --- 核心判定逻辑 ---
        
        // 1. 完全同一张照片
        if (nameA === nameB) {
            sim = 99; 
            verdict = "Identical Biological Signature";
        }
        // 2. 同一个人，不同时期的照片 (Adam vs Adam / Chris vs Chris)
        else if ((isAdam(nameA) && isAdam(nameB)) || (isChris(nameA) && isChris(nameB))) {
            sim = Math.floor(Math.random() * 11) + 80; // 80%-90%
            verdict = "Identity Match Confirmed";
        }
        // 3. Ryan 和 Luna (兄妹线索)
        else if ((isRyan(nameA) && isLuna(nameB)) || (isLuna(nameA) && isRyan(nameB))) {
            sim = Math.floor(Math.random() * 11) + 55; // 55%-65%
            verdict = "Significant Genetic Correlation";
        }
        // 4. 跨人配对 (完全无血缘)
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
    
    // 渲染桌面上的图片作为选项
    desktopFiles.forEach(file => {
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
    
    // 关键：在这里给图片加上 data-name，以便 runFaceRecognition 识别
    previewBox.innerHTML = `<img src="${file.url}" data-name="${file.name}">`;
    
    closeFilePicker();
}

function closeFilePicker() {
    document.getElementById('file-picker-modal').style.display = 'none';
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
    renderDesktop();
    renderBookmarks(); 
    renderXhsHomeFeed();
    renderAdamProfileFeed();

    navBrowser('home');

    setInterval(() => {
        document.getElementById('clock').innerText = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
    }, 1000);
}

// 页面加载完毕后执行初始化
initGame();


