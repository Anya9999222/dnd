import "./card.css";

export default class Card {
  constructor(parentEl, value) {
    this.parentEl = parentEl;
    this.value = value;
  }

  static get selector() {
    return ".card";
  }

  getCoords(elem) {
    const box = elem.getBoundingClientRect();

    return {
      top: box.top + window.scrollY,
      left: box.left + window.scrollX,
    };
  }
  bindToDOM() {
    const markup = `
            <div class="card">
            ${this.value}
            <div class="delete"></div>
            </div>
        `;

    const cardsBlock = this.parentEl.querySelector(".cards");

    cardsBlock.insertAdjacentHTML("beforeend", markup);

    const cardsList = cardsBlock.querySelectorAll(".delete");
    cardsList.forEach((e) => e.addEventListener("click", this.deleteCard));
  }

  deleteCard(e) {
    e.target.closest(".card").remove();
  }
}
