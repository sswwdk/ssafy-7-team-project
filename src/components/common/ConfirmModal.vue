<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '확인'
  },
  confirmLabel: {
    type: String,
    default: '확인'
  },
  errorMessage: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close', 'confirm'])
const password = ref('')

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      password.value = ''
    }
  }
)

function submit() {
  emit('confirm', password.value.trim())
}
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-backdrop" @click.self="emit('close')">
      <section class="modal-card" role="dialog" aria-modal="true" :aria-label="title">
        <h2>{{ title }}</h2>
        <p class="help-text">작성 시 사용한 비밀번호를 입력해 주세요.</p>
        <label class="field-label" for="confirm-password">비밀번호</label>
        <input
          id="confirm-password"
          v-model="password"
          class="text-input"
          type="password"
          autocomplete="current-password"
          @keyup.enter="submit"
        />
        <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>
        <div class="button-row end">
          <button class="button button-ghost" type="button" @click="emit('close')">취소</button>
          <button class="button button-danger" type="button" :disabled="!password" @click="submit">
            {{ confirmLabel }}
          </button>
        </div>
      </section>
    </div>
  </Teleport>
</template>
