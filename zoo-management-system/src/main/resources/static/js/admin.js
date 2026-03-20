// admin.js - 管理员页面核心逻辑（完整CRUD）
document.addEventListener('DOMContentLoaded', function() {
    // 1. 通用：加载登录用户信息
    const user = checkLogin();
    if (user) {
        const nicknameEl = document.getElementById('nickname');
        if (nicknameEl) {
            nicknameEl.textContent = user.nickname;
        }
    }

    // 2. 通用方法：刷新首页最近添加的动物（替代404接口）
    function refreshRecentAnimals() {
        request('/api/admin/animals', 'GET', null, function(res) {
            const container = document.getElementById('recentAnimals');
            if (!container) return; // 非首页则跳过

            container.innerHTML = '';
            if (!res.data || res.data.length === 0) {
                container.innerHTML = '<p>暂无动物数据～🐾</p>';
                return;
            }

            // 按ID倒序排序（新添加的动物ID更大），取前5个
            const recentAnimals = res.data.sort((a, b) => (b.id || 0) - (a.id || 0)).slice(0, 5);

            recentAnimals.forEach(animal => {
                const item = document.createElement('div');
                item.className = 'animal-card';
                item.innerHTML = `
                    <img src="${animal.imageUrl || '/images/animal/default.jpg'}" alt="${animal.name}">
                    <h3>${animal.name || '未知动物'}</h3>
                    <p>类型：${animal.type || '未知'} | 年龄：${animal.age || 0}岁</p>
                `;
                container.appendChild(item);
            });

            // 清除刷新标记
            sessionStorage.removeItem('needRefreshRecentAnimals');
        }, function(err) {
            // 错误处理：显示友好提示
            const container = document.getElementById('recentAnimals');
            if (container) {
                container.innerHTML = `<p style="color: #ff6b8b;">加载失败：${err}</p>`;
            }
        });
    }

    // 3. 首页（index.html）逻辑
    if (window.location.pathname.includes('index.html')) {
        // 加载动物总数
        function loadAnimalCount() {
            request('/api/admin/animals', 'GET', null, function(res) {
                const el = document.getElementById('animalCount');
                if (el) el.textContent = res.data ? res.data.length : 0;
            });
        }

        // 加载园区总数
        function loadParkCount() {
            request('/api/admin/parks', 'GET', null, function(res) {
                const el = document.getElementById('parkCount');
                if (el) el.textContent = res.data ? res.data.length : 0;
            });
        }

        // 加载用户总数
        function loadUserCount() {
            request('/api/admin/users', 'GET', null, function(res) {
                const el = document.getElementById('userCount');
                if (el) el.textContent = res.data ? res.data.length : 0;
            });
        }

        // 初始化加载首页数据
        loadAnimalCount();
        loadParkCount();
        loadUserCount();
        refreshRecentAnimals();

        // 检查并刷新数据（从其他页面返回时）
        function checkAndRefresh() {
            if (sessionStorage.getItem('needRefreshRecentAnimals') === 'true') {
                loadAnimalCount();
                refreshRecentAnimals();
            }
        }

        // 页面切回/激活时刷新
        window.addEventListener('visibilitychange', function() {
            if (!document.hidden) checkAndRefresh();
        });
        window.addEventListener('focus', checkAndRefresh);
    }

    // 4. 动物管理页（animal-manage.html）逻辑
    if (window.location.pathname.includes('animal-manage.html')) {
        // 加载园区下拉框（通用方法）
        function loadParkSelect(selectId) {
            request('/api/admin/parks', 'GET', null, function(res) {
                const select = document.getElementById(selectId);
                if (!select) return;

                // 清空原有选项（保留默认）
                select.innerHTML = '<option value="">选择园区</option>';

                if (res.data && res.data.length > 0) {
                    res.data.forEach(park => {
                        const option = document.createElement('option');
                        option.value = park.id;
                        option.textContent = park.name;
                        select.appendChild(option);
                    });
                }
            });
        }

        // 加载动物列表
        function loadAnimalList() {
            request('/api/admin/animals', 'GET', null, function(res) {
                const container = document.getElementById('animalList');
                if (!container) return;

                container.innerHTML = '';
                if (!res.data || res.data.length === 0) {
                    container.innerHTML = '<p>暂无动物数据～🐾</p>';
                    return;
                }

                // 创建动物列表表格
                const table = document.createElement('table');
                table.className = 'table';
                table.innerHTML = `
                    <thead>
                        <tr>
                            <th>动物名称</th>
                            <th>类型</th>
                            <th>年龄</th>
                            <th>所属园区</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                `;
                const tbody = table.querySelector('tbody');

                // 渲染动物数据
                res.data.forEach(animal => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${animal.name || '未知'}</td>
                        <td>${animal.type || '未知'}</td>
                        <td>${animal.age || 0}岁</td>
                        <td>${getParkNameById(animal.parkId)}</td>
                        <td>
                            <button class="btn btn-primary btn-edit" data-id="${animal.id}" style="margin-right:5px;">修改</button>
                            <button class="btn btn-secondary btn-delete" data-id="${animal.id}">删除</button>
                        </td>
                    `;
                    tbody.appendChild(tr);
                });
                container.appendChild(table);

                // 绑定删除事件
                document.querySelectorAll('.btn-delete').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const id = this.getAttribute('data-id');
                        if (!id) return;

                        if (confirm('确定要删除这个可爱的动物吗？🐾')) {
                            request(`/api/admin/animal/${id}`, 'DELETE', null, function(res) {
                                alert(res.msg || '删除成功！');
                                loadAnimalList(); // 刷新列表
                                sessionStorage.setItem('needRefreshRecentAnimals', 'true'); // 标记首页刷新
                            });
                        }
                    });
                });

                // 绑定修改事件
                document.querySelectorAll('.btn-edit').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const id = this.getAttribute('data-id');
                        // 查找当前动物数据
                        const animal = res.data.find(item => item.id == id);
                        if (!animal) return;

                        // 填充编辑表单
                        document.getElementById('editAnimalId').value = animal.id;
                        document.getElementById('editAnimalName').value = animal.name || '';
                        document.getElementById('editAnimalType').value = animal.type || '';
                        document.getElementById('editAnimalAge').value = animal.age || 0;
                        document.getElementById('editAnimalIntro').value = animal.intro || '';
                        document.getElementById('editAnimalImageUrl').value = animal.imageUrl || '';

                        // 加载园区下拉框并选中当前园区
                        loadParkSelect('editParkSelect');
                        setTimeout(() => {
                            document.getElementById('editParkSelect').value = animal.parkId || '';
                        }, 200);

                        // 显示编辑表单
                        document.getElementById('editAnimalCard').style.display = 'block';
                    });
                });
            });
        }

        // 取消编辑动物
        const cancelEditAnimal = document.getElementById('cancelEditAnimal');
        if (cancelEditAnimal) {
            cancelEditAnimal.addEventListener('click', function() {
                document.getElementById('editAnimalCard').style.display = 'none';
                document.getElementById('editAnimalForm').reset();
            });
        }

        // 提交编辑动物表单
        const editAnimalForm = document.getElementById('editAnimalForm');
        if (editAnimalForm) {
            editAnimalForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const id = document.getElementById('editAnimalId').value;
                const formData = new FormData(this);
                const data = Object.fromEntries(formData.entries());

                // 补全默认值
                if (!data.imageUrl) data.imageUrl = '/images/animal/default.jpg';
                if (!data.age) data.age = 0;

                // 提交修改请求
                request(`/api/admin/animal/${id}`, 'PUT', data, function(res) {
                    alert(res.msg || '修改动物成功！🐼');
                    if (res.code === 200 || res.success) {
                        document.getElementById('editAnimalCard').style.display = 'none';
                        editAnimalForm.reset();
                        loadAnimalList(); // 刷新列表
                        sessionStorage.setItem('needRefreshRecentAnimals', 'true');
                    }
                });
            });
        }

        // 根据园区ID获取名称（简化版）
        function getParkNameById(parkId) {
            const parkMap = {1: '熊猫馆', 2: '企鹅馆', 3: '长颈鹿园', 4: '鸟类乐园'};
            return parkMap[parkId] || '未知园区';
        }

        // 绑定添加动物表单提交事件
        const addForm = document.getElementById('addAnimalForm');
        if (addForm) {
            addForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const formData = new FormData(this);
                const data = Object.fromEntries(formData.entries());

                // 补全默认值
                if (!data.imageUrl) data.imageUrl = '/images/animal/default.jpg';
                if (!data.age) data.age = 0;

                // 提交添加请求
                request('/api/admin/animal', 'POST', data, function(res) {
                    alert(res.msg || '添加动物成功！🐥');
                    if (res.code === 200 || res.success) {
                        addForm.reset();
                        loadAnimalList(); // 刷新列表
                        sessionStorage.setItem('needRefreshRecentAnimals', 'true');
                    }
                });
            });
        }

        // 初始化加载
        loadParkSelect('parkSelect');
        loadAnimalList();
    }

    // 5. 园区管理页（park-manage.html）逻辑
    if (window.location.pathname.includes('park-manage.html')) {
        // 加载园区列表
        function loadParkList() {
            request('/api/admin/parks', 'GET', null, function(res) {
                const container = document.getElementById('parkList');
                if (!container) return;

                container.innerHTML = '';
                if (!res.data || res.data.length === 0) {
                    container.innerHTML = '<p>暂无园区数据～🏞️</p>';
                    return;
                }

                // 创建园区表格
                const table = document.createElement('table');
                table.className = 'table';
                table.innerHTML = `
                    <thead>
                        <tr>
                            <th>园区名称</th>
                            <th>位置</th>
                            <th>介绍</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                `;
                const tbody = table.querySelector('tbody');

                res.data.forEach(park => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${park.name || '未知'}</td>
                        <td>${park.location || '未知'}</td>
                        <td>${park.intro || '无'}</td>
                        <td>
                            <button class="btn btn-primary btn-edit" data-id="${park.id}" style="margin-right:5px;">修改</button>
                            <button class="btn btn-secondary btn-delete" data-id="${park.id}">删除</button>
                        </td>
                    `;
                    tbody.appendChild(tr);
                });
                container.appendChild(table);

                // 绑定删除事件
                document.querySelectorAll('.btn-delete').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const id = this.getAttribute('data-id');
                        if (!id) return;

                        if (confirm('确定要删除这个园区吗？🏞️')) {
                            request(`/api/admin/park/${id}`, 'DELETE', null, function(res) {
                                alert(res.msg || '删除成功！');
                                loadParkList();
                            });
                        }
                    });
                });

                // 绑定修改事件
                document.querySelectorAll('.btn-edit').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const id = this.getAttribute('data-id');
                        const park = res.data.find(item => item.id == id);
                        if (!park) return;

                        // 填充编辑表单
                        document.getElementById('editParkId').value = park.id;
                        document.getElementById('editParkName').value = park.name || '';
                        document.getElementById('editParkLocation').value = park.location || '';
                        document.getElementById('editParkIntro').value = park.intro || '';
                        document.getElementById('editParkImageUrl').value = park.imageUrl || '';

                        // 显示编辑表单
                        document.getElementById('editParkCard').style.display = 'block';
                    });
                });
            });
        }

        // 取消编辑园区
        const cancelEditPark = document.getElementById('cancelEditPark');
        if (cancelEditPark) {
            cancelEditPark.addEventListener('click', function() {
                document.getElementById('editParkCard').style.display = 'none';
                document.getElementById('editParkForm').reset();
            });
        }

        // 提交编辑园区表单
        const editParkForm = document.getElementById('editParkForm');
        if (editParkForm) {
            editParkForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const id = document.getElementById('editParkId').value;
                const formData = new FormData(this);
                const data = Object.fromEntries(formData.entries());

                if (!data.imageUrl) data.imageUrl = '/images/park/default.jpg';

                // 提交修改请求
                request(`/api/admin/park/${id}`, 'PUT', data, function(res) {
                    alert(res.msg || '修改园区成功！🏞️');
                    if (res.code === 200 || res.success) {
                        document.getElementById('editParkCard').style.display = 'none';
                        editParkForm.reset();
                        loadParkList();
                    }
                });
            });
        }

        // 绑定添加园区表单
        const addForm = document.getElementById('addParkForm');
        if (addForm) {
            addForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const formData = new FormData(this);
                const data = Object.fromEntries(formData.entries());

                if (!data.imageUrl) data.imageUrl = '/images/park/default.jpg';

                request('/api/admin/park', 'POST', data, function(res) {
                    alert(res.msg || '添加园区成功！🏞️');
                    if (res.code === 200 || res.success) {
                        addForm.reset();
                        loadParkList();
                    }
                });
            });
        }

        loadParkList();
    }

    // 6. 用户管理页（user-manage.html）逻辑
    if (window.location.pathname.includes('user-manage.html')) {
        // 加载用户列表
        function loadUserList() {
            request('/api/admin/users', 'GET', null, function(res) {
                const container = document.getElementById('userList');
                if (!container) return;

                container.innerHTML = '';
                if (!res.data || res.data.length === 0) {
                    container.innerHTML = '<p>暂无用户数据～👥</p>';
                    return;
                }

                // 创建用户表格
                const table = document.createElement('table');
                table.className = 'table';
                table.innerHTML = `
                    <thead>
                        <tr>
                            <th>用户名</th>
                            <th>昵称</th>
                            <th>角色</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                `;
                const tbody = table.querySelector('tbody');

                // 角色映射
                const roleMap = {
                    'admin': '管理员',
                    'keeper': '饲养员',
                    'visitor': '游客'
                };

                res.data.forEach(user => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${user.username || '未知'}</td>
                        <td>${user.nickname || '未知'}</td>
                        <td>${roleMap[user.role] || '未知'}</td>
                        <td>
                            <button class="btn btn-primary btn-edit" data-id="${user.id}" style="margin-right:5px;">修改</button>
                            <button class="btn btn-secondary btn-delete" data-id="${user.id}">删除</button>
                        </td>
                    `;
                    tbody.appendChild(tr);
                });
                container.appendChild(table);

                // 绑定删除事件
                document.querySelectorAll('.btn-delete').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const id = this.getAttribute('data-id');
                        if (!id) return;

                        if (confirm('确定要删除这个用户吗？👥')) {
                            request(`/api/admin/user/${id}`, 'DELETE', null, function(res) {
                                alert(res.msg || '删除成功！');
                                loadUserList();
                            });
                        }
                    });
                });

                // 绑定修改事件
                document.querySelectorAll('.btn-edit').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const id = this.getAttribute('data-id');
                        const user = res.data.find(item => item.id == id);
                        if (!user) return;

                        // 填充编辑表单
                        document.getElementById('editUserId').value = user.id;
                        document.getElementById('editUsername').value = user.username || '';
                        document.getElementById('editNickname').value = user.nickname || '';
                        document.getElementById('editRole').value = user.role || 'visitor';
                        // 密码留空（不默认显示）

                        // 显示编辑表单
                        document.getElementById('editUserCard').style.display = 'block';
                    });
                });
            });
        }

        // 取消编辑用户
        const cancelEditUser = document.getElementById('cancelEditUser');
        if (cancelEditUser) {
            cancelEditUser.addEventListener('click', function() {
                document.getElementById('editUserCard').style.display = 'none';
                document.getElementById('editUserForm').reset();
            });
        }

        // 提交编辑用户表单
        const editUserForm = document.getElementById('editUserForm');
        if (editUserForm) {
            editUserForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const id = document.getElementById('editUserId').value;
                const formData = new FormData(this);
                const data = Object.fromEntries(formData.entries());

                // 密码留空则删除该字段（不修改密码）
                if (!data.password) delete data.password;
                data.avatar = '/images/avatar/default.png'; // 默认头像

                // 提交修改请求
                request(`/api/admin/user/${id}`, 'PUT', data, function(res) {
                    alert(res.msg || '修改用户成功！👥');
                    if (res.code === 200 || res.success) {
                        document.getElementById('editUserCard').style.display = 'none';
                        editUserForm.reset();
                        loadUserList();
                    }
                });
            });
        }

        // 绑定添加用户表单
        const addForm = document.getElementById('addUserForm');
        if (addForm) {
            addForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const formData = new FormData(this);
                const data = Object.fromEntries(formData.entries());

                data.avatar = '/images/avatar/default.png'; // 默认头像

                request('/api/admin/user', 'POST', data, function(res) {
                    alert(res.msg || '添加用户成功！👥');
                    if (res.code === 200 || res.success) {
                        addForm.reset();
                        loadUserList();
                    }
                });
            });
        }

        loadUserList();
    }
});