import Card from "./card/card";
import Column from "./column/column";

const firstCol = new Column("To do", "first");
const secondCol = new Column("In Progress", "second");
const thirdCol = new Column("Done", "third");

firstCol.bindToDOM();
secondCol.bindToDOM();
thirdCol.bindToDOM();

const cards = document.querySelectorAll(".cards");

let clone;
let actualElement;
let savedSpace;

const removeEl = (el) => {
  el.remove();
};

cards.forEach((e) =>
  e.addEventListener("mousedown", (e) => {
    e.preventDefault();
    if (e.target.classList.contains("delete")) {
      removeEl(e.target.closest(".card"));
      return;
    }
    savedSpace = e.target.cloneNode(true);
    savedSpace.classList.remove("card");
    savedSpace.classList.add("saved");
    savedSpace.style.height = e.target.offsetHeight + "px";
    savedSpace.style.width = e.target.offsetWidth + "px";
    savedSpace.querySelector(".delete").remove();
    savedSpace.textContent = "";

    e.target.insertAdjacentElement("afterend", savedSpace);

    clone = e.target.cloneNode(true);
    clone.classList.remove("card");
    clone.classList.add("additional");
    clone.style.height = e.target.offsetHeight + "px";
    clone.style.width = e.target.offsetWidth + "px";
    clone.querySelector(".delete").remove();
    clone.textContent = "";

    actualElement = e.target;
    document.body.style.cursor = "grabbing";
    let shiftX = e.clientX - actualElement.getBoundingClientRect().left;
    let shiftY = e.clientY - actualElement.getBoundingClientRect().top;

    actualElement.classList.add("dragged");

    document.body.append(actualElement);

    moveAt(e.pageX, e.pageY);

    const onMouseUp = (e) => {
      const clonePos = document.querySelector(".additional");
      const savedPos = document.querySelector(".saved");
      if (clonePos) {
        clonePos.insertAdjacentElement("beforebegin", actualElement);
        removeEl(clonePos);
      } else {
        savedPos.insertAdjacentElement("beforebegin", actualElement);
      }
      removeEl(savedPos);

      document.body.style.cursor = "default";
      actualElement.classList.remove("dragged");

      actualElement = undefined;
      clone = undefined;

      document.documentElement.removeEventListener("mouseup", onMouseUp);
      document.documentElement.removeEventListener("mousemove", onMouseMove);
    };

    function moveAt(pageX, pageY) {
      actualElement.style.left = pageX - shiftX + "px";
      actualElement.style.top = pageY - shiftY + "px";
    }
    const onMouseMove = (e) => {
      const target = e.target;
      const { top } = target.getBoundingClientRect();
      const center = top + target.offsetHeight / 2;
      const column = e.target.closest(".column");
      if (!column) {
        return;
      }
      const cardsBlock = column.querySelector(".cards");

      if (target.classList.contains("card")) {
        if (e.clientY < center) {
          target.insertAdjacentElement("beforebegin", clone);
        } else if (e.clientY > center) {
          console.log(target, "from second");
          target.insertAdjacentElement("afterend", clone);
        }
      } else if (target.classList.contains("cards")) {
        const list = target.querySelectorAll(".card");
        const pos = [];
        list.forEach((item) => {
          pos.push(item.getBoundingClientRect().top);
        });

        const index = pos.findIndex((i) => i > e.clientY);
        cardsBlock.insertBefore(clone, list[index]);
      } else if (e.target.classList.contains("additional")) {
        return;
      } else {
        cardsBlock.appendChild(clone);
      }
      moveAt(e.clientX, e.clientY);
    };

    document.documentElement.addEventListener("mouseup", onMouseUp);
    document.documentElement.addEventListener("mousemove", onMouseMove);
  }),
);

window.addEventListener("beforeunload", () => {
  const data = {
    firstCol: [],
    secondCol: [],
    thirdCol: [],
  };

  cards.forEach((e) => {
    if (e.hasChildNodes()) {
      const cards = e.querySelectorAll(".card");
      cards.forEach((card) => {
        if (card.closest(".column").classList.contains("first")) {
          data.firstCol.push(card.innerText);
        } else if (card.closest(".column").classList.contains("second")) {
          data.secondCol.push(card.innerText);
        } else {
          data.thirdCol.push(card.innerText);
        }
      });
    }
  });

  localStorage.setItem("data", JSON.stringify(data));
});

document.addEventListener("DOMContentLoaded", () => {
  const json = localStorage.getItem("data");

  const firCol = document.querySelector(".first");
  const secCol = document.querySelector(".second");
  const thirCol = document.querySelector(".third");

  let data;

  try {
    data = JSON.parse(json);
  } catch (error) {
    console.log(error);
  }

  if (data) {
    data.firstCol.forEach((item) => {
      const card = new Card(firCol, item);
      card.bindToDOM();
    });
    data.secondCol.forEach((item) => {
      const card = new Card(secCol, item);
      card.bindToDOM();
    });
    data.thirdCol.forEach((item) => {
      const card = new Card(thirCol, item);
      card.bindToDOM();
    });
  }
});
