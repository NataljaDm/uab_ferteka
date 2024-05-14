class Gallery {
  constructor(selector, data) {
    this.selector = selector;
    this.data = data;

    this.imgFolder = "";
    this.contentOrder = "default";
    this.size1 = {
      min: 1,
      max: 6,
    };
    this.DOM = null;

    this.init();
  }

  init() {
    if (!this.isValidSelector() || !this.isValidData()) {
      return false;
    }

    this.render();
    this.enableFilter();
  }

  isValidSelector() {
    try {
      this.DOM = document.querySelector(this.selector);
      return !!this.DOM;
    } catch (error) {
      return false;
    }
  }

  // isValidSelectorOldschool() {
  //     if (typeof this.selector !== 'string' || this.selector === '') {
  //         return false;
  //     }

  //     this.DOM = document.querySelector(this.selector);
  //     return !!this.DOM;
  // }

  isNonEmptyString(str) {
    return typeof str === "string" && str.trim() !== "";
  }

  isPositiveInteger(num) {
    return Number.isInteger(num) && num > 0;
  }

  isNonEmptyArray(arr, minSize = 1) {
    return Array.isArray(arr) && arr.length >= minSize;
  }

  isValidData() {
    const { imgFolder, contentOrder, size1, data } = this.data ?? {};
    const { min, max } = size1 ?? {};

    if (this.isNonEmptyString(imgFolder)) {
      this.imgFolder = imgFolder.trim();
    }

    if (this.isNonEmptyString(contentOrder)) {
      this.contentOrder = contentOrder.trim();
    }

    if (size1 && this.isPositiveInteger(min)) {
      this.size1.min = min;
    }

    if (size1 && this.isPositiveInteger(max)) {
      this.size1.max = max;
    }

    if (!this.isNonEmptyArray(data, this.size1.min)) {
      return false;
    }

    const correctData = [];

    for (const item of data) {
      if (typeof item !== "object" || Array.isArray(item) || item === null) {
        continue;
      }

      const { img, alt, title, href, tags } = item;

      if (
        !this.isNonEmptyString(img) ||
        !this.isNonEmptyString(alt) ||
        !this.isNonEmptyString(title) ||
        !this.isNonEmptyString(href) ||
        !this.isNonEmptyArray(tags)
      ) {
        continue;
      }

      item.img = item.img.trim();
      item.alt = item.alt.trim();
      item.title = item.title.trim();
      item.href = item.href.trim();

      const validTags = [];
      for (const tag of tags) {
        if (this.isNonEmptyString(tag)) {
          validTags.push(tag.trim());
        }
      }

      if (validTags.length === 0) {
        continue;
      }

      item.tags = validTags;

      correctData.push(item);
    }

    this.data.data = correctData;

    return correctData.length > 0;
  }

  filterHTML() {
    const data = this.data.data.map((item) => item.tags);

    // const tagsList = [];
    // for (const tags of data) {
    //     for (const tag of tags) {
    //         tagsList.push(tag);
    //     }
    // }
    const tagsList = data.flat();

    const lowercaseUniqueTags = [];
    const originalUniqueTags = [];
    for (const tag of tagsList) {
      const correctTag = tag.toLowerCase();
      if (!lowercaseUniqueTags.includes(correctTag)) {
        lowercaseUniqueTags.push(correctTag);
        originalUniqueTags.push(tag);
      }
    }

    let HTML = '<div class="option active">All</div>';

    for (const tag of originalUniqueTags) {
      HTML += `<div class="option">${tag}</div>`;
    }

    return HTML;
  }

  contentHTML() {
    let HTML = "";

    let count = 0;
    for (const item of this.data.data) {
      if (count >= this.size1.max) {
        break;
      }
      count++;

      const path = this.imgFolder + item.img;
      const dataTags = item.tags.join(",").toLowerCase();

      HTML += `<div class="card" data-tags="${dataTags}">
            <img class="image" src="${path}" alt="${item.alt}">
            <a class="title" href="${item.href}">${item.title}</a>
            <p class="tag">${item.tags[0]}</p>
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

  enableFilter() {
    const filterOptionsDOM = this.DOM.querySelectorAll(".filter > .option");
    const cardsDOM = this.DOM.querySelectorAll(".gallery-content > .card");

    for (const optionDOM of filterOptionsDOM) {
      optionDOM.addEventListener("click", () => {
        this.DOM.querySelector(".option.active").classList.remove("active");
        optionDOM.classList.add("active");

        const tag = optionDOM.innerText;
        if (tag === "All") {
          for (const cardDOM of cardsDOM) {
            cardDOM.classList.remove("hide");
          }
        } else {
          for (const cardDOM of cardsDOM) {
            const tags = cardDOM.dataset.tags.split(",");
            if (tags.includes(tag.toLowerCase())) {
              cardDOM.classList.remove("hide");
            } else {
              cardDOM.classList.add("hide");
            }
          }
        }
      });
    }
  }
}

export { Gallery };


