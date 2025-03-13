export default class SecureInput extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'closed' });
    const input = document.createElement('input');
    input.type = 'password';
    this.shadowRoot?.appendChild(input);
  }
}
customElements.define('secure-input', SecureInput);
