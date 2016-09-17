/**
 * Created by keyvan on 9/17/16.
 */
// Adapted from http://stackoverflow.com/questions/20403544/convert-two-32-bit-integers-to-one-signed-64-bit-integer-string

function invertBit(bit) {
    return bit == "0" ? "1" : "0";
}

function binaryInvert(binaryString) {
    return binaryString.split("").map(invertBit).join("");
}

function binaryIncrement(binaryString) {
    let idx = binaryString.lastIndexOf("0");
    return binaryString.substring(0, idx) + "1" + binaryInvert(binaryString.substring(idx + 1));
}

function binaryDecrement(binaryString) {
    let idx = binaryString.lastIndexOf("1");
    return binaryString.substring(0, idx) + binaryInvert(binaryString.substring(idx));
}

function binaryAbs(binaryString) {
    if (binaryString[0] === "1") {
        return binaryInvert(binaryDecrement(binaryString));
    }
    return binaryString;
}

function to32Bits(val) {
    let binaryString = val.toString(2);
    if (binaryString[0] === "-") {
        binaryString = new Array(33 - (binaryString.length - 1)).join("1") + binaryInvert(binaryString.substr(1));
        return binaryIncrement(binaryString);
    }
    return new Array(33 - binaryString.length).join("0") + binaryString;
}

function to64BitsIntegerString(high, low) {

    let fullBinaryNumber = to32Bits(high) + to32Bits(low);
    let isNegative = fullBinaryNumber[0] === "1";

    fullBinaryNumber = binaryAbs(fullBinaryNumber);

    let result = "";

    while (fullBinaryNumber.length > 0) {
        let remainingToConvert = "", resultDigit = 0;
        for (let position = 0; position < fullBinaryNumber.length; ++position) {
            let currentValue = Number(fullBinaryNumber[position]) + resultDigit * 2;
            let remainingDigitToConvert = Math.floor(currentValue / 10);
            resultDigit = currentValue % 10;
            if (remainingToConvert.length || remainingDigitToConvert) {
                remainingToConvert += remainingDigitToConvert;
            }
        }
        fullBinaryNumber = remainingToConvert;
        result = resultDigit + result;
    }
    return (isNegative?"-":"") + result;
}

export {to64BitsIntegerString}
