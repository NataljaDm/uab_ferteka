class Gallery {
  constructor(selector, data) {
    this.selector = selector;
    this.data = data;
  }

  render() {
    let cardsHTML = '';

    for (const item of this.data.data) {
      cardsHTML += `<div class="card">
                        <img class="image" src="./img/project-foto/par13.png" alt="Mercury data center">
                        <a class="title" href="#">Mercury</a>
                        <p class="tag">Data center</p>
                        </div>`;
    }

    const HTML = `<div class="filter">
                         <div class="option active">All</div>
                         <div class="option">Data center</div>
                         <div class="option">Industrial project</div>
                         <div class="option">Shipbuilding</div>
                        </div>
                        <div class="gallery-content">
                         
                             ${cardsHTML}
                            </div>`;

    const DOM = document.querySelector(this.selector);

    DOM.classList.add('gallery');
    DOM.innerHTML = HTML;
  }
}

export { Gallery };
