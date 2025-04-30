let colors = {
  "Y90": "#FDBE1B",
  "Y80": "#FDC328",
  "Y70": "#FCC935",
  "Y60": "#FCCE49",
  "Y50": "#FDD45D",
  "Y40": "#FDD972",
  "Y30": "#FDDF86",
  "Y20": "#FDE49A",
  "Y10": "#FEE9AE",
  "FFF": "#FFFFFF",
  "F10": "#ECEFFF",
  "F20": "#D8DEFF",
  "F30": "#C4CDFF",
  "F40": "#B1BDFF",
  "F50": "#9DACFF",
  "F60": "#899BFF",
  "F70": "#768BFF",
  "F80": "#627AFF",
  "F90": "#4F6AFF",
  "100*": "#3B59FF",
  "110*": "#3551ED",
  "120*": "#2F4ADC",
  "130*": "#2942CA",
  "140*": "#233AB9",
  "150*": "#1E33A7",
  "160*": "#182B95",
  "170*": "#122384",
  "180*": "#0C1B72",
  "190*": "#061461",
  "200*": "#000C4F",
  "225*": "#040D3F",
  "250*": "#080E2F",
  "275*": "#0B0E1F",
  "300*": "#080B1A",
  "000*": "#000000"
};

// functions
function getRGB(hex) {
  hex = hex.replace("#", "");
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);
  return [r, g, b];
}
function getTextColor(r, g, b) {
  let brightness = (r * 299) + (g * 587) + (b * 114);
  brightness /= 255000;
  return (brightness >= 0.5) ? "#000000" : "#FFFFFF";
}
function getLuminance(r, g, b) {
  let a = [r, g, b].map(function(v) {
      v /= 255;
      return v <= 0.03928
        ? v / 12.92
        : Math.pow( (v + 0.055) / 1.055, 2.4 );
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}
function roundDecimal(num) {
  return Math.round(num * 100) / 100;
}

// build html
function buildHTML(div, obj) {
  for (let [key, val] of Object.entries(obj)) {
    key = key.replace("*", "");
    let background = getRGB(val);
    let backgroundText = getTextColor(background[0], background[1], background[2]);

    let color = `<section class="color container-fluid" style="background-color: ${val}; color: ${backgroundText};">
      <div class="container">
        <div class="row">
          <div class="col col-3 col-md-2 col-lg-1 text-center d-flex flex-column justify-content-center">
            <h2>${key}</h2>
            <p>${val}</p>
          </div>
          <div class="swatches col col-9 col-md-10 col-lg-11 d-flex flex-wrap align-items-center">`;

    for (let [k, v] of Object.entries(obj)) {
      k = k.replace("*", "");
      
      let foreground = getRGB(v);
      let foregroundText = getTextColor(foreground[0], foreground[1], foreground[2]);

      let backgroundLum = getLuminance(background[0], background[1], background[2]);
      let foregroundLum = getLuminance(foreground[0], foreground[1], foreground[2]);

      let ratio = foregroundLum > backgroundLum 
          ? ((foregroundLum + 0.05) / (backgroundLum + 0.05))
          : ((backgroundLum + 0.05) / (foregroundLum + 0.05));
      let ratioRounded = roundDecimal(ratio);

      let contrast;
      let accessible = false;
      if (ratio >= 7) {
        contrast = "high-contrast";
        accessible = true;
      } else if (ratio >= 4.5) {
        contrast = "medium-contrast";
        accessible = true;
      } else if (ratio >= 3) {
        contrast = "low-contrast";
        accessible = true;
      } else {
        contrast = "";
      }

      if (accessible) {
        color += `<div class="swatch ${contrast} text-center d-flex flex-column justify-content-center" style="background-color: ${v}; color: ${foregroundText};">
            <p>${k}</p>
            <p class="small">${ratioRounded}</p>
          </div>`;
      }
    }
    color += `</div>
        </div>
      </div>
    </section>`;
    div.innerHTML += color;
  }
}

async function main() {
  let div = document.querySelector("#colors");
  let obj = colors;
  
  // build html
  await new Promise((resolve) => {
    resolve(buildHTML(div, obj));
  });
  
  // THEN run everything else

}

main();
