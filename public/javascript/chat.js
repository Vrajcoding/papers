document.addEventListener("DOMContentLoaded", async function() {
    const responseDiv = document.querySelector('.response');
    const userInput = document.querySelector('.userinput');
    const btn = document.querySelector('#btn');

    if (btn && userInput && responseDiv) {
        btn.addEventListener("click", async (e) => {
            e.preventDefault();
            if (!userInput.value.trim()) {
                userInput.classList.add('border-red-500');
                userInput.placeholder = "Please enter a message!";
                setTimeout(() => {
                    userInput.classList.remove('border-red-500');
                    userInput.placeholder = "Type your message...";
                }, 1500);
                return;
            }
            
            const userMessage = userInput.value;
            const msgdiv = document.createElement("div");
            msgdiv.className = "mb-2 p-2 bg-blue-100 rounded text-gray-800 self-start max-w-xs mr-auto";
            msgdiv.textContent = userMessage;
            responseDiv.append(msgdiv);

            userInput.value = "";

            const serverMsgDiv = document.createElement("div");
            serverMsgDiv.className = "mb-2 p-2 bg-zinc-200 rounded text-gray-800 self-end w-[98%] ml-auto text-left";
            serverMsgDiv.innerHTML = "loading...";
            responseDiv.append(serverMsgDiv);
            
            try {
                const apiResponse = await fetch('/chatRoute/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        messages: [{ role: 'user', content: userMessage }],
                    }),
                });
                
                if (!apiResponse.ok) {
                    throw new Error(`HTTP error! status: ${apiResponse.status}`);
                }
                
                const data = await apiResponse.json();
                const markdownText = data.choices?.[0]?.message?.content || 'No response received.';
                
                if(window.marked){
                    serverMsgDiv.innerHTML = marked.parse(markdownText);
                } else {
                    serverMsgDiv.textContent = markdownText;
                }
            } catch (err) {
                serverMsgDiv.innerHTML = 'Error: ' + err.message;
            }
            
            responseDiv.scrollTop = responseDiv.scrollHeight;
        });
    }
});