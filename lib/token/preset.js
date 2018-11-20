'use strict';

const AIBT = {
    layerMarker : "tl",
    version: 1,
    symbol: "AIBT",
    factor: 10,
    fullName: "AIB Token for exchange",
    hex: "746c0141494254000a41494220546f6b656e20666f722065786368616e6765",
};

const SPCT = {
    layerMarker : "tl",
    version: 1,
    symbol: "SPCT",
    factor: 5,
    fullName: "Space Token for exchange",
    hex: "746c01535043540005537061636520546f6b656e20666f722065786368616e6765",
};

const presetTokens = [AIBT,SPCT];
/**
 * A bitcoin transaction script. Each transaction's inputs and outputs
 * has a script that is evaluated to validate it's spending.
 *
 * See https://en.bitcoin.it/wiki/Script
 *
 * @constructor
 * @param {Object|string|Buffer=} from optional data to populate script
 */
var PresetTokens = function PresetTokens() {
    if (!(this instanceof PresetTokens)) {
        return new PresetTokens();
    }
};

PresetTokens.prototype.isPresetToken = function(hex) {
    var matchedToken;
    if (hex != undefined || hex != "") {
       presetTokens.forEach(function (token) {
            if (hex === token.hex)
                matchedToken = token;
       })
    }
    return matchedToken;
};
PresetTokens.prototype.getAIBT = function() {
    return AIBT;
};
PresetTokens.prototype.getSPCT = function() {
    return SPCT;
};
module.exports = PresetTokens;