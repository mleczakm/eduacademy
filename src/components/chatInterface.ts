import { ElevenLabsTextChatClient } from '@mleczakm/elevenlabs-text-chat';

interface ChatMessage {
  role: 'user' | 'agent';
  text: string;
  isDelta?: boolean;
  isComplete?: boolean;
  isStart?: boolean;
}

interface ClientConfig {
  agentId: string;
  onMessage: (message: ChatMessage) => void;
  onStatusChange: (status: string) => void;
  onError: (error: string) => void;
}

const container = document.querySelector('[data-chat-id]');
const chatId = container ? container.getAttribute('data-chat-id') : null;

if (!chatId) {
  console.error('Chat container not found');
}

class ElevenLabsClient {
  _client: ElevenLabsTextChatClient;
  _config: ClientConfig;
  _status: string;
  _needsContext: boolean;

  constructor(config: ClientConfig) {
    this._config = config;
    this._status = 'disconnected';
    this._needsContext = true;
    this._client = new ElevenLabsTextChatClient({
      agentId: config.agentId,
      onStatusChange: (status) => {
        this._status = status;
        if (status === 'disconnected') this._needsContext = true;
        this._config.onStatusChange(status);
      },
      onEvent: (event) => {
        if (event.type === 'response_start') {
          this._config.onMessage({ role: 'agent', text: '', isStart: true });
        } else if (event.type === 'response_delta') {
          this._config.onMessage({ role: 'agent', text: event.text, isDelta: true });
        } else if (event.type === 'response_complete') {
          this._config.onMessage({ role: 'agent', text: '', isComplete: true });
        } else if (event.type === 'response') {
          this._config.onMessage({ role: 'agent', text: event.text, isComplete: true });
        } else if (event.type === 'agent_error' || event.type === 'transport_error') {
          const error = event.error instanceof Error ? event.error.message : String(event.error);
          this._config.onError(error);
        }
      },
    });
  }

  async connect(): Promise<void> {
    if (!(await this._client.connect())) {
      throw new Error('Unable to connect to the public agent');
    }
  }

  async sendMessage(text: string): Promise<void> {
    const context = this._needsContext ? this._loadContext() : undefined;
    if (!(await this._client.send(text, { context }))) {
      throw new Error('Unable to send the message');
    }
    this._needsContext = false;
  }

  _loadContext(): string | undefined {
    try {
      const saved = localStorage.getItem('chat_history');
      if (!saved) return undefined;
      const messages = JSON.parse(saved) as ChatMessage[];
      if (messages.length === 0) return undefined;
      return (
        'Previous conversation context:\n' +
        messages
          .map((message) => (message.role === 'user' ? 'User: ' : 'Assistant: ') + message.text)
          .join('\n')
      );
    } catch (error) {
      console.error('Failed to load chat context:', error);
      return undefined;
    }
  }

  disconnect(): void {
    this._needsContext = true;
    this._client.close();
  }

  getStatus(): string {
    return this._status;
  }
}

const AGENT_ID = 'agent_2501ktwm893ffmwt20a3v29eg57q';

class ChatUI {
  _container: HTMLElement;
  _messages: ChatMessage[];
  _currentAgentMessage: string;
  _client: ElevenLabsClient;
  _input: HTMLInputElement | null;
  _form: HTMLFormElement | null;
  _submitButton: HTMLButtonElement | null;
  _clearButton: HTMLButtonElement | null;
  _statusIndicator: HTMLElement | null;
  _statusText: HTMLElement | null;
  _modal: HTMLElement | null;
  _confirmClearBtn: HTMLElement | null;
  _cancelClearBtn: HTMLElement | null;

  constructor(containerId: string) {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error('Container with id "' + containerId + '" not found');
    }
    this._container = container;
    this._messages = [];
    this._currentAgentMessage = ''; // Accumulate delta parts
    this._client = new ElevenLabsClient({
      agentId: AGENT_ID,
      onMessage: this._handleAgentMessage.bind(this),
      onStatusChange: this._handleStatusChange.bind(this),
      onError: function (error: string) {
        console.error('Chat error:', error);
      },
    });

    this._initializeElements();
    this._loadHistory();
    this._renderMessages();
    this._setupEventListeners();
  }

  _initializeElements(): void {
    this._input = this._container.querySelector('input[type="text"]');
    this._form = this._container.querySelector('form');
    this._submitButton = this._container.querySelector('button[type="submit"]');
    this._clearButton = this._container.querySelector('.clear-chat-btn');
    this._statusIndicator = this._container.querySelector('.status-indicator');
    this._statusText = this._container.querySelector('.status-text');
    this._modal = document.getElementById('clear-chat-modal');
    this._confirmClearBtn = document.getElementById('confirm-clear');
    this._cancelClearBtn = document.getElementById('cancel-clear');
  }

  _loadHistory(): void {
    const saved = localStorage.getItem('chat_history');
    if (saved) {
      try {
        this._messages = this._dedupeMessages(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse chat history:', e);
      }
    }

    // Add welcome message if no messages exist
    if (this._messages.length === 0) {
      this._messages.push({
        role: 'agent',
        text: 'Cześć! Pomagam dobrać najciekawsze zajęcia i warsztaty w Future Edu Academy. Dla kogo dziś szukasz inspiracji? 😊',
      });
    }
  }

  _saveHistory(): void {
    if (this._messages.length > 0) {
      localStorage.setItem('chat_history', JSON.stringify(this._messages));
    }
  }

  _dedupeMessages(messages: ChatMessage[]): ChatMessage[] {
    return messages.filter((msg, idx) => {
      if (idx === 0) return true;
      const prev = messages[idx - 1];
      return !(msg.role === prev.role && msg.text === prev.text);
    });
  }

  _handleAgentMessage(message: ChatMessage): void {
    // Check if this is a start event (from agent_chat_response_part)
    if (message.isStart) {
      this._currentAgentMessage = ''; // Reset accumulator for new response
      return;
    }

    // Check if this is a delta part (from agent_chat_response_part)
    if (message.isDelta) {
      this._currentAgentMessage += message.text;
      return; // Don't render yet, wait for complete message
    }

    // Check if this is a complete message (from conversation_done)
    if (message.isComplete) {
      if (this._currentAgentMessage) {
        message.text = this._currentAgentMessage;
        this._currentAgentMessage = '';
      }
      if (
        this._messages.some((m) => {
          return m.role === 'agent' && m.text === message.text;
        })
      ) {
        return;
      }
      this._messages.push(message);
      this._saveHistory();
      this._renderMessages();
    }
  }

  _handleStatusChange(status: string): void {
    if (!this._statusIndicator || !this._statusText) return;

    this._statusIndicator.className = 'status-indicator w-2 h-2 rounded-full inline-block';

    switch (status) {
      case 'connected':
        this._statusIndicator.classList.add('bg-green-400');
        this._statusText.textContent = 'Chętnie doradzę';
        this._submitButton.disabled = false;
        this._submitButton.classList.remove('opacity-50', 'cursor-not-allowed');
        break;
      case 'connecting':
        this._statusIndicator.classList.add('bg-yellow-400');
        this._statusText.textContent = 'Łączenie...';
        this._submitButton.disabled = true;
        this._submitButton.classList.add('opacity-50', 'cursor-not-allowed');
        break;
      case 'disconnected':
        this._statusIndicator.classList.add('bg-green-400');
        this._statusText.textContent = 'Gotowy do rozmowy';
        this._submitButton.disabled = false;
        this._submitButton.classList.remove('opacity-50', 'cursor-not-allowed');
        break;
      case 'error':
        this._statusIndicator.classList.add('bg-red-400');
        this._statusText.textContent = 'Błąd połączenia';
        this._submitButton.disabled = false;
        this._submitButton.classList.remove('opacity-50', 'cursor-not-allowed');
        break;
    }
  }

  _renderMessages(): void {
    const messagesContainer = this._container.querySelector('.messages-container');
    if (!messagesContainer) return;

    messagesContainer.innerHTML = this._messages
      .map((msg) => {
        const isUser = msg.role === 'user';
        return (
          '<div class="flex items-start gap-2.5 ' +
          (isUser ? 'flex-row-reverse' : '') +
          '"><div class="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-lg mt-0.5 ' +
          (isUser ? 'bg-brandPrimary/20' : 'bg-brandAccentLight') +
          '">' +
          (isUser ? '👩' : '🐨') +
          '</div><div class="p-3.5 rounded-xl shadow-sm max-w-[85%] leading-relaxed ' +
          (isUser
            ? 'bg-brandPrimary text-white rounded-tr-none'
            : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none') +
          '">' +
          this._escapeHtml(msg.text) +
          '</div></div>'
        );
      })
      .join('');

    this._scrollToBottom();
  }

  _escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  _scrollToBottom(): void {
    const messagesContainer = this._container.querySelector('.messages-container');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  _setupEventListeners(): void {
    this._form.addEventListener('submit', (e) => {
      e.preventDefault();
      this._handleSubmit();
    });

    this._input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this._handleSubmit();
      }
    });

    this._clearButton.addEventListener('click', () => {
      this._showClearModal();
    });

    this._confirmClearBtn.addEventListener('click', () => {
      this._handleClearChat();
      this._hideClearModal();
    });

    this._cancelClearBtn.addEventListener('click', () => {
      this._hideClearModal();
    });

    this._modal.addEventListener('click', (e) => {
      if (e.target === this._modal) {
        this._hideClearModal();
      }
    });
  }

  _handleSubmit(): void {
    const text = this._input.value.trim();
    if (!text) return;

    this._messages.push({ role: 'user', text: text });
    this._saveHistory();
    this._renderMessages();
    this._input.value = '';

    this._client
      .sendMessage(text)
      .then(() => {
        // Success
      })
      .catch((error) => {
        console.error('Failed to send message:', error);
        this._messages.pop();
        this._saveHistory();
        this._renderMessages();
        this._input.value = text;
      });
  }

  _handleClearChat(): void {
    this._messages = [];
    localStorage.removeItem('chat_history');
    this._client.disconnect();

    // Add welcome message back
    this._messages.push({
      role: 'agent',
      text: 'Cześć! Pomagam dobrać najciekawsze zajęcia i warsztaty w Future Edu Academy. Dla kogo dziś szukasz inspiracji? 😊',
    });

    this._renderMessages();

    // Reconnect after a short delay
    setTimeout(() => {
      this._client.connect().catch((error) => {
        console.error('Failed to reconnect:', error);
      });
    }, 500);
  }

  _showClearModal(): void {
    this._modal.classList.remove('hidden');
  }

  _hideClearModal(): void {
    this._modal.classList.add('hidden');
  }
}

if (chatId) {
  new ChatUI(chatId);
}
