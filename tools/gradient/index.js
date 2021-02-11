function genGradient(steps, _hue1, _hue2) {
    hue1 = parseInt(_hue1);
    hue2 = parseInt(_hue2);
    step = 1;
    step = (hue2 - hue1) / (steps - 1);

    output = []

    for (let x = 0; x < steps; x++) {
        let result = (hue1) + step * x;
        while (result < 0) result += 360;
        while (result > 360) result -= 360;
        output.push(result);
    }
    return output;
}

// copied from https://stackoverflow.com/a/44134328
function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
    };
    return `${f(0)}${f(8)}${f(4)}`;
  }

function renderGradient() {
    let sat = document.getElementById("sat-box").value;
    let light = document.getElementById("light-box").value;
    let text = document.getElementById("textin-box").value;

    let hues = genGradient(
        text.length,
        document.getElementById("hue1-box").value,
        document.getElementById("hue2-box").value,
    );

    let outBuf = "";

    for (let hue in hues) {
        outBuf += `<span style="color: hsl(${hues[hue]}, ${sat}%, ${light}%)">${text[hue].replace(" ", "&nbsp")}</span>`
    }

    document.getElementById("text").innerHTML = outBuf;
    exportText();
}

function onSlide() {
    for (let property of ["hue1", "hue2", "sat", "light"]) {
        document.getElementById(`${property}-box`).value = document.getElementById(`${property}-range`).value;
    }
    renderGradient();
}

function onBoxEdit() {
    for (let property of ["hue1", "hue2", "sat", "light"]) {
        try {
            document.getElementById(`${property}-range`).value = document.getElementById(`${property}-box`).value;
        } catch (Exception) {}
    }
    renderGradient();
}

function exportText() {
    let format = document.getElementById("export-format").value;
    let text = document.getElementById("textin-box").value;
    let sat = document.getElementById("sat-range").value;
    let light = document.getElementById("light-range").value;

    let hues = genGradient(
        text.length,
        document.getElementById("hue1-range").value,
        document.getElementById("hue2-range").value,
    );
    let output = format == "json" ? "[" : "";
    for (let hue in hues) {
        let hex = hslToHex(hues[hue], sat, light);
        switch (format) {
            case "json":
                output += `{"text":"${text[hue].replace("\\", "")}", "color":"#${hex}"}`;
                if (hue != text.length - 1) output += ", ";
                break;
            case "spigot":
                output += `&x${hex.split("").reduce( ((x, a) => x + "&" + a), "")}${text[hue]}`;
                break;
            case "cmi":
                output += `{#${hex}}${text[hue]}`;
                break;
        }
    }
    if (format == "json") output += "]";

    document.getElementById("export-box").value = output;
}