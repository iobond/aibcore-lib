'use strict';

var Address = require('../address');
var BufferReader = require('../encoding/bufferreader');
var BufferWriter = require('../encoding/bufferwriter');
var Hash = require('../crypto/hash');
var Opcode = require('../opcode');
var PublicKey = require('../publickey');
var Signature = require('../crypto/signature');
var Networks = require('../networks');
var $ = require('../util/preconditions');
var _ = require('lodash');
var errors = require('../errors');
var buffer = require('buffer');
var BufferUtil = require('../util/buffer');
var JSUtil = require('../util/js');
var PresetTokens = require('./preset');

const MaxOPDataLen = 80;

const TokenLayerLen = 2;
const VersionLen = 1;
const SymbolLen = 5;
const FactorLen = 1;
const MaxAllowdFullNamelen = MaxOPDataLen - (TokenLayerLen + VersionLen + SymbolLen + FactorLen);

const Version = 1;

const TokenLayer = {
    code : "tl",
    hex: 0x746c,
};

/**
 * A bitcoin transaction script. Each transaction's inputs and outputs
 * has a script that is evaluated to validate it's spending.
 *
 * See https://en.bitcoin.it/wiki/Script
 *
 * @constructor
 * @param {Object|string|Buffer=} from optional data to populate script
 */
var Token = function Token(from) {
    if (!(this instanceof Token)) {
        return new Token(from);
    }
    this.chunks = [];

    if (BufferUtil.isBuffer(from)) {
        return Token.fromBuffer(from);
    }
};

Token.prototype.fromBuffer = function(buffer) {
    var token = new Token();

    var hex = new BufferReader(buffer).readAll().toString('hex');
    var br = new BufferReader(buffer);
    while (!br.finished()) {
        try {
            token = {
                layerMarker : br.read(TokenLayerLen).toString(),
                version: br.readUInt8(VersionLen),
                symbol: br.read(SymbolLen).toString().replace(/\0/g, ''),
                factor: br.readUInt8(FactorLen),
                fullName: br.readAll().toString(),
                hex: hex,
            }

        } catch (e) {
            if (e instanceof RangeError) {
                throw new errors.Token.InvalidBuffer(buffer.toString('hex'));
            }
            throw e;
        }
    }
    return token;
};

Token.prototype.fromHexString = function(from) {
    if (_.isString(from) && JSUtil.isHexa(from)) {
        return this.fromBuffer(new buffer.Buffer(from, 'hex'));
    }
    return null;
};

Token.prototype.encode = function(token) {
    var tokenHexStr;
    try {
        var tokenLayerHexStr = Buffer.from(TokenLayer.code, 'utf8').toString('hex');
        var versionHexStr = Version.toString(16);
        versionHexStr = Version > 0xf ? versionHexStr : versionHexStr.padStart(2,'0');
        var symbolHexStr = Buffer.from(token.symbol, 'utf8').toString('hex');
        var factorHexStr = token.factor.toString('16');
        factorHexStr = token.factor > 0xf ? factorHexStr : factorHexStr.padStart(2,'0');
        var fullNameHexStr = Buffer.from(token.fullName, 'utf8').toString('hex');

        if (token.factor > 0xff ) {
            throw Error("token factor must not exceed 255");
        }
        if (token.fullName.length > MaxAllowdFullNamelen) {
            throw Error("token full name too long");
        }
        if (token.symbol.length > SymbolLen) {
            throw Error("token symbol length must not exceed 5");
        } else if (token.symbol.length == 0 ) {
            console.log("token symbol length can not be zero.\n");
            throw Error("token symbol length can not be zero");
        } else if (token.symbol.length < SymbolLen) {
            symbolHexStr = symbolHexStr.padEnd(SymbolLen*2,'00'); //actual length in hex string should be doubled.
        }
        tokenHexStr = tokenLayerHexStr+versionHexStr+symbolHexStr+factorHexStr+fullNameHexStr;
    }catch (e) {
        if (e instanceof RangeError) {
            throw Error("Token Encode conversion error");
        }
        throw e;
    }
    return tokenHexStr;
};

Token.prototype.isPresetToken = function(buffer) {
    var hex = new BufferReader(buffer).readAll().toString('hex');
    return new PresetTokens().isPresetToken(hex);
};

Token.prototype.getTokenBalances = function(utxos,txs) {
    var tokenBalances = [];
    utxos.forEach(function(utxo){

    });
}

module.exports = Token;