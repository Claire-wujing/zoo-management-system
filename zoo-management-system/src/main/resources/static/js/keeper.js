// 全局变量
let user = null;
let animalList = [];
let isAnimalListLoaded = false;
let allFeedingRecords = []; // 存储所有记录，用于筛选

// 页面入口
document.addEventListener('DOMContentLoaded', function() {
    user = checkLogin();
    if (!user) return;

    // 显示用户名
    const nicknameEl = document.getElementById('nickname');
    if (nicknameEl) {
        nicknameEl.textContent = user.nickname || user.username;
    }

    // 初始化页面
    const path = window.location.pathname;
    if (path.includes('index.html')) {
        initIndexPage();
    } else if (path.includes('feeding-record.html')) {
        initFeedingRecordPage();
        // 绑定筛选和弹窗事件
        bindFilterEvents();
        bindModalEvents();
        bindEditFormEvent();
    }
});

// 首页初始化
function initIndexPage() {
    loadAnimals(function() {
        document.getElementById('animalCount').textContent = animalList.length;
        document.getElementById('recordCount').textContent = '0';
        loadMyFeedingRecords();
    });
}

// 喂食记录页初始化
function initFeedingRecordPage() {
    loadAnimals(function() {
        fillAnimalSelect();
        fillFilterAnimalSelect(); // 填充筛选下拉框
        loadMyFeedingRecords();
    });
}

// 加载动物列表
function loadAnimals(callback) {
    if (isAnimalListLoaded && animalList.length > 0) {
        typeof callback === 'function' && callback();
        return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/keeper/animals', true);

    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            const res = JSON.parse(xhr.responseText);
            if (res.code === 200 && res.data) {
                animalList = res.data.map(animal => ({
                    ...animal,
                    id: parseInt(animal.id)
                }));
                isAnimalListLoaded = true;
                typeof callback === 'function' && callback();
            } else {
                alert('获取动物列表失败：' + (res.msg || '未知错误'));
            }
        } else {
            alert('获取动物列表失败！状态码：' + xhr.status);
        }
    };

    xhr.onerror = function() {
        alert('网络错误，无法获取动物列表～');
    };

    xhr.send();
}

// 填充新增动物下拉框
function fillAnimalSelect() {
    const selectEl = document.getElementById('animalSelect');
    const editSelectEl = document.getElementById('editAnimalSelect');
    if (!selectEl) return;

    selectEl.innerHTML = '<option value="">选择要喂食的动物</option>';
    if (editSelectEl) {
        editSelectEl.innerHTML = '<option value="">选择要喂食的动物</option>';
    }

    animalList.forEach(animal => {
        const option = document.createElement('option');
        option.value = animal.id;
        option.textContent = animal.name;
        selectEl.appendChild(option);

        if (editSelectEl) {
            const editOption = document.createElement('option');
            editOption.value = animal.id;
            editOption.textContent = animal.name;
            editSelectEl.appendChild(editOption);
        }
    });
}

// 填充筛选动物下拉框
function fillFilterAnimalSelect() {
    const filterEl = document.getElementById('filterAnimal');
    if (!filterEl) return;

    filterEl.innerHTML = '<option value="">全部动物</option>';
    animalList.forEach(animal => {
        const option = document.createElement('option');
        option.value = animal.id;
        option.textContent = animal.name;
        filterEl.appendChild(option);
    });
}

// 加载喂食记录（支持筛选）
function loadMyFeedingRecords(filters = null) {
    const container = document.getElementById('myFeedingRecords') || document.getElementById('feedingRecordList');
    if (!container) return;

    // 禁用转圈样式
    container.style.cssText = `
        width: auto !important;
        height: auto !important;
        border: none !important;
        animation: none !important;
        margin: 0 !important;
    `;
    container.innerHTML = '<p>正在加载喂食记录...</p>';

    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/api/keeper/feeding-records/${user.id}`, true);

    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            const res = JSON.parse(xhr.responseText);
            if (res.code === 200 && res.data) {
                // 存储所有记录
                allFeedingRecords = res.data.map(record => ({
                    ...record,
                    id: parseInt(record.id),
                    animalId: parseInt(record.animalId),
                    keeperId: parseInt(record.keeperId)
                }));

                // 更新记录数
                const recordCountEl = document.getElementById('recordCount');
                if (recordCountEl) {
                    recordCountEl.textContent = allFeedingRecords.length;
                }

                // 应用筛选
                let displayRecords = allFeedingRecords;
                if (filters) {
                    displayRecords = filterFeedingRecords(filters);
                }

                renderFeedingRecords(displayRecords, container);
            } else {
                container.innerHTML = '<p>获取记录失败：' + (res.msg || '未知错误') + '</p>';
            }
        } else {
            container.innerHTML = `<p>获取记录失败！状态码：${xhr.status}</p>`;
        }
    };

    xhr.onerror = function() {
        container.innerHTML = '<p>网络错误，无法获取记录～</p>';
    };

    xhr.send();
}

// 渲染喂食记录（添加操作按钮）
function renderFeedingRecords(records, container) {
    if (records.length === 0) {
        container.innerHTML = '<p>暂无喂食记录～ 快去添加吧！🐾</p>';
        return;
    }

    container.innerHTML = '';
    records.forEach(record => {
        const animalName = getAnimalNameById(record.animalId);
        const item = document.createElement('div');
        item.className = 'record-item';

        // 格式化时间为datetime-local兼容格式
        const feedTimeFormatted = record.feedTime
            ? new Date(record.feedTime).toISOString().slice(0, 16)
            : '';

        // 核心修改：用record-content包裹内容，按钮区域独立
        item.innerHTML = `
            <div class="record-content">
                <h4><img src="../../images/icons/feed.png" alt="喂食"> 喂食动物：${animalName}</h4>
                <p>食物：${record.food}</p>
                <p>时间：${formatDate(record.feedTime)}</p>
                <p>备注：${record.note || '无'}</p>
            </div>
            <div class="record-actions">
                <button class="btn btn-secondary edit-btn" 
                        data-id="${record.id}" 
                        data-animal-id="${record.animalId}"
                        data-food="${record.food}"
                        data-feed-time="${feedTimeFormatted}"
                        data-note="${record.note || ''}">
                    编辑
                </button>
                <button class="btn btn-secondary delete-btn" data-id="${record.id}">
                    删除
                </button>
            </div>
        `;
        container.appendChild(item);
    });

    // 绑定编辑/删除按钮事件
    bindRecordActionEvents();
}

// 筛选喂食记录
function filterFeedingRecords(filters) {
    return allFeedingRecords.filter(record => {
        // 动物筛选
        if (filters.animalId && parseInt(record.animalId) !== parseInt(filters.animalId)) {
            return false;
        }
        // 开始时间筛选
        if (filters.startTime) {
            const recordTime = new Date(record.feedTime).getTime();
            const startTime = new Date(filters.startTime).getTime();
            if (recordTime < startTime) return false;
        }
        // 结束时间筛选
        if (filters.endTime) {
            const recordTime = new Date(record.feedTime).getTime();
            const endTime = new Date(filters.endTime).getTime();
            if (recordTime > endTime) return false;
        }
        return true;
    });
}

// 绑定筛选事件
function bindFilterEvents() {
    const btnFilter = document.getElementById('btnFilter');
    const btnReset = document.getElementById('btnResetFilter');
    if (!btnFilter || !btnReset) return;

    // 筛选按钮
    btnFilter.addEventListener('click', function() {
        const filters = {
            animalId: document.getElementById('filterAnimal').value,
            startTime: document.getElementById('filterStartTime').value,
            endTime: document.getElementById('filterEndTime').value
        };
        loadMyFeedingRecords(filters);
    });

    // 重置按钮
    btnReset.addEventListener('click', function() {
        document.getElementById('filterAnimal').value = '';
        document.getElementById('filterStartTime').value = '';
        document.getElementById('filterEndTime').value = '';
        loadMyFeedingRecords();
    });
}

// 绑定编辑/删除按钮事件
function bindRecordActionEvents() {
    // 编辑按钮
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // 填充编辑表单
            document.getElementById('editRecordId').value = this.dataset.id;
            document.getElementById('editAnimalSelect').value = this.dataset.animalId;
            document.getElementById('editFood').value = this.dataset.food;
            document.getElementById('editFeedTime').value = this.dataset.feedTime;
            document.getElementById('editNote').value = this.dataset.note;
            document.getElementById('editKeeperId').value = user.id;

            // 显示弹窗
            document.getElementById('editModal').style.display = 'flex';
        });
    });

    // 删除按钮
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const recordId = this.dataset.id;
            if (!confirm('确定删除这条记录吗？删除后无法恢复！')) return;

            // 禁用按钮防止重复点击
            this.disabled = true;
            this.innerHTML = '删除中...';

            // 调用删除接口
            deleteFeedingRecord(recordId, this);
        });
    });
}

// 绑定弹窗事件
function bindModalEvents() {
    const modal = document.getElementById('editModal');
    const modalClose = document.getElementById('modalClose');
    if (!modal || !modalClose) return;

    // 关闭弹窗
    modalClose.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // 点击弹窗外部关闭
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// 绑定编辑表单提交事件
function bindEditFormEvent() {
    const form = document.getElementById('editFeedingForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // 获取编辑数据
        const recordId = document.getElementById('editRecordId').value;
        const animalId = parseInt(document.getElementById('editAnimalSelect').value);
        const food = document.getElementById('editFood').value.trim();
        const feedTime = document.getElementById('editFeedTime').value;
        const note = document.getElementById('editNote').value.trim();
        const keeperId = parseInt(document.getElementById('editKeeperId').value);

        // 验证
        if (!animalId) { alert('请选择要喂食的动物！'); return; }
        if (!food) { alert('请输入喂食食物！'); return; }
        if (!feedTime) { alert('请选择喂食时间！'); return; }

        // 构造数据
        const recordData = {
            id: parseInt(recordId),
            animalId: animalId,
            keeperId: keeperId,
            food: food,
            feedTime: feedTime,
            note: note,
            createTime: new Date().toISOString()
        };

        // 发送修改请求
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', `/api/keeper/feeding-record/${recordId}`, true);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');

        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                const res = JSON.parse(xhr.responseText);
                alert(res.msg);
                if (res.code === 200) {
                    // 关闭弹窗 + 刷新记录
                    document.getElementById('editModal').style.display = 'none';
                    loadMyFeedingRecords();
                }
            } else {
                alert('修改失败！状态码：' + xhr.status);
            }
        };

        xhr.onerror = function() {
            alert('网络错误，修改失败～');
        };

        xhr.send(JSON.stringify(recordData));
    });
}

// 删除喂食记录
function deleteFeedingRecord(recordId, btn) {
    const xhr = new XMLHttpRequest();
    xhr.open('DELETE', `/api/keeper/feeding-record/${recordId}`, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');

    xhr.onload = function() {
        btn.disabled = false;
        btn.innerHTML = '删除';

        if (xhr.status >= 200 && xhr.status < 300) {
            const res = JSON.parse(xhr.responseText);
            alert(res.msg);
            if (res.code === 200) {
                loadMyFeedingRecords(); // 刷新记录
            }
        } else {
            alert(`删除失败！状态码：${xhr.status}`);
        }
    };

    xhr.onerror = function() {
        btn.disabled = false;
        btn.innerHTML = '删除';
        alert('网络错误，删除失败～');
    };

    xhr.send();
}

// 新增喂食记录
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('addFeedingForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const animalId = parseInt(document.getElementById('animalSelect').value);
        const food = document.querySelector('input[name="food"]').value.trim();
        const feedTime = document.querySelector('input[name="feedTime"]').value;
        const note = document.querySelector('textarea[name="note"]').value.trim();
        const keeperId = user.id;

        // 验证
        if (!animalId) { alert('请选择要喂食的动物！'); return; }
        if (!food) { alert('请输入喂食食物！'); return; }
        if (!feedTime) { alert('请选择喂食时间！'); return; }

        const submitBtn = this.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '提交中... 🐾';

        // 构造数据
        const recordData = {
            animalId: animalId,
            keeperId: keeperId,
            food: food,
            feedTime: feedTime,
            note: note,
            createTime: new Date().toISOString()
        };

        // 发送请求
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/keeper/feeding-record', true);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');

        xhr.onload = function() {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '提交记录 🐾';
            if (xhr.status >= 200 && xhr.status < 300) {
                const res = JSON.parse(xhr.responseText);
                alert(res.msg);
                if (res.code === 200) {
                    form.reset();
                    loadMyFeedingRecords(); // 刷新记录
                }
            } else {
                alert('提交失败！状态码：' + xhr.status);
            }
        };

        xhr.onerror = function() {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '提交记录 🐾';
            alert('网络错误，提交失败～');
        };

        xhr.send(JSON.stringify(recordData));
    });
});

// 工具函数：获取动物名称
function getAnimalNameById(animalId) {
    const targetId = parseInt(animalId);
    const animal = animalList.find(animal => parseInt(animal.id) === targetId);

    if (animal) return animal.name;

    if (!isAnimalListLoaded) {
        setTimeout(() => {
            loadMyFeedingRecords();
        }, 500);
        return '加载中...';
    }

    return '未知动物';
}

// 工具函数：格式化日期
function formatDate(dateStr) {
    if (!dateStr) return '无';
    const date = new Date(dateStr);
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}