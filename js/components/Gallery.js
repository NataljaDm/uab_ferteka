class Gallery {
  constructor(selector, data) {
    this.selector = selector;
    this.data = data;

    this.imgFolder = '';
    this.contentOrder = 'default';
    this.size = {
        min:1,
        max:6,
    };

    this.DOM = null;

    this.init();
  }

  init() {
    if (!this.isValidSelector() || !this.isValidData()) {
      return false;
    }
    this.render();
  }

  isValidSelector() {
    try {
        this.DOM = document.querySelector(this.selector);
        return !!this.DOM;
    } catch (error) {
        return false;
    }
  }

  isValidData() {


    return true;
  }

  filterHTML() {
    return `<div class="option active">All</div>
    <div class="option">Data center</div>
    <div class="option">Industrial project</div>
    <div class="option">Shipbuilding</div>`;
  }

  contentHTML() {
    let HTML = '';

    for (const item of this.data.data) {
      HTML += `<div class="card">
                          <img class="image" src="./img/project-foto/par13.png" alt="Mercury data center">
                          <a class="title" href="#">Mercury</a>
                          <p class="tag">Data center</p>
                          </div>`;
    }

    return HTML;
  }

  render() {

    const HTML = `<div class="filter">
                         ${this.filterHTML()}
                        </div>
                        <div class="gallery-content">
                             ${this.contentHTML()}
                            </div>`;

    

    this.DOM.classList.add("gallery");
    this.DOM.innerHTML = HTML;
  }
}

export { Gallery };
