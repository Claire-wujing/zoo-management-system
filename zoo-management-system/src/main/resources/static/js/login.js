// 登录表单提交事件
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();  // 阻止表单默认提交

    // 直接获取表单元素（因为已经加了name属性）
    const form = this;
    const formData = new FormData(form);  // 自动获取所有带name的输入值

    // 显示加载中
    const loginBtn = document.querySelector('.btn-login');
    loginBtn.disabled = true;
    loginBtn.innerHTML = '登录中... 🐼';

    // 【关键修改】改用表单格式提交，不用JSON
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/login', true);
    // 不用设置Content-Type，浏览器会自动设置为multipart/form-data
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            const res = JSON.parse(xhr.responseText);
            if (res.code === 200) {
                // 登录成功，保存用户信息到本地存储
                localStorage.setItem('user', JSON.stringify(res.data));
                alert(res.msg);

                // 根据角色跳转到对应页面
                const role = formData.get('role');
                switch(role) {
                    case 'admin':
                        window.location.href = 'admin/index.html';
                        break;
                    case 'keeper':
                        window.location.href = 'keeper/index.html';
                        break;
                    case 'visitor':
                        window.location.href = 'visitor/index.html';
                        break;
                }
            } else {
                alert(res.msg);
            }
        } else {
            alert('登录失败！');
        }
        // 恢复按钮状态
        loginBtn.disabled = false;
        loginBtn.innerHTML = '登录 🐾';
    };

    xhr.onerror = function() {
        alert('网络错误！请重试');
        loginBtn.disabled = false;
        loginBtn.innerHTML = '登录 🐾';
    };

    xhr.send(formData);  // 直接发送FormData，不用转JSON
});
