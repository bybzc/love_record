function createMessageBox(imageUrl, content, time) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';

    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'avatar';
    const avatarImg = document.createElement('img');
    avatarImg.src = imageUrl;
    avatarImg.alt = '头像';
    avatarImg.style= "width:50px;height:50px";
    avatarDiv.appendChild(avatarImg);

    const messageContentDiv = document.createElement('div');
    messageContentDiv.className = 'message-content';

    const messageTimeDiv = document.createElement('div');
    messageTimeDiv.className = 'message-time';
    messageTimeDiv.textContent = time;
    const messageTextP = document.createElement('p');
    messageTextP.className = 'message-text';
    messageTextP.textContent = content;

    messageContentDiv.appendChild(messageTimeDiv);
    messageContentDiv.appendChild(messageTextP);

    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(messageContentDiv);

    return messageDiv;
}
function formatDateTime(date) {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // 获取月份，并确保两位数显示
    const day = ('0' + date.getDate()).slice(-2); // 获取日期，并确保两位数显示
    const hour = ('0' + date.getHours()).slice(-2); // 获取小时，并确保两位数显示
    const minute = ('0' + date.getMinutes()).slice(-2); // 获取分钟，并确保两位数显示
    const second = ('0' + date.getSeconds()).slice(-2); // 获取秒钟，并确保两位数显示

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

async function postFormRequest(url, formData) {
    try {
        const response = await axios.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log('Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error; // 抛出错误以便上层函数捕获
    }
}

async function submitMessage() {
    // 获取用户输入的留言
    let messageValue = document.getElementById('message').value;

    // 获取用户选择的图片文件
    const imageFileInput = document.getElementById('image');
    let imageFile = null;

    if (imageFileInput.files.length > 0) {
        imageFile = imageFileInput.files[0];
    }

    const formData = new FormData();
    formData.append('content', messageValue);
    formData.append('image', imageFile);
    formData.append('date', formatDateTime(new Date()));

    try {
        // 等待 postFormRequest 执行完成
        let data = await postFormRequest('http://localhost:1314/add_message', formData);
        let imageUrl = data.imageUrl;

        // 创建留言元素并添加到留言板
        const container = document.getElementById('messageBoard');
        const date = formatDateTime(new Date());
        let message = createMessageBox(imageUrl, messageValue, date);
        container.insertBefore(message, container.firstChild);

        // 清空文本框
        document.getElementById('message').value = '';
        document.getElementById('image').value = '';
    } catch (error) {
        // 处理错误
        console.error('Failed to submit message:', error);
    }
}

async function getRequest(url) {
    try {
        const response = await axios.get(url);
        console.log('Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error; // 抛出错误以便上层函数捕获
    }
}

// 填充消息
async function populateMessages() {
    const data = await getRequest('http://localhost:1314/get_message')
    const container = document.getElementById('messageBoard');
    data.forEach(row => {
        container.insertBefore(createMessageBox(row[2], row[1], row[0]),container.firstChild); // 修正参数顺序
    });
}

function getRandomInt(min, max) {
    min = Math.ceil(min); // 将最小值向上取整
    max = Math.floor(max); // 将最大值向下取整
    return Math.floor(Math.random() * (max - min)) + min; // 返回随机整数
}

function setBackgrount() {
    const wrap = document.getElementById('wrap');

    randomNum = getRandomInt(1, 10); 
    let imageUrl = './imgs/we/t' + randomNum + '.jpg';
    wrap.style.backgroundImage = 'url(' + imageUrl + ')';
}
