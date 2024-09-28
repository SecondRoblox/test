// Your Supabase URL and API Key
const SUPABASE_URL = 'https://aqndlpzoqavlkdtvjgcy.supabase.co'; // Your Supabase project URL
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxbmRscHpvcWF2bGtkdHZqZ2N5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc0OTA5ODksImV4cCI6MjA0MzA2Njk4OX0.hOAtSk_B3DtHUsHFSGWLZmJLZD0-tySzmNrOAn6bvhE'; // Your anon public key

// Initialize Supabase
const { createClient } = supabase;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Select DOM elements
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');

// Function to send a message
sendButton.onclick = async function () {
    const message = messageInput.value;
    if (message.trim()) {
        const { error } = await supabase.from('messages').insert([{ text: message }]);
        if (error) {
            console.error('Error inserting message:', error);
        } else {
            messageInput.value = ''; // Clear input field after sending
        }
    }
};

// Real-time subscription for new messages
supabase
    .from('messages')
    .on('INSERT', payload => {
        const messageElement = document.createElement('div');
        messageElement.textContent = payload.new.text;
        messagesDiv.appendChild(messageElement);
    })
    .subscribe();

// Function to load existing messages
async function loadMessages() {
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error loading messages:', error);
        return;
    }

    data.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.textContent = message.text;
        messagesDiv.appendChild(messageElement);
    });
}

// Load existing messages on page load
loadMessages();
