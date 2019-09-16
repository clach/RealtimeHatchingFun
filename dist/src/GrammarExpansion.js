// Some sort of class to represent a Rule for expanding a character into a 
// string. You might consider creating a map within each Rule that maps probabilities 
// to strings, so that a Rule can represent multiple possible expansions for a character
// with different probabilities.
class GrammarExpansion {
    constructor() {
        // this maps a character to a map of probabilties to strings
        this.expansionRulesMap = new Map();
    }
    // adds expansion rule to map
    addExpansionRule(startChar, probability, successorString) {
        if (this.expansionRulesMap.has(startChar)) {
            var probToStringMap = this.expansionRulesMap.get(startChar);
            probToStringMap.set(probability, successorString);
        }
        else {
            var probToStringMap = new Map();
            probToStringMap.set(probability, successorString);
            this.expansionRulesMap.set(startChar, probToStringMap);
        }
    }
    // uses randomly generated number to determine how to expand a character
    getExpansion(startChar) {
        if (this.expansionRulesMap.has(startChar)) {
            var probToStringMap = this.expansionRulesMap.get(startChar);
            var rand = Math.random();
            var successorString;
            var accumulatedProbability = 0.0;
            for (const prob of probToStringMap.keys()) {
                if (rand > accumulatedProbability && rand <= accumulatedProbability + prob) {
                    successorString = probToStringMap.get(prob);
                }
                accumulatedProbability += prob;
            }
            return successorString;
        }
        else {
            return '';
        }
    }
}
export default GrammarExpansion;
//# sourceMappingURL=GrammarExpansion.js.map