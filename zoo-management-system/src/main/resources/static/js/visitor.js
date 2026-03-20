// 游客页面通用：加载用户信息
const user = checkLogin();
if (user) {
    document.getElementById('nickname').textContent = user.nickname;
}

// 图片放大预览功能
function initImagePreview() {
    // 创建预览层HTML元素
    const previewDiv = document.createElement('div');
    previewDiv.className = 'image-preview';
    previewDiv.id = 'imagePreview';
    previewDiv.innerHTML = `
        <span class="preview-close">&times;</span>
        <img class="preview-img" src="" alt="">
    `;
    document.body.appendChild(previewDiv);

    const imagePreview = document.getElementById('imagePreview');
    const previewImg = imagePreview.querySelector('.preview-img');
    const previewClose = imagePreview.querySelector('.preview-close');

    // 为所有动物图片添加点击事件
    function addImageClickEvent() {
        // 为首页的动物卡片图片添加点击事件
        const animalImages = document.querySelectorAll('#animalGrid img');
        animalImages.forEach(img => {
            img.addEventListener('click', function() {
                const imgSrc = this.getAttribute('src');
                previewImg.setAttribute('src', imgSrc);
                imagePreview.classList.add('active');
                document.body.style.overflow = 'hidden'; // 禁止背景滚动
            });
        });

        // 为园区导览页的图片添加点击事件
        const parkImages = document.querySelectorAll('#parkDetail img');
        parkImages.forEach(img => {
            img.addEventListener('click', function() {
                const imgSrc = this.getAttribute('src');
                previewImg.setAttribute('src', imgSrc);
                imagePreview.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
    }

    // 关闭预览
    previewClose.addEventListener('click', function() {
        imagePreview.classList.remove('active');
        document.body.style.overflow = '';
    });

    // 点击空白处关闭预览
    imagePreview.addEventListener('click', function(e) {
        if (e.target === imagePreview) {
            imagePreview.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // ESC键关闭预览
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && imagePreview.classList.contains('active')) {
            imagePreview.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // 初始化时添加事件
    addImageClickEvent();

    // 返回函数以便在动态内容加载后重新绑定事件
    return addImageClickEvent;
}

// 初始化图片预览功能
const addImageClickEvent = initImagePreview();

// 游客首页（动物列表）
if (window.location.pathname.includes('index.html')) {
    // 轮播图自动切换
    const carouselImgs = document.querySelectorAll('.carousel-img');
    const dots = document.querySelectorAll('.dot');
    let currentIndex = 0;

    function showSlide(index) {
        carouselImgs.forEach(img => img.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        carouselImgs[index].classList.add('active');
        dots[index].classList.add('active');
        currentIndex = index;
    }

    // 自动切换
    setInterval(() => {
        let nextIndex = (currentIndex + 1) % carouselImgs.length;
        showSlide(nextIndex);
    }, 3000);

    // 点击 dots 切换
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            showSlide(index);
        });
    });

    // 加载动物列表
    request('/api/visitor/animals', 'GET', null, function(res) {
        const container = document.getElementById('animalGrid');
        container.innerHTML = '';
        res.data.forEach(animal => {
            const card = document.createElement('div');
            card.className = 'card animal-card fade-in';
            card.style.animationDelay = `${Math.random() * 0.5}s`;
            card.innerHTML = `
                <img src="${animal.imageUrl || '/images/animal/default.jpg'}" alt="${animal.name}">
                <h3>${animal.name}</h3>
                <p>类型：${animal.type}</p>
                <p>年龄：${animal.age}岁</p>
                <p class="intro">${animal.intro || '可爱的小动物～'}</p>
            `;
            container.appendChild(card);
        });

        // 为新加载的图片添加点击事件
        addImageClickEvent();
    });
}

// 园区导览页
if (window.location.pathname.includes('zoo-guide.html')) {
    // 加载园区数据（缓存）
    let parkList = [];
    request('/api/visitor/parks', 'GET', null, function(res) {
        parkList = res.data;
    });

    // 点击地图热点查看园区详情
    document.querySelectorAll('.map-hotspot').forEach(hotspot => {
        hotspot.addEventListener('click', function() {
            const parkId = parseInt(this.getAttribute('data-park-id'));
            const park = parkList.find(p => p.id === parkId);
            if (!park) return;

            // 更新园区标题
            document.getElementById('parkTitle').textContent = `🏞️ ${park.name}`;

            // 加载该园区的动物
            request(`/api/visitor/park/${parkId}/animals`, 'GET', null, function(res) {
                const detailContainer = document.getElementById('parkDetail');
                detailContainer.innerHTML = `
                    <img src="${park.imageUrl || '/images/park/default.jpg'}" alt="${park.name}">
                    <p><strong>位置：</strong>${park.location}</p>
                    <p><strong>介绍：</strong>${park.intro || '暂无介绍～'}</p>
                    <h4>🐾 园区内的动物：</h4>
                `;

                if (res.data.length === 0) {
                    detailContainer.innerHTML += '<p>该园区暂无动物～</p>';
                    return;
                }

                const animalList = document.createElement('div');
                animalList.className = 'grid';
                res.data.forEach(animal => {
                    const animalCard = document.createElement('div');
                    animalCard.className = 'card animal-card';
                    animalCard.innerHTML = `
                        <img src="${animal.imageUrl || '/images/animal/default.jpg'}" alt="${animal.name}">
                        <h3>${animal.name}</h3>
                        <p>${animal.intro || '可爱的小动物～'}</p>
                    `;
                    animalList.appendChild(animalCard);
                });
                detailContainer.appendChild(animalList);

                // 为新加载的图片添加点击事件
                addImageClickEvent();
            });
        });
    });
}
