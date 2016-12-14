/*
 * @author David Menger
 */
'use strict';

const assert = require('assert');
const replaceDiacritics = require('../src/replaceDiacritics');


describe('util.replaceDiacritics()', function () {

    it('should replace wierd characters', function () {
        assert.equal(replaceDiacritics('žšč'), 'zsc');
        assert.equal(
            replaceDiacritics('Příliš žluťoučký kůň úpěl ďábelské ódy'),
            'Prilis zlutoucky kun upel dabelske ody'
        );
        assert.equal(replaceDiacritics('\u007F'), '\u007F');
    });

});
