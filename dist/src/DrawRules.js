// A second Rule-style class that dictates what drawing operation should be performed 
// when a character is parsed during the drawing process. This should also be a map of 
// probabilities, but this time the values in the map will be functions rather than 
// strings. Invoke a given function, e.g. drawBranch, when a character is parsed.
class DrawRules {
    constructor() {
        // this maps a character to a map of probabilties to draw functions
        this.drawRules = new Map();
    }
    // adds draw rule to map
    addDrawRule(char, probability, drawFunction) {
        var probToFunctionMap = this.drawRules.get(char);
        probToFunctionMap.set(probability, drawFunction);
    }
    // uses randomly generated number to determine how to draw a character
    getDrawRule(char) {
        var probToFunctionMap = this.drawRules.get(char);
        var rand = Math.random();
        var drawRule;
        var accumulatedProbability = 0.0;
        for (const prob of probToFunctionMap.keys()) {
            if (rand > accumulatedProbability && rand <= accumulatedProbability + prob) {
                drawRule = probToFunctionMap.get(prob);
            }
            accumulatedProbability += prob;
        }
        return drawRule;
    }
}
export default DrawRules;
//# sourceMappingURL=DrawRules.js.map