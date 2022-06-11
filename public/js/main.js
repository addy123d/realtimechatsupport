console.log("Chat Support");

// Manipulate HTML Elements
let inputBox = document.querySelector(".chatroom_form_inputbox");
let sendButton = document.querySelector(".chatroom_form_sendBtn");
let chatBox = document.querySelector(".chats");

const ws = new WebSocket(`ws://127.0.0.1:5000`);

ws.onopen = () => {
    console.log("Connection Established...");
}
let chatString = "";
ws.onmessage = (data) => {
    console.log(data);

    let parsed_data = JSON.parse(data.data);
    console.log(parsed_data);

    if(parsed_data.message === "Connection Opened..."){

    }else{

        chatString += `<li class="chatroom_history_list_item chatroom_history_list_left chatroom_history_list_item--grey matches"><strong>${parsed_data.name}: </strong> ${parsed_data.query}</li>`;
    
        chatBox.innerHTML = chatString;
    }

   
}



// Chat Bot Brain !
// let bot = new RiveScript();
// let username = "user";

// function brainReady() {
//     console.log("Chatbot Ready");

//     // Now the replies must be sorted!
//     bot.sortReplies();
// }

// // It's good to catch errors too!
// function brainError(error, filename, lineno) {
//     console.log("ChatBot Error " + error);
// }

// // Load an individual file.
// bot.loadFile("brain/brain.rive").then(brainReady).catch(brainError);


// let chatString = "";

sendButton.addEventListener("click", () => {
    console.log("User Input: ");
    console.log(inputBox.value);

    ws.send(JSON.stringify({
        name : user_name,
        query : inputBox.value
    }));


    // chatString += `<li class="chatroom_history_list_item chatroom_history_list_left chatroom_history_list_item--grey matches"><strong>${user_name}: </strong> ${inputBox.value}</li>`;

    // chatBox.innerHTML = chatString;
    

    // Empty the input Box !
    inputBox.value = "";


});

let topicName = "";
function courseName(element) {
    console.log("Element: ", element);

    if (element.dataset.course === "AI") {
        topicName = element.dataset.course;
        console.log("User Clicked AI");
    } else if (element.dataset.course === "IOT") {
        topicName = element.dataset.course;
        console.log("User Clicked IOT");
    } else {
        topicName = element.dataset.course;
        console.log("User Clicked Machine Learning");
    }
}



function chatBotReply(input) {
    let chatString = `<li class="chatroom_history_list_item chatroom_history_list_left chatroom_history_list_item--grey matches"> Hello, ${user_name} </li>`;
    bot.reply(username, input).then(function (reply) {

        if (reply === "generateticket") {
            chatString += `<li class="chatroom_history_list_item chatroom_history_list_left chatroom_history_list_item--grey matches">
                        <div class="courseButtons">
                            <button data-status = "resolved" onclick="resolveStatus(this)">Resolved</button>
                            <button data-status = "unresolved" onclick="resolveStatus(this)">Unresolved</button>
                        </div>
                     </li>`;


        } else {
            chatString += `<li class="chatroom_history_list_item chatroom_history_list_left chatroom_history_list_item--grey matches">
            ${reply}
         </li>
         <li class="chatroom_history_list_item chatroom_history_list_left chatroom_history_list_item--grey matches">
                        <div class="courseButtons">
                            <button data-status = "resolved" onclick="resolveStatus(this)">Resolved</button>
                            <button data-status = "unresolved" onclick="resolveStatus(this)">Unresolved</button>
                        </div>
                     </li>
         `;
        }

        chatBox.innerHTML = chatString;

    })
}

function resolveStatus(element) {
    if (element.dataset.status === "unresolved") {
        location.href = `${location.origin}/unresolved?topic=${topicName}`;
    }else{
        let chatString = "";

        chatString += `<li class="chatroom_history_list_item chatroom_history_list_left chatroom_history_list_item--grey matches">
        Thanks to connect with us !!!!
     </li>
     `;

     chatBox.innerHTML = chatString;
    }
}