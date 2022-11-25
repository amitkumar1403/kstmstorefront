export default function eventDispatcher(eventType: string, payload: any) {
  let event = new CustomEvent(eventType, {
    detail: { action: eventType, payload },
  })
  window.dispatchEvent(event)
}
