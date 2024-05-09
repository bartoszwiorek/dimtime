class DimTime {
  dimtimeConsts = {
    brightnessAmountVariable: "--dimtime-website-brightness-percentage",
    brightnessCurrentVariable:
      "--dimtime-website-brightness-percentage-current",
    minAmount: 20,
    className: "dimtime",
  };

  constructor() {
    this.createDimtimeInstance();
  }

  attachSliderInput(id) {
    document.getElementById(id).addEventListener("input", (event) => {
      const { value } = event.target;

      document.documentElement.style.setProperty(
        this.dimtimeConsts.brightnessAmountVariable,
        `${value}%`
      );

      localStorage.setItem(this.dimtimeConsts.brightnessAmountVariable, value);
    });
  }

  attachSliderCheckbox(id) {
    document.getElementById(id).addEventListener("input", (event) => {
      const { checked } = event.target;

      const value =
        checked === true
          ? `var(${this.dimtimeConsts.brightnessAmountVariable})`
          : `100%`;

      document.documentElement.style.setProperty(
        this.dimtimeConsts.brightnessCurrentVariable,
        value
      );

      localStorage.setItem(this.dimtimeConsts.brightnessCurrentVariable, value);
    });
  }

  createStyles({ brightnessAmount }) {
    const style = document.createElement("style");

    style.innerHTML = `
    :root  {
      ${this.dimtimeConsts.brightnessAmountVariable}: ${brightnessAmount}%;
      ${this.dimtimeConsts.brightnessCurrentVariable}: var(${this.dimtimeConsts.brightnessAmountVariable});
    }

    html {
      filter: brightness(var(${this.dimtimeConsts.brightnessCurrentVariable})) !important;
    }

    .dimtime-slider {
      padding: 6px !important;
      display: flex !important;
      align-items: center !important;
      bottom: 0 !important;
      left: 0 !important;
      position: fixed !important;
      width: 100px !important;
      z-index: 999999999999999 !important;
      min-width: 100px !important;
      min-height: 35px !important;
      background: rgba(0, 0, 0, 0.15) !important;
      border-top-right-radius: 6px !important;
    }

    .dimtime-slider:hover {
      background: rgba(0, 0, 0, 0.9) !important;
    }

    .dimtime-slider,
    .dimtime-slider input[type='checkbox'] {
      transition: 200ms !important;
    }

    .dimtime-slider input[type='range'] {
      height: 100% !important;
      top: 0 !important;
      max-width: 70% !important;
    }

    .dimtime-slider input[type='checkbox'] {
      opacity: 0.5 !important;
      margin: 0 0 0 auto !important;
      padding: 0 !important;
    }

    .dimtime-slider input[type='range'],
    .dimtime-slider input[type='checkbox'] {
      appearance: auto !important;
      cursor: pointer !important;
    }

    .dimtime-slider:hover input[type='checkbox'] {
      opacity: 1 !important;
    }
  `;

    return style;
  }

  createInputs({ baseId, brightnessAmount, currentValue }) {
    const inputsContainer = document.createElement("div");
    inputsContainer.className = `${this.dimtimeConsts.className}-slider`;

    inputsContainer.innerHTML = `
      <input type="range" id="${baseId}-range" value="${brightnessAmount}" name="dimtime-slider-value" min="${
      this.dimtimeConsts.minAmount
    }" max="100" />
      <input type="checkbox" id="${baseId}-checkbox" name="dimtime-slider-checkbox" ${
      currentValue !== "100%" ? "checked" : ""
    } />
    `;

    return inputsContainer;
  }

  get state() {
    const currentValueReference = localStorage.getItem(
      this.dimtimeConsts.brightnessCurrentVariable
    );

    const brightnessAmount = Math.min(
      100,
      Math.max(
        this.dimtimeConsts.minAmount,
        parseInt(
          Number(
            localStorage.getItem(this.dimtimeConsts.brightnessAmountVariable) ??
              100
          )
        )
      )
    );

    return {
      brightnessAmount,
      currentValue: currentValueReference,
    };
  }

  get id() {
    return `${this.dimtimeConsts.className}-${new Date().getTime()}`;
  }

  createDimtimeInstance() {
    if (document.querySelector(`.${this.dimtimeConsts.className}`)) {
      // already initialized.
      return;
    }

    const id = this.id;
    const { brightnessAmount, currentValue } = this.state;

    if (currentValue) {
      document.documentElement.style.setProperty(
        this.dimtimeConsts.brightnessCurrentVariable,
        currentValue
      );
    }

    const stylesElem = this.createStyles({
      brightnessAmount,
    });

    const inputs = this.createInputs({
      baseId: id,
      brightnessAmount,
      currentValue,
    });

    // append to DOM
    document.body.prepend(inputs);
    document.documentElement.prepend(stylesElem);
    document.documentElement.classList.add(this.dimtimeConsts.className);

    // attach inputs events
    this.attachSliderInput(`${id}-range`);
    this.attachSliderCheckbox(`${id}-checkbox`);
  }
}

function init() {
  new DimTime();
}

// init
init();
