<template>
  <q-page class="chat-page">
    <!-- Header -->
    <div class="chat-header">
      <q-btn
        flat
        round
        icon="arrow_back"
        color="white"
        class="back-btn"
        @click="goToHome"
      />
      <div class="header-title">AI SALES SUPERNOVA</div>
      <q-btn
        flat
        round
        icon="history"
        color="white"
        class="history-btn-mobile"
        @click="sidebarOpen = !sidebarOpen"
      />
    </div>

    <div class="chat-layout">
      <!-- Main Chat Area -->
      <div class="chat-main">
        <!-- Messages -->
        <div class="messages-area" ref="messagesArea">
          <div
            v-for="(msg, index) in messages"
            :key="index"
            class="message-row"
            :class="msg.role"
          >
            <!-- AI Message -->
            <template v-if="msg.role === 'ai'">
              <div class="ai-avatar-small">
                 <img src="~assets/icon-chat-noiva.png" alt="Logo" style="width: 46px; height: 48px;" />
              </div>
              <div class="message-bubble ai-bubble">{{ msg.text }}</div>
            </template>
            <!-- User Message -->
            <template v-else>
              <div class="message-bubble user-bubble">{{ msg.text }}</div>
            </template>
          </div>

          <!-- Typing Indicator -->
          <div v-if="loading" class="message-row ai">
            <div class="ai-avatar-small">
              <img src="~assets/icon-chat-noiva.png" alt="Logo" style="width: 46px; height: 48px;" />
            </div>
            <div class="message-bubble ai-bubble typing-indicator">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </div>
          </div>
        </div>

        <!-- Input Area -->
        <div class="chat-input-area">
          <q-input
            v-model="currentMessage"
            placeholder="escribe tu mensaje, presiona enter o consulta..."
            outlined
            dense
            class="chat-input"
            bg-color="transparent"
            color="grey-5"
            :loading="loading"
            :disable="loading"
            @keyup.enter="sendMessage"
          >
            <template #append>
              <q-btn
                round
                flat
                icon="send"
                color="grey-6"
                size="sm"
                :loading="loading"
                :disable="!currentMessage.trim() || loading"
                @click="sendMessage"
              />
            </template>
          </q-input>
        </div>
      </div>

      <!-- History Sidebar (Desktop) -->
      <div class="chat-sidebar chat-sidebar-desktop" v-if="sidebarOpen">
        <div class="sidebar-header">
          <span class="sidebar-title">History Chat</span>
          <div class="sidebar-actions">
            <q-btn flat round icon="add" size="xs" color="grey-6" @click="newChat">
              <q-tooltip>Nuevo chat</q-tooltip>
            </q-btn>
            <q-btn flat round icon="close" size="xs" color="grey-6" @click="sidebarOpen = false" />
          </div>
        </div>
        <div class="sidebar-list">
          <div
            v-for="item in chatHistory"
            :key="item.id"
            class="history-item"
            :class="{ active: currentSessionId === item.id }"
            @click="loadHistory(item)"
          >
            <div class="history-content">
              <div class="history-preview">{{ item.preview }}</div>
              <div class="history-date">{{ item.date }}</div>
            </div>
            <q-btn
              flat
              round
              dense
              icon="delete"
              size="xs"
              color="grey-6"
              class="delete-btn"
              @click="deleteChat(item.id, $event)"
            >
              <q-tooltip>Eliminar</q-tooltip>
            </q-btn>
          </div>
          <div v-if="chatHistory.length === 0" class="empty-history">
            <q-icon name="chat_bubble_outline" size="48px" color="grey-6" />
            <div class="empty-text">No hay conversaciones</div>
          </div>
        </div>
      </div>

      <!-- Toggle sidebar button when closed (Desktop only) -->
      <q-btn
        v-if="!sidebarOpen"
        flat round
        icon="history"
        color="grey-6"
        class="open-sidebar-btn"
        @click="sidebarOpen = true"
      />
    </div>

    <!-- History Menu (Mobile) -->
    <!-- <q-dialog v-model="sidebarOpen" position="bottom" class="history-dialog-mobile">
      <q-card class="history-card-mobile">
        <q-card-section class="history-header-mobile">
          <div class="history-title-mobile">History Chat</div>
          <q-btn flat round dense icon="close" color="grey-6" @click="sidebarOpen = false" />
        </q-card-section>
        <q-card-section class="history-list-mobile">
          <div
            v-for="(item, i) in chatHistory"
            :key="i"
            class="history-item-mobile"
            @click="loadHistory(item); sidebarOpen = false"
          >
            <div class="history-preview-mobile">{{ item.preview }}</div>
            <div class="history-date-mobile">{{ item.date }}</div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog> -->
  </q-page>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { api } from 'src/boot/axios';
import { Notify, Dialog } from 'quasar';
import { useChatStore } from 'src/stores/chat-store';

const router = useRouter();
const chatStore = useChatStore();
const messagesArea = ref<HTMLElement | null>(null);
const currentMessage = ref('');
const sidebarOpen = ref(true);
const loading = ref(false);
const currentSessionId = ref<string | null>(null);

interface Message { role: 'ai' | 'user'; text: string; timestamp: number }

const messages = ref<Message[]>([]);
const chatHistory = computed(() => chatStore.sortedSessions);

onMounted(() => {
  const state = history.state as { initialQuery?: string; initialResponse?: any; loadSessionId?: string };

  if (state?.loadSessionId) {
    // Cargar sesión existente
    const session = chatStore.sessions.find(s => s.id === state.loadSessionId);
    if (session) {
      loadHistory(session);
    }
  } else if (state?.initialQuery && state?.initialResponse) {
    // Crear nueva sesión
    currentSessionId.value = chatStore.createSession(state.initialQuery);

    const userMsg: Message = {
      role: 'user',
      text: state.initialQuery,
      timestamp: Date.now()
    };
    const aiMsg: Message = {
      role: 'ai',
      text: state.initialResponse.answer || state.initialResponse.response || 'Respuesta recibida',
      timestamp: Date.now()
    };

    messages.value = [userMsg, aiMsg];
    chatStore.addMessage(currentSessionId.value, userMsg);
    chatStore.addMessage(currentSessionId.value, aiMsg);

    nextTick(() => scrollToBottom());
  } else {
    messages.value = [
      { role: 'ai', text: '¡Hola! Soy tu asistente de ventas. ¿En qué puedo ayudarte hoy?', timestamp: Date.now() }
    ];
  }
});

async function sendMessage() {
  if (!currentMessage.value.trim() || loading.value) return;

  const userMsg = currentMessage.value;

  // Si no hay sesión activa, crear una
  if (!currentSessionId.value) {
    currentSessionId.value = chatStore.createSession(userMsg);
  }

  const userMessage: Message = { role: 'user', text: userMsg, timestamp: Date.now() };
  messages.value.push(userMessage);
  chatStore.addMessage(currentSessionId.value, userMessage);

  currentMessage.value = '';
  await nextTick();
  scrollToBottom();

  loading.value = true;
  try {
    const response = await api.post('/rag/ask', {
      query: userMsg,
      top_k: 2
    });

    const aiMessage: Message = {
      role: 'ai',
      text: response.data.answer || response.data.response || 'Respuesta procesada correctamente',
      timestamp: Date.now()
    };

    messages.value.push(aiMessage);
    chatStore.addMessage(currentSessionId.value, aiMessage);
    nextTick(() => scrollToBottom());
  } catch (error: any) {
    console.error('Error:', error);

    let errorMessage = 'Lo siento, hubo un error al procesar tu consulta. Por favor intenta de nuevo.';
    let notifyMessage = 'Error al procesar la consulta';
    let notifyType = 'negative';

    if (error.response?.status === 400) {
      const detail = error.response.data?.detail || '';

      if (detail.includes('intento de inyección detectado')) {
        errorMessage = '🚫 Tu consulta fue bloqueada porque se detectó un intento de inyección. Por favor, reformula tu pregunta de manera segura.';
        notifyMessage = 'Consulta bloqueada: Intento de inyección detectado';
        notifyType = 'warning';
      } else if (detail.includes('lenguaje inapropiado detectado')) {
        errorMessage = '⚠️ Tu consulta contiene lenguaje inapropiado. Por favor, mantén un lenguaje profesional y respetuoso.';
        notifyMessage = 'Consulta bloqueada: Lenguaje inapropiado';
        notifyType = 'warning';
      } else if (detail.includes('fuera del dominio de negocio permitido')) {
        errorMessage = '📋 Tu consulta está fuera de mi área de conocimiento. Solo puedo ayudarte con temas relacionados a ventas, productos y clientes.';
        notifyMessage = 'Consulta fuera de alcance';
        notifyType = 'info';
      } else {
        errorMessage = `❌ ${detail}`;
        notifyMessage = detail;
      }
    }

    const aiMessage: Message = { role: 'ai', text: errorMessage, timestamp: Date.now() };
    messages.value.push(aiMessage);
    chatStore.addMessage(currentSessionId.value!, aiMessage);

    Notify.create({
      type: notifyType,
      message: notifyMessage,
      position: 'top',
      timeout: 4000,
      actions: [{ icon: 'close', color: 'white' }]
    });
  } finally {
    loading.value = false;
    nextTick(() => scrollToBottom());
  }
}

function scrollToBottom() {
  if (messagesArea.value) {
    messagesArea.value.scrollTop = messagesArea.value.scrollHeight;
  }
}

function loadHistory(session: any) {
  currentSessionId.value = session.id;
  messages.value = [...session.messages];
  chatStore.loadSession(session.id);
  nextTick(() => scrollToBottom());
}

function deleteChat(sessionId: string, event: Event) {
  event.stopPropagation();

  Dialog.create({
    title: 'Eliminar chat',
    message: '¿Estás seguro de eliminar esta conversación?',
    cancel: {
      label: 'Cancelar',
      flat: true,
      color: 'grey-6'
    },
    ok: {
      label: 'Eliminar',
      flat: true,
      color: 'negative'
    },
    dark: true,
    class: 'delete-dialog'
  }).onOk(() => {
    chatStore.deleteSession(sessionId);
    if (currentSessionId.value === sessionId) {
      currentSessionId.value = null;
      messages.value = [
        { role: 'ai', text: '¡Hola! Soy tu asistente de ventas. ¿En qué puedo ayudarte hoy?', timestamp: Date.now() }
      ];
    }
    Notify.create({
      type: 'positive',
      message: 'Chat eliminado',
      position: 'top',
      timeout: 2000
    });
  });
}

function newChat() {
  currentSessionId.value = null;
  messages.value = [
    { role: 'ai', text: '¡Hola! Soy tu asistente de ventas. ¿En qué puedo ayudarte hoy?', timestamp: Date.now() }
  ];
  sidebarOpen.value = false;
}

function goToHome() {
  router.push('/home');
}
</script>

<style scoped lang="scss">
.chat-page {
  min-height: 100vh;
  background-color: #0b0b28;
  background-image: url('~assets/background_home.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  display: flex;
  flex-direction: column;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(11, 11, 40, 0.75);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 20% 30%, rgba(85, 0, 212, 0.1), transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(161, 0, 0, 0.08), transparent 50%);
  }
}

.chat-header {
  display: flex;
  align-items: center;
  padding: 16px 24px;
  background: rgba(11, 11, 40, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 2px solid rgba(85, 0, 212, 0.4);
  box-shadow: 0 4px 20px rgba(85, 0, 212, 0.2);
  position: relative;
  z-index: 10;
  gap: 16px;

  @media (max-width: 600px) {
    padding: 12px 16px;
    gap: 12px;
  }
}

.back-btn {
  transition: all 0.3s ease;

  &:hover {
    color: #5500d4 !important;
    text-shadow: 0 0 10px rgba(85, 0, 212, 1);
  }
}

.header-title {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 3px;
  color: #fff;
  text-transform: uppercase;
  text-shadow: 0 0 20px rgba(85, 0, 212, 1),
               0 0 40px rgba(161, 0, 0, 0.6);
  flex: 1;
  text-align: center;

  @media (max-width: 600px) {
    font-size: 12px;
    letter-spacing: 2px;
  }
}

.header-spacer {
  width: 40px;

  @media (max-width: 600px) {
    width: 32px;
  }
}

.chat-layout {
  display: flex;
  flex: 1;
  gap: 12px;
  padding: 16px;
  box-sizing: border-box;
  position: relative;
  z-index: 1;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 8px;
    gap: 8px;
  }
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: rgba(11, 11, 40, 0.95);
  backdrop-filter: blur(15px);
  border: 2px solid rgba(85, 0, 212, 0.4);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 0 40px rgba(85, 0, 212, 0.3),
              0 0 80px rgba(161, 0, 0, 0.2),
              inset 0 0 60px rgba(85, 0, 212, 0.05);
  min-width: 0;

  @media (max-width: 768px) {
    border-radius: 12px;
  }
}

.messages-area {
  flex: 1;
  overflow-y: auto;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;

  @media (max-width: 600px) {
    padding: 12px 8px;
    gap: 10px;
  }

  &::-webkit-scrollbar {
    width: 8px;

    @media (max-width: 600px) {
      width: 4px;
    }
  }

  &::-webkit-scrollbar-track {
    background: rgba(11, 11, 40, 0.3);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(85, 0, 212, 0.5);
    border-radius: 4px;

    &:hover {
      background: rgba(85, 0, 212, 0.7);
    }
  }
}

.message-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;

  &.user {
    justify-content: flex-end;
  }

  @media (max-width: 600px) {
    gap: 6px;
  }
}

.ai-avatar-small {
  flex-shrink: 0;
  margin-top: 2px;
  filter: drop-shadow(0 0 15px rgba(85, 0, 212, 0.6));

  img {
    @media (max-width: 600px) {
      width: 32px !important;
      height: 34px !important;
    }
  }
}

.message-bubble {
  max-width: 75%;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 13px;
  line-height: 1.5;
  color: #fff;

  @media (max-width: 600px) {
    max-width: 85%;
    padding: 10px 12px;
    font-size: 12px;
    border-radius: 10px;
  }
}

.ai-bubble {
  background: rgba(11, 11, 40, 0.7);
  border: 1px solid rgba(85, 0, 212, 0.5);
  box-shadow: 0 0 20px rgba(85, 0, 212, 0.2);
}

.user-bubble {
  background: linear-gradient(135deg, rgba(85, 0, 212, 0.3), rgba(161, 0, 0, 0.3));
  border: 2px solid #5500d4;
  box-shadow: 0 0 20px rgba(85, 0, 212, 0.4),
              0 0 40px rgba(161, 0, 0, 0.2);
}

.chat-input-area {
  padding: 12px 16px 16px;
  border-top: 1px solid rgba(85, 0, 212, 0.3);
  background: rgba(11, 11, 40, 0.5);

  @media (max-width: 600px) {
    padding: 8px 12px 12px;
  }

  .chat-input {
    :deep(.q-field__control) {
      border-radius: 12px;
      background: rgba(11, 11, 40, 0.7);
      border: 1px solid rgba(85, 0, 212, 0.5);

      @media (max-width: 600px) {
        border-radius: 10px;
      }

      &:hover {
        border-color: #5500d4;
        box-shadow: 0 0 15px rgba(85, 0, 212, 0.4);
      }
    }

    :deep(.q-field__native) {
      color: #fff;

      @media (max-width: 600px) {
        font-size: 14px;
      }
    }

    :deep(input::placeholder) {
      color: rgba(255, 255, 255, 0.5);
    }
  }
}

/* Sidebar */
.chat-sidebar {
  width: 220px;
  flex-shrink: 0;
  background: rgba(11, 11, 40, 0.85);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(85, 0, 212, 0.4);
  border-radius: 16px;
  box-shadow: 0 0 30px rgba(85, 0, 212, 0.3),
              inset 0 0 40px rgba(85, 0, 212, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 768px) {
    position: absolute;
    right: 8px;
    top: 8px;
    bottom: 8px;
    width: 200px;
    z-index: 100;
  }

  @media (max-width: 600px) {
    width: calc(100% - 16px);
    right: 8px;
    left: 8px;
  }
}

.sidebar-header {
  padding: 16px;
  border-bottom: 1px solid rgba(85, 0, 212, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(85, 0, 212, 0.1);
}

.sidebar-actions {
  display: flex;
  gap: 4px;
}

.sidebar-title {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 0 0 10px rgba(85, 0, 212, 0.8);

  @media (max-width: 600px) {
    font-size: 11px;
  }
}

.sidebar-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;

  &::-webkit-scrollbar {
    width: 6px;

    @media (max-width: 600px) {
      width: 4px;
    }
  }

  &::-webkit-scrollbar-track {
    background: rgba(11, 11, 40, 0.3);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(85, 0, 212, 0.5);
    border-radius: 3px;
  }
}

.history-item {
  padding: 12px;
  margin-bottom: 6px;
  background: rgba(11, 11, 40, 0.5);
  border: 1px solid rgba(85, 0, 212, 0.3);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;

  &.active {
    background: rgba(85, 0, 212, 0.3);
    border-color: #5500d4;
    box-shadow: 0 0 15px rgba(85, 0, 212, 0.5);
  }

  &:hover {
    background: rgba(85, 0, 212, 0.2);
    border-color: #5500d4;
    box-shadow: 0 0 15px rgba(85, 0, 212, 0.4);
    transform: translateX(4px);

    .delete-btn {
      opacity: 1;
    }
  }
}

.history-content {
  flex: 1;
  min-width: 0;
}

.history-preview {
  font-size: 12px;
  color: #fff;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 600px) {
    font-size: 11px;
  }
}

.history-date {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);

  @media (max-width: 600px) {
    font-size: 9px;
  }
}

.delete-btn {
  opacity: 0;
  transition: opacity 0.3s ease;
  flex-shrink: 0;

  &:hover {
    color: #ff4444 !important;
  }
}

.open-sidebar-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(85, 0, 212, 0.3);
  border: 1px solid rgba(85, 0, 212, 0.5);
  box-shadow: 0 0 20px rgba(85, 0, 212, 0.4);

  @media (max-width: 768px) {
    top: 12px;
    right: 12px;
  }

  &:hover {
    background: rgba(85, 0, 212, 0.5);
    box-shadow: 0 0 30px rgba(85, 0, 212, 0.6);
  }
}

.history-btn-mobile {
  transition: all 0.3s ease;

  @media (min-width: 769px) {
    display: none;
  }

  &:hover {
    color: #5500d4 !important;
    text-shadow: 0 0 10px rgba(85, 0, 212, 1);
  }
}

.chat-sidebar-desktop {
  @media (max-width: 768px) {
    display: none !important;
  }
}

.open-sidebar-btn {
  @media (max-width: 768px) {
    display: none !important;
  }
}

.history-dialog-mobile {
  @media (min-width: 769px) {
    display: none !important;
  }
}

.history-card-mobile {
  background: rgba(11, 11, 40, 0.98);
  backdrop-filter: blur(15px);
  border-top: 2px solid rgba(85, 0, 212, 0.6);
  border-radius: 20px 20px 0 0;
  max-height: 70vh;
  box-shadow: 0 -4px 40px rgba(85, 0, 212, 0.4);
}

.history-header-mobile {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(85, 0, 212, 0.3);
  background: rgba(85, 0, 212, 0.1);
}

.header-actions-mobile {
  display: flex;
  gap: 8px;
}

.history-title-mobile {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  text-shadow: 0 0 10px rgba(85, 0, 212, 0.8);
}

.history-list-mobile {
  padding: 12px;
  max-height: 50vh;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(11, 11, 40, 0.3);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(85, 0, 212, 0.5);
    border-radius: 2px;
  }
}

.history-item-mobile {
  padding: 14px 16px;
  margin-bottom: 8px;
  background: rgba(11, 11, 40, 0.6);
  border: 1px solid rgba(85, 0, 212, 0.4);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;

  &.active {
    background: rgba(85, 0, 212, 0.3);
    border-color: #5500d4;
    box-shadow: 0 0 20px rgba(85, 0, 212, 0.5);
  }

  &:active {
    background: rgba(85, 0, 212, 0.3);
    border-color: #5500d4;
    box-shadow: 0 0 20px rgba(85, 0, 212, 0.5);
    transform: scale(0.98);
  }
}

.history-content-mobile {
  flex: 1;
  min-width: 0;
}

.history-preview-mobile {
  font-size: 13px;
  color: #fff;
  margin-bottom: 6px;
  line-height: 1.4;
}

.history-date-mobile {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
}

.delete-btn-mobile {
  flex-shrink: 0;

  &:active {
    color: #ff4444 !important;
  }
}

.empty-history {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  opacity: 0.5;
}

.empty-text {
  margin-top: 12px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
}

.empty-history-mobile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  opacity: 0.5;
}

.empty-text-mobile {
  margin-top: 16px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 16px 20px !important;
  min-width: 60px;
}

.dot {
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: typing 1.4s infinite;

  &:nth-child(2) {
    animation-delay: 0.2s;
  }

  &:nth-child(3) {
    animation-delay: 0.4s;
  }
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.6;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}
</style>

















