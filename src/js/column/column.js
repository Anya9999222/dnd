import NewCard from "../newCard/newCard";
import "./column.css";

export default class Column {
  constructor(title, number) {
    this.title = title;
    this.number = number;
  }

  static get selector() {
    return ".column-footer";
  }

  bindToDOM() {
    const markup = `
      <div class="column ${this.number}">
        <h2 class="column-title">
        <div class="title">${this.title}</div>
        <div class="points">&#8943</div>
        </h2>
        <div class="cards"></div>
        <div class="column-footer">&#43 Add another card</div>
      </div>
    `;
    const container = document.querySelector(".container");

    container.insertAdjacentHTML("beforeend", markup);

    this.elements = container.querySelectorAll(Column.selector);

    this.elements.forEach((el) => el.addEventListener("click", this.onClick));
  }

  onClick(e) {
    e.preventDefault();
    const addingButton = e.target;
    const currentCol = e.target.closest(".column");
    const newCard = new NewCard(currentCol);
    newCard.bindToDOM();

    addingButton.classList.add("hidden");
  }
}
