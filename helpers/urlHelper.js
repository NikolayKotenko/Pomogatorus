// Разбираем hash прим. #inviteUserModal=true
export function getNameStateModalByUrlHash(hash) {
  const hashModal = hash.split('#')[1]
  const keyValue = hashModal.split('=')
  const nameModal = keyValue[0]
  const stateModal = keyValue[1]

  return { nameModal, stateModal }
}

export function setStateModalByUrlHash(nameModal, stateModal) {
  window.location.hash = nameModal + '=' + stateModal
}
