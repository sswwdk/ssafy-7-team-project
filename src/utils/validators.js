export function validatePostInput(input, options = {}) {
  const errors = {}
  const title = input.title?.trim() || ''
  const content = input.content?.trim() || ''
  const password = input.password?.trim() || ''

  if (!input.category) {
    errors.category = '카테고리를 선택해 주세요.'
  }

  if (!title) {
    errors.title = '제목을 입력해 주세요.'
  } else if (title.length > 80) {
    errors.title = '제목은 80자 이하로 입력해 주세요.'
  }

  if (!content) {
    errors.content = '내용을 입력해 주세요.'
  } else if (content.length > 3000) {
    errors.content = '내용은 3,000자 이하로 입력해 주세요.'
  }

  if (options.requirePassword !== false) {
    if (!password) {
      errors.password = '비밀번호를 입력해 주세요.'
    } else if (password.length < 4 || password.length > 20) {
      errors.password = '비밀번호는 4~20자로 입력해 주세요.'
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    value: {
      category: input.category,
      title,
      content,
      password
    }
  }
}

export function validateCommentInput(input) {
  const errors = {}
  const content = input.content?.trim() || ''
  const password = input.password?.trim() || ''

  if (!content) {
    errors.content = '댓글 내용을 입력해 주세요.'
  } else if (content.length > 3000) {
    errors.content = '댓글은 3,000자 이하로 입력해 주세요.'
  }

  if (!password) {
    errors.password = '비밀번호를 입력해 주세요.'
  } else if (password.length < 4 || password.length > 20) {
    errors.password = '비밀번호는 4~20자로 입력해 주세요.'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    value: { content, password }
  }
}
