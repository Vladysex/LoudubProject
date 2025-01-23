function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('collapsed');
    } else {
        console.error("Sidebar element not found.");
    }
}

function showContent(section) {
    const sections = ['subscription', 'mail','admin','work_surface'];

    sections.forEach(sec => {
        const contentDiv = document.getElementById(`${sec}-content`);
        if (contentDiv) {
            contentDiv.style.display = 'none';
        }
    });

    const selectedContent = document.getElementById(`${section}-content`);
    if (selectedContent) {
        selectedContent.style.display = 'block';
    } else {
        console.warn(`Content section ${section} not found.`);
    }
}

function logout() {
    alert("You have been logged out!");
    window.location.href = logoutUrl;
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('tts-form').addEventListener('submit', function (event) {
        event.preventDefault();

        const text = document.getElementById('text-input').value;
        const voiceId = document.getElementById('voice-select').value;
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

        fetch('/api/text-to-speech/', {
            method: "POST",
            body: new URLSearchParams({text: text, voice_id: voiceId}),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "X-CSRFToken": csrfToken
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                const audioPlayer = document.getElementById('audio-player');
                audioPlayer.src = "/" + data.audio_url;
                audioPlayer.style.display = "block";
            } else {
                alert("Error: " + data.error);
            }
        })
        .catch(error => console.error('Error:', error));
    });
});

function deleteMessage(messageId) {
    if (confirm("Are you sure you want to delete this message?")) {
        fetch(`/delete-message/${messageId}/`, {
            method: "DELETE",
            headers: {
                "X-CSRFToken": getCSRFToken(),
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                document.getElementById(`message-${messageId}`).remove();
                alert("Message deleted successfully");

            } else {
                alert("Error deleting message: " + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    }
    location.reload();

}

function updateMessage(messageId) {
    const updatedMessage = document.getElementById(`message-text-${messageId}`).value;

    fetch(`/update-message/${messageId}/`, {
        method: "PUT",
        body: JSON.stringify({ message: updatedMessage }),
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken()
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            alert("Message updated successfully!");
            location.reload();
        } else {
            alert("Error updating message: " + data.message);
        }
    })
    .catch(error => console.error('Error:', error));
}

function getCSRFToken() {
    let cookieValue = null;
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith("csrftoken=")) {
            cookieValue = cookie.substring("csrftoken=".length, cookie.length);
            break;
        }
    }
    return cookieValue;
}