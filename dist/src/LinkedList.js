import GrammarExpansion from './GrammarExpansion';
class ListNode {
    constructor(character, prev, next) {
        this.character = character;
        this.prev = prev;
        this.next = next;
    }
}
class LinkedList {
    constructor() {
    }
}
class Grammar {
    constructor(startChar) {
        this.currStringArr = new Array();
        this.expansionRules = new GrammarExpansion();
        this.currStringArr.push(startChar);
        this.expansionRules.addExpansionRule('1', 1, '11');
        this.expansionRules.addExpansionRule('0', 1, '1[0]0');
    }
    getString() {
        return this.currStringArr.join();
    }
    expandString() {
        var newStringArr = new Array();
        for (var stringToExpand in this.currStringArr) {
            for (var i = 0; i < stringToExpand.length; i++) {
                var char = stringToExpand.charAt(i);
                let successorString = this.expansionRules.getExpansion(char);
                newStringArr.push(successorString);
            }
        }
        this.currStringArr = newStringArr;
    }
}
export default Grammar;
//# sourceMappingURL=LinkedList.js.map