


export const logTestCaseCompareResult = (caseIndex, description, isSame, reason) => {
    let result = isSame ? "pass" : "fail";

    let logString = `\nResult: ${result}\n` +
    `Reason: ${reason}\n`;

    if (!isSame) {
        logString += `\tTest case number: ${caseIndex}\n` +
            `\tDescription: ${description}`;
    }

    console.log(logString);
}