'use strict';

var should = require('chai').should();
var expect = require('chai').expect;
var bitcore = require('../../index');

var BufferUtil = bitcore.util.buffer;
var Script = bitcore.Script;
var Networks = bitcore.Networks;
var Opcode = bitcore.Opcode;
var PublicKey = bitcore.PublicKey;
var Address = bitcore.Address;
var Token = bitcore.Token;
var PresetTokens = bitcore.PresetTokens;

describe('Script', function() {

    describe('#fromBuffer', function() {

        it('should parse AIBT token info', function() {
            var buf = new Buffer([0x74,0x6c,0x01,0x41,0x49,0x42,0x54,0x00,0x0A,0x41,0x49,0x42,0x20,0x54,0x6f,0x6b,0x65,0x6e,0x20,0x66,0x6f,0x72,0x20,0x65,0x78,0x63,0x68,0x61,0x6e,0x67,0x65]);
            //buf.set(0x746c01414942540A41494220546f6b656e20466f722065786368616e6765);
            var token = new Token().fromBuffer(buf);
            var AIBT = new PresetTokens().getAIBT();
            token.layerMarker.should.equal(AIBT.layerMarker);
            token.version.should.equal(AIBT.version);
            token.factor.should.equal(AIBT.factor);
            token.fullName.should.equal(AIBT.fullName);
            token.symbol.should.equal(AIBT.symbol);
            token.hex.should.equal(AIBT.hex);
        });

        it('should parse SPCT token info', function() {
            var buf = new Buffer([0x74,0x6c,0x01,0x53,0x50,0x43,0x54,0x00,0x05,0x53,0x70,0x61,0x63,0x65,0x20,0x54,0x6f,0x6b,0x65,0x6e,0x20,0x66,0x6f,0x72,0x20,0x65,0x78,0x63,0x68,0x61,0x6e,0x67,0x65]);
            //buf.set(0x746c015350435405537061636520546f6b656e20466f722065786368616e6765);
            var token = new Token().fromBuffer(buf);
            var SPCT = new PresetTokens().getSPCT();
            token.layerMarker.should.equal(SPCT.layerMarker);
            token.version.should.equal(SPCT.version);
            token.symbol.should.equal(SPCT.symbol);
            token.factor.should.equal(SPCT.factor);
            token.fullName.should.equal(SPCT.fullName);
            token.hex.should.equal(SPCT.hex);
        });

        it('should return SPCT token info', function() {
            var buf = new Buffer([0x74,0x6c,0x01,0x53,0x50,0x43,0x54,0x00,0x05,0x53,0x70,0x61,0x63,0x65,0x20,0x54,0x6f,0x6b,0x65,0x6e,0x20,0x66,0x6f,0x72,0x20,0x65,0x78,0x63,0x68,0x61,0x6e,0x67,0x65]);
            //buf.set(0x746c015350435405537061636520546f6b656e20466f722065786368616e6765);
            var presetToken = new Token().isPresetToken(buf);
            var SPCT = new PresetTokens().getSPCT();
            presetToken.layerMarker.should.equal(SPCT.layerMarker);
            presetToken.version.should.equal(SPCT.version);
            presetToken.symbol.should.equal(SPCT.symbol);
            presetToken.factor.should.equal(SPCT.factor);
            presetToken.fullName.should.equal(SPCT.fullName);
            presetToken.hex.should.equal(SPCT.hex);
        });

        it('should return null object', function() {
            var buf = new Buffer([0x84,0x6c,0x01,0x53,0x50,0x43,0x54,0x00,0x05,0x53,0x70,0x61,0x63,0x65,0x20,0x54,0x6f,0x6b,0x65,0x6e,0x20,0x66,0x6f,0x72,0x20,0x65,0x78,0x63,0x68,0x61,0x6e,0x67,0x65]);
            //buf.set(0x746c015350435405537061636520546f6b656e20466f722065786368616e6765);
            var presetToken = new Token().isPresetToken(buf);
            should.equal(presetToken,undefined);
        });

        it('should equal SPCT hex with encoded token hex string', function() {
            var SPCT = new PresetTokens().getSPCT();
            var tokenHexStr = new Token().encode(SPCT);
            should.equal(tokenHexStr,SPCT.hex);
        });
    });
});
