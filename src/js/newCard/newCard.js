import Card from "../card/card";
import "./newCard.css";

export default class NewCard {
  constructor(parentEl) {
    this.parentEl = parentEl;
  }

  static get markup() {
    return `
        <form class="new-card">
         <textarea class="text" placeholder="Enter a title for this card..."></textarea>
         <div class="new-card-footer">
         <button class="submit">Add Card </button>
         <div class="cross">&#x2573</div>
         </div>
         </form>
        `;
  }

  static get crossSelector() {
    return ".cross";
  }

  static get selector() {
    return ".new-card";
  }

  static get textSelector() {
    return ".text";
  }

  static get footerSel() {
    return ".column-footer";
  }
  bindToDOM() {
    this.parentEl.insertAdjacentHTML("beforeend", NewCard.markup);

    this.element = this.parentEl.querySelector(NewCard.selector);
    this.cross = this.element.querySelector(NewCard.crossSelector);
    this.text = this.parentEl.querySelector(NewCard.textSelector);

    const onClick = (e) => {
      e.preventDefault();
      const footer = this.parentEl.querySelector(NewCard.footerSel);
      e.target.closest(".new-card").remove();
      footer.classList.remove("hidden");
    };

    const onSubmit = (e) => {
      e.preventDefault();
      const text = document.querySelector(NewCard.textSelector);
      const parent = text.closest(".column");
      const card = new Card(parent, text.value);
      card.bindToDOM();
      onClick(e);
    };

    this.cross.addEventListener("click", onClick);
    this.element.addEventListener("submit", onSubmit);
  }
}
