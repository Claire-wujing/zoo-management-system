// common.js - 通用工具函数（修复错误回调 + 登录校验）
function request(url, method, data, successCallback, errorCallback) {
    const xhr = new XMLHttpRequest();
    // 拼接完整接口地址（如果你的后端地址不是8080，自行修改）
    const baseUrl = 'http://localhost:8080';
    const fullUrl = baseUrl + url;

    xhr.open(method, fullUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    // 默认错误回调：避免 is not a function 报错
    const defaultErrorCallback = function(err) {
        console.error('请求失败：', err);
        alert('接口请求失败，请检查网络或接口是否存在');
    };
    const finalErrorCallback = errorCallback || defaultErrorCallback;

    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const res = JSON.parse(xhr.responseText);
                successCallback(res);
            } catch (e) {
                finalErrorCallback('解析返回数据失败：' + e.message);
            }
        } else {
            finalErrorCallback(`请求失败，状态码：${xhr.status}，接口：${fullUrl}`);
        }
    };

    // 网络错误处理
    xhr.onerror = function() {
        finalErrorCallback(`网络请求失败，接口：${fullUrl}`);
    };

    xhr.send(data ? JSON.stringify(data) : null);
}

// 登录状态校验：未登录则跳转到登录页
function checkLogin() {
    const user = localStorage.getItem('user');
    if (!user) {
        window.location.href = '/html/login.html';
        return null;
    }
    try {
        return JSON.parse(user);
    } catch (e) {
        localStorage.removeItem('user');
        window.location.href = '/html/login.html';
        return null;
    }
}

// 退出登录功能
function logout() {
    localStorage.removeItem('user');
    alert('退出登录成功！');
    window.location.href = '/html/login.html';
}

// 全局绑定退出登录按钮
document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.querySelector('.btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
});