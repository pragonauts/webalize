/*
 * @author David Menger
 */
'use strict';

const assert = require('assert');
const url = require('../src');

describe('util.url', function () {

    describe('#toCamelCase()', function () {

        it('should make camecase from webalized strings', function () {
            assert.equal(url.toCamelCase('some-text'), 'someText');
            assert.equal(url.toCamelCase('a-b-c-abc'), 'aBCAbc');
            assert.equal(url.toCamelCase('Classic text'), 'classicText');
        });

        it('should strip diacritics, when true is passed as second param', function () {
            assert.equal(url.toCamelCase('ŇěJaký čupr', true), 'nejakyCupr');
        });

    });


    describe('#camelcaseToWebalized()', function () {

        it('should make url friendly links', function () {
            assert.equal(
                url.camelcaseToWebalized('fUNNY-text-InCamel-END'),
                'f-u-n-n-y-text-in-camel-e-n-d'
            );
        });

        it('should convert camelcase to nice urls', function () {
            assert.equal(url.camelcaseToWebalized('aBCAbc'), 'a-b-c-abc');
        });


        it('should throw an error, when bad string is inserted', function () {
            assert.throws(() => {
                url.camelcaseToWebalized('StartsWithUppercase');
            }, Error);

            assert.throws(() => {
                url.camelcaseToWebalized('hasForeign Character');
            }, Error);

            assert.throws(() => {
                url.camelcaseToWebalized('hasOtherChar*');
            }, Error);
        });


    });


    describe('#webalize()', function () {

        it('should strip diacritics, when true is passed as second param', function () {
            assert.equal(url.webalize('FUNNY text InCamel END', true), 'funny-text-incamel-end');
            assert.equal(url.webalize('-Ňějaký čupr', true), 'nejaky-cupr');
        });

    });

    describe('#webalize() without diacritics is reverse to #toCamelCase()', function () {

        it('#webalize -> #toCamelCase', function () {
            const strings = [
                'aBC', // ABC is not camelcase
                'punk30frog',
                'punk30Frog',
                'ohMy20',
                'bLAH30'
            ];

            strings.forEach((str) => {
                const webalized = url.camelcaseToWebalized(str);
                const reversed = url.toCamelCase(webalized);
                assert.equal(reversed, str);
            });
        });

    });


    describe('#webalizeChunks()', function () {

        it('should retain slashes', function () {
            assert.equal(url.webalizeChunks('/blahBlah/haHa'), '/blah-blah/ha-ha');
            assert.equal(url.webalizeChunks('blahBlah/haHa'), 'blah-blah/ha-ha');
        });

        it('should always return string', function () {
            assert(typeof url.webalizeChunks(null) === 'string');
        });

    });


    describe('#looksLikeFile()', function () {

        it('should filter urls which not leads to templates', function () {
            assert(url.looksLikeFile('/assets/img/some_image.png?v=132'));
            assert(!url.looksLikeFile('/assets/img/some-url?with=query'));
        });

    });

    describe('#camelCaseChunks()', function () {

        it('should retain slashes', function () {
            assert.equal(url.camelCaseChunks('/blah-blah/ha-ha'), '/blahBlah/haHa');
            assert.equal(url.camelCaseChunks('blah-blah/ha-ha'), 'blahBlah/haHa');
        });

        it('should always return string', function () {
            assert(typeof url.camelCaseChunks(null) === 'string');
        });
    });


    describe('#asTemplateUrl()', function () {

        it('should return home for shortest path', function () {
            const HOME = 'hp';
            assert.equal(url.asTemplateUrl('/', '/?some=query', HOME), HOME);
        });

        it('should pass the attribute', function () {
            const HOME = 'hp';
            assert.equal(url.asTemplateUrl('/any', '/any?some=query', HOME), 'any');
        });

        it('should return home for shortest path', function () {
            const HOME = 'hp';
            const NOT_FOUND = '404';
            assert.equal(url.asTemplateUrl('/image.jpg', '/image.jpg', HOME, NOT_FOUND), NOT_FOUND);
        });

        it('should not fail with empty params', function () {
            assert.equal(url.asTemplateUrl('/', '/?some=query'), '');
        });

        it('should return NOTFOUND, when home is accessed directly', function () {
            const HOME = 'hp';
            const NOT_FOUND = '404';
            assert.equal(
                url.asTemplateUrl(`/${HOME}`, `/${HOME}?some=query`, HOME, NOT_FOUND),
                NOT_FOUND
            );
        });

        it('should return NOTFOUND, when url is a file', function () {
            const HOME = 'hp';
            const NOT_FOUND = '404';
            assert.equal(
                url.asTemplateUrl('/some/file.png', '/some/file.png?some=query', HOME, NOT_FOUND),
                NOT_FOUND
            );
        });
    });


    describe('#withParams()', function () {

        it('should add or replace params in query', function () {
            const res = url.withParams('http://www.google.com', { query: { x: 1, y: 2 } });
            assert.equal(res, 'http://www.google.com/?x=1&y=2');
        });

        it('should add or replace params in query', function () {
            const res = url.withParams('http://www.google.com', { hash: { x: 1, y: 2 } });
            assert.equal(res, 'http://www.google.com/#x=1&y=2');
        });

        it('should add or replace params in query', function () {
            const res = url.withParams('http://www.google.com?foo=1&bar=&x=hello', { query: { x: 1, y: 2 } });
            assert.equal(res, 'http://www.google.com/?foo=1&bar=&x=1&y=2');
        });

        it('should add or replace params in hash', function () {
            const res = url.withParams('http://www.google.com#foo=1&bar=&x=hello', { hash: { x: 1, y: 2 } });
            assert.equal(res, 'http://www.google.com/#foo=1&bar=&x=1&y=2');
        });

        it('should remove the query when null is used', function () {
            const res = url.withParams('http://www.google.com?foo=1&bar=&x=hello', { query: null });
            assert.equal(res, 'http://www.google.com/');
        });

        it('should remove the query when null is used', function () {
            const res = url.withParams('http://www.google.com#foo=1&bar=&x=hello', { hash: null });
            assert.equal(res, 'http://www.google.com/');
        });

        it('should replace hash when its bad', function () {
            const res = url.withParams('http://www.google.com#jkfsdj', { hash: { a: 1, y: 2 } });
            assert.equal(res, 'http://www.google.com/#jkfsdj=&a=1&y=2');
        });

    });

});
