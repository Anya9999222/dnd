import Card from "./card/card";
import Column from "./column/column";

const firstCol = new Column("To do", "first");
const secondCol = new Column("In Progress", "second");
const thirdCol = new Column("Done", "third");

firstCol.bindToDOM();
secondCol.bindToDOM();
thirdCol.bindToDOM();

const cards = document.querySelectorAll(".cards");

let actualElement;
const leaveSpace = (el, height) => {
  const div = document.createElement("div");
  div.classList.add("additional");
  div.style.height = height + "px";
  el.appendChild(div);
};

const removeAdditional = () => {
  const additional = document.querySelector(".additional");
  additional.remove();
};
const addSpace = (el, height) => {
  const parent = el.closest(".cards");
  const div = document.createElement("div");
  div.classList.add("additional");
  div.style.height = height + "px";
  parent.insertBefore(el, div);
};

cards.forEach((e) =>
  e.addEventListener("mousedown", (e) => {
    e.preventDefault();
    leaveSpace(e.target.closest(".cards"), e.target.offsetHeight);

    actualElement = e.target;
    document.body.style.cursor = "grabbing";
    let shiftX = e.clientX - actualElement.getBoundingClientRect().left;
    let shiftY = e.clientY - actualElement.getBoundingClientRect().top;

    document.body.append(actualElement);
    actualElement.classList.add("dragged");

    moveAt(e.pageX, e.pageY);

    const onMouseUp = (e) => {
      const mouseUpItem = e.target;
      const column = e.target.closest(".column");
      const cardsBlock = column.querySelector(".cards");
      document.body.style.cursor = "default";
      cardsBlock.appendChild(actualElement);
      actualElement.classList.remove("dragged");
      actualElement = undefined;
      removeAdditional();

      document.documentElement.removeEventListener("mouseup", onMouseUp);
      document.documentElement.removeEventListener("mousemove", onMouseMove);
      document.documentElement.removeEventListener("mouseover", onMouseOver);
    };

    function moveAt(pageX, pageY) {
      actualElement.style.left = pageX - shiftX + "px";
      actualElement.style.top = pageY - shiftY + "px";
    }
    const onMouseMove = (e) => {
      moveAt(e.pageX, e.pageY);
    };

    const onMouseOver = (e) => {
      // const cardOnTarget = e.target.classList.contains('card');
      // if(cardOnTarget){
      //     addSpace(e.target, e.target.style.height)
      // }
    };

    document.documentElement.addEventListener("mouseup", onMouseUp);
    document.documentElement.addEventListener("mousemove", onMouseMove);
    document.documentElement.addEventListener("mouseover", onMouseOver);
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

  const cardBlocks = document.querySelectorAll(".cards");
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
