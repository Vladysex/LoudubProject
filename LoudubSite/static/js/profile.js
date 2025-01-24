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