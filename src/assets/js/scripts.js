var conn = new WebSocket('ws://localhost:8080');

function autoScroll() {
    var par = $('#text-window');
    var inner = $('#text-content');
    par.scrollTop(par.scrollTop() + inner.position().top + inner.height());
}

function joinChat(e) {
    e.preventDefault();
    var username = $('#username').val();
    if (username.length > 0) {
        var package = {
            'type': 'join',
            'msg': username
        };
        conn.send(JSON.stringify(package));
        $('#username').val(null);
    }
}

function sendMessage(e) {
    e.preventDefault();
    var message = $('#text-input').val();
    if (message.length > 0) {
        var package = {
            'type': 'msg',
            'msg': message
        };
        conn.send(JSON.stringify(package));
        $('#text-input').val(null);
    }
}

function responseHandler(data) {
    if (data.type === 'setuser') {
        if (data.status) {
            $('#username-window').hide();
            $('#chat-window').show();
        }
    } else if (data.type === 'message') {
        $('#text-content').append('<p>' + data.username + ': ' + data.message + '</p>');
    } else if (data.type === 'join') {
        $('#text-content').append('<p class="join">' + data.username + ' ' + data.message + '</p>');
    } else if (data.type === 'leave') {
        $('#text-content').append('<p class="leave">' + data.username + ' ' + data.message + '</p>');
    } else if (data.type === 'userlist') {
        var html = '';
        data.message.forEach(element => html += '<li class="list-group-item">' + element + '</li>');
        $('#user-list').html(html);
    }
}

conn.onopen = function(e) {
    console.log("Connection established!");
};

conn.onmessage = function(e) {
    if (e.data) {
        var obj = JSON.parse(e.data);
        responseHandler(obj);
        autoScroll();
    }
};
