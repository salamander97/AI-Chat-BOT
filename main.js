
const sendButton = document.getElementById('send-button');
const messageDisplay = document.getElementById('message-display');
const userInput = document.getElementById('user-input');
const loadingIcon = document.getElementById('loading-icon');
const title = document.querySelector('.title');
const subtitle = document.querySelector('.subtitle');
const subtitle1 = document.querySelector('.subtitle1');

const messageContainerDiv = document.createElement('div');
messageContainerDiv.classList.add('message-container');
messageDisplay.appendChild(messageContainerDiv);

sendButton.addEventListener('click', async () => {
    // sendButton.classList.add('hidden');
    // loadingIcon.classList.remove('hidden');
    const userMessage = userInput.value.trim();
    if (userMessage) {
        title.classList.add('hidden');
        subtitle.classList.add('hidden');
        subtitle1.classList.add('hidden');

        if (userMessage === 'bạn là ai' || userMessage === 'Bạn là ai' || userMessage === 'Ai tạo ra bạn' || userMessage === 'Bạn là chatgpt mấy' || userMessage === 'Bạn là ChatGPT mấy') {
            const botResponse = "Tôi là một phiên bản của Chat GPT, một trí tuệ nhân tạo mạnh mẽ. Được cấu hình lại và tạo ra bởi <a href='https://www.facebook.com/sOckbOy97/' target='_blank'>Trung Hiếu</a>"
        }
        const userMessageContainer = createUserMessageContainer(userMessage);
        // Thêm tin nhắn người dùng vào cuối danh sách
        messageDisplay.appendChild(userMessageContainer);
        userMessageContainer.scrollIntoView({ behavior: 'smooth' });


        userInput.value = '';
    }

    const chatGPTKey = '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';
    const OPEN_AI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

    try {
        const response = await axios.post(
            `${OPEN_AI_ENDPOINT}`,
            {
                model: 'gpt-3.5-turbo-1106',
                messages: [
                    { role: 'system', content: 'You are a helpful assistant.' },
                    { role: 'user', content: userMessage }
                ],
                temperature: 0.9,
                max_tokens: 1500,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${chatGPTKey}`,
                },
            }
        );
        console.log('API Response:', response.data);

        if (!response.data.choices || response.data.choices.length === 0) {
            console.error('No valid response from the OpenAI API.');
            return;
        }


        const aiMessage = response.data.choices[0].message.content;
        const aiMessageContainer = createAiMessageContainer(aiMessage);
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
        // Thêm tin nhắn của chatbot vào cuối danh sách
        messageDisplay.appendChild(aiMessageContainer);
        aiMessageContainer.scrollIntoView({ behavior: 'smooth' })
    } catch (error) {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
        console.error('Error:', error);
    }
    // loadingIcon.classList.add('hidden');
    // sendButton.classList.remove('hidden');

});



function createUserMessageContainer(message) {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message-container');

    const senderIcon = document.createElement('img');
    senderIcon.src = './icon/user.svg';
    senderIcon.classList.add('sender-icon');
    messageContainer.appendChild(senderIcon);

    const messageText = document.createElement('div');
    messageText.classList.add('message-text');
    messageContainer.appendChild(messageText);

    // Kiểm tra xem tin nhắn có phải là mã code không
    if (message.startsWith('```') && message.endsWith('```')) {
        // Tạo một thẻ <pre> và <code> để hiển thị mã
        const pre = document.createElement('pre');
        const code = document.createElement('code');
        code.classList.add('language-javascript'); // Thêm lớp PrismJS
        pre.appendChild(code);
        messageText.appendChild(pre);

        // Loại bỏ các dấu ``
        code.innerText = message.slice(3, -3);

        // Tô màu cú pháp mã với PrismJS
        Prism.highlightElement(code);
    } else {
        // Hiển thị tin nhắn bình thường
        messageText.innerText = message;
    }

    return messageContainer;
}
function createTypingIndicator() {
    const typingIndicatorContainer = document.createElement('div');
    typingIndicatorContainer.classList.add('ai-message-container');
    typingIndicatorContainer.id = 'typing-indicator';

    const aiSenderIcon = document.createElement('img');
    aiSenderIcon.src = './icon/ChatBOT.svg';
    aiSenderIcon.classList.add('ai-sender-icon');
    typingIndicatorContainer.appendChild(aiSenderIcon);

    const aiMessageText = document.createElement('div');
    aiMessageText.classList.add('ai-message-text');
    aiMessageText.innerText = 'AI đang nhập...';
    typingIndicatorContainer.appendChild(aiMessageText);

    messageDisplay.appendChild(typingIndicatorContainer);
    typingIndicatorContainer.scrollIntoView({ behavior: 'smooth' });
}
function createAiMessageContainer(message) {
    const aiMessageContainer = document.createElement('div');
    aiMessageContainer.classList.add('ai-message-container');

    const aiSenderIcon = document.createElement('img');
    aiSenderIcon.src = './icon/ChatBOT.svg';
    aiSenderIcon.classList.add('ai-sender-icon');
    aiMessageContainer.appendChild(aiSenderIcon);

    const aiMessageText = document.createElement('div');
    aiMessageText.classList.add('ai-message-text');
    aiMessageContainer.appendChild(aiMessageText);

    // Hiển thị từng chữ một
    let i = 0;
    function typeWriter() {
        if (i < message.length) {
            if (message.charAt(i) === '\n') {
                // Nếu là ký tự xuống dòng, thêm thẻ <br> vào thay vì hiển thị nó
                aiMessageText.innerHTML += '<br>';
            }
            // Kiểm tra xem tin nhắn có phải là mã code không
            if (message.charAt(i) === '`' && message.charAt(i + 1) === '`' && message.charAt(i + 2) === '`') {
                // Tạo một thẻ <pre> và <code> để hiển thị mã
                const pre = document.createElement('pre');
                const code = document.createElement('code');
                // Thêm lớp PrismJS để hiển thị mã
                code.classList.add('language-javascript');
                pre.appendChild(code);
                aiMessageText.appendChild(pre);

                // Bỏ qua các dấu ``
                i += 3;
                function typeWriterCode() {
                    if (i < message.length && !(message.charAt(i) === '`' && message.charAt(i + 1) === '`' && message.charAt(i + 2) === '`')) {
                        code.innerHTML += message.charAt(i);
                        i++;
                        setTimeout(typeWriterCode, 30); // Thời gian hiển thị giữa các chữ
                    } else {
                        // Bỏ qua các dấu ``
                        i += 3;
                        Prism.highlightElement(code);
                        typeWriter();
                    }
                }
                typeWriterCode();
            } else {
                aiMessageText.innerHTML += message.charAt(i);
                i++;
                setTimeout(typeWriter, 10); // Thời gian hiển thị giữa các chữ
            }
        }
    }
    typeWriter();
    return aiMessageContainer;
}
