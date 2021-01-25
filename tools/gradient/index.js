function genGradient(steps, _hue1, _hue2, direction) {
    hue1 = parseInt(_hue1);
    hue2 = parseInt(_hue2);
    step = 1;
    if (direction) { // forward
        while (hue1 > hue2) hue2 += 360;
        step = (hue2 - hue1) / (steps - 1);
    }
    else { // backward
        while (hue2 > hue1) hue1 += 360;
        step = (hue2 - hue1) / (steps - 1);
    }

    output = []

    for (let x = 0; x < steps; x++) {
        let result = (direction ? hue1 : hue2) + step * x;
        while (result < 0) result += 360;
        output.push(result);
    }
    return output;
}

function renderGradient() {
    let sat = document.getElementById("sat-box").value;
    let light = document.getElementById("light-box").value;

    let hues = genGradient(
        document.getElementById("steps-box").value,
        document.getElementById("hue1-box").value,
        document.getElementById("hue2-box").value,
        document.getElementById("direction-box").checked,
    );

    let outBuf = "";

    for (let hue of hues) {
        outBuf += `<span style="background: hsl(${hue}, ${sat}%, ${light}%)"></span>`
    }

    document.getElementById("text").innerHTML = outBuf;
}

function onSlide() {
    for (let property of ["steps", "hue1", "hue2", "sat", "light"]) {
        document.getElementById(`${property}-box`).value = document.getElementById(`${property}-range`).value;
    }
    renderGradient();
}