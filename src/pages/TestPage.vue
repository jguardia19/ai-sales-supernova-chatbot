<script setup lang="ts">
import { ref } from "vue";
import { askOpenAI } from "src/services/open_ai";

const question = ref("");
const answer = ref("");
const loading = ref(false);
const error = ref("");

const consultar = async () => {
  if (!question.value.trim()) return;

  loading.value = true;
  answer.value = "";
  error.value = "";

  try {
    answer.value = await askOpenAI(question.value);
  } catch (err: any) {
    error.value = err?.message || "Error consultando OpenAI";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="q-pa-md" style="max-width: 800px; margin: 0 auto;">
    <q-input
      v-model="question"
      type="textarea"
      filled
      autogrow
      label="Pregunta"
    />

    <q-btn
      class="q-mt-md"
      color="primary"
      label="Consultar"
      :loading="loading"
      @click="consultar"
    />

    <q-banner v-if="error" class="bg-red-1 text-red q-mt-md">
      {{ error }}
    </q-banner>

    <q-card v-if="answer" class="q-mt-md">
      <q-card-section>
        <div class="text-h6">Respuesta</div>
        <div class="q-mt-sm">{{ answer }}</div>
      </q-card-section>
    </q-card>
  </div>
</template>
